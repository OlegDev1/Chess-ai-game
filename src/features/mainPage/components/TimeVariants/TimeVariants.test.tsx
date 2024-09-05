import userEvent from "@testing-library/user-event";
import TimeVariants from "./TimeVariants";
import { render, screen } from "@testing-library/react";

const timeVariants = [10, 15, 20, 25, 30, 40, 50, 60, 70, 85];

it("Buttons set the limited time", async () => {
  const mockSetLimitedGameMinutes = jest.fn();

  render(<TimeVariants setLimitedGameMinutes={mockSetLimitedGameMinutes} />);
  const timeVariantsButtons = screen.getByTestId("timePicker");

  for (let i = 0; i < timeVariants.length; i++) {
    const button = timeVariantsButtons.children[i];

    await userEvent.click(button);
    expect(mockSetLimitedGameMinutes).toHaveBeenLastCalledWith(timeVariants[i]);
  }
});
