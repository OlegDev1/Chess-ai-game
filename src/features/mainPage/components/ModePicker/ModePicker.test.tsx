import { render, screen } from "@testing-library/react";
import ModePicker from "./ModePicker";
import userEvent from "@testing-library/user-event";
import { GameMode } from "@features/mainPage/types/gameMode.types";

type setupProps = {
  gameMode: GameMode;
  setGameMode: React.Dispatch<React.SetStateAction<GameMode>>;
};
function setup({ gameMode, setGameMode }: setupProps) {
  render(<ModePicker gameMode={gameMode} setGameMode={setGameMode} />);

  const chooseAiButton = screen.getByTestId("modePicker").children[0];
  const chooseFriendButton = screen.getByTestId("modePicker").children[1];

  return { chooseAiButton, chooseFriendButton };
}

it("AI button is selected", () => {
  const { chooseAiButton, chooseFriendButton } = setup({ gameMode: "ai", setGameMode: jest.fn() });

  expect(chooseAiButton.className).toContain("selected");
  expect(chooseFriendButton.className).not.toContain("selected");
});

it("Friend button is selected", () => {
  const { chooseAiButton, chooseFriendButton } = setup({
    gameMode: "friend",
    setGameMode: jest.fn()
  });

  expect(chooseAiButton.className).not.toContain("selected");
  expect(chooseFriendButton.className).toContain("selected");
});

it("Buttons set the game mode", async () => {
  const mockSetGameMode = jest.fn();
  const { chooseAiButton, chooseFriendButton } = setup({
    gameMode: "ai",
    setGameMode: mockSetGameMode
  });

  await userEvent.click(chooseAiButton);
  expect(mockSetGameMode).toHaveBeenLastCalledWith("ai");
  await userEvent.click(chooseFriendButton);
  expect(mockSetGameMode).toHaveBeenLastCalledWith("friend");
});
