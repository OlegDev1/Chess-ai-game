import { useState } from "react";
import { GameMode } from "../../types/gameMode.types";
import { GameTimeMode } from "../../types/gameTimeMode.types";
import { Strength } from "../../types/strength.types";
import { Side } from "../../types/side.types";
import Slider from "../Slider/Slider";
import TimeVariants from "../TimeVariants/TimeVariants";
import StrengthPicker from "../StrengthPicker/StrengthPicker";
import SidePicker from "../SidePicker/SidePicker";
import StartGame from "../StartGame/StartGame";
import "./GameSettings.css";

export default function GameSettings() {
  const [gameMode, setGameMode] = useState<GameMode>("ai");
  const [gameTimeMode, setGameTimeMode] = useState<GameTimeMode>("limited");
  const [limitedGameMinutes, setLimitedGameMinutes] = useState(15);
  const [strength, setStrength] = useState<Strength>(1);
  const [side, setSide] = useState<Side>("random");

  return (
    <div className="homeSection__gameSettings">
      <div className="settings__modes">
        <button
          className={`settings__mode ${gameMode === "ai" ? "selected" : ""}`}
          onClick={() => setGameMode("ai")}>
          Play with AI
        </button>
        <button
          className={`settings__mode ${gameMode === "friend" ? "selected" : ""}`}
          onClick={() => setGameMode("friend")}>
          Play with a friend
        </button>
      </div>
      <div className="settings__time">
        <h3 className="settings__time-title">Game time</h3>
        <div className="time__buttons-limit">
          <button
            className={`time__button-limit ${gameTimeMode === "unlimited" ? "selected" : ""}`}
            onClick={() => setGameTimeMode("unlimited")}>
            Unlimited
          </button>
          <button
            className={`time__button-limit ${gameTimeMode !== "unlimited" ? "selected" : ""}`}
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
      {gameMode === "ai" && <StrengthPicker strength={strength} setStrength={setStrength} />}
      <SidePicker side={side} setSide={setSide} />
      <StartGame />
    </div>
  );
}
