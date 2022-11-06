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

import { useState, useEffect } from "react";

import classes from "./AudioStreamingPage.module.css";

/* Import modules for Speech Recognizer (Tensorflow.js) */
import * as tf from "@tensorflow/tfjs";
import * as speechCommands from "@tensorflow-models/speech-commands";

/* probability threshold for recognizer to detect GOWAJEE keywords */
const GOWAJEE_THRESH = 0.9;

const AudioStreamingPage = () => {
  /* states for speech recognizer model */
  const [recognizer, setRecognizer] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [isForcedStopListening, setIsForcredStopListening] = useState(false);
  const [gowajeeProb, setGowajeeProb] = useState(null);

  /* states for enable/disable streaming */
  const [isStreaming, setIsStreaming] = useState(false);

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

  const recognizerListen = async () => {
    setIsListening(true);
    let first;
    await recognizer.listen(
      (result) => {
        let gowajee_prob = result.scores[1];
        if (first) {
          setGowajeeProb(gowajee_prob);
        }
        console.log(gowajee_prob, "streaming = ", isStreaming);
        // if gowajee_prob > GOWAJEE_THRESH, toggle the streaming
        if (gowajee_prob > GOWAJEE_THRESH) {
          if (first) {
            toggleIsStreaming();
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

  const toggleIsStreaming = () => {
    recognizer.stopListening();
    setIsListening(false);

    if (isStreaming) {
      console.log("Stop Streaming");
      setIsStreaming(false);
    } else {
      console.log("Start Streaming");
      setIsStreaming(true);
    }
  };

  const toggleIsForcedStopListening = () => {
    if (isForcedStopListening) {
      setIsForcredStopListening(false);
    } else {
      setIsForcredStopListening(true);
    }
  };

  // when the page is loaded, automatically initiate the speechRecognizer model ================
  useEffect(() => {
    /* This function is used to initiate the speechRecognizer model
     * with predefined model's weight and metadata. This function will be called
     * when the page is loaded.
     */
    if (!recognizer) {
      initiateRecognizer();
    }
  }, [recognizer]);

  // if the model is ready, start listening
  if (recognizer && !isListening && !isForcedStopListening) {
    recognizerListen();
  } else if (recognizer && isListening && isForcedStopListening) {
    recognizer.stopListening();
    setGowajeeProb(null);
    setIsListening(false);
  }

  return (
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

        <p className={classes["audioStreaming__items-header"]}>isListening:</p>
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
      </div>
      <br></br>

      <div
        className={`${classes["audioStreaming__items-status"]} ${
          isStreaming ? classes["pos"] : classes["neg"]
        }`}
      >
        {isStreaming ? "Streaming" : "Not Streaming"}
      </div>

      {gowajeeProb && (
        <div id={classes["gowajee_prob"]}>
          <p>Gowajee Probability = </p>
          <h6>{gowajeeProb.toFixed(5) * 100}</h6>
          <p>%</p>
        </div>
      )}
    </div>
  );
};

export default AudioStreamingPage;
