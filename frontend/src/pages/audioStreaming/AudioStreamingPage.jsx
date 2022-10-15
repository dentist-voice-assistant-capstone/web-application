import { ReactMediaRecorder } from "react-media-recorder";
import NavBar from "../../components/ui/NavBar";

const AudioStreamingPage = () => {
  return (
    <div>
      <ReactMediaRecorder
        audio
        render={({ status, startRecording, stopRecording, mediaBlobUrl }) => (
          <div>
            <p>{status}</p>
            <NavBar email={"email"}></NavBar>
            <button onClick={startRecording}>Start Recording</button>
            <button onClick={stopRecording}>Stop Recording</button>
            <video src={mediaBlobUrl} controls autoPlay loop />
          </div>
        )}
      />
    </div>
  );
};

export default AudioStreamingPage;
