import ChessBoard from "@features/chessPage/components/ChessBoard/ChessBoard";
import Moves from "@features/chessPage/components/Moves/Moves";
import Timer from "@features/chessPage/components/Timer/Timer";
import Modal from "@features/chessPage/components/Modal/Modal";
import { TimeType } from "@features/chessPage/types/TimeType.types";
import { GameDataType } from "@features/chessPage/types/GameDataType.types";
import { useParams, useNavigate } from "react-router-dom";
import "./ChessRoute.css";
import { useState } from "react";

export default function ChessRoute() {
  const [moves, setMoves] = useState("");
  const [time, setTime] = useState<TimeType>({ white: 0, black: 0 });
  const [gameData, setGameData] = useState<GameDataType>({
    gameStatus: "started",
    currentSide: "white",
    playerSide: "white",
    boardOrientation: "white",
    aiStrength: 1
  });
  const { gameId } = useParams();
  const navigate = useNavigate();

  if (!gameId) {
    navigate("/");
    return;
  }

  return (
    <div className="chessboard-wrapper">
      <Modal gameData={gameData} setGameData={setGameData} />

      <section className="chessboard-content">
        <Timer time={time} moves={moves} gameData={gameData} />
        <ChessBoard
          gameId={gameId}
          gameData={gameData}
          setMoves={setMoves}
          setTime={setTime}
          setGameData={setGameData}
        />
        <Moves moves={moves} setGameData={setGameData} />
      </section>
    </div>
  );
}
