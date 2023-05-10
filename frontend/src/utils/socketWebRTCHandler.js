import {
  RTC_CONFIG,
  URL_BACKEND_STREAMING,
  SOCKET_RECONNECTION_ATTEMPTS,
  SOCKET_RECONNECTION_DELAY,
  AUTO_CHANGE_QUADRANT_DELAY,
} from "../utils/constants";
import { getToothStartPosition } from "./toothLogic";
import { playConnectionSound } from "./soundPlayerHandler";

/* Import modules for using sockets */
import io from "socket.io-client";

const getAudioTrackAndAddToTheConnection = async (
  peerConnection,
  localStream,
  setLocalStream
) => {
  try {
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: false,
      audio: true,
    });

    mediaStream.getTracks().forEach((track) => {
      if (localStream === null) {
        peerConnection.addTrack(track, mediaStream);
      } else {
        localStream.addTrack(track);
        peerConnection.addTrack(track, localStream);
      }
    });

    if (localStream === null) {
      setLocalStream(mediaStream);
    }
  } catch (err) {
    // console.log(err);
    if (err.name === "NotAllowedError") {
      // handle permission denied error here
      // console.log('Permission denied by user');
      alert(
        "Permission to use microphone was denied. This application needs to have access to your microphone to work. If you want to allow access, please check your browser permission settings."
      );
    }
  }
};

/* This function is called when the user vist the record page for the first time.
 * This function initates connection between frontend and backend streaming
 * via socket and webRTC.
 */
const initiateConnection = async (
  userId,
  setSocket,
  setPeerConnection,
  setLocalStream,
  setIsSocketReconnecting,
  setSocketFailedToConnect,
  setWebRTCFailedToConnect,
  setIsAudioStreaming,
  handleSetInformation,
  dispatchCurrentCommand
) => {
  // variable used for each socket connections ======================
  const autoChangeToothTimer = {
    timerID: null,
    timerStatus: null,
    callbackFunction: null,
    parameters: null,
  };
  let isSocketConnectionLost = false;
  // ================================================================

  /* 1) initiate RTCPeerConnectionObject and socket object */
  const pc = new RTCPeerConnection(RTC_CONFIG);
  const s = io.connect(URL_BACKEND_STREAMING, {
    reconnectionAttempts: SOCKET_RECONNECTION_ATTEMPTS,
    reconnectionDelay: SOCKET_RECONNECTION_DELAY,
    query: { userId: userId },
  });

  /* 2) set up events for socket */
  // 2.1) events on connections ("connect", "connect_error", "reconnect_attempt", "reconnect_failed")
  // "connect" -> fired when socket connection successful
  s.on("connect", () => {
    // console.log("socket connection successful!")
    // console.log(`socket connected, id = ${s.id}`)

    // cheeck if the connection was established after the connection was lost earlier
    if (isSocketConnectionLost) {
      // console.log("connection after lost connection!!")
      // !! TODO
      // if the webRTC connection is not connected yet, call "reConnection" to reconnect via webRTC
      if (pc.connectionState !== "connected") {
        reConnection(
          s,
          setSocket,
          setPeerConnection,
          setLocalStream,
          setIsAudioStreaming,
          setWebRTCFailedToConnect
        );
      }
      setIsSocketReconnecting(false);
      isSocketConnectionLost = false;
    }

    // mark connection success
    setSocketFailedToConnect(false);
  });

  // "connect_error" -> fired when socket connection was lost
  s.on("connect_error", (err) => {
    // console.log("set isSocketConnectionLost to true, connect_error event!")

    // detect socket connection lost
    if (!isSocketConnectionLost) {
      isSocketConnectionLost = true;
      setWebRTCFailedToConnect(true);
      clearWebRTCPeerConnection(
        pc,
        s,
        setSocket,
        setPeerConnection,
        setLocalStream,
        setIsAudioStreaming,
        setWebRTCFailedToConnect
      );

      // clear currentCommand cursor
      dispatchCurrentCommand({ type: "CLEAR_COMMAND" });
    }
  });

  // "reconnect_attempt" -> fired when the socket trys to reconnect each time after the connection was lost
  s.io.on("reconnect_attempt", (attempt) => {
    // console.log(`socket connection error, trying to reconnect #${attempt}`)
    // mark that the socket is still trying to reconnect
    setIsSocketReconnecting(true);
  });

  // "reconnect_failed" -> fired when the maximum attempts to reconnect has been reached. It still cannot make
  // any connection to the server, then
  s.io.on("reconnect_failed", () => {
    // console.log(`maximum reconnect attempts reached, cannot connect socket`)
    // mark that the socket stops trying to reconnect
    setIsSocketReconnecting(false);
    // mark that it is fail to connect at the moment
    setSocketFailedToConnect(true);

    playConnectionSound("Disconnected");
  });

  // 2.2) events for SDP Exchange
  setUpEventForSDPExchangeBetweenPeerConnectionsViaSocket(s, pc);

  // 2.3) events for recieving periodental value from backend streaming
  // receiving updated command from backend streaming server
  s.on("update_command", async (data) => {
    console.log("update_command", data);

    // automatically determine the start position of the tooth for PDRE command (from given tooth's quadrant, id)
    let position = null;
    if (data.command === "PDRE" && data.q && data.i && data.tooth_side) {
      position = getToothStartPosition(data.q, data.i, data.tooth_side);
    }

    dispatchCurrentCommand({
      type: "UPDATE_COMMAND",
      payload: {
        command: data.command,
        tooth:
          !!data.q && !!data.i ? data.q.toString() + data.i.toString() : null,
        side: !!data.tooth_side ? data.tooth_side : null,
        position: !!position ? position : null,
      },
    });
  });

  // receiving recorded data from backend streaming server
  s.on("data", async (data) => {
    console.log("data", data);

    /* if we receive the next data while the autoChaneToothTimer is ticking, then immediately executued the timer by
      clearout the timer and then calling the callbackFunction immediately
    */
    if (autoChangeToothTimer.timerStatus === "ticking") {
      clearTimeout(autoChangeToothTimer.timerID);
      autoChangeToothTimer.callbackFunction(autoChangeToothTimer.parameters);
      autoChangeToothTimer.timerStatus = "executed";
      // console.log("autoChangeToothTimer is forced executed!")
    }

    if (data.mode !== "BOP") {
      // [for "PD", "RE", "Missing", "MGJ", "MO" data]
      let spec_id = null;
      /* mapping position for PD, RE */
      if (data.mode === "PD" || data.mode === "RE") {
        if (data.position === "buccal" || data.position === "lingual") {
          spec_id = "middle";
        } else {
          spec_id = data.position;
        }
      }

      // shift the cursor when receive "RE" command
      if (data.mode === "RE") {
        // console.log("cursor shifted !")
        dispatchCurrentCommand({
          type: "UPDATE_PDRE_POSITION",
          payload: {
            tooth: data.q.toString() + data.i.toString(),
            side: data.side,
            position: spec_id,
          },
        });
      }

      handleSetInformation(
        data.q,
        data.i,
        data.side,
        data.mode,
        data.target,
        spec_id
      );
      // console.log(data.q, data.i, data.side, data.mode, data.target, spec_id)
    } else {
      // for "BOP" data[]

      /* Sometimes, when start a new zee in BOP command, there was no update_command object sent 
      from the backend_webrtc server. Therefore, we add some temporary code below to update 
      the cursor on the page.
      */
      // dispatchCurrentCommand({
      //   type: "UPDATE_COMMAND",
      //   payload: {
      //     command: data.mode,
      //     tooth: data.q.toString() + data.i.toString(),
      //     side: data.side,
      //     position: null
      //   }
      // })

      let positionArray;
      if (data.q === 1 || data.q === 4) {
        positionArray = ["distal", "middle", "mesial"];
      } else if (data.q === 2 || data.q === 3) {
        positionArray = ["mesial", "middle", "distal"];
      }

      for (let i = 0; i < 3; i++) {
        handleSetInformation(
          data.q,
          data.i,
          data.side,
          data.mode,
          data.target[i],
          positionArray[i]
        );
        // console.log(data.q, data.i, data.side, data.mode, data.target[i], positionArray[i])
      }
    }

    // shift the cursor to the next tooth available (PDRE, MGJ command) when receiving
    // 'next_tooth' field
    if (!!data.next_tooth) {
      // changeTooth callback function and parameters
      const cbFn = dispatchCurrentCommand;
      const paramForCbFn = {
        type: "NEXT_TOOTH",
        payload: {
          mode: data.mode,
          next_tooth: data.next_tooth,
        },
      };
      if (data.q !== data.next_tooth.q) {
        // if the quadrant is changed -> set the timer
        const timer = setTimeout(() => {
          cbFn(paramForCbFn);
          autoChangeToothTimer.timerStatus = "executed";
          // console.log("autoChangeToothTimer is executued!")
        }, AUTO_CHANGE_QUADRANT_DELAY);

        autoChangeToothTimer.timerID = timer;
        autoChangeToothTimer.timerStatus = "ticking";
        autoChangeToothTimer.callbackFunction = cbFn;
        autoChangeToothTimer.parameters = paramForCbFn;
        // console.log("autoChangeToothTimer is Set", autoChangeToothTimer)
      } else {
        // if the quadrant is not changed -> call the function immediately
        cbFn(paramForCbFn);
      }
    }
  });

  /* 3) set event for RTCPeerConnection */
  addEventsForRTCPeerConnection(
    pc,
    s,
    setSocket,
    setPeerConnection,
    setLocalStream,
    setIsAudioStreaming,
    setWebRTCFailedToConnect
  );

  /* 4) get the localStream and then add tracks from the localStream to the peerConnection */
  // this will also automatically trigger pc.onnegotiationneeded to send the offer to the server
  await getAudioTrackAndAddToTheConnection(pc, null, setLocalStream);

  setPeerConnection(pc);
  setSocket(s);
};

/* This function is called after initating a new socket and peerConnection for connecting to the backend server.
 * This function will handle answers and candidates sent from the server for SDP exchange. (webRTC connection)
 */
const setUpEventForSDPExchangeBetweenPeerConnectionsViaSocket = (
  socket,
  peerConnection
) => {
  // receiving SDP answer from backend streaming server
  socket.on("answer", async (answer) => {
    // console.log("received answer from server", answer);
    try {
      // make sure that the RTCPeerConnection object is in the correct state before calling the setRemoteDescription() method.
      if (peerConnection.signalingState !== "have-local-offer") {
        return;
      }
      await peerConnection.setRemoteDescription(answer);
      // console.log("finish setting answer");
    } catch (err) {
      alert(err);
    }
  });

  // receiving candidate from backend streaming server
  socket.on("candidate", async (candidate) => {
    // console.log("recieved candidate from server", candidate);
    if (candidate && peerConnection.signalingState !== "closed") {
      await peerConnection.addIceCandidate(candidate);
    }
  });
};

// FUNCTIONS FOR HANDLING RTCPeerConnection EVENTS ===========================================================================
// icecandidate -> listen for local ICE candidates on the local RTCPeerConnection, send the event.candidate to the server via socket.io
const onIceCandidate = (socket, event) => {
  if (event.candidate) {
    socket.emit("candidate", event.candidate);
  }
};

// negotiationneeded -> In case of needing to re-exchange SDP between the client and the server (negotiation)
const onNegotiationNeeded = async (socket, event) => {
  let peerConnection = event.target;
  try {
    await peerConnection.setLocalDescription(
      await peerConnection.createOffer()
    );
    // sending offer to server
    socket.emit("offer", peerConnection.localDescription);
  } catch (err) {
    alert(err);
  }
};

// connectionstatechange -> listen for connectionstate change
const onConnectionStateChange = (
  socket,
  setIsAudioStreaming,
  setPeerConnection,
  setWebRTCFailedToConnect,
  event
) => {
  let peerConnection = event.target;

  // console.log("peerConnection.connectionState change to", peerConnection.connectionState)
  // update the peerConnection to re update the isConnectionReady variable
  // setPeerConnection(peerConnection);

  if (peerConnection.connectionState === "connected") {
    // console.log("PEERS CONNECTED");
    // IMPORTANT: emits a start streaming signal, once the webRTC peers are connected! ======
    startAudioStreaming(socket, null, setIsAudioStreaming);
    setWebRTCFailedToConnect(false);
  }
};

// iceconnectionstatechange
const onIceConnectionStateChange = (event) => {
  let peerConnection = event.target;

  // for detect connection lost
  if (peerConnection.iceConnectionState === "disconnected") {
    // console.log("webRTC Connection lost, attempt to reconnect");
  }
};
// =============================================================================================================================
/* This function is called when the peerConnection is being set up.
 * This function will set up needed events for the peerConnection.
 */
const addEventsForRTCPeerConnection = (
  peerConnection,
  socket,
  setSocket,
  setPeerConnection,
  setLocalStream,
  setIsAudioStreaming,
  setWebRTCFailedToConnect
) => {
  peerConnection.addEventListener(
    "icecandidate",
    onIceCandidate.bind(null, socket)
  );
  peerConnection.addEventListener(
    "negotiationneeded",
    onNegotiationNeeded.bind(null, socket)
  );
  peerConnection.addEventListener(
    "connectionstatechange",
    onConnectionStateChange.bind(
      null,
      socket,
      setIsAudioStreaming,
      setPeerConnection,
      setWebRTCFailedToConnect
    )
  );
  peerConnection.addEventListener(
    "iceconnectionstatechange",
    onIceConnectionStateChange
  );
};

const removeEventsForRTCPeerConnection = (
  peerConnection,
  socket,
  setSocket,
  setPeerConnection,
  setLocalStream,
  setIsAudioStreaming,
  setWebRTCFailedToConnect
) => {
  peerConnection.removeEventListener(
    "icecandidate",
    onIceCandidate.bind(null, socket)
  );
  peerConnection.removeEventListener(
    "negotiationneeded",
    onNegotiationNeeded.bind(null, socket)
  );
  peerConnection.removeEventListener(
    "connectionstatechange",
    onConnectionStateChange.bind(
      null,
      socket,
      setIsAudioStreaming,
      setPeerConnection,
      setWebRTCFailedToConnect
    )
  );
  peerConnection.removeEventListener(
    "iceconnectionstatechange",
    onIceConnectionStateChange
  );
};

/* This function is called when the user want to set the missing of the specific tooth to FALSE.
 * This function will emit an message through the socket channel "undo_missing"
 * to tell the backend streaming server.
 */
const undoToothMissing = (socket, q, i) => {
  const toothData = { q: q, i: i };
  socket.emit("undo_missing", toothData);
};

/* This function is called when the user want to set the missing of the specific tooth to TRUE.
 * This function will emit an message through the socket channel "add_missing"
 * to tell the backend streaming server.
 */
const addToothMissing = (socket, q, i) => {
  const toothData = { q: q, i: i };
  socket.emit("add_missing", toothData);
};

/* This function is called when the connection is ready (socket and webRTC) or
 * the user wants to resume the recording process after being paused.
 * This function starts streaming audio from user's microphone to the backend
 * streaming server.
 */
const startAudioStreaming = (socket, localStream, setIsAudioStreaming) => {
  // console.log("== start streaming ==")

  if (localStream) {
    localStream.getTracks().forEach((track) => {
      track.enabled = true;
    });
  }

  socket.emit("start_record");
  setIsAudioStreaming(true);
};

/* This function is called when the user wants to pause the recording process.
 * This function disables streaming audio.
 */
const stopAudioStreaming = (socket, localStream, setIsAudioStreaming) => {
  // console.log("== stop streaming ==")

  localStream.getTracks().forEach((track) => {
    track.enabled = false;
  });
  socket.emit("stop_record");
  setIsAudioStreaming(false);
};

/* This function is called once the user successfully reconnect via sockets after the connection is lost.
 * This function will set-up new webRTC connection by creating a new peer connection.
 */
const reConnection = async (
  socket,
  setSocket,
  setPeerConnection,
  setLocalStream,
  setIsAudioStreaming,
  setWebRTCFailedToConnect
) => {
  // console.log("reConnection function called")

  /* 1) initiate RTCPeerConnectionObject object */
  const pc = new RTCPeerConnection(RTC_CONFIG);

  /* 2) override socket events for SDP exchange */
  setUpEventForSDPExchangeBetweenPeerConnectionsViaSocket(socket, pc);

  /* 3) set event for RTCPeerConnection */
  addEventsForRTCPeerConnection(
    pc,
    socket,
    setSocket,
    setPeerConnection,
    setLocalStream,
    setIsAudioStreaming,
    setWebRTCFailedToConnect
  );

  /* 4) get the localStream and then add tracks from the localStream to the peerConnection */
  // this will also automatically trigger pc.onnegotiationneeded to send the offer to the server
  await getAudioTrackAndAddToTheConnection(pc, null, setLocalStream);

  // set new pc and socket
  setPeerConnection(pc);
  setSocket(socket);
};

/* This function is called when the user finish the recording process by
 * pressing "finish" button and confirm. This function will terminate the
 * connection (webRTC and socket) between frontend and backend-streaming.
 */
const terminateConnection = (
  socket,
  peerConnection,
  localStream,
  setSocket,
  setPeerConnection,
  setLocalStream,
  setIsAudioStreaming,
  setWebRTCFailedToConnect
) => {
  if (socket) {
    socket.disconnect(); // socket disconnect
  }

  if (localStream) {
    localStream.getTracks().forEach((track) => {
      track.stop();
    });
  }

  if (peerConnection) {
    clearWebRTCPeerConnection(
      peerConnection,
      socket,
      setSocket,
      setPeerConnection,
      setLocalStream,
      setIsAudioStreaming,
      setWebRTCFailedToConnect
    );
  }

  // console.log("connnection terminated.")
  // clear states
  setSocket(null);
  setPeerConnection(null);
  setLocalStream(null);
};

const clearWebRTCPeerConnection = (
  peerConnection,
  socket,
  setSocket,
  setPeerConnection,
  setLocalStream,
  setIsAudioStreaming,
  setWebRTCFailedToConnect
) => {
  // console.log("clearing webRTC object and unsubscribe events...")
  peerConnection.close();
  removeEventsForRTCPeerConnection(
    peerConnection,
    socket,
    setSocket,
    setPeerConnection,
    setLocalStream,
    setIsAudioStreaming,
    setWebRTCFailedToConnect
  );
  setPeerConnection(null);
};

export {
  initiateConnection,
  undoToothMissing,
  addToothMissing,
  startAudioStreaming,
  stopAudioStreaming,
  terminateConnection,
};
