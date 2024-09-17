import { TimeType } from "../../types/TimeType.types";
import formatTime from "../../utils/formatTime.ts";
import { GameDataType } from "../../types/GameDataType.types.ts";
import useTimer from "../../hooks/useTimer";
import { InfinitySVG } from "@components/svg/infinityIcon";
import "./Timer.css";

type TimerProps = {
  time: TimeType;
  moves: string;
  gameData: GameDataType;
};

export default function Timer({ time, moves, gameData }: TimerProps) {
  const { whiteSideTimer, blackSideTimer } = useTimer({ time, moves, gameData });
  const { currentSide, playerSide, aiStrength, boardOrientation } = gameData;

  return (
    <>
      <div
        className={`chessboard-timer chessboard-timer--${boardOrientation == "white" ? "bottom" : "top"}`}
        aria-label="White side timer"
        data-testid="timer-white">
        <div
          className="chessboard-timer__name chessboard-timer__name--white"
          data-testid="timerName-white"
          aria-checked={currentSide == "white" ? "true" : "false"}>
          {playerSide == "white" ? "YOU" : `AI BOT LEVEL ${aiStrength}`}
        </div>
        <div
          className="chessboard-timer__time chessboard-timer__time--white"
          data-testid="timerTime-white"
          aria-checked={currentSide == "white" ? "true" : "false"}>
          {whiteSideTimer == "unlimited" ? <InfinitySVG /> : formatTime(whiteSideTimer)}
        </div>
      </div>
      <div
        className={`chessboard-timer chessboard-timer--${boardOrientation == "white" ? "top" : "bottom"}`}
        aria-label="Black side timer"
        data-testid="timer-black">
        <div
          className="chessboard-timer__name chessboard-timer__name--black"
          data-testid="timerName-black"
          aria-checked={currentSide == "black" ? "true" : "false"}>
          {playerSide == "black" ? "YOU" : `AI BOT LEVEL ${aiStrength}`}
        </div>
        <div
          className="chessboard-timer__time chessboard-timer__time--black"
          data-testid="timerTime-black"
          aria-checked={currentSide == "black" ? "true" : "false"}>
          {blackSideTimer == "unlimited" ? <InfinitySVG /> : formatTime(blackSideTimer)}
        </div>
      </div>
    </>
  );
}
