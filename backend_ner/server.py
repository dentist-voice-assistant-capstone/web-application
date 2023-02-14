from typing import Iterable

import grpc
from concurrent import futures

from grpc.aio import ServicerContext

import utils.ner_model_pb2 as ner_model_pb2
import utils.ner_model_pb2_grpc as ner_model_pb2_grpc

from transformers import AutoTokenizer

from utils.model import TokenClassifier
from utils.parser_model import ParserModel
from utils.proto_utils import create_ner_response
from utils.dictionary_mapping import DictionaryMapping

import config


class NERBackendServicer(ner_model_pb2_grpc.NERBackendServicer):
    def __init__(self, token_classifier, parser, dict_map):
        self.token_classifier = token_classifier
        self.parser = parser
        self.dict_map = dict_map

    # Insert a logic of StreamingNER function
    def StreamingNER(
        self,
        request_iterator: Iterable[ner_model_pb2.StreamingTranscribeResponse],
        context: ServicerContext,
    ) -> Iterable[ner_model_pb2.NERResponse]:
        """
        Wait for a response from clients, then predict tags from the response using wangchanberta model (ONNX CPU)
        """
        # Reset all the parameter when use this function
        sentences = []
        old_is_final = True
        old_command, old_tooth, old_tooth_side = None, None, None
        self.parser.reset()
        for request in request_iterator:
            # Concatenate trancripts in the responses
            sentence = ""
            for transcript in request.results:
                sentence += str(transcript.transcript)
                for word in transcript.word_timestamps:
                    print(word.word, word.confidence)

            # print(request.results)
            sentence = self.dict_map.normalize(sentence)
            # hack, token classifier model cannot predict single number text, 
            # however if we add space at the end of the sentence it will resolve the problem
            sentence = sentence + " " 

            if old_is_final:
                sentences.append(sentence)
            else:
                sentences[-1] = sentence
            print(sentences)

            # Predict the class of each token in the sentence
            # predicted_token = self.token_classifier.inference(sentence)
            # print(predicted_token)
            # Preprocess the predicted token and convert to semantic command
            semantics = self.parser.inference(sentence, self.token_classifier, request.is_final)
            print(semantics)
            command, tooth, tooth_side, semantics, _ = semantics.values()    
            # print(semantics)
            if ((len(semantics) == 0) or (len(semantics) > 0 and (semantics[-1]["command"] != command))) and command and (command != old_command or old_tooth is None or old_tooth_side is None): # or tooth != old_tooth or tooth_side != old_tooth_side):
                update_display = {
                    "command": command,
                    "data": {
                        "zee": tooth,
                        "tooth_side": tooth_side,
                    },
                    "is_complete": False
                }
                old_command, old_tooth, old_tooth_side = command, tooth, tooth_side
                semantics.append(update_display)


            # print()

            old_is_final = request.is_final
            # Create a dummy response
            if len(semantics) > 0:
                response = create_ner_response(semantics)
                yield response


address = f"[::]:{config.PORT}"


def main():
    # Initial tokenizer
    tokenizer = AutoTokenizer.from_pretrained(
        "airesearch/wangchanberta-base-att-spm-uncased", revision="main"
    )
    # Create token classifier and parser model
    token_classifier = TokenClassifier(tokenizer, "model/onnx_model-quantized.onnx", "model/model_args.json")
    parser = ParserModel()
    dict_map = DictionaryMapping("dictionary_mapping.csv")

    # Create a gRPC server
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=4))

    # Add NERBackendServicer to the server
    ner_model_pb2_grpc.add_NERBackendServicer_to_server(
        NERBackendServicer(token_classifier, parser, dict_map), server
    )

    # Start the server
    server.add_insecure_port(address)
    server.start()
    print("Server serving at %s", address)
    server.wait_for_termination()


if __name__ == "__main__":
    main()
