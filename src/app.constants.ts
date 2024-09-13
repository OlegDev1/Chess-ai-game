export const APP_HOME_PATH = "/";
export const APP_PLAY_PATH = ({ gameId }: { gameId: string }) => `/play/${gameId}`;

export const CREATE_GAME_PATH = "/api/challenge/ai";
export const STREAM_GAME_PATH = ({ gameId }: { gameId: string }) =>
  `/api/board/game/stream/${gameId}`;
export const MAKE_MOVE_PATH = ({ gameId, move }: { gameId: string; move: string }) =>
  `/api/board/game/${gameId}/move/${move}`;

export const LAST_MOVE_STYLE = { background: "rgb(0,204,102, 0.3)" };
export const HIGHLIGHT_KING_STYLE = {
  background:
    "radial-gradient(ellipse at center, rgba(255, 0, 0, 1) 0%, rgba(231, 0, 0, 1) 25%, rgba(169, 0, 0, 0) 89%, rgba(158, 0, 0, 0) 100%)"
};
export const CHOSEN_PIECE_STYLE = { background: "rgba(255, 255, 0, 0.4)" };
export const POSSIBLE_MOVE_STYLE = ({ isCapture }: { isCapture: boolean }) => ({
  background: isCapture
    ? "radial-gradient(circle, rgba(0,0,0,.15) 85%, transparent 85%)"
    : "radial-gradient(circle, rgba(0,0,0,.15) 25%, transparent 25%)",
  borderRadius: "50%"
});
export const CHESSBOARD_STYLE = { borderRadius: "2px" };
