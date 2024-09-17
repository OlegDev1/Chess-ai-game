import { useState } from "react";
import { GameTimeMode } from "@pages/mainPage/types/GameTimeMode.types";
import { Strength } from "@pages/mainPage/types/Strength.types";
import { Side } from "@pages/mainPage/types/Side.types";
import TimePicker from "../TimePicker/TimePicker";
import StrengthPicker from "../StrengthPicker/StrengthPicker";
import SidePicker from "../SidePicker/SidePicker";
import "./GameSettings.css";
import { apiPostRequest } from "@utils/apiClient.ts";
import { useNavigate } from "react-router-dom";
import { CreateGameResponse } from "@pages/mainPage/types/CreateGameResponse.types";
import { AxiosResponse } from "axios";
import { CREATE_GAME_PATH, APP_PLAY_PATH } from "../../../../app.constants.ts";

export default function GameSettings() {
  const [gameTimeMode, setGameTimeMode] = useState<GameTimeMode>("limited");
  const [limitedGameMinutes, setLimitedGameMinutes] = useState(15);
  const [strength, setStrength] = useState<Strength>(1);
  const [side, setSide] = useState<Side>("random");
  const navigate = useNavigate();

  async function handleStartGame() {
    const res: AxiosResponse<CreateGameResponse> = await apiPostRequest(
      CREATE_GAME_PATH,
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
    navigate(APP_PLAY_PATH({ gameId: res.data.id }));
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

      <section className="settings__start-game">
        <button
          className="settings__start-game-button"
          data-testid="startGame-button"
          onClick={handleStartGame}>
          Start Game
        </button>
      </section>
    </div>
  );
}
