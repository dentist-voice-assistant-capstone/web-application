import json
import numpy as np
import torch
from onnxruntime import InferenceSession
from simpletransformers.ner.ner_utils import InputExample, convert_example_to_feature


class TokenClassifier:
    def __init__(self, tokenizer, onnx_model_path, onnx_model_argument_path):
        self.tokenizer = tokenizer
        self.args = self.initial_session_and_argument(onnx_model_path, onnx_model_argument_path, tokenizer)

    def inference(self, sentence, mode="new"):
        test_sentence = self.preprocess_test_sentence_from_start(
            sentence, self.tokenizer
        )
        predictions = self.prediction_with_onnx(self.args, test_sentence)
        predictions = self.postprocess_predictions_BI(predictions, mode=mode)
        return predictions

    def preprocess_test_sentence_from_start(self, test_sentences, auto_tokenizer):
        test_sentences = auto_tokenizer.tokenize(test_sentences)
        test_sentences = " ".join(test_sentences)
        return test_sentences


    def postprocess_predictions_BI(self, predictions, mode="normal"):
        result_list = []
        for i in range(len(predictions)):
            words = ""
            category = ""
            for j in range(len(predictions[i])):
                # Beginning case
                if "B-" in list(predictions[i][j].values())[0]:
                    if words != "" and category != "":
                        new_words = words
                        if words[0] == "▁":
                            new_words = new_words[1:]
                        if words[-1] == "▁":
                            new_words = new_words[:-1]
                        result_list.append([new_words, category])
                    words = list(predictions[i][j].keys())[0]
                    category = list(predictions[i][j].values())[0][2:]
                elif (
                    "I-" in list(predictions[i][j].values())[0]
                    and list(predictions[i][j].values())[0][2:] == category
                ):
                    words += list(predictions[i][j].keys())[0]
                elif list(predictions[i][j].values())[0] == "O" and words != "":
                    new_words = words
                    if words[0] == "▁":
                        new_words = new_words[1:]
                    if words[-1] == "▁":
                        new_words = new_words[:-1]
                    result_list.append([new_words, category])
                    # Reset
                    words = ""
                    category = ""
            if words != "" and category != "":
                new_words = words
                if words[0] == "▁":
                    new_words = new_words[1:]
                if words[-1] == "▁":
                    new_words = new_words[:-1]
                result_list.append([new_words, category])
        if mode == "new":
            for item in result_list:
                if item[0] == "":
                    result_list.remove(item)
        return result_list


    def initial_session_and_argument(self, onnx_model_path, onnx_model_argument_path, tokenizer):
        # Create Inference session
        session = InferenceSession(onnx_model_path, providers=["CPUExecutionProvider"])

        # Load model arguments
        args = json.load(open(onnx_model_argument_path))
        max_seq_length = args["max_seq_length"]
        cls_token_at_end = bool(args["model_type"] in ["xlnet"])
        pad_on_left = bool(args["model_type"] in ["xlnet"])
        cls_token_segment_id = 2 if args["model_type"] in ["xlnet"] else 0
        pad_token_segment_id = 4 if args["model_type"] in ["xlnet"] else 0
        sep_token_extra = args["model_type"] in [
            "roberta",
            "camembert",
            "xlmroberta",
            "longformer",
            "mpnet",
        ]

        # Initial tokenizer
        cls_token = tokenizer.cls_token
        sep_token = tokenizer.sep_token
        pad_token = tokenizer.pad_token_id

        label_list = args["labels_list"]
        label_map_label2id = {label: i for i, label in enumerate(label_list)}
        label_map_id2label = {i: label for i, label in enumerate(label_list)}

        pad_token_label_id = -100
        sequence_a_segment_id = 0
        mask_padding_with_zero = True

        return [
            session,
            label_list,
            max_seq_length,
            label_map_label2id,
            label_map_id2label,
            max_seq_length,
            tokenizer,
            cls_token_at_end,
            cls_token,
            cls_token_segment_id,
            sep_token,
            sep_token_extra,
            pad_on_left,
            pad_token,
            pad_token_segment_id,
            pad_token_label_id,
            sequence_a_segment_id,
            mask_padding_with_zero,
        ]


    def prediction_with_onnx(self, initial_list, test_sentence):
        [
            session,
            label_list,
            max_seq_length,
            label_map_label2id,
            label_map_id2label,
            max_seq_length,
            tokenizer,
            cls_token_at_end,
            cls_token,
            cls_token_segment_id,
            sep_token,
            sep_token_extra,
            pad_on_left,
            pad_token,
            pad_token_segment_id,
            pad_token_label_id,
            sequence_a_segment_id,
            mask_padding_with_zero,
        ] = initial_list

        examples = [
            InputExample(
                i,
                sentence.split(),
                [label_list[0] for word in sentence.split()],
            )
            for i, sentence in enumerate([test_sentence])
        ]

        # Convert example to feature
        features = [
            convert_example_to_feature(
                example,
                label_map_label2id,
                max_seq_length,
                tokenizer,
                cls_token_at_end,
                cls_token,
                cls_token_segment_id,
                sep_token,
                sep_token_extra,
                pad_on_left,
                pad_token,
                pad_token_segment_id,
                pad_token_label_id,
                sequence_a_segment_id,
                mask_padding_with_zero,
            )
            for example in examples
        ]

        all_input_ids = torch.tensor([f.input_ids for f in features], dtype=torch.long)
        all_input_mask = torch.tensor([f.input_mask for f in features], dtype=torch.long)
        all_label_ids = torch.tensor([f.label_ids for f in features], dtype=torch.long)

        inputs = {
            "input_ids": np.array(all_input_ids),
            "attention_mask": np.array(all_input_mask),
        }

        # Make a prediction
        outputs = session.run(None, input_feed=inputs)
        preds = outputs[0]
        out_label_ids = np.array(all_label_ids)
        out_input_ids = inputs["input_ids"]
        out_attention_mask = inputs["attention_mask"]
        token_logits = preds

        # Label classes
        preds = np.argmax(preds, axis=2)

        out_label_list = [[] for _ in range(out_label_ids.shape[0])]
        preds_list = [[] for _ in range(out_label_ids.shape[0])]

        for i in range(out_label_ids.shape[0]):
            for j in range(out_label_ids.shape[1]):
                if out_label_ids[i, j] != pad_token_label_id:
                    out_label_list[i].append(label_map_id2label[out_label_ids[i][j]])
                    preds_list[i].append(label_map_id2label[preds[i][j]])

        preds = [
            [
                {word: preds_list[i][j]}
                for j, word in enumerate(sentence.split()[: len(preds_list[i])])
            ]
            for i, sentence in enumerate([test_sentence])
        ]

        return preds
