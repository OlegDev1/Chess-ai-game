import ChessBoard from "../features/chessPage/components/ChessBoard/ChessBoard";
import { useParams, useNavigate } from "react-router-dom";

export default function ChessRoute() {
  const { gameId } = useParams();
  const navigate = useNavigate();

  if (!gameId) {
    navigate("/");
    return;
  }
  return <ChessBoard gameId={gameId} />;
}
