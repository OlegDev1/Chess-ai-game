import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import GameSettings from "../components/GameSettings/GameSettings";

jest.mock("react-router-dom");

beforeEach(() => render(<GameSettings />));

describe("Change the modes", () => {
  it("Change settings modes", async () => {
    const buttonPlayAi = screen.getByText("Play with AI");
    await userEvent.click(buttonPlayAi);
    expect(buttonPlayAi).toHaveClass("selected");

    const buttonPlayFriend = screen.getByText("Play with a friend");
    await userEvent.click(buttonPlayFriend);
    expect(buttonPlayFriend).toHaveClass("selected");
  });

  it("Change game time modes", async () => {
    const buttonUnlimited = screen.getByText("Unlimited");
    await userEvent.click(buttonUnlimited);
    expect(buttonUnlimited).toHaveClass("selected");

    const buttonLimited = screen.getByText("Limited");
    await userEvent.click(buttonLimited);
    expect(buttonLimited).toHaveClass("selected");
  });
});

describe("Components depending on the mode", () => {
  it("Time picker, when the time is limited", async () => {
    const buttonLimited = screen.getByText("Limited");
    await userEvent.click(buttonLimited);
    expect(screen.queryByText("10 min")).toBeInTheDocument();
  });

  it("Strength in AI mode", async () => {
    const buttonPlayAi = screen.getByText("Play with AI");
    await userEvent.click(buttonPlayAi);
    expect(screen.queryByText("Strength")).toBeInTheDocument();
  });

  it("No strength in Friend mode", async () => {
    const buttonPlayFriend = screen.getByText("Play with a friend");
    await userEvent.click(buttonPlayFriend);
    expect(screen.queryByText("Strength")).not.toBeInTheDocument();
  });
});

describe("Individual components", () => {
  it("Change the time with a slider", async () => {
    const sliderPointerText = screen.getByTestId("sliderPointerText");
    const timeVarinatButtons = screen.getByTestId("timePicker").children;
    for (const button of timeVarinatButtons) {
      await userEvent.click(button);
      if (button.textContent) {
        expect(sliderPointerText).toHaveTextContent(button.textContent);
      } else {
        throw new Error("Button textContent is null");
      }
    }
  });

  it("Change the strength", async () => {
    const strengthButtons = screen.getByTestId("strengthPicker").children;
    for (const button of strengthButtons) {
      await userEvent.click(button);
      expect(button).toHaveClass("selected");
    }
  });

  it("Change the side", async () => {
    const sideButtons = screen.getByTestId("sidePicker").children;
    for (const button of sideButtons) {
      await userEvent.click(button);
      expect(button).toHaveClass("selected");
    }
  });
});
