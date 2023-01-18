// GENERATED CODE -- DO NOT EDIT!

// Original file comments:
//
// Based on gRPC health check protocol - more details found here:
// https://github.com/grpc/grpc/blob/master/doc/health-checking.md
//
//
'use strict';
var grpc = require('@grpc/grpc-js');
var health_pb = require('./health_pb.js');

function serialize_gowajee_speech_HealthCheckRequest(arg) {
  if (!(arg instanceof health_pb.HealthCheckRequest)) {
    throw new Error('Expected argument of type gowajee.speech.HealthCheckRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_gowajee_speech_HealthCheckRequest(buffer_arg) {
  return health_pb.HealthCheckRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_gowajee_speech_HealthCheckResponse(arg) {
  if (!(arg instanceof health_pb.HealthCheckResponse)) {
    throw new Error('Expected argument of type gowajee.speech.HealthCheckResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_gowajee_speech_HealthCheckResponse(buffer_arg) {
  return health_pb.HealthCheckResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var HealthService = exports.HealthService = {
  check: {
    path: '/gowajee.speech.Health/Check',
    requestStream: false,
    responseStream: false,
    requestType: health_pb.HealthCheckRequest,
    responseType: health_pb.HealthCheckResponse,
    requestSerialize: serialize_gowajee_speech_HealthCheckRequest,
    requestDeserialize: deserialize_gowajee_speech_HealthCheckRequest,
    responseSerialize: serialize_gowajee_speech_HealthCheckResponse,
    responseDeserialize: deserialize_gowajee_speech_HealthCheckResponse,
  },
  watch: {
    path: '/gowajee.speech.Health/Watch',
    requestStream: false,
    responseStream: true,
    requestType: health_pb.HealthCheckRequest,
    responseType: health_pb.HealthCheckResponse,
    requestSerialize: serialize_gowajee_speech_HealthCheckRequest,
    requestDeserialize: deserialize_gowajee_speech_HealthCheckRequest,
    responseSerialize: serialize_gowajee_speech_HealthCheckResponse,
    responseDeserialize: deserialize_gowajee_speech_HealthCheckResponse,
  },
};

exports.HealthClient = grpc.makeGenericClientConstructor(HealthService);
