import { TimeType } from "features/chessPage/types/TimeType.types";
import formatTime from "../../utils/formatTime.ts";
import { GameDataType } from "features/chessPage/types/GameDataType.types.ts";
import useTimer from "../../hooks/useTimer";
import { InfinitySVG } from "../../../../components/SVG/infinityIcon";
import "./Timer.css";

type TimerProps = {
  time: TimeType;
  moves: string;
  gameData: GameDataType;
};

export default function Timer({ time, moves, gameData }: TimerProps) {
  const { whiteSideTimer, blackSideTimer } = useTimer({ time, moves, gameData });
  const { currentSide, playerSide, aiStrength } = gameData;

  return (
    <>
      <div className="chessboardTimer timer__bottom">
        <div
          className={`timer__name timer__name-white ${currentSide == "white" ? "selected" : ""}`}
          data-testid="timerName-white">
          {playerSide == "white" ? "YOU" : `AI BOT LEVEL ${aiStrength}`}
        </div>
        <div
          className={`timer__time timer__time-white ${currentSide == "white" ? "selected" : ""}`}
          data-testid="timerTime-white">
          {whiteSideTimer == "unlimited" ? <InfinitySVG /> : formatTime(whiteSideTimer)}
        </div>
      </div>
      <div className="chessboardTimer timer__top">
        <div
          className={`timer__name timer__name-black ${currentSide == "black" ? "selected" : ""}`}
          data-testid="timerName-black">
          {playerSide == "black" ? "YOU" : `AI BOT LEVEL ${aiStrength}`}
        </div>
        <div
          className={`timer__time timer__time-black ${currentSide == "black" ? "selected" : ""}`}
          data-testid="timerTime-black">
          {blackSideTimer == "unlimited" ? <InfinitySVG /> : formatTime(blackSideTimer)}
        </div>
      </div>
    </>
  );
}
