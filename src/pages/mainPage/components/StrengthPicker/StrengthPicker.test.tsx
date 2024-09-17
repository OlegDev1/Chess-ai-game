import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import StrengthPicker from "./StrengthPicker";
import { Strength } from "@pages/mainPage/types/Strength.types";

const strengthVariants = [1, 2, 3, 4, 5, 6, 7, 8] as Strength[];

test.each(strengthVariants)("highlights strength %i, when it is selected", (strength) => {
  render(<StrengthPicker strength={strength} setStrength={jest.fn()} />);

  for (const i of strengthVariants) {
    const button = screen.getByTestId("strengthPicker").children[i - 1];

    if (i === strength) {
      expect(button).toHaveAttribute("aria-checked", "true");
    } else {
      expect(button).toHaveAttribute("aria-checked", "false");
    }
  }
});

it("sets the strength", async () => {
  const mockSetStrength = jest.fn();
  render(<StrengthPicker strength={1} setStrength={mockSetStrength} />);

  for (const i of strengthVariants) {
    const button = screen.getByTestId("strengthPicker").children[i - 1];

    await userEvent.click(button);
    expect(mockSetStrength).toHaveBeenLastCalledWith(i);
  }
});
