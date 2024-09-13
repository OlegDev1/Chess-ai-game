import { Chess } from "chess.js";
import captureSoundPath from "../../../public/Capture.ogg";
import moveSoundPath from "../../../public/Move.ogg";
import _ from "lodash";

export default async function playMoveOrCaptureSound(chess: Chess) {
  const lastMove = _.last(chess.history({ verbose: true }));
  if (!lastMove) return;

  if ("captured" in lastMove) {
    const captureSound = new Audio(captureSoundPath);
    captureSound.play().catch((e) => {
      console.error("Can not play capture sound: ", e);
    });
  } else {
    const moveSound = new Audio(moveSoundPath);
    moveSound.play().catch((e) => {
      console.error("Can not play move sound: ", e);
    });
  }
}
