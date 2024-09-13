import { GameStatus } from "./GameStatus.types";
import { AiStrength } from "./AiStrength.types";

export type GameDataType = {
  gameStatus: GameStatus;
  playerSide: "white" | "black";
  currentSide: "white" | "black";
  boardOrientation: "white" | "black";
  aiStrength: AiStrength;
  winner?: "white" | "black";
  isModalClosed?: boolean;
};
