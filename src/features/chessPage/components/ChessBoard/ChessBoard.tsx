import { useState } from "react";
import { Chess } from "chess.js";
import { apiPostRequest } from "utils/apiClient";
import { Chessboard } from "react-chessboard";
import { PromotionPieceOption, Piece, Square } from "react-chessboard/dist/chessboard/types";
import useStreamGame from "../../hooks/useStreamGame";
import { MoveStyleType } from "../../types/MoveStyleType.types";
import { TimeType } from "features/chessPage/types/TimeType.types";
import { GameDataType } from "features/chessPage/types/GameDataType.types";

type ChessBoardProps = {
  gameId: string;
  setMoves: React.Dispatch<React.SetStateAction<string>>;
  setTime: React.Dispatch<React.SetStateAction<TimeType>>;
  setGameData: React.Dispatch<React.SetStateAction<GameDataType>>;
};

export default function ChessBoard({ gameId, setMoves, setTime, setGameData }: ChessBoardProps) {
  const [chessBoardFEN, setChessBoardFEN] = useState<null | string>(null);
  const [possibleMoves, setPossibleMoves] = useState<object>({});
  const [isCheckStyle, setIsCheckStyle] = useState<object>({});
  const [lastMoveStyle, setLastMoveStyle] = useState<object>({});
  const lichessApi = "lip_1PxEoSykBCqOIAXnLVXc";

  useStreamGame({
    lichessApi,
    gameId,
    setLastMoveStyle,
    setIsCheckStyle,
    setChessBoardFEN,
    setMoves,
    setTime,
    setGameData
  });

  function handleSquareClick(square: Square) {
    if (!chessBoardFEN) return false;

    const chess = new Chess(chessBoardFEN);

    //If the click is on one of the possible moves
    if (Object.keys(possibleMoves).slice(1).includes(square)) {
      const fromSquare = Object.keys(possibleMoves)[0];
      try {
        chess.move({
          from: fromSquare,
          to: square
        });

        apiPostRequest(`/api/board/game/${gameId}/move/${fromSquare + square}`);

        const lastMove = [fromSquare, square];
        const style: MoveStyleType = {};
        for (const move of lastMove) {
          style[move] = { background: "rgb(0,204,102, 0.3)" };
        }
        setLastMoveStyle(style);
        setChessBoardFEN(chess.fen());
        setPossibleMoves({});
        setIsCheckStyle({});
        setMoves((moves) => (moves += ` ${fromSquare + square}`));
        setGameData((data) => ({
          ...data,
          currentSide: data.currentSide == "white" ? "black" : "white"
        }));
        return true;
      } catch (e) {
        return false;
      }
    }

    //If the click is not on one of the possible moves - this code get's the possible moves of the current square
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
        borderRadius: "50%"
      };
    }
    setPossibleMoves(styles);
    return true;
  }
  function handlePieceDragBegin(_piece: Piece, sourceSquare: Square) {
    if (!chessBoardFEN) return false;

    const chess = new Chess(chessBoardFEN);
    const moves = chess.moves({ square: sourceSquare, verbose: true });
    if (moves.length == 0) {
      setPossibleMoves({});
      return false;
    }

    const styles: MoveStyleType = { [sourceSquare]: { background: "rgba(255, 255, 0, 0.4)" } };
    for (const move of moves) {
      styles[move.to] = {
        background:
          chess.get(move.to) && chess.get(move.to).color !== chess.get(sourceSquare).color
            ? "radial-gradient(circle, rgba(0,0,0,.15) 85%, transparent 85%)"
            : "radial-gradient(circle, rgba(0,0,0,.15) 25%, transparent 25%)",
        borderRadius: "50%"
      };
    }
    setPossibleMoves(styles);
    return true;
  }
  function handlePieceDrop(sourceSquare: Square, targetSquare: Square) {
    if (!chessBoardFEN) return false;

    const chess = new Chess(chessBoardFEN);
    try {
      chess.move({
        from: sourceSquare,
        to: targetSquare
      });

      apiPostRequest(`/api/board/game/${gameId}/move/${sourceSquare + targetSquare}`);

      const lastMove = [sourceSquare, targetSquare];
      const style: MoveStyleType = {};
      for (const move of lastMove) {
        style[move] = { background: "rgb(0,204,102, 0.3)" };
      }
      setLastMoveStyle(style);
      setChessBoardFEN(chess.fen());
      setPossibleMoves({});
      setIsCheckStyle({});
      setMoves((moves) => (moves += ` ${sourceSquare + targetSquare}`));
      setGameData((data) => ({
        ...data,
        currentSide: data.currentSide == "white" ? "black" : "white"
      }));
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

      apiPostRequest(
        `/api/board/game/${gameId}/move/${promoteFromSquare + promoteToSquare + promotionPiece}`
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
      setMoves((moves) => (moves += ` ${promoteFromSquare + promoteToSquare + promotionPiece}`));
      setGameData((data) => ({
        ...data,
        currentSide: data.currentSide == "white" ? "black" : "white"
      }));
      return true;
    } catch (e) {
      return false;
    }
  }

  if (!chessBoardFEN) return <></>;
  return (
    <div className="chessboard">
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
