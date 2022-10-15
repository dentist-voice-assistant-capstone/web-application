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
import "./AudioStreamingPage.module.css";

const AudioStreamingPage = () => {
  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({ audio: true });

  console.log(status);

  return (
    <div>
      <p>{status}</p>
      <button
        type="submit"
        className="audio-record_start"
        onClick={startRecording}
      >
        start
      </button>
      <div />
      <button
        type="submit"
        className="audio-record_stop"
        onClick={stopRecording}
      >
        stop
      </button>
      <div />
      <video src={mediaBlobUrl} controls autoPlay loop />
    </div>
  );
};

export default AudioStreamingPage;
