interface GameDataResponse {
  type: "gameFull";
  id: string;
  speed: string;
  state: GameStateResponse;
  white: {
    aiLevel?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  };
  black: {
    aiLevel?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  };
  variant: { name: string };
}
interface GameStateResponse {
  type: "gameState";
  btime: number;
  wtime: number;
  moves: string;
  status: string;
}

export type StreamResponseType = GameDataResponse | GameStateResponse;
