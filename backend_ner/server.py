from typing import Iterable

import grpc
from concurrent import futures

from grpc.aio import ServicerContext

import utils.ner_model_pb2 as ner_model_pb2
import utils.ner_model_pb2_grpc as ner_model_pb2_grpc

from transformers import AutoTokenizer

from utils.model import TokenClassifier
from utils.parser_model import ParserModel
from utils.proto_utils import create_ner_response, create_incomplete_semantic
from utils.dictionary_mapping import DictionaryMapping

import config


class NERBackendServicer(ner_model_pb2_grpc.NERBackendServicer):
    def __init__(self, token_classifier: TokenClassifier, parser: ParserModel, dict_map: DictionaryMapping):
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
        old_tooth_list = []
        old_is_final = True
        old_command, old_tooth, old_tooth_side = None, None, None
        self.parser.reset()
        for request in request_iterator:
            # Concatenate trancripts in the responses
            sentence = ""
            for transcript in request.results:
                # fix the problem, when the user does not speak, but
                # gowajee output something. We do not consider the word
                # which has low confidence. 
                # for word in transcript.word_timestamps:
                #     print("Word", word.word)
                #     print("Confidence", word.confidence)
                if len(transcript.word_timestamps) == 1 and \
                    transcript.word_timestamps[0].confidence < 0.3:
                    continue
                sentence += str(transcript.transcript)


            # print(request.results)
            sentence = self.dict_map.normalize(sentence)
            # hack, token classifier model cannot predict single number text, 
            # however if we add space at the end of the sentence it will resolve the problem
            # sentence = sentence + " " 

            if old_is_final:
                sentences.append(sentence)
                old_tooth_list = []
            else:
                sentences[-1] = sentence
            print(sentences)

            # Predict the class of each token in the sentence
            # predicted_token = self.token_classifier.inference(sentence)
            # print(predicted_token)
            # Preprocess the predicted token and convert to semantic command
            semantics = self.parser.inference(sentence, self.token_classifier, request.is_final)
            # print(semantics)
            command, tooth, tooth_side, semantics, _ = semantics.values()    
            
            # Create an incomplete semantic for update display to frontend
            # 1.) first we consider that if there is not semantic from the result but the command is not None
            # then create incomplete semantic
            # 2.) second we consider that if there are more than one semantic, then there is two case which we need to consider
            # 2.1) the command in the last semantic is not the same as the command, this mean
            #      that there is a new command from the user but does not complete yet. 
            # 2.2) the command is a BOP command because when we speak the BOP format, it will always output one semantic
            #      unlike other command such as PDRE which doesn't output anything before speaking the payload value
            # 3.) last but note least the PDRE and the MGJ command has a sequential format, therefore these two command 
            #     must send incomplete only at the start of the command and frontend will do the rest, if not, the cursor
            #     will be pull back to the tooth of the incomplete command. Therefore, we need to separate the MGJ command
            #     from the other (PDRE) because the tooth_side in MGJ is None.
            if ((len(semantics) == 0) or (len(semantics) > 0 and (semantics[-1]["command"] != command or tooth is None or tooth_side is None or command=="BOP"))) \
            and command and (command != old_command or old_tooth is None or old_tooth_side is None or \
            ((command == old_command and command != "MGJ" and (tooth is None or tooth_side is None)) or \
             (command == old_command and command == "MGJ" and (tooth is None)))): # or tooth != old_tooth or tooth_side != old_tooth_side):
                # print("create incomplete semantic", command, tooth, tooth_side)
                # print("old command", old_command, old_tooth, old_tooth_side)
                update_display = create_incomplete_semantic(command, tooth, tooth_side)
                old_command, old_tooth, old_tooth_side = command, tooth, tooth_side
                if command == "MGJ":
                    old_tooth_side = "Not Care"
                semantics.insert(0, update_display)


            # print()

            old_is_final = request.is_final
            # Create a dummy response
            if len(semantics) > 0:
                response = create_ner_response(semantics)
                yield response
    
    def UndoMissing(
        self,
        request: ner_model_pb2.Zee,
        context: ServicerContext,
    ) -> ner_model_pb2.Empty:
        q, i = request.first_zee, request.second_zee
        self.parser.append_zee_to_available_teeth_dict([q, i])
        return ner_model_pb2.Empty()
    
    def AddMissing(
        self,
        request: ner_model_pb2.Zee,
        context: ServicerContext,
    ) -> ner_model_pb2.Empty:
        q, i = request.first_zee, request.second_zee
        self.parser.remove_zee_from_available_teeth_dict([q, i])
        return ner_model_pb2.Empty()


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
