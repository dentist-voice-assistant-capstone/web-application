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

/* Import modules for Speech Recognizer (Tensorflow.js) */
import * as tf from "@tensorflow/tfjs";
import * as speechCommands from "@tensorflow-models/speech-commands";

/* probability threshold for recognizer to detect GOWAJEE keywords*/
const GOWAJEE_THRESH = 0.8;

const AudioStreamingPage = () => {
  /* states for speech recognizer model */
  const [recognizer, setRecognizer] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [isForcedStopListening, setIsForcredStopListening] = useState(false);

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
    console.log("Recognizer completely loaded!");
    console.log(r.wordLabels());
    setRecognizer(r);
  };

  const recognizerListen = () => {
    console.log("Listening...");
    setIsListening(true);
    recognizer.listen(
      (result) => {
        let gowajee_prob = result.scores[1];
        console.log(gowajee_prob);
      },
      {
        includeSpectrogram: true,
        includeEmbedding: true,
        probabilityThreshold: GOWAJEE_THRESH,
      }
    );
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
  }, []);

  // if the model is ready, start listening
  if (recognizer && !isListening && !isForcedStopListening) {
    recognizerListen();
  }

  return (
    <div>
      <p>{recognizer ? "Model ready" : "Model Not Ready"}</p>
      <p>{isListening ? "Listening" : "Not Listening"}</p>
      <br></br>
      <p>{isStreaming ? "Streaming" : "Not Streaming"}</p>
    </div>
  );
};

export default AudioStreamingPage;
