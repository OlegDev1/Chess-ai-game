import userEvent from "@testing-library/user-event";
import TimeVariants from "./TimeVariants";
import { render, screen } from "@testing-library/react";

const timeVariants = [10, 15, 20, 25, 30, 40, 50, 60, 70, 85];

test.each(timeVariants)("highlights time variant %i, when it is selected", (timeVariant) => {
  render(<TimeVariants limitedGameMinutes={timeVariant} setLimitedGameMinutes={jest.fn()} />);

  for (let i = 0; i < timeVariants.length; i++) {
    const button = screen.getByTestId("timePicker").children[i];
    if (!button.textContent) throw new Error("Time variant button does not have text content");

    if (button.textContent.includes(String(timeVariant))) {
      expect(button).toHaveAttribute("aria-checked", "true");
    } else {
      expect(button).toHaveAttribute("aria-checked", "false");
    }
  }
});

it("sets the limited time", async () => {
  const mockSetLimitedGameMinutes = jest.fn();

  render(
    <TimeVariants limitedGameMinutes={20} setLimitedGameMinutes={mockSetLimitedGameMinutes} />
  );
  const timeVariantsButtons = screen.getByTestId("timePicker");

  for (let i = 0; i < timeVariants.length; i++) {
    const button = timeVariantsButtons.children[i];

    await userEvent.click(button);

    expect(mockSetLimitedGameMinutes).toHaveBeenLastCalledWith(timeVariants[i]);
  }
});
