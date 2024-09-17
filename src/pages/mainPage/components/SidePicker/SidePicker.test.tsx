import { render, screen } from "@testing-library/react";
import SidePicker from "./SidePicker";
import userEvent from "@testing-library/user-event";
import { Side } from "@pages/mainPage/types/Side.types";

type setupProps = {
  side: Side;
  setSide: React.Dispatch<React.SetStateAction<Side>>;
};
function setup({ side, setSide }: setupProps) {
  render(<SidePicker side={side} setSide={setSide} />);

  const whiteSideButton = screen.getByTestId("sidePicker").children[0];
  const randomSideButton = screen.getByTestId("sidePicker").children[1];
  const blackSideButton = screen.getByTestId("sidePicker").children[2];

  return { whiteSideButton, randomSideButton, blackSideButton };
}

describe("chosen side display", () => {
  it("highlights white side, when it is selected", () => {
    const { whiteSideButton, randomSideButton, blackSideButton } = setup({
      side: "white",
      setSide: jest.fn()
    });

    expect(whiteSideButton).toHaveAttribute("aria-checked", "true");
    expect(randomSideButton).toHaveAttribute("aria-checked", "false");
    expect(blackSideButton).toHaveAttribute("aria-checked", "false");
  });

  it("highlights random side, when it is selected", () => {
    const { whiteSideButton, randomSideButton, blackSideButton } = setup({
      side: "random",
      setSide: jest.fn()
    });

    expect(whiteSideButton).toHaveAttribute("aria-checked", "false");
    expect(randomSideButton).toHaveAttribute("aria-checked", "true");
    expect(blackSideButton).toHaveAttribute("aria-checked", "false");
  });

  it("highlights black side, when it is selected", () => {
    const { whiteSideButton, randomSideButton, blackSideButton } = setup({
      side: "black",
      setSide: jest.fn()
    });

    expect(whiteSideButton).toHaveAttribute("aria-checked", "false");
    expect(randomSideButton).toHaveAttribute("aria-checked", "false");
    expect(blackSideButton).toHaveAttribute("aria-checked", "true");
  });
});

it("sets the side", async () => {
  const mockSetSide = jest.fn();
  const { whiteSideButton, randomSideButton, blackSideButton } = setup({
    side: "white",
    setSide: mockSetSide
  });

  await userEvent.click(whiteSideButton);
  expect(mockSetSide).toHaveBeenLastCalledWith("white");
  await userEvent.click(randomSideButton);
  expect(mockSetSide).toHaveBeenLastCalledWith("random");
  await userEvent.click(blackSideButton);
  expect(mockSetSide).toHaveBeenLastCalledWith("black");
});
