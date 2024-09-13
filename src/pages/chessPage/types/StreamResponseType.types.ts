import { AiStrength } from "./AiStrength.types";
import { GameStatus } from "./GameStatus.types";

export interface GameFullResponse {
  type: "gameFull";
  id: string;
  speed: string;
  state: GameStateResponse;
  white: {
    aiLevel?: AiStrength;
  };
  black: {
    aiLevel?: AiStrength;
  };
  variant: { name: string };
}
export interface GameStateResponse {
  type: "gameState";
  btime: number;
  wtime: number;
  moves: string;
  status: GameStatus;
  winner?: "black" | "white";
}

export type StreamResponseType = GameFullResponse | GameStateResponse;
