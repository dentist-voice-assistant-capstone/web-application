const webrtc = require("wrtc");
const { RTCAudioSink } = require("wrtc").nonstandard;
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const WavFileWriter = require("wav").FileWriter;
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

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
  let outputFileStream = null;
  let audioTrack = null;

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
    outputFileStream = new WavFileWriter(`./audio/${socket.id}.wav`, {
      sampleRate: 48000,
      bitDepth: 16,
      channels: 1,
    });

    sink = new RTCAudioSink(audioTrack);
    sink.ondata = ({ samples: { buffer } }) => {
      if (buffer && outputFileStream) {
        outputFileStream.write(Buffer.from(buffer));
      }
    };
  });

  // When client send stop record
  socket.on("stop_record", async () => {
    outputFileStream.end();
    sink.stop();
  });

  // When disconnect end the streaming
  socket.on("disconnect", () => {
    console.log("disconnect");
    if (outputFileStream) {
      outputFileStream.end();
      outputFileStream = null;
    }
    if (sink) {
      sink.stop();
      sink = null;
    }
  });

  // When new audio track is added, then assign audio track
  pc.ontrack = (event) => {
    audioTrack = event.streams[0].getAudioTracks()[0];
  };
});

server.listen(process.env.SERVER_PORT, () => {
  console.log(`listening on *:${process.env.SERVER_PORT}`);
});
