import { useNavigate } from "react-router-dom";
import CloseSVG from "@components/svg/closeIcon";
import { GameDataType } from "@pages/chessPage/types/GameDataType.types";
import _ from "lodash";
import "./Modal.css";
import { APP_HOME_PATH } from "../../../../app.constants.ts";

type ModalProps = {
  gameData: GameDataType;
  setGameData: React.Dispatch<React.SetStateAction<GameDataType>>;
};
export default function Modal({ gameData, setGameData }: ModalProps) {
  const navigate = useNavigate();
  const { gameStatus, winner: winnerSide, isModalClosed } = gameData;

  const winReason: Record<string, string> = {
    mate: "checkmate",
    outoftime: "timeout"
  };
  const winner = winnerSide ? _.capitalize(winnerSide) : "Nobody";
  const reason = winReason[gameStatus] ?? gameStatus;

  if (gameStatus === "started" || isModalClosed) return <></>;

  return (
    <section
      className="chessboard-modal"
      onClick={(e) => {
        if (e.target === e.currentTarget) setGameData((data) => ({ ...data, isModalClosed: true }));
      }}
      data-testid="chessboardModalBackground">
      <div className="modal fade-in-scale" data-testid="chessboardModal">
        <button
          className="modal-close-button"
          onClick={() => setGameData((data) => ({ ...data, isModalClosed: true }))}
          data-testid="modalCloseButton">
          <CloseSVG />
        </button>

        <h1 className="modal-title" data-testid="modalWinner">
          {winner} Won
        </h1>
        <h3 className="modal-info" data-testid="modalReason">
          by {reason}
        </h3>

        <button
          className="modal-back-button"
          onClick={() => navigate(APP_HOME_PATH)}
          data-testid="modalBackButton">
          Back home
        </button>
      </div>
    </section>
  );
}
