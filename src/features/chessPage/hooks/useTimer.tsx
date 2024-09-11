import { useState, useEffect } from "react";
import { TimeType } from "../types/TimeType.types";
import { GameDataType } from "../types/GameDataType.types";

type useTimerProps = {
  time: TimeType;
  moves: string;
  gameData: GameDataType;
};

export default function useTimer({ time, moves, gameData }: useTimerProps) {
  const [timerCounter, setTimerCounter] = useState(time);
  const currentSide = gameData.currentSide;
  const gameStatus = gameData.gameStatus;
  const hasMoves = Boolean(moves);

  //For optimization purposes
  useEffect(() => {
    setTimerCounter((e) => ({ ...e, white: time.white, black: time.black }));
  }, [time.white, time.black]);

  useEffect(() => {
    if (
      !hasMoves ||
      (timerCounter.white == "unlimited" && timerCounter.black == "unlimited") ||
      gameStatus !== "started"
    )
      return;

    const interval = setInterval(
      () =>
        setTimerCounter((e) => ({
          ...e,
          [currentSide]: e[currentSide] == "unlimited" ? "unlimited" : e[currentSide] - 1000
        })),
      1000
    );
    return () => clearInterval(interval);
  }, [gameStatus, currentSide, hasMoves, timerCounter.white, timerCounter.black]);

  //When the timer is over, a refetch in useStreamGame is fired by window focus event
  useEffect(() => {
    if (
      (timerCounter.white != "unlimited" && timerCounter.white < 0) ||
      (timerCounter.black != "unlimited" && timerCounter.black < 0)
    ) {
      const event = new Event("focus");
      window.dispatchEvent(event);
    }
  }, [timerCounter.white, timerCounter.black]);

  return { whiteSideTimer: timerCounter.white, blackSideTimer: timerCounter.black };
}
