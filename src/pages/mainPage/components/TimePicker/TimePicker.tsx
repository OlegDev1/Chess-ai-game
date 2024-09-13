import Slider from "../Slider/Slider";
import TimeVariants from "../TimeVariants/TimeVariants";
import { GameTimeMode } from "../../types/GameTimeMode.types";
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
      <div className="settings__time-buttons">
        <button
          className={`settings__time-button ${gameTimeMode === "unlimited" ? "selected" : ""}`}
          data-testid="unlimitedTime-button"
          onClick={() => setGameTimeMode("unlimited")}>
          Unlimited
        </button>
        <button
          className={`settings__time-button ${gameTimeMode === "limited" ? "selected" : ""}`}
          data-testid="limitedTime-button"
          onClick={() => setGameTimeMode("limited")}>
          Limited
        </button>
      </div>
      {gameTimeMode === "limited" && (
        <div className="settings__time-limit-select">
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
