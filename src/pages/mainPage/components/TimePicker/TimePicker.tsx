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
    <section className="settings__time" aria-labelledby="settings__time-title">
      <h2 className="settings__time-title" id="settings__time-title">
        Game time
      </h2>
      <ul className="settings__time-buttons" role="radiogroup">
        <li
          className="settings__time-button"
          role="radio"
          aria-checked={gameTimeMode === "unlimited" ? "true" : "false"}
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && setGameTimeMode("unlimited")}
          onClick={() => setGameTimeMode("unlimited")}
          data-testid="unlimitedTime-button">
          Unlimited
        </li>
        <li
          className="settings__time-button"
          role="radio"
          aria-checked={gameTimeMode === "limited" ? "true" : "false"}
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && setGameTimeMode("limited")}
          onClick={() => setGameTimeMode("limited")}
          data-testid="limitedTime-button">
          Limited
        </li>
      </ul>
      {gameTimeMode === "limited" && (
        <div className="settings__time-limit-select">
          <Slider
            limitedGameMinutes={limitedGameMinutes}
            setLimitedGameMinutes={setLimitedGameMinutes}
          />
          <TimeVariants
            limitedGameMinutes={limitedGameMinutes}
            setLimitedGameMinutes={setLimitedGameMinutes}
          />
        </div>
      )}
    </section>
  );
}
