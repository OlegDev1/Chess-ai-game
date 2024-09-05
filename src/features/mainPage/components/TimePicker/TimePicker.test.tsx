import TimePicker from "./TimePicker";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GameTimeMode } from "@features/mainPage/types/gameTimeMode.types";

type setupProps = {
  gameTimeMode: GameTimeMode;
  setGameTimeMode: React.Dispatch<React.SetStateAction<GameTimeMode>>;
};
function setup({ gameTimeMode, setGameTimeMode }: setupProps) {
  render(
    <TimePicker
      gameTimeMode={gameTimeMode}
      setGameTimeMode={setGameTimeMode}
      limitedGameMinutes={0}
      setLimitedGameMinutes={jest.fn()}
    />
  );

  const unlimitedTimeButton = screen.getByTestId("unlimitedTime-button");
  const limitedTimeButton = screen.getByTestId("limitedTime-button");

  return { unlimitedTimeButton, limitedTimeButton };
}

it("Unlimited time is selected", () => {
  const { unlimitedTimeButton, limitedTimeButton } = setup({
    gameTimeMode: "unlimited",
    setGameTimeMode: jest.fn()
  });

  expect(unlimitedTimeButton.className).toContain("selected");
  expect(limitedTimeButton.className).not.toContain("selected");
});

it("Limited time is selected", () => {
  const { unlimitedTimeButton, limitedTimeButton } = setup({
    gameTimeMode: "limited",
    setGameTimeMode: jest.fn()
  });

  expect(unlimitedTimeButton.className).not.toContain("selected");
  expect(limitedTimeButton.className).toContain("selected");

  expect(screen.getByTestId("timePicker")).toBeInTheDocument();
  expect(screen.getByTestId("slider")).toBeInTheDocument();
});

it("Buttons set the time mode", async () => {
  const mockSetGameTimeMode = jest.fn();
  const { unlimitedTimeButton, limitedTimeButton } = setup({
    gameTimeMode: "limited",
    setGameTimeMode: mockSetGameTimeMode
  });

  await userEvent.click(unlimitedTimeButton);
  expect(mockSetGameTimeMode).toHaveBeenLastCalledWith("unlimited");
  await userEvent.click(limitedTimeButton);
  expect(mockSetGameTimeMode).toHaveBeenLastCalledWith("limited");
});
