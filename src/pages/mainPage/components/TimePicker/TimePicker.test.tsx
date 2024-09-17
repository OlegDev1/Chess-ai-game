import TimePicker from "./TimePicker";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GameTimeMode } from "@pages/mainPage/types/GameTimeMode.types";

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

describe("time mode display", () => {
  it("highlights unlimited time, when it is selected", () => {
    const { unlimitedTimeButton, limitedTimeButton } = setup({
      gameTimeMode: "unlimited",
      setGameTimeMode: jest.fn()
    });

    expect(unlimitedTimeButton).toHaveAttribute("aria-checked", "true");
    expect(limitedTimeButton).toHaveAttribute("aria-checked", "false");
  });

  it("highlights limited time, when it is selected", () => {
    const { unlimitedTimeButton, limitedTimeButton } = setup({
      gameTimeMode: "limited",
      setGameTimeMode: jest.fn()
    });

    expect(unlimitedTimeButton).toHaveAttribute("aria-checked", "false");
    expect(limitedTimeButton).toHaveAttribute("aria-checked", "true");

    expect(screen.getByTestId("timePicker")).toBeInTheDocument();
    expect(screen.getByTestId("slider")).toBeInTheDocument();
  });
});

it("sets the time mode", async () => {
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
