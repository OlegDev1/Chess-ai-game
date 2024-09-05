import { render, screen } from "@testing-library/react";
import SidePicker from "./SidePicker";
import userEvent from "@testing-library/user-event";
import { Side } from "@features/mainPage/types/side.types";

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

it("White side is selected", () => {
  const { whiteSideButton, randomSideButton, blackSideButton } = setup({
    side: "white",
    setSide: jest.fn()
  });

  expect(whiteSideButton.className).toContain("selected");
  expect(randomSideButton.className).not.toContain("selected");
  expect(blackSideButton.className).not.toContain("selected");
});

it("Random side is selected", () => {
  const { whiteSideButton, randomSideButton, blackSideButton } = setup({
    side: "random",
    setSide: jest.fn()
  });

  expect(whiteSideButton.className).not.toContain("selected");
  expect(randomSideButton.className).toContain("selected");
  expect(blackSideButton.className).not.toContain("selected");
});

it("Black side is selected", () => {
  const { whiteSideButton, randomSideButton, blackSideButton } = setup({
    side: "black",
    setSide: jest.fn()
  });

  expect(whiteSideButton.className).not.toContain("selected");
  expect(randomSideButton.className).not.toContain("selected");
  expect(blackSideButton.className).toContain("selected");
});

it("Buttons set the side", async () => {
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
