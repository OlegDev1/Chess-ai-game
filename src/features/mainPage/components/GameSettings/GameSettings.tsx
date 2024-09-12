import { useState } from "react";
import { GameTimeMode } from "../../types/gameTimeMode.types";
import { Strength } from "../../types/strength.types";
import { Side } from "../../types/side.types";
import TimePicker from "../TimePicker/TimePicker";
import StrengthPicker from "../StrengthPicker/StrengthPicker";
import SidePicker from "../SidePicker/SidePicker";
import "./GameSettings.css";
import { apiPostRequest } from "@utils/apiClient.ts";
import { useNavigate } from "react-router-dom";
import { CreateGameResponse } from "../../types/createGameResponse.types";
import { AxiosResponse } from "axios";

export default function GameSettings() {
  const [gameTimeMode, setGameTimeMode] = useState<GameTimeMode>("limited");
  const [limitedGameMinutes, setLimitedGameMinutes] = useState(15);
  const [strength, setStrength] = useState<Strength>(1);
  const [side, setSide] = useState<Side>("random");
  const navigate = useNavigate();

  async function handleStartGame() {
    const res: AxiosResponse<CreateGameResponse> = await apiPostRequest(
      "/api/challenge/ai",
      new URLSearchParams({
        level: String(strength),
        color: side,
        variant: "standard",
        ...(gameTimeMode === "limited" && {
          "clock.limit": String(limitedGameMinutes * 60),
          "clock.increment": "1"
        })
      })
    );
    navigate(`/play/${res.data.id}`);
  }

  return (
    <div className="home-section__settings">
      <TimePicker
        gameTimeMode={gameTimeMode}
        setGameTimeMode={setGameTimeMode}
        limitedGameMinutes={limitedGameMinutes}
        setLimitedGameMinutes={setLimitedGameMinutes}
      />
      <StrengthPicker strength={strength} setStrength={setStrength} />
      <SidePicker side={side} setSide={setSide} />

      <div className="settings__start-game">
        <button
          className="settings__start-game-button"
          data-testid="startGame-button"
          onClick={handleStartGame}>
          Start Game
        </button>
      </div>
    </div>
  );
}
