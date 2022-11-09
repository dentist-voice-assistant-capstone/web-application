const webrtc = require("wrtc");
const { RTCAudioSink } = require("wrtc").nonstandard;
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const WavFileWriter = require("wav").FileWriter;
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: `http://127.0.0.1:${process.env.CLIENT_PORT}`,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  // Initialize parameter in socket section
  let sink = null;
  let outputFileStream = null;

  const pc = new webrtc.RTCPeerConnection();
  pc.onicecandidate = ({ candidate }) => {
    socket.emit("candidate", candidate);
  };

  socket.on("offer", async (offer) => {
    await pc.setRemoteDescription(offer);
    await pc.setLocalDescription(await pc.createAnswer());
    socket.emit("answer", pc.localDescription);
  });

  socket.on("candidate", async (candidate) => {
    if (candidate) {
      await pc.addIceCandidate(candidate);
    }
  });

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

  pc.ontrack = (event) => {
    outputFileStream = new WavFileWriter(`./audio/${socket.id}.wav`, {
      sampleRate: 48000,
      bitDepth: 16,
      channels: 1,
    });

    console.log(event.streams);
    let audioTrack = event.streams[0].getAudioTracks()[0];
    sink = new RTCAudioSink(audioTrack);
    sink.ondata = ({ samples: { buffer } }) => {
      if (buffer && outputFileStream) {
        outputFileStream.write(Buffer.from(buffer));
      }
    };
  };
});

server.listen(process.env.SERVER_PORT, () => {
  console.log(`listening on *:${process.env.SERVER_PORT}`);
});
