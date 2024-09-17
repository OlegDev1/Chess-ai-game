import { useState } from "react";
import { Chess } from "chess.js";
import { apiPostRequest } from "@utils/apiClient";
import { Chessboard } from "react-chessboard";
import { PromotionPieceOption, Piece, Square } from "react-chessboard/dist/chessboard/types";
import useStreamGame from "../../hooks/useStreamGame";
import { MoveStyleType } from "../../types/MoveStyleType.types";
import { TimeType } from "../../types/TimeType.types";
import { GameDataType } from "../../types/GameDataType.types";
import playErrorSound from "@pages/chessPage/utils/playErrorSound";
import playMoveOrCaptureSound from "@pages/chessPage/utils/playMoveOrCaptureSound";
import {
  CHESSBOARD_STYLE,
  CHOSEN_PIECE_STYLE,
  LAST_MOVE_STYLE,
  MAKE_MOVE_PATH,
  POSSIBLE_MOVE_STYLE
} from "../../../../app.constants.ts";

type ChessBoardProps = {
  gameId: string;
  gameData: GameDataType;
  setMoves: React.Dispatch<React.SetStateAction<string>>;
  setTime: React.Dispatch<React.SetStateAction<TimeType>>;
  setGameData: React.Dispatch<React.SetStateAction<GameDataType>>;
};

export default function ChessBoard({
  gameId,
  gameData,
  setMoves,
  setTime,
  setGameData
}: ChessBoardProps) {
  const [chessBoardFEN, setChessBoardFEN] = useState<null | string>(null);
  const [possibleMoves, setPossibleMoves] = useState<object>({});
  const [isCheckStyle, setIsCheckStyle] = useState<object>({});
  const [lastMoveStyle, setLastMoveStyle] = useState<object>({});

  useStreamGame({
    gameId,
    playerSide: gameData.playerSide,
    setLastMoveStyle,
    setIsCheckStyle,
    setChessBoardFEN,
    setMoves,
    setTime,
    setGameData
  });

  function handleSquareClick(square: Square) {
    if (!chessBoardFEN || gameData.playerSide !== gameData.currentSide) return false;

    const chess = new Chess(chessBoardFEN);

    //If the click is on one of the possible moves
    if (Object.keys(possibleMoves).slice(1).includes(square)) {
      const fromSquare = Object.keys(possibleMoves)[0];
      try {
        chess.move({
          from: fromSquare,
          to: square
        });
        apiPostRequest(MAKE_MOVE_PATH({ gameId: gameId, move: fromSquare + square }));

        const lastMove = [fromSquare, square];
        const style: MoveStyleType = {};
        for (const move of lastMove) {
          style[move] = LAST_MOVE_STYLE;
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
        playMoveOrCaptureSound(chess);
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

    const styles: MoveStyleType = { [square]: CHOSEN_PIECE_STYLE };
    for (const move of moves) {
      styles[move.to] = POSSIBLE_MOVE_STYLE({
        isCapture: chess.get(move.to) && chess.get(move.to).color !== chess.get(square).color
      });
    }
    setPossibleMoves(styles);
    return true;
  }
  function handlePieceDragBegin(_piece: Piece, sourceSquare: Square) {
    if (!chessBoardFEN || gameData.playerSide !== gameData.currentSide) return false;

    const chess = new Chess(chessBoardFEN);
    const moves = chess.moves({ square: sourceSquare, verbose: true });
    if (moves.length == 0) {
      setPossibleMoves({});
      return false;
    }

    const styles: MoveStyleType = { [sourceSquare]: CHOSEN_PIECE_STYLE };
    for (const move of moves) {
      styles[move.to] = POSSIBLE_MOVE_STYLE({
        isCapture: chess.get(move.to) && chess.get(move.to).color !== chess.get(sourceSquare).color
      });
    }
    setPossibleMoves(styles);
    return true;
  }
  function handlePieceDrop(sourceSquare: Square, targetSquare: Square) {
    if (!chessBoardFEN || gameData.playerSide !== gameData.currentSide) {
      playErrorSound();
      return false;
    }

    const chess = new Chess(chessBoardFEN);
    try {
      chess.move({
        from: sourceSquare,
        to: targetSquare
      });
      apiPostRequest(MAKE_MOVE_PATH({ gameId: gameId, move: sourceSquare + targetSquare }));

      const lastMove = [sourceSquare, targetSquare];
      const style: MoveStyleType = {};
      for (const move of lastMove) {
        style[move] = LAST_MOVE_STYLE;
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
      playMoveOrCaptureSound(chess);
      return true;
    } catch (e) {
      playErrorSound();
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
        MAKE_MOVE_PATH({
          gameId: gameId,
          move: promoteFromSquare + promoteToSquare + promotionPiece
        })
      );

      const lastMove = [promoteFromSquare, promoteToSquare];
      const style: MoveStyleType = {};
      for (const move of lastMove) {
        style[move] = LAST_MOVE_STYLE;
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
    <div className="chessboard" aria-label="Chess Board">
      <Chessboard
        position={chessBoardFEN}
        onSquareClick={handleSquareClick}
        onPieceDragBegin={handlePieceDragBegin}
        onPieceDrop={handlePieceDrop}
        onPromotionCheck={handlePromotionCheck}
        onPromotionPieceSelect={handlePromotionPieceSelect}
        customSquareStyles={{ ...lastMoveStyle, ...isCheckStyle, ...possibleMoves }}
        customBoardStyle={CHESSBOARD_STYLE}
        boardOrientation={gameData.boardOrientation}
      />
    </div>
  );
}
