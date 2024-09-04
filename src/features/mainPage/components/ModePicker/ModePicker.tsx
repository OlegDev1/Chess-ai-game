import { GameMode } from "../../types/gameMode.types";
import "./ModePicker.css";

type ModePickerProps = {
  gameMode: GameMode;
  setGameMode: React.Dispatch<React.SetStateAction<GameMode>>;
};

export default function ModePicker({ gameMode, setGameMode }: ModePickerProps) {
  return (
    <div className="settings__modes" data-testid="modePicker">
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
  );
}
