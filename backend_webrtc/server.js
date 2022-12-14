const webrtc = require("wrtc");
const { RTCAudioSink } = require("wrtc").nonstandard;
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const WavFileWriter = require("wav").FileWriter;
const gowajee_service = reuqire('./utils/gowajee_service.js');
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const RATE = 48000 // Sample rate of the input audio

// gRPC Denpendencies
const grpc = require('@grpc/grpc-js');
const protoLoader = require("@grpc/proto-loader");

// Load Gowajee proto for gRPC
const SPEECH2TEXT_PROTO_PATH = './proto/speech2text.proto'
let speech2text_packageDefinition = protoLoader.loadSync(SPEECH2TEXT_PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
let speech2text_protoc = grpc.loadPackageDefinition(speech2text_packageDefinition).gowajee.speech.speech2text;

// Load NER Backend proto for gRPC
const NER_PROTO_PATH = './proto/ner_model.proto'
let ner_packageDefinition = protoLoader.loadSync(NER_PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
let ner_protoc = grpc.loadPackageDefinition(ner_packageDefinition).ner_backend;

// Initialize Socket
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  // Create CORS, in order to give an access to front-end server
  cors: {
    origin: `http://${process.env.IP_ADDRESS}:${process.env.CLIENT_PORT}`,
    methods: ["GET", "POST"],
  },
});

// Open Socket Connection
io.on("connection", (socket) => {
  // Initialize parameter in socket section
  let sink = null;
  let audioTrack = null;
  let is_record = false;

  // Connect to gRPC Gowajee Streaming Backend
  let gowajee_stub = new speech2text_protoc.GowajeeSpeechToText(
    `localhost:${process.env.GOWAJEE_PORT}`,
    grpc.credentials.createInsecure()
  );

  // Connect to NER Backend 
  let ner_stub = new ner_protoc.NERBackend(
    `localhost:${process.env.NER_BACKEND_PORT}`, 
    grpc.credentials.createInsecure()
  );

  // Create RTC peer connection and send server candidate to client
  const pc = new webrtc.RTCPeerConnection();
  pc.onicecandidate = ({ candidate }) => {
    socket.emit("candidate", candidate);
  };

  // Set SDP and answer to client
  socket.on("offer", async (offer) => {
    await pc.setRemoteDescription(offer);
    await pc.setLocalDescription(await pc.createAnswer());
    socket.emit("answer", pc.localDescription);
  });

  // When receive candidate from client, then add candidate to iceCandidate
  socket.on("candidate", async (candidate) => {
    if (candidate) {
      await pc.addIceCandidate(candidate);
    }
  });

  // When client send start record
  socket.on("start_record", async () => {
    is_record = true;
  });

  // When client send stop record
  socket.on("stop_record", async () => {
    is_record = false;
  });

  // When disconnect end the streaming
  socket.on("disconnect", () => {
    console.log("disconnect");
    if (sink) {
      sink.stop();
      sink = null;
    }
  });

  // When new audio track is added, then assign audio track
  pc.ontrack = (event) => {
    
    // Initilize Parameter for Gowajee Streaming Stub
    request = gowajee_service.init_streaming_request();

    // Create call instance for callling an streaming transcribe method (stub module)
    let gowajee_call = gowajee_stub.StreamingTranscribe((err, response) => {
      if(err) console.log(err);
    });

    let ner_call = ner_stub.StreamingNER((err, response) => {
      if(err) console.log(err);
    });


    // Query new audio track
    audioTrack = event.streams[0].getAudioTracks()[0];
    // Convert AudioTrack type to mp3/wav format
    sink = new RTCAudioSink(audioTrack);
    // When new data coming, send to Gowajee server
    sink.ondata = (data) => {
      if (data.samples.buffer && is_record){ // Send request to Gowajee if is_record is true!!
        request.audio_data = new Uint8Array(data.samples.buffer); // set request's audio data to the income audio
        gowajee_call.write(request); // send/call for streaming transcribe method
      }
    }

    // When receive response from Gowajee Server, Send it to ner backend server
    gowajee_call.on('data', (response) => {
      ner_call.write(response);
    });
  };
});

server.listen(process.env.SERVER_PORT, () => {
  console.log(`listening on *:${process.env.SERVER_PORT}`);
});
