// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var ner_model_pb = require('./ner_model_pb.js');

function serialize_NERRequest(arg) {
  if (!(arg instanceof ner_model_pb.NERRequest)) {
    throw new Error('Expected argument of type NERRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_NERRequest(buffer_arg) {
  return ner_model_pb.NERRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_NERResponse(arg) {
  if (!(arg instanceof ner_model_pb.NERResponse)) {
    throw new Error('Expected argument of type NERResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_NERResponse(buffer_arg) {
  return ner_model_pb.NERResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var NERBackendService = exports.NERBackendService = {
  streamingNER: {
    path: '/NERBackend/StreamingNER',
    requestStream: true,
    responseStream: true,
    requestType: ner_model_pb.NERRequest,
    responseType: ner_model_pb.NERResponse,
    requestSerialize: serialize_NERRequest,
    requestDeserialize: deserialize_NERRequest,
    responseSerialize: serialize_NERResponse,
    responseDeserialize: deserialize_NERResponse,
  },
};

exports.NERBackendClient = grpc.makeGenericClientConstructor(NERBackendService);
