import React, { useState } from "react"
import { RTC_CONFIG, URL_BACKEND_STREAMING } from "../utils/constants";

/* Import modules for using sockets */
import io from "socket.io-client";

const SocketWebRTCContext = React.createContext({
  socket: null,
  peerConnection: null,
  isSocketConnected: false,
  isAudioStreaming: false,
  initiateConnection: () => { }
})

export const SocketWebRTCContextProvider = (props) => {
  // [STATES] =======================================================
  /* states for Socket connection */
  const [socket, setSocket] = useState(null);

  /* states for WebRTC connection */
  const [peerConnection, setPeerConnection] = useState(null);
  const [localStream, setLocalStream] = useState(null);

  /* states for enable/disable streaming */
  const [isAudioStreaming, setIsAudioStreaming] = useState(null);
  // ================================================================

  /* determine the socket's connection status */
  const isSocketConnected = !!socket ? socket.connected : false

  const initiateConnection = async () => {
    /* 1) initiate RTCPeerConnectionObject and socket object */
    const pc = new RTCPeerConnection(RTC_CONFIG);
    const s = await io.connect(URL_BACKEND_STREAMING);

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

  const contextValue = {
    socket: socket,
    peerConnection: peerConnection,
    isSocketConnected: isSocketConnected,
    isAudioStreaming: isAudioStreaming,
    initiateConnection: initiateConnection
  };

  return (
    <SocketWebRTCContext.Provider value={contextValue}>
      {props.children}
    </SocketWebRTCContext.Provider>
  );
};

export default SocketWebRTCContext
