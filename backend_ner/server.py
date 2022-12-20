from typing import Iterable

import grpc
import concurrent
from concurrent import futures

from grpc.aio import ServicerContext

import utils.ner_model_pb2 as ner_model_pb2
import utils.ner_model_pb2_grpc as ner_model_pb2_grpc

from utils.model import *
from transformers import AutoTokenizer

import config


class NERBackendServicer(ner_model_pb2_grpc.NERBackendServicer):
    def __init__(self, tokenizer, args):
        self.tokenizer = tokenizer
        self.args = args

    # Insert a logic of StreamingNER function
    def StreamingNER(
        self,
        request_iterator: Iterable[ner_model_pb2.StreamingTranscribeResponse],
        context: ServicerContext,
    ) -> Iterable[ner_model_pb2.NERResponse]:
        """
        Wait for a response from clients, then predict tags from the response using wangchanberta model (ONNX CPU)
        """
        for request in request_iterator:
            # Concatenate trancripts in the responses
            sentences = ""
            for transcript in request.results:
                sentences += str(transcript.transcript)

            # Preprocess the sentences using tokenizer and predict tags
            test_sentence = preprocess_test_sentence_from_start(
                sentences, self.tokenizer
            )
            predictions = prediction_with_onnx(self.args, test_sentence)
            # Postprocess to convert text to number or commands
            print(str(postprocess_predictions_BI(predictions, mode="new")))

            # Create a dummy response
            response = ner_model_pb2.NERResponse()
            response.message = "hello websocket server"
            yield response


address = f"[::]:{config.PORT}"


def main():
    # Initial tokenizer
    tokenizer = AutoTokenizer.from_pretrained(
        "airesearch/wangchanberta-base-att-spm-uncased", revision="main"
    )
    # Initial interface session
    args = initial_session_and_argument(
        "model/onnx_model-quantized.onnx", "model/model_args.json", tokenizer
    )

    # Create a gRPC server
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=4))

    # Add NERBackendServicer to the server
    ner_model_pb2_grpc.add_NERBackendServicer_to_server(
        NERBackendServicer(tokenizer, args), server
    )

    # Start the server
    server.add_insecure_port(address)
    server.start()
    print("Server serving at %s", address)
    server.wait_for_termination()


if __name__ == "__main__":
    main()
