// import { ReactMediaRecorder } from "react-media-recorder";
// import NavBar from "../../components/ui/NavBar";

// const AudioStreamingPage = () => {
//   return (
//     <div>
//       <ReactMediaRecorder
//         audio
//         render={({ status, startRecording, stopRecording, mediaBlobUrl }) => (
//           <div>
//             <p>{status}</p>
//             <button onClick={startRecording}>Start Recording</button>
//             <div />
//             <button onClick={stopRecording}>Stop Recording</button>
//             <div />
//             <video src={mediaBlobUrl} controls autoPlay loop />
//           </div>
//         )}
//       />
//     </div>
//   );
// };

// import { useReactMediaRecorder } from "react-media-recorder";
// import classes from "./AudioStreamingPage.module.css";

// const AudioStreamingPage = () => {
//   const { status, startRecording, stopRecording, mediaBlobUrl } =
//     useReactMediaRecorder({ audio: true });

//   console.log(status);
//   console.log(mediaBlobUrl);

//   return (
//     <div>
//       <p>{status}</p>
//       <button
//         type="submit"
//         className={classes.audio_record_start}
//         onClick={startRecording}
//       >
//         Start
//       </button>
//       <div />
//       <button
//         type="submit"
//         className={classes.audio_record_stop}
//         onClick={stopRecording}
//       >
//         Stop
//       </button>
//       <div />
//       <video src={mediaBlobUrl} controls autoPlay loop />
//     </div>
//   );
// };

import { Fragment, useState, useEffect } from "react";

import Modal from "../../components/ui/Modal";

import classes from "./AudioStreamingPage.module.css";

/* Import modules for using sockets */
import io from "socket.io-client";

/* Import modules for Speech Recognizer (Tensorflow.js) */
import * as tf from "@tensorflow/tfjs";
import * as speechCommands from "@tensorflow-models/speech-commands";

/* probability threshold for recognizer to detect GOWAJEE keywords */
const GOWAJEE_THRESH = 0.9;

/* connection to socket server */
const socket = io.connect("http://localhost:3001");

const AudioStreamingPage = () => {
  /* states for speech recognizer model */
  const [recognizer, setRecognizer] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [isForcedStopListening, setIsForcredStopListening] = useState(false);
  const [gowajeeProb, setGowajeeProb] = useState(null);

  /* states for WebRTC Connection (streaming audio to backend) */
  const [peerConnection, setPeerConnection] = useState(null);
  const [localStream, setLocalStream] = useState(null);

  /* states for enable/disable streaming */
  const [isStreaming, setIsStreaming] = useState(false);
  const [isForcedStopStreaming, setIsForedStopStreaming] = useState(false);

  /* states for error modals */
  const [socketConnectionErrorModal, setSocketConnectionErrorModal] =
    useState(null);

  // For showing error modal if cannot connect to backend server ==================
  // if (!socket.connected && !socketConnectionErrorModal) {
  //   setSocketConnectionErrorModal({
  //     header: "Connection Error",
  //     content: <p>Cannot connect to backend server</p>,
  //   });
  // }
  // ==============================================================================

  const initiateRecognizer = async () => {
    /* load speechRecognizer model with its metadata and pre-trained weight
     * noted that the metadata and the weight are kept in the public folder, to prevent being processed by react
     */
    const r = speechCommands.create(
      "BROWSER_FFT",
      null,
      "http://localhost:5000/wakewordWeight/model.json",
      "http://localhost:5000/wakewordWeight/metadata.json"
    );
    await r.ensureModelLoaded();
    setRecognizer(r);
  };

  const initiateClientPeerConnection = async () => {
    // 1) initiate RTCPeerConnection
    // RTCPeerConnection configuration - STUN servers, ...
    const configuration = {
      iceServers: [
        {
          urls: ["stun:stun.l.google.com:19302"],
        },
      ],
    };
    const pc = new RTCPeerConnection(configuration);

    // listen for local ICE candidates on the local RTCPeerConnection, send the event.candidate to the server via socket.io
    pc.onicecandidate = ({ candidate }) => {
      if (candidate) {
        socket.emit("candidate", candidate);
      }
    };

    // In case of needing to re-exchange SDP between the client and the server (negotiation)
    pc.onnegotiationneeded = async () => {
      try {
        await pc.setLocalDescription(await pc.createOffer());
        // sending offer to server
        socket.emit("offer", pc.localDescription);
      } catch (err) {
        alert(err);
      }
    };

    console.log("peerConnection created!");

    // 2) get the localStream and then add the tracks from the localStream to the peerConnection
    // this will also automatically trigger pc.onnegotiationneeded to send the offer to the server
    await navigator.mediaDevices
      .getUserMedia({
        video: false,
        audio: true,
      })
      .then((mediaStream) => {
        mediaStream.getTracks().forEach((track) => {
          pc.addTrack(track, mediaStream);
        });
        console.log("add track finished");
        setLocalStream(mediaStream);
      });

    // listen for connectionstate change ========================================================
    pc.onconnectionstatechange = (event) => {
      if (pc.connectionState === "connected") {
        // start streaming
        console.log("PEERS CONNECTED");
      }
    };
    // ============================================================================================

    // 3) waiting for answer event from client via socket.io
    socket.on("answer", async (answer) => {
      console.log("received answer from server", answer);
      try {
        await pc.setRemoteDescription(answer);
        console.log("finish setting answer");
      } catch (err) {
        alert(err);
      }
    });

    socket.on("candidate", async (candidate) => {
      if (candidate) {
        await pc.addIceCandidate(candidate);
      }
    });

    setPeerConnection(pc);
  };

  const recognizerListen = async () => {
    setIsListening(true);
    let first;
    await recognizer.listen(
      (result) => {
        let gowajee_prob = result.scores[1];
        if (first) {
          setGowajeeProb(gowajee_prob);
        }
        // console.log(gowajee_prob, "streaming = ", isStreaming);
        // if gowajee_prob > GOWAJEE_THRESH, toggle the streaming
        if (gowajee_prob > GOWAJEE_THRESH) {
          if (first) {
            toggleIsForcedStopStreaming();
          } else {
            console.log("skipped!");
          }
        } else if (!first) {
          first = gowajee_prob;
        }
      },
      {
        // important ! ------------------------
        includeSpectrogram: true,
        includeEmbedding: true,
        // ------------------------------------
        probabilityThreshold: GOWAJEE_THRESH,
      }
    );
  };

  // FUNCTIONS for handling start/stop/toggle streaming ===============
  const startStreaming = () => {
    console.log("start streaming");
    localStream.getTracks().forEach((track) => {
      track.enabled = true;
    });
    socket.emit("start_record");
    setIsStreaming(true);
  };

  const stopStreaming = () => {
    console.log("stop streaming");
    socket.emit("stop_record");
    localStream.getTracks().forEach((track) => {
      track.enabled = false;
    });

    setIsStreaming(false);
  };

  const toggleIsForcedStopStreaming = () => {
    if (recognizer.isListening) {
      recognizer.stopListening();
    }
    setIsListening(false);

    if (isForcedStopStreaming) {
      setIsForedStopStreaming(false);
    } else {
      setIsForedStopStreaming(true);
    }
  };

  //===================================================================

  const toggleIsForcedStopListening = () => {
    if (isForcedStopListening) {
      setIsForcredStopListening(false);
    } else {
      setIsForcredStopListening(true);
    }
  };

  useEffect(() => {
    /* This function is used to initiate the speechRecognizer model
     * with predefined model's weight and metadata. This function will be called
     * when the page is loaded.
     */
    initiateRecognizer();

    /* This function is used to initiate the Client's RTCPeerConnection in
     * order to stream audio to the backend server.
     */
    initiateClientPeerConnection();
  }, []);

  // if the model is ready, start listening
  if (recognizer && !isListening && !isForcedStopListening) {
    recognizerListen();
  } else if (recognizer && isListening && isForcedStopListening) {
    recognizer.stopListening();
    setGowajeeProb(null);
    setIsListening(false);
  }

  // if the RTCPeerConnection is ready, start streaming
  if (
    peerConnection &&
    peerConnection.connectionState === "connected" &&
    localStream &&
    !isStreaming &&
    !isForcedStopStreaming
  ) {
    startStreaming();
  }

  if (localStream && isStreaming && isForcedStopStreaming) {
    stopStreaming();
  }

  return (
    <Fragment>
      {socketConnectionErrorModal && (
        <Modal
          header={socketConnectionErrorModal.header}
          content={socketConnectionErrorModal.content}
          onOKClick={() => setSocketConnectionErrorModal(null)}
          modalType="error"
        />
      )}

      <div className={classes["audioStreaming"]}>
        <div className={classes["audioStreaming__items-grid"]}>
          <p className={classes["audioStreaming__items-header"]}>
            Gowajee Spotting Model:
          </p>
          <div
            className={`${classes["audioStreaming__items-status"]} ${
              recognizer ? classes["pos"] : classes["neg"]
            }`}
          >
            {recognizer ? "Ready" : "Not Ready"}
          </div>
          <div></div>

          <p className={classes["audioStreaming__items-header"]}>
            isListening:
          </p>
          <div
            className={`${classes["audioStreaming__items-status"]} ${
              isListening ? classes["pos"] : classes["neg"]
            }`}
          >
            {isListening ? "Yes" : "No"}
          </div>

          <div className={classes["audioStreaming__items-button"]}>
            <button onClick={toggleIsForcedStopListening}>
              {isListening ? "Stop" : "Start"}
            </button>
          </div>

          <p className={classes["audioStreaming__items-header"]}>
            Socket Connection:
          </p>
          <div
            className={`${classes["audioStreaming__items-status"]} ${
              socket.connected === true ? classes["pos"] : classes["neg"]
            }`}
          >
            {socket.connected ? socket.id : "Socket Disconnected"}
          </div>
          <div></div>

          <p className={classes["audioStreaming__items-header"]}>
            RTCPeerConnection:
          </p>
          <div
            className={`${classes["audioStreaming__items-status"]} ${
              peerConnection && peerConnection.connectionState === "connected"
                ? classes["pos"]
                : classes["neg"]
            }`}
          >
            {peerConnection ? peerConnection.connectionState : "Not Ready"}
          </div>
          <div></div>
        </div>

        <br></br>

        <div
          className={`${classes["audioStreaming__items-status"]} ${
            peerConnection &&
            peerConnection.connectionState === "connected" &&
            isStreaming
              ? classes["pos"]
              : classes["neg"]
          }`}
        >
          {peerConnection &&
          peerConnection.connectionState === "connected" &&
          isStreaming
            ? "Streaming"
            : "Not Streaming"}
        </div>
        <div></div>

        {gowajeeProb && (
          <div id={classes["gowajee_prob"]}>
            <p>Gowajee Probability = </p>
            <h6>{gowajeeProb.toFixed(5) * 100}</h6>
            <p>%</p>
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default AudioStreamingPage;
