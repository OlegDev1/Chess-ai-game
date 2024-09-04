export type CreateGameResponse = {
  createdAt: number;
  fen: string;
  id: string;
  player: "white" | "black";
  variant: {
    key: string;
  };
};
