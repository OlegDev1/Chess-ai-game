import { useState, useEffect } from "react";
import { Chess } from "chess.js";
import _ from "lodash";
import playMoveOrCaptureSound from "../utils/playMoveOrCaptureSound";
import { MoveStyleType } from "../types/MoveStyleType.types";
import { TimeType } from "../types/TimeType.types";
import { GameDataType } from "../types/GameDataType.types";
import { StreamResponseType, GameFullResponse } from "../types/StreamResponseType.types";
import { readStream } from "../utils/readStream";
import { AiStrength } from "../types/AiStrength.types";
import { STREAM_GAME_PATH, LAST_MOVE_STYLE, HIGHLIGHT_KING_STYLE } from "../../../app.constants.ts";

type useStreamGameProps = {
  gameId: string;
  playerSide: "white" | "black";
  setLastMoveStyle: React.Dispatch<React.SetStateAction<object>>;
  setIsCheckStyle: React.Dispatch<React.SetStateAction<object>>;
  setChessBoardFEN: React.Dispatch<React.SetStateAction<null | string>>;
  setMoves: React.Dispatch<React.SetStateAction<string>>;
  setTime: React.Dispatch<React.SetStateAction<TimeType>>;
  setGameData: React.Dispatch<React.SetStateAction<GameDataType>>;
};

function getGameData(response: StreamResponseType) {
  const moves = response.type == "gameFull" ? response.state.moves : response.moves;
  const currentSide: "white" | "black" =
    moves.split(" ").filter((e) => e !== "").length % 2 == 0 ? "white" : "black";
  const gameStateObj = response.type == "gameFull" ? response.state : response;

  return { moves, currentSide, gameStateObj };
}
function getGameSides(response: GameFullResponse) {
  const aiSide: "white" | "black" = response.white.aiLevel !== undefined ? "white" : "black";
  const aiStrength: AiStrength = response[aiSide].aiLevel!;
  const playerSide: "white" | "black" = aiSide == "white" ? "black" : "white";

  return { aiStrength, playerSide };
}
function getLastMoveStyle(moves: string) {
  const lastTwoMoves = _.last(moves.split(" "));
  if (!lastTwoMoves) return;
  const lastMoves = [lastTwoMoves.slice(0, 2), lastTwoMoves.slice(2, 4)];

  const style: MoveStyleType = {};
  for (const move of lastMoves) {
    style[move] = LAST_MOVE_STYLE;
  }

  return style;
}
function getKingPiece(chess: Chess) {
  const pieces = _.flatten(chess.board());
  const kingPiece = pieces.find(
    (piece) => piece && piece.type === "k" && piece.color === chess.turn()
  );
  return kingPiece;
}

export default function useStreamGame({
  gameId,
  playerSide,
  setLastMoveStyle,
  setIsCheckStyle,
  setChessBoardFEN,
  setMoves,
  setTime,
  setGameData
}: useStreamGameProps) {
  const [focus, setFocus] = useState(0);

  //Updates the second useEffect, when the windows is refocused
  useEffect(() => {
    window.onfocus = () => setFocus((e) => e + 1);
  }, []);

  //Uses http streaming to get the data about the game from the api
  useEffect(() => {
    const lichessBaseUrl = import.meta.env.VITE_LICHESS_BASE_URL;
    const lichessApi = import.meta.env.VITE_LICHESS_API_KEY;

    const stream = fetch(lichessBaseUrl + STREAM_GAME_PATH({ gameId: gameId }), {
      headers: {
        Authorization: `Bearer ${lichessApi}`
      }
    });

    const onMessage = (response: StreamResponseType) => {
      const chess = new Chess();
      const { moves, currentSide, gameStateObj } = getGameData(response);

      //If full response with game data
      if (response.type == "gameFull") {
        const { aiStrength, playerSide } = getGameSides(response);

        setGameData((data) => ({
          ...data,
          playerSide: playerSide,
          aiStrength: aiStrength,
          boardOrientation: playerSide
        }));
      }

      //If there are moves on the board
      if (moves) {
        moves.split(" ").forEach((e: string) => {
          chess.move(e);
        });

        //Play the sound of opponent's move or capture
        if (currentSide === playerSide && response.type == "gameState")
          playMoveOrCaptureSound(chess);

        const style = getLastMoveStyle(moves);
        if (!style) return;

        //Highlights the last move
        setLastMoveStyle(style);
        //Updates the move history
        setMoves(moves);
      }

      //If the current side is in check
      if (chess.isCheck()) {
        const kingPiece = getKingPiece(chess);
        if (!kingPiece) return;

        //Highlights the king
        setIsCheckStyle({
          [kingPiece.square]: HIGHLIGHT_KING_STYLE
        });
      } else {
        setIsCheckStyle({});
      }

      //Updates the time left
      if (gameStateObj.wtime > 10_800_000) {
        //unlimited time, because the maximum for limited is 10,800,000 milliseconds
        setTime((timeObj) => ({ ...timeObj, white: "unlimited", black: "unlimited" }));
      } else {
        //limited time
        setTime((timeObj) => ({
          ...timeObj,
          white: gameStateObj.wtime,
          black: gameStateObj.btime
        }));
      }

      //Updates the current side, game status and the winner if any
      setGameData((data) => ({
        ...data,
        currentSide: currentSide,
        gameStatus: gameStateObj.status,
        winner: gameStateObj.winner
      }));

      //Updates the chessboard
      setChessBoardFEN(chess.fen());
    };

    stream.then(readStream(onMessage));
  }, [
    focus,
    gameId,
    playerSide,
    setLastMoveStyle,
    setIsCheckStyle,
    setChessBoardFEN,
    setMoves,
    setTime,
    setGameData
  ]);
}
