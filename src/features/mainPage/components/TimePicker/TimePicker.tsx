import Slider from "../Slider/Slider";
import TimeVariants from "../TimeVariants/TimeVariants";
import { GameTimeMode } from "../../types/gameTimeMode.types";
import "./TimePicker.css";

type TimePickerProps = {
  gameTimeMode: GameTimeMode;
  setGameTimeMode: React.Dispatch<React.SetStateAction<GameTimeMode>>;
  limitedGameMinutes: number;
  setLimitedGameMinutes: React.Dispatch<React.SetStateAction<number>>;
};

export default function TimePicker({
  gameTimeMode,
  setGameTimeMode,
  limitedGameMinutes,
  setLimitedGameMinutes
}: TimePickerProps) {
  return (
    <div className="settings__time">
      <h3 className="settings__time-title">Game time</h3>
      <div className="time__buttons-limit">
        <button
          className={`time__button-limit ${gameTimeMode === "unlimited" ? "selected" : ""}`}
          data-testid="unlimitedTime-button"
          onClick={() => setGameTimeMode("unlimited")}>
          Unlimited
        </button>
        <button
          className={`time__button-limit ${gameTimeMode !== "unlimited" ? "selected" : ""}`}
          data-testid="limitedTime-button"
          onClick={() => setGameTimeMode("limited")}>
          Limited
        </button>
      </div>
      {gameTimeMode === "limited" && (
        <div className="settings__limitSelect">
          <Slider
            limitedGameMinutes={limitedGameMinutes}
            setLimitedGameMinutes={setLimitedGameMinutes}
          />
          <TimeVariants setLimitedGameMinutes={setLimitedGameMinutes} />
        </div>
      )}
    </div>
  );
}
