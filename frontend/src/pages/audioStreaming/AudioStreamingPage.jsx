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

import { useReactMediaRecorder } from "react-media-recorder";
import classes from "./AudioStreamingPage.module.css";

const AudioStreamingPage = () => {
  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({ audio: true });

  console.log(status);
  console.log(mediaBlobUrl);

  return (
    <div>
      <p>{status}</p>
      <button
        type="submit"
        className={classes.audio_record_start}
        onClick={startRecording}
      >
        Start
      </button>
      <div />
      <button
        type="submit"
        className={classes.audio_record_stop}
        onClick={stopRecording}
      >
        Stop
      </button>
      <div />
      <video src={mediaBlobUrl} controls autoPlay loop />
    </div>
  );
};

export default AudioStreamingPage;
