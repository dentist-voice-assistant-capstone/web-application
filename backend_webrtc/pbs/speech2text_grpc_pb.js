// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var speech2text_pb = require('./speech2text_pb.js');
var audio_pb = require('./audio_pb.js');
var decoder_type_pb = require('./decoder_type_pb.js');

function serialize_gowajee_speech_speech2text_StreamingTranscribeRequest(arg) {
  if (!(arg instanceof speech2text_pb.StreamingTranscribeRequest)) {
    throw new Error('Expected argument of type gowajee.speech.speech2text.StreamingTranscribeRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_gowajee_speech_speech2text_StreamingTranscribeRequest(buffer_arg) {
  return speech2text_pb.StreamingTranscribeRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_gowajee_speech_speech2text_StreamingTranscribeResponse(arg) {
  if (!(arg instanceof speech2text_pb.StreamingTranscribeResponse)) {
    throw new Error('Expected argument of type gowajee.speech.speech2text.StreamingTranscribeResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_gowajee_speech_speech2text_StreamingTranscribeResponse(buffer_arg) {
  return speech2text_pb.StreamingTranscribeResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_gowajee_speech_speech2text_TranscribeRequest(arg) {
  if (!(arg instanceof speech2text_pb.TranscribeRequest)) {
    throw new Error('Expected argument of type gowajee.speech.speech2text.TranscribeRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_gowajee_speech_speech2text_TranscribeRequest(buffer_arg) {
  return speech2text_pb.TranscribeRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_gowajee_speech_speech2text_TranscribeResponse(arg) {
  if (!(arg instanceof speech2text_pb.TranscribeResponse)) {
    throw new Error('Expected argument of type gowajee.speech.speech2text.TranscribeResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_gowajee_speech_speech2text_TranscribeResponse(buffer_arg) {
  return speech2text_pb.TranscribeResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


//
// The GowajeeSpeechToText service provides two mechanisms for converting speech to text.
var GowajeeSpeechToTextService = exports.GowajeeSpeechToTextService = {
  // Transcribe expects a TranscribeRequest and returns a TranscribeResponse.
transcribe: {
    path: '/gowajee.speech.speech2text.GowajeeSpeechToText/Transcribe',
    requestStream: false,
    responseStream: false,
    requestType: speech2text_pb.TranscribeRequest,
    responseType: speech2text_pb.TranscribeResponse,
    requestSerialize: serialize_gowajee_speech_speech2text_TranscribeRequest,
    requestDeserialize: deserialize_gowajee_speech_speech2text_TranscribeRequest,
    responseSerialize: serialize_gowajee_speech_speech2text_TranscribeResponse,
    responseDeserialize: deserialize_gowajee_speech_speech2text_TranscribeResponse,
  },
  // StreamingTranscribe is a non-blocking API call that allows audio data chunks to be fed to the server.
streamingTranscribe: {
    path: '/gowajee.speech.speech2text.GowajeeSpeechToText/StreamingTranscribe',
    requestStream: true,
    responseStream: true,
    requestType: speech2text_pb.StreamingTranscribeRequest,
    responseType: speech2text_pb.StreamingTranscribeResponse,
    requestSerialize: serialize_gowajee_speech_speech2text_StreamingTranscribeRequest,
    requestDeserialize: deserialize_gowajee_speech_speech2text_StreamingTranscribeRequest,
    responseSerialize: serialize_gowajee_speech_speech2text_StreamingTranscribeResponse,
    responseDeserialize: deserialize_gowajee_speech_speech2text_StreamingTranscribeResponse,
  },
};

exports.GowajeeSpeechToTextClient = grpc.makeGenericClientConstructor(GowajeeSpeechToTextService);
