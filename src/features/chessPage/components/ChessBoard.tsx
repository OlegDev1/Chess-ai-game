import { useState, useEffect } from "react";
import { Chess } from "chess.js";
import "./ChessBoard.css";
import { Chessboard } from "react-chessboard";

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
      setChessBoard(chess.fen());
    };

    stream.then(readStream(onMessage));
  }, [focus]);
  if (!chessBoard) return <></>;

  return (
    <div className="chessWrapper">
      <Chessboard position={chessBoard} />
    </div>
  );
}
