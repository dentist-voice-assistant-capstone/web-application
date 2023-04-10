/* import sounds */
import connectedSound from "../sounds/connectedSound.mp3"
import connectionLostSound from "../sounds/connectionLostSound.mp3";
import disconnectedSound from "../sounds/disconnectedSound.mp3";

export const playConnectionSound = (currentConnectionStatus, volume = 0.2, loop = false) => {
  let soundToPlay;
  switch (currentConnectionStatus) {
    case "Connected":
      soundToPlay = connectedSound;
      break;
    case "Reconnecting":
      soundToPlay = connectionLostSound;
      break;
    case "Disconnected":
      soundToPlay = disconnectedSound;
      break;
    default:
      return
  }
  let audioObj = new Audio(soundToPlay);
  audioObj.volume = volume;
  audioObj.loop = loop;
  audioObj.play();
}