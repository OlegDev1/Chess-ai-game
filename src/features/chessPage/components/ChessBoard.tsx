import { useState, useEffect } from "react";
import { Chess } from "chess.js";
import "./ChessBoard.css";

export default function ChessBoard() {
  const [chessBoard, setChessBoard] = useState(null);

  const [focus, setFocus] = useState(0);
  useEffect(() => {
    window.onfocus = () => setFocus((e) => e + 1);
  }, []);

  useEffect(() => {
    const readStream = (processLine) => (response) => {
      const stream = response.body.getReader();
      console.log("stream");
      const matcher = /\r?\n/;
      const decoder = new TextDecoder();
      let buf = "";

      const loop = () =>
        stream.read().then(({ done, value }) => {
          if (done) {
            if (buf.length > 0) processLine(JSON.parse(buf));
          } else {
            const chunk = decoder.decode(value, {
              stream: true,
            });
            buf += chunk;

            const parts = buf.split(matcher);
            buf = parts.pop();
            for (const i of parts.filter((p) => p)) processLine(JSON.parse(i));
            return loop();
          }
        });

      return loop();
    };

    const stream = fetch("https://lichess.org/api/board/game/stream/IXUEZBhx", {
      headers: {
        Authorization: "Bearer lip_1PxEoSykBCqOIAXnLVXc",
      },
    });

    const onMessage = (data) => {
      const chess = new Chess();
      const Data = data.state ? data.state.moves : data.moves;
      Data.split(" ").forEach((e) => {
        chess.move(e);
      });
      setChessBoard(chess.board());
    };

    stream.then(readStream(onMessage));
  }, [focus]);
  if (!chessBoard) return <></>;

  return (
    <div className="chessWrapper">
      <div className="chessBoard">
        {[...Array(64)].map((e, i) => {
          const row = Math.floor(i / 8);
          const col = i % 8;
          const isBlack = (row + col) % 2 === 1;
          const color = isBlack ? "black" : "white";
          return <div className={`boardSquare ${color}`}></div>;
        })}
      </div>
      <div className="chessPieces">
        {chessBoard.map((row, i) => {
          return row.map((elem, k) => {
            if (!elem) return <></>;
            return (
              <div
                className="chessPiece"
                style={{
                  top: 100 * i + 10 + "px",
                  left: 100 * k + 10 + "px",
                  transition: "top 0.7s, left 0.7s",
                }}>
                {elem.type}
              </div>
            );
          });
        })}
      </div>
    </div>
  );
}
