import { useState, useEffect } from "react";
import { Chess } from "chess.js";
import axios from "axios";
import "./ChessBoard.css";
import { Chessboard } from "react-chessboard";

export default function ChessBoard() {
  const [chessBoardFEN, setChessBoardFEN] = useState(null);
  const [possibleMoves, setPossibleMoves] = useState({});
  const [focus, setFocus] = useState(0);
  useEffect(() => {
    window.onfocus = () => setFocus((e) => e + 1);
  }, []);

  useEffect(() => {
    const readStream = (processLine) => (response) => {
      const stream = response.body.getReader();
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

    const stream = fetch("https://lichess.org/api/board/game/stream/UwdOM1mE", {
      headers: {
        Authorization: "Bearer lip_1PxEoSykBCqOIAXnLVXc",
      },
    });

    const onMessage = (data) => {
      const chess = new Chess();
      const Data = data.state ? data.state.moves : data.moves;
      if (Data) {
        Data.split(" ").forEach((e) => {
          chess.move(e);
        });
      }
      setChessBoardFEN(chess.fen());
    };

    stream.then(readStream(onMessage));
  }, [focus]);

  function handleSquareClick(square) {
    if (!chessBoardFEN) return false;
    const chess = new Chess(chessBoardFEN);

    if (Object.keys(possibleMoves).slice(1).includes(square)) {
      console.log("move");
      try {
        chess.move({
          from: Object.keys(possibleMoves)[0],
          to: square,
        });
        axios.post(
          `https://lichess.org/api/board/game/UwdOM1mE/move/${
            Object.keys(possibleMoves)[0] + square
          }`,
          {},
          {
            headers: {
              Authorization: "Bearer lip_1PxEoSykBCqOIAXnLVXc",
            },
          }
        );
        setChessBoardFEN(chess.fen());
        setPossibleMoves({});
        return true;
      } catch (e) {
        return false;
      }
    }

    const moves = chess.moves({ square: square, verbose: true });
    if (moves.length == 0) {
      setPossibleMoves({});
      return;
    }

    const styles = { [square]: { backgroundColor: "rgba(255, 255, 0, 0.4)" } };
    for (const move of moves) {
      styles[move.to] = {
        background:
          chess.get(move.to) && chess.get(move.to).color !== chess.get(square).color
            ? "radial-gradient(circle, rgba(0,0,0,.15) 85%, transparent 85%)"
            : "radial-gradient(circle, rgba(0,0,0,.15) 25%, transparent 25%)",
        borderRadius: "50%",
      };
    }
    setPossibleMoves(styles);
  }
  function handlePossibleMovesDrag(piece, sourceSquare) {
    if (!chessBoardFEN) return false;
    const chess = new Chess(chessBoardFEN);
    const moves = chess.moves({ square: sourceSquare, verbose: true });
    if (moves.length == 0) {
      setPossibleMoves({});
      return;
    }

    const styles = { [sourceSquare]: { backgroundColor: "rgba(255, 255, 0, 0.4)" } };
    for (const move of moves) {
      styles[move.to] = {
        background:
          chess.get(move.to) && chess.get(move.to).color !== chess.get(sourceSquare).color
            ? "radial-gradient(circle, rgba(0,0,0,.15) 85%, transparent 85%)"
            : "radial-gradient(circle, rgba(0,0,0,.15) 25%, transparent 25%)",
        borderRadius: "50%",
      };
    }
    setPossibleMoves(styles);
  }
  function handlePieceDrop(sourceSquare, targetSquare) {
    if (!chessBoardFEN) return false;
    const chess = new Chess(chessBoardFEN);
    try {
      chess.move({
        from: sourceSquare,
        to: targetSquare,
      });
      axios.post(
        `https://lichess.org/api/board/game/UwdOM1mE/move/${sourceSquare + targetSquare}`,
        {},
        {
          headers: {
            Authorization: "Bearer lip_1PxEoSykBCqOIAXnLVXc",
          },
        }
      );
    } catch (e) {
      return false;
    }
    setChessBoardFEN(chess.fen());
    setPossibleMoves({});
    return true;
  }
  function handlePromotion(piece, promoteFromSquare, promoteToSquare) {
    const promotionPiece = piece.slice(1).toLowerCase();

    const chess = new Chess(chessBoardFEN);
    try {
      chess.move({ from: promoteFromSquare, to: promoteToSquare, promotion: promotionPiece });
      axios.post(
        `https://lichess.org/api/board/game/UwdOM1mE/move/${
          promoteFromSquare + promoteToSquare + promotionPiece
        }`,
        {},
        {
          headers: {
            Authorization: "Bearer lip_1PxEoSykBCqOIAXnLVXc",
          },
        }
      );
      setChessBoardFEN(chess.fen());
      return true;
    } catch (e) {
      return false;
    }
  }

  if (!chessBoardFEN) return <></>;
  return (
    <div className="chessWrapper">
      <Chessboard
        position={chessBoardFEN}
        onSquareClick={handleSquareClick}
        onPieceDragBegin={handlePossibleMovesDrag}
        onPieceDrop={handlePieceDrop}
        customSquareStyles={{ ...possibleMoves }}
        onPromotionPieceSelect={handlePromotion}
      />
    </div>
  );
}
