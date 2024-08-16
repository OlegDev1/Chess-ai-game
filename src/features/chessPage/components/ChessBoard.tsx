import { useState, useEffect } from "react";
import { Chess } from "chess.js";
import _ from "lodash";
import axios from "axios";
import "./ChessBoard.css";
import { Chessboard } from "react-chessboard";

export default function ChessBoard() {
  const [chessBoardFEN, setChessBoardFEN] = useState(null);
  const [possibleMoves, setPossibleMoves] = useState({});
  const [isCheckStyle, setIsCheckStyle] = useState({});
  const [lastMoveStyle, setLastMoveStyle] = useState({});
  const [focus, setFocus] = useState(0);
  const gameId = "DALCjC9u";
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

    const stream = fetch(`https://lichess.org/api/board/game/stream/${gameId}`, {
      headers: {
        Authorization: "Bearer lip_1PxEoSykBCqOIAXnLVXc",
      },
    });

    const onMessage = (data) => {
      const chess = new Chess();
      const moves = data.state ? data.state.moves : data.moves;
      if (moves) {
        moves.split(" ").forEach((e) => {
          chess.move(e);
        });
        let lastMove = _.last(moves.split(" "));
        lastMove = [lastMove.slice(0, 2), lastMove.slice(2, 4)];
        const style = {};
        for (const move of lastMove) {
          style[move] = { background: "rgb(0,204,102, 0.3)" };
        }
        setLastMoveStyle(style);
      }
      if (chess.isCheck()) {
        const pieces = _.flatten(chess.board());
        const kingPiece = pieces.find(
          (piece) => piece && piece.type === "k" && piece.color === chess.turn()
        ).square;
        console.log(kingPiece);
        setIsCheckStyle({
          [kingPiece]: {
            background:
              "radial-gradient(ellipse at center, rgba(255, 0, 0, 1) 0%, rgba(231, 0, 0, 1) 25%, rgba(169, 0, 0, 0) 89%, rgba(158, 0, 0, 0) 100%)",
          },
        });
      } else {
        setIsCheckStyle({});
      }
      setChessBoardFEN(chess.fen());
    };

    stream.then(readStream(onMessage));
  }, [focus]);

  function handleSquareClick(square) {
    if (!chessBoardFEN) return false;
    const chess = new Chess(chessBoardFEN);
    const fromSquare = Object.keys(possibleMoves)[0];
    if (Object.keys(possibleMoves).slice(1).includes(square)) {
      try {
        chess.move({
          from: fromSquare,
          to: square,
        });

        axios.post(
          `https://lichess.org/api/board/game/${gameId}/move/${fromSquare + square}`,
          {},
          {
            headers: {
              Authorization: "Bearer lip_1PxEoSykBCqOIAXnLVXc",
            },
          }
        );
        const lastMove = [fromSquare, square];
        const style = {};
        for (const move of lastMove) {
          style[move] = { background: "rgb(0,204,102, 0.3)" };
        }
        setLastMoveStyle(style);
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
      return false;
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
        `https://lichess.org/api/board/game/${gameId}/move/${sourceSquare + targetSquare}`,
        {},
        {
          headers: {
            Authorization: "Bearer lip_1PxEoSykBCqOIAXnLVXc",
          },
        }
      );

      const lastMove = [sourceSquare, targetSquare];
      const style = {};
      for (const move of lastMove) {
        style[move] = { background: "rgb(0,204,102, 0.3)" };
      }
      setLastMoveStyle(style);
    } catch (e) {
      return false;
    }
    setChessBoardFEN(chess.fen());
    setPossibleMoves({});
    return true;
  }
  function handlePromotionCheck(sourceSquare, targetSquare) {
    const chess = new Chess(chessBoardFEN);
    const sourceSquareData = chess.get(sourceSquare);

    const isPossibleMove = Object.keys(possibleMoves).slice(1).includes(targetSquare);
    const isPromotionMove =
      (sourceSquareData.color === "w" &&
        sourceSquareData.type === "p" &&
        targetSquare[1] === "8") ||
      (sourceSquareData.color === "b" && sourceSquareData.type === "p" && targetSquare[1] === "1");
    if (isPossibleMove && isPromotionMove) return true;
    return false;
  }
  function handlePromotion(piece, promoteFromSquare, promoteToSquare) {
    const promotionPiece = piece.slice(1).toLowerCase();

    const chess = new Chess(chessBoardFEN);
    try {
      chess.move({ from: promoteFromSquare, to: promoteToSquare, promotion: promotionPiece });

      axios.post(
        `https://lichess.org/api/board/game/${gameId}/move/${
          promoteFromSquare + promoteToSquare + promotionPiece
        }`,
        {},
        {
          headers: {
            Authorization: "Bearer lip_1PxEoSykBCqOIAXnLVXc",
          },
        }
      );

      const lastMove = [promoteFromSquare, promoteToSquare];
      const style = {};
      for (const move of lastMove) {
        style[move] = { background: "rgb(0,204,102, 0.3)" };
      }
      setLastMoveStyle(style);
      setChessBoardFEN(chess.fen());
      setPossibleMoves({});
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
        onPromotionCheck={handlePromotionCheck}
        onPromotionPieceSelect={handlePromotion}
        customSquareStyles={{ ...lastMoveStyle, ...isCheckStyle, ...possibleMoves }}
      />
    </div>
  );
}
