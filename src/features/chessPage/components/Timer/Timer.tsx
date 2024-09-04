import { TimeType } from "../../types/TimeType.types";
import formatTime from "../../utils/formatTime.ts";
import { GameDataType } from "../../types/GameDataType.types.ts";
import useTimer from "../../hooks/useTimer";
import { InfinitySVG } from "@components/SVG/infinityIcon";
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
      <div className="chessboard-timer chessboard-timer--bottom">
        <div
          className={`chessboard-timer__name chessboard-timer__name--white ${currentSide == "white" ? "selected" : ""}`}
          data-testid="timerName-white">
          {playerSide == "white" ? "YOU" : `AI BOT LEVEL ${aiStrength}`}
        </div>
        <div
          className={`chessboard-timer__time chessboard-timer__time--white ${currentSide == "white" ? "selected" : ""}`}
          data-testid="timerTime-white">
          {whiteSideTimer == "unlimited" ? <InfinitySVG /> : formatTime(whiteSideTimer)}
        </div>
      </div>
      <div className="chessboard-timer chessboard-timer--top">
        <div
          className={`chessboard-timer__name chessboard-timer__name--black ${currentSide == "black" ? "selected" : ""}`}
          data-testid="timerName-black">
          {playerSide == "black" ? "YOU" : `AI BOT LEVEL ${aiStrength}`}
        </div>
        <div
          className={`chessboard-timer__time chessboard-timer__time--black ${currentSide == "black" ? "selected" : ""}`}
          data-testid="timerTime-black">
          {blackSideTimer == "unlimited" ? <InfinitySVG /> : formatTime(blackSideTimer)}
        </div>
      </div>
    </>
  );
}
