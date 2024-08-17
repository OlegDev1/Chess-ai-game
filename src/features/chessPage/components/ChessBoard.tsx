import { useState } from "react";
import { Chess } from "chess.js";
import axios from "axios";
import "./ChessBoard.css";
import { Chessboard } from "react-chessboard";
import useStreamGame from "../hooks/useStreamGame";
import { PromotionPieceOption, Piece, Square } from "react-chessboard/dist/chessboard/types";
type MoveStyleType = { [key: string]: { background: string; borderRadius?: string } };

export default function ChessBoard() {
  const [chessBoardFEN, setChessBoardFEN] = useState<null | string>(null);
  const [possibleMoves, setPossibleMoves] = useState<object>({});
  const [isCheckStyle, setIsCheckStyle] = useState<object>({});
  const [lastMoveStyle, setLastMoveStyle] = useState<object>({});
  const lichessApi = "lip_1PxEoSykBCqOIAXnLVXc";
  const gameId = "J1tPD7V8";

  useStreamGame({ gameId, setLastMoveStyle, setIsCheckStyle, setChessBoardFEN, lichessApi });

  function handleSquareClick(square: Square) {
    if (!chessBoardFEN) return false;

    const chess = new Chess(chessBoardFEN);

    //If the click is on one of the possible moves
    if (Object.keys(possibleMoves).slice(1).includes(square)) {
      const fromSquare = Object.keys(possibleMoves)[0];

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
              Authorization: `Bearer ${lichessApi}`,
            },
          }
        );

        const lastMove = [fromSquare, square];
        const style: MoveStyleType = {};
        for (const move of lastMove) {
          style[move] = { background: "rgb(0,204,102, 0.3)" };
        }
        setLastMoveStyle(style);
        setChessBoardFEN(chess.fen());
        setPossibleMoves({});
        setIsCheckStyle({});
        return true;
      } catch (e) {
        return false;
      }
    }

    //If the click is not on one of the possible moves - it get's the possible moves of the current square
    const moves = chess.moves({ square: square, verbose: true });
    if (moves.length == 0) {
      setPossibleMoves({});
      return false;
    }
    const styles: MoveStyleType = { [square]: { background: "rgba(255, 255, 0, 0.4)" } };
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
  function handlePieceDragBegin(piece: Piece, sourceSquare: Square) {
    if (!chessBoardFEN) return false;

    const chess = new Chess(chessBoardFEN);
    const moves = chess.moves({ square: sourceSquare, verbose: true });
    if (moves.length == 0) {
      setPossibleMoves({});
      return;
    }

    const styles: MoveStyleType = { [sourceSquare]: { background: "rgba(255, 255, 0, 0.4)" } };
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
  function handlePieceDrop(sourceSquare: Square, targetSquare: Square) {
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
            Authorization: `Bearer ${lichessApi}`,
          },
        }
      );

      const lastMove = [sourceSquare, targetSquare];
      const style: MoveStyleType = {};
      for (const move of lastMove) {
        style[move] = { background: "rgb(0,204,102, 0.3)" };
      }
      setLastMoveStyle(style);
      setChessBoardFEN(chess.fen());
      setPossibleMoves({});
      setIsCheckStyle({});
      return true;
    } catch (e) {
      return false;
    }
  }
  function handlePromotionCheck(sourceSquare: Square, targetSquare: Square) {
    if (!chessBoardFEN) return false;

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
  function handlePromotionPieceSelect(
    piece?: PromotionPieceOption,
    promoteFromSquare?: Square,
    promoteToSquare?: Square
  ) {
    if (!chessBoardFEN || !piece || !promoteFromSquare || !promoteToSquare) return false;

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
            Authorization: `Bearer ${lichessApi}`,
          },
        }
      );

      const lastMove = [promoteFromSquare, promoteToSquare];
      const style: MoveStyleType = {};
      for (const move of lastMove) {
        style[move] = { background: "rgb(0,204,102, 0.3)" };
      }
      setLastMoveStyle(style);
      setChessBoardFEN(chess.fen());
      setPossibleMoves({});
      setIsCheckStyle({});
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
        onPieceDragBegin={handlePieceDragBegin}
        onPieceDrop={handlePieceDrop}
        onPromotionCheck={handlePromotionCheck}
        onPromotionPieceSelect={handlePromotionPieceSelect}
        customSquareStyles={{ ...lastMoveStyle, ...isCheckStyle, ...possibleMoves }}
      />
    </div>
  );
}
