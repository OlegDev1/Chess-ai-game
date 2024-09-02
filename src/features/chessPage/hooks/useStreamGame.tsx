import { useState, useEffect } from "react";
import { Chess } from "chess.js";
import _ from "lodash";
import { MoveStyleType } from "../types/MoveStyleType.types";
import { TimeType } from "../types/TimeType.types";
import { GameDataType } from "../types/GameDataType.types";
import { StreamResponseType } from "../types/StreamResponseType.types";

type useStreamGameProps = {
  lichessApi: string;
  gameId: string;
  setLastMoveStyle: React.Dispatch<React.SetStateAction<object>>;
  setIsCheckStyle: React.Dispatch<React.SetStateAction<object>>;
  setChessBoardFEN: React.Dispatch<React.SetStateAction<null | string>>;
  setMoves: React.Dispatch<React.SetStateAction<string>>;
  setTime: React.Dispatch<React.SetStateAction<TimeType>>;
  setGameData: React.Dispatch<React.SetStateAction<GameDataType>>;
};

export default function useStreamGame({
  lichessApi,
  gameId,
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
    const readStream =
      (processLine: (arg0: StreamResponseType) => void) => (response: Response) => {
        const stream = response.body!.getReader();
        const matcher = /\r?\n/;
        const decoder = new TextDecoder();
        let buf = "";

        const loop: () => Promise<void> = () =>
          stream.read().then(({ done, value }) => {
            if (done) {
              if (buf.length > 0) processLine(JSON.parse(buf));
            } else {
              const chunk = decoder.decode(value, {
                stream: true
              });
              buf += chunk;

              const parts = buf.split(matcher);
              buf = parts.pop()!;
              for (const i of parts.filter((p) => p)) processLine(JSON.parse(i));
              return loop();
            }
          });

        return loop();
      };

    const stream = fetch(`https://lichess.org/api/board/game/stream/${gameId}`, {
      headers: {
        Authorization: `Bearer ${lichessApi}`
      }
    });

    const onMessage = (response: StreamResponseType) => {
      const chess = new Chess();
      const moves = response.type == "gameFull" ? response.state.moves : response.moves;
      const time = response.type == "gameFull" ? response.state : response;
      const currentSide =
        moves.split(" ").filter((e) => e !== "").length % 2 == 0 ? "white" : "black";

      //If full response with game data
      if (response.type == "gameFull") {
        const aiSide = response.white.aiLevel !== undefined ? "white" : "black";
        const aiStrength = response[aiSide].aiLevel!;
        const playerSide = aiSide == "white" ? "black" : "white";

        setGameData((data) => ({ ...data, playerSide: playerSide, aiStrength: aiStrength }));
      }

      //If there are moves on the board
      if (moves) {
        moves.split(" ").forEach((e: string) => {
          chess.move(e);
        });

        const lastTwoMoves: string | undefined = _.last(moves.split(" "));
        if (!lastTwoMoves) return;
        const lastMoves = [lastTwoMoves.slice(0, 2), lastTwoMoves.slice(2, 4)];

        const style: MoveStyleType = {};
        for (const move of lastMoves) {
          style[move] = { background: "rgb(0,204,102, 0.3)" };
        }
        //Highlights the last move
        setLastMoveStyle(style);
        //Updates the move history
        setMoves(moves);
      }

      //If the current side is in check
      if (chess.isCheck()) {
        const pieces = _.flatten(chess.board());
        const kingPiece = pieces.find(
          (piece) => piece && piece.type === "k" && piece.color === chess.turn()
        );
        if (!kingPiece) return;

        //Highlights the king
        setIsCheckStyle({
          [kingPiece.square]: {
            background:
              "radial-gradient(ellipse at center, rgba(255, 0, 0, 1) 0%, rgba(231, 0, 0, 1) 25%, rgba(169, 0, 0, 0) 89%, rgba(158, 0, 0, 0) 100%)"
          }
        });
      } else {
        setIsCheckStyle({});
      }

      //Updates the time left
      if (time.wtime > 10_800_000) {
        //unlimited time, because the maximum for limited is 10,800,000 milliseconds
        setTime((timeObj) => ({ ...timeObj, white: "unlimited", black: "unlimited" }));
      } else {
        //limited time
        setTime((timeObj) => ({ ...timeObj, white: time.wtime, black: time.btime }));
      }

      //Updates the current side
      setGameData((data) => ({ ...data, currentSide: currentSide }));

      //Updates the chessboard
      setChessBoardFEN(chess.fen());
    };

    stream.then(readStream(onMessage));
  }, [
    focus,
    lichessApi,
    gameId,
    setLastMoveStyle,
    setIsCheckStyle,
    setChessBoardFEN,
    setMoves,
    setTime,
    setGameData
  ]);
}
