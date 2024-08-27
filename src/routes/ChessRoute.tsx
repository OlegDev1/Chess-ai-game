import ChessBoard from "../features/chessPage/components/ChessBoard/ChessBoard";
import Moves from "../features/chessPage/components/Moves/Moves";
import { useParams, useNavigate } from "react-router-dom";
import "./ChessRoute.css";
import { useState } from "react";

export default function ChessRoute() {
  const [moves, setMoves] = useState("");
  const { gameId } = useParams();
  const navigate = useNavigate();

  if (!gameId) {
    navigate("/");
    return;
  }
  return (
    <div className="chessWrapper">
      <section className="chessBoard-content">
        <ChessBoard gameId={gameId} setMoves={setMoves} />
        <Moves moves={moves} />
      </section>
    </div>
  );
}
