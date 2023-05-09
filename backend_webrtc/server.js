const ToothTable = require("./teeth/ToothTable.js");

const fs = require("fs");
const webrtc = require("wrtc");
const { RTCAudioSink } = require("wrtc").nonstandard;
const express = require("express");
const https = require("https");
const http = require("http");
const { Server } = require("socket.io");
const gowajee_service = require("./utils/gowajee_service.js");
const dotenv = require("dotenv");
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const RATE = 48000; // Sample rate of the input audio

// gRPC Denpendencies
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

// Load Gowajee proto for gRPC
const SPEECH2TEXT_PROTO_PATH = "./proto/speech2text.proto";
let speech2text_packageDefinition = protoLoader.loadSync(
  SPEECH2TEXT_PROTO_PATH,
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  }
);
let speech2text_protoc = grpc.loadPackageDefinition(
  speech2text_packageDefinition
).gowajee.speech.speech2text;

// Load NER Backend proto for gRPC
const NER_PROTO_PATH = "./proto/ner_model.proto";
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
const server = process.env.NODE_ENV === "production" ? https.createServer(
  {
    key: fs.readFileSync("key.pem"),
    cert: fs.readFileSync("cert.pem"),
  }, 
  app
) : http.createServer(app);
const io = new Server(server, {
  // Create CORS, in order to give an access to front-end server
  cors: {
    origin: `${process.env.NODE_ENV === "production" ? "https" : "http"}://${process.env.CLIENT_IP}:${process.env.CLIENT_PORT}`,
    methods: ["GET", "POST"],
  },
});

// Open Socket Connection
io.on("connection", async (socket) => {
  // Initialize parameter in socket section
  let sink = null;
  let audioTrack = null;
  let is_record = false;
  let gowajee_call = null;
  let ner_call = null;
  let old_command = null;
  let old_q = null;
  let old_i = null;
  let old_side = "";
  let toothTable = new ToothTable();
  // ----------------- Update record data from MongoDB if userID exists ----------------- //
  // // Sample token
  // let token =
  //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MjFhMmMzOTliODg0NTdlODBhNDZkZSIsImlhdCI6MTY4MDEwMjAxMiwiZXhwIjoxNjg3ODc4MDEyfQ.p8-uTTUVMt3qUe7JrQe0TeRZ1mwy8RsfbyfapQfeBSs";
  // // const token = socket.handshake.query.token;
  // // Send request to backend server to get previous record data if exists
  // let config = {
  //   headers: {
  //     Authorization: "Bearer " + token,
  //   },
  //   withCredentials: true,
  // };
  // let url = `http://${process.env.NORMAL_BACKEND_IP}:${process.env.NORMAL_BACKEND_PORT}/record`;
  // await axios
  //   .get(url, config)
  //   .then((response) => response.data)
  //   .then((data) => {
  //     if (data.data) {
  //       let recordData = data.data.recordData;
  //       toothTable.importValue(recordData);
  //     }
  //   })
  //   .catch((err) => console.log(err));
  // console.log("Tooth table data", toothTable);
  // toothTable.showPDREValue();
  // -------------------------------------------------------------------------------------------------------------- //

  console.log(
    "socket id:",
    socket.id,
    ", userId:",
    socket.handshake.query.userId
  );

  // Connect to gRPC Gowajee Streaming Backend
  let gowajee_stub = new speech2text_protoc.GowajeeSpeechToText(
    // `localhost:${process.env.GOWAJEE_PORT}`,
    `${process.env.GOWAJEE_IP}:${process.env.GOWAJEE_PORT}`,
    grpc.credentials.createInsecure()
  );

  // Connect to NER Backend
  let ner_stub = new ner_protoc.NERBackend(
    // `localhost:${process.env.NER_BACKEND_PORT}`,
    `${process.env.NER_BACKEND_IP}:${process.env.NER_BACKEND_PORT}`,
    grpc.credentials.createInsecure()
  );

  // Create RTC peer connection and send server candidate to client
  const RTC_CONFIG = {
    iceServers: [
      {
        urls: "stun:a.relay.metered.ca:80",
      },
      {
        urls: "turn:a.relay.metered.ca:80",
        username: process.env.OPEN_RELAY_USERNAME,
        credential: process.env.OPEN_RELAY_CREDENTIAL,
      },
      {
        urls: "turn:a.relay.metered.ca:80?transport=tcp",
        username: process.env.OPEN_RELAY_USERNAME,
        credential: process.env.OPEN_RELAY_CREDENTIAL,
      },
      {
        urls: "turn:a.relay.metered.ca:443",
        username: process.env.OPEN_RELAY_USERNAME,
        credential: process.env.OPEN_RELAY_CREDENTIAL,
      },
      {
        urls: "turn:a.relay.metered.ca:443?transport=tcp",
        username: process.env.OPEN_RELAY_USERNAME,
        credential: process.env.OPEN_RELAY_CREDENTIAL,
      },
    ],
  };

  const pc = new webrtc.RTCPeerConnection(RTC_CONFIG);
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
    console.log(`[${socket.id}] start streaming`);
    is_record = true;
  });

  // When client send stop record
  socket.on("stop_record", async () => {
    console.log(`[${socket.id}] stop streaming`);
    is_record = false;
  });

  // When client undo missing
  socket.on("undo_missing", async (toothData) => {
    tooth = { first_zee: toothData.q, second_zee: toothData.i };
    ner_stub.UndoMissing(tooth, (err, response) => {
      if (err) console.log(err);
    });
    toothTable.updateValue(toothData.q, toothData.i, "Missing", false);
    // console.log("undo_missing:", toothData);
  })

  // When client add missing
  socket.on("add_missing", async (toothData) => {
    tooth = { first_zee: toothData.q, second_zee: toothData.i };
    ner_stub.AddMissing(tooth, (err, response) => {
      if (err) console.log(err);
    });
    toothTable.updateValue(toothData.q, toothData.i, "Missing", true);
    // console.log("add_missing:", toothData);
  })

  // When disconnect end the streaming
  socket.on("disconnect", () => {
    console.log("disconnect");
    if (sink) {
      sink.stop();
      gowajee_call.cancel();
      ner_call.cancel()
      sink = null;
    }
  });

  // When new audio track is added, then assign audio track
  pc.ontrack = (event) => {
    // Initilize Parameter for Gowajee Streaming Stub
    request = gowajee_service.init_streaming_request();

    // Create call instance for callling an streaming transcribe method (stub module)
    gowajee_call = gowajee_stub.StreamingTranscribe((err, response) => {
      if (err) console.log(err);
    });

    ner_call = ner_stub.StreamingNER((err, response) => {
      if (err) console.log(err);
    });

    // Query new audio track
    audioTrack = event.streams[0].getAudioTracks()[0];
    // Convert AudioTrack type to mp3/wav format
    sink = new RTCAudioSink(audioTrack);
    // When new data coming, send to Gowajee server
    sink.ondata = (data) => {
      if (data.samples.buffer && is_record) {
        // Send request to Gowajee if is_record is true!!
        request.audio_data = new Uint8Array(data.samples.buffer); // set request's audio data to the income audio
        gowajee_call.write(request); // send/call for streaming transcribe method
      }
    };

    // When receive response from Gowajee Server, Send it to ner backend server
    gowajee_call.on("data", (response) => {
      ner_call.write(response);
      }).once('error', () => {
        console.log("end grpc streaming");
    });

    ner_call.on("data", (response) => {
      // console.log(response.response);
      let semanticList = response.response;
      let isUpdate = false;

      semanticList.forEach(async (semantic) => {
        mode = semantic.command;
        pd_re_bop = ["PDRE", "BOP"];
        mo_mgj = ["MO", "MGJ"];

        // console.log(semantic);
        if (!semantic.is_complete) {
          q = null;
          i = null;
          if (!(semantic.data.zee === null)) {
            q = semantic.data.zee.first_zee;
            i = semantic.data.zee.second_zee;
          }
          tooth_side = semantic.data.tooth_side;

          if (
            !(old_command === mode) ||
            !(q === old_q) ||
            !(i === old_i) ||
            !(tooth_side === old_side)
          ) {
            sendUpdateDisplayToFrontEnd(socket, mode, q, i, tooth_side);
            // Clear the ToothValue when start a command to handle the repeat tooth value problem.
            if (mode === "PDRE" && !!q && !!i && !!tooth_side) {
              toothTable.clearToothValue(q, i, mode, tooth_side);
            } else if (mode === "MGJ" && !!q && !!i) {
              toothTable.clearToothValue(q, i, mode);
            }
          }

          old_command = mode;
          old_q = q;
          old_i = i;
          old_side = tooth_side;
          return;
        }

        if (pd_re_bop.includes(mode)) {
          side = semantic.data.tooth_side.toLowerCase();
          position = semantic.data.position.toLowerCase();
          q = semantic.data.zee.first_zee;
          i = semantic.data.zee.second_zee;

          if (mode === "PDRE") {
            target = semantic.data.payload;
            mode = semantic.data.is_number_PD ? "PD" : "RE";
          } else {
            target = semantic.data.BOP_payload;
          }

          // console.log(mode, q, i, side, position, '-->', target)
          let next_tooth = null;
          // toothTable.updateValue(q, i, mode, target, side, position);
          if (toothTable.updateValue(q, i, mode, target, side, position)) {
            if (
              mode === "RE" &&
              (((((q === 1 || q === 3) && side === "buccal") ||
                ((q === 2 || q === 4) && side === "lingual")) &&
                position === "mesial") ||
                ((((q === 1 || q === 3) && side === "lingual") ||
                  ((q === 2 || q === 4) && side === "buccal")) &&
                  position === "distal"))
            ) {
              next_tooth = toothTable.findNextAvailableTooth(q, i, side);
            }
            sendUpdateToothTableDataToFrontEnd(
              socket,
              q,
              i,
              mode,
              target,
              side,
              position,
              next_tooth
            );
            if (next_tooth) {
              toothTable.clearToothValue(
                next_tooth.q,
                next_tooth.i,
                "PDRE",
                side
              );
            }
          }
        } else if (mo_mgj.includes(mode)) {
          q = semantic.data.zee.first_zee;
          i = semantic.data.zee.second_zee;
          target = semantic.data.payload;

          // console.log(mode, q, i, '-->', target)
          let next_tooth = null;
          if (toothTable.updateValue(q, i, mode, target)) {
            if (mode === "MGJ") {
              next_tooth = toothTable.findNextAvailableTooth(q, i, "buccal");
            }
            sendUpdateToothTableDataToFrontEnd(
              socket,
              q,
              i,
              mode,
              target,
              (side = null),
              (position = null),
              (next_tooth = next_tooth)
            );
            if (next_tooth) {
              toothTable.clearToothValue(next_tooth.q, next_tooth.i, mode);
            }
          }
        } else if (mode === "Missing") {
          missing_list = semantic.data.missing;
          missing_list.forEach((missing_tooth) => {
            q = missing_tooth.first_zee;
            i = missing_tooth.second_zee;
            target = true;

            // console.log(mode, q, i, '-->', target)
            if (toothTable.updateValue(q, i, mode, target))
              sendUpdateToothTableDataToFrontEnd(socket, q, i, mode, target);
          });
        }
        // toothTable.showPDREValue();
        // ----------------- Update record data to MongoDB ----------------- //
        // let config = {
        //   headers: {
        //     Authorization: "Bearer " + token,
        //   },
        //   withCredentials: true,
        // };
        // let updatedData = {
        //   recordData: toothTable.exportValue(),
        //   timestamp: Date.now(),
        // };
        // let url = `http://${process.env.NORMAL_BACKEND_IP}:${process.env.NORMAL_BACKEND_PORT}/record`;
        // await axios.post(url, updatedData, config);
        // ----------------------------------------------------------------- //
      });
      }).once('error', () => {
        console.log("end grpc streaming");
    });;
  };
});

const sendUpdateToothTableDataToFrontEnd = (
  socket,
  q,
  i,
  mode,
  target,
  side = null,
  position = null,
  next_tooth = null
) => {
  data = { q, i, mode, target, side, position, next_tooth };
  // console.log("data", data);
  socket.emit("data", data);
};

const sendUpdateDisplayToFrontEnd = (socket, command, q, i, tooth_side) => {
  data = { command, q, i, tooth_side };
  // console.log("update_command", data);
  socket.emit("update_command", data);
};

server.listen(process.env.SERVER_PORT, () => {
  console.log(`listening on *:${process.env.SERVER_PORT}`);
});
