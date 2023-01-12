import {
  RTC_CONFIG, URL_BACKEND_STREAMING,
  SOCKET_RECONNECTION_ATTEMPTS,
  SOCKET_RECONNECTION_DELAY
} from "../utils/constants";

/* Import modules for using sockets */
import io from "socket.io-client";

/* This function is called when the user vist the record page for the first time.
 * This function initates connection between frontend and backend streaming 
 * via socket and webRTC.
*/
const initiateConnection = async (setSocket, setPeerConnection, setLocalStream, setSocketFailedToConnect) => {
  let socketFailedToConnectCount = 0

  /* 1) initiate RTCPeerConnectionObject and socket object */
  const pc = new RTCPeerConnection(RTC_CONFIG);
  const s = io.connect(URL_BACKEND_STREAMING, {
    reconnectionAttempts: SOCKET_RECONNECTION_ATTEMPTS,
    reconnectionDelay: SOCKET_RECONNECTION_DELAY
  });

  /* catching socket connection error */
  s.on("connect_error", (err) => {
    socketFailedToConnectCount += 1
    console.log(`socket connection error, trying to reconnect #${socketFailedToConnectCount}`)
    if (socketFailedToConnectCount === SOCKET_RECONNECTION_ATTEMPTS + 1) {
      console.log(`maximum reconnect attempts reached, cannot connect socket`)
      setSocketFailedToConnect(true)
      return
    }
  })

  /* 2) set event for socket */
  // receiving SDP answer from backend streaming server
  s.on("answer", async (answer) => {
    console.log("received answer from server", answer);
    try {
      await pc.setRemoteDescription(answer);
      console.log("finish setting answer");
    } catch (err) {
      alert(err);
    }
  });
  // receiving candidate from backend streaming server
  s.on("candidate", async (candidate) => {
    if (candidate) {
      await pc.addIceCandidate(candidate);
    }
  });

  /* 3) set event for RTCPeerConnecton */
  // listen for local ICE candidates on the local RTCPeerConnection, send the event.candidate to the server via socket.io
  pc.onicecandidate = ({ candidate }) => {
    if (candidate) {
      s.emit("candidate", candidate);
    }
  };
  // In case of needing to re-exchange SDP between the client and the server (negotiation)
  pc.onnegotiationneeded = async () => {
    try {
      await pc.setLocalDescription(await pc.createOffer());
      // sending offer to server
      s.emit("offer", pc.localDescription);
    } catch (err) {
      alert(err);
    }
  };
  // listen for connectionstate change
  pc.onconnectionstatechange = (event) => {
    if (pc.connectionState === "connected") {
      // start streaming
      console.log("PEERS CONNECTED");
      // update the peerConnection to re update the isConnectionReady variable
      setPeerConnection(pc);
    }
  };

  /* 4) get the localStream and then add tracks from the localStream to the peerConnection */
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

  setPeerConnection(pc);
  setSocket(s);

  console.log(`socket connected, id = ${s.id}`)
}

/* This function is called when the connection is ready (socket and webRTC) or
 * the user wants to resume the recording process after being paused.
 * This function starts streaming audio from user's microphone to the backend
 * streaming server.
 */
const startAudioStreaming = (socket, localStream, setIsAudioStreaming) => {
  console.log("== start streaming ==")

  localStream.getTracks().forEach((track) => {
    track.enabled = true;
  });
  socket.emit("start_record");
  setIsAudioStreaming(true);
}

/* This function is called when the user wants to pause the recording process.
 * This function disables streaming audio. 
 */
const stopAudioStreaming = (socket, localStream, setIsAudioStreaming) => {
  console.log("== stop streaming ==")

  localStream.getTracks().forEach((track) => {
    track.enabled = false;
  });
  socket.emit("stop_record");
  setIsAudioStreaming(false);
}

/* This function is called when the user finish the recording process by
 * pressing "finish" button and confirm. This function will terminate the
 * connection (webRTC and socket) between frontend and backend-streaming.
 */
const terminateConnection = (socket, peerConnection, localStream, setSocket, setPeerConnection, setLocalStream) => {
  socket.disconnect(); // socket disconnect

  if (localStream) {
    localStream.getTracks().forEach((track) => {
      track.stop();
    });
  }
  peerConnection.close(); // close webRTCConnection

  console.log("connnection terminated.")
  // clear states
  setSocket(null);
  setPeerConnection(null);
  setLocalStream(null);
}

export {
  initiateConnection,
  startAudioStreaming,
  stopAudioStreaming,
  terminateConnection
}