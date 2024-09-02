import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Timer from "./Timer";
type checkTimerDisplayProps =
  | {
      timerMode: "limited";
      whiteName: string;
      whiteTime: string;
      blackName: string;
      blackTime: string;
    }
  | { timerMode: "unlimited"; whiteName: string; blackName: string };

function checkTimerDisplay(props: checkTimerDisplayProps) {
  const { timerMode, whiteName, blackName } = props;

  expect(screen.getByTestId("timerName-white").textContent).toBe(whiteName);
  expect(screen.getByTestId("timerName-black").textContent).toBe(blackName);

  if (timerMode === "limited") {
    const { whiteTime, blackTime } = props;
    expect(screen.getByTestId("timerTime-white").textContent).toBe(whiteTime);
    expect(screen.getByTestId("timerTime-black").textContent).toBe(blackTime);
  } else {
    expect(screen.getAllByTestId("infinitySVG")).toHaveLength(2);
  }
}
function checkTimerSelected(side: "white" | "black") {
  if (side === "white") {
    expect(screen.getByTestId("timerName-white")).toHaveClass("selected");
    expect(screen.getByTestId("timerTime-white")).toHaveClass("selected");
    expect(screen.getByTestId("timerName-black")).not.toHaveClass("selected");
    expect(screen.getByTestId("timerTime-black")).not.toHaveClass("selected");
  } else {
    expect(screen.getByTestId("timerName-white")).not.toHaveClass("selected");
    expect(screen.getByTestId("timerTime-white")).not.toHaveClass("selected");
    expect(screen.getByTestId("timerName-black")).toHaveClass("selected");
    expect(screen.getByTestId("timerTime-black")).toHaveClass("selected");
  }
}

it("Default values", () => {
  render(
    <Timer
      time={{ white: 0, black: 0 }}
      moves=""
      gameData={{ currentSide: "white", playerSide: "white", aiStrength: 1 }}
    />
  );

  checkTimerDisplay({
    timerMode: "limited",
    whiteName: "YOU",
    whiteTime: "00:00",
    blackName: "AI BOT LEVEL 1",
    blackTime: "00:00"
  });

  checkTimerSelected("white");
});

it("Player (white) has 32 seconds. Bot level 5 (black, current) has 11 minutes and 12 seconds", () => {
  render(
    <Timer
      time={{ white: 32 * 1000, black: (60 * 11 + 12) * 1000 }}
      moves=""
      gameData={{ currentSide: "black", playerSide: "white", aiStrength: 5 }}
    />
  );

  checkTimerDisplay({
    timerMode: "limited",
    whiteName: "YOU",
    whiteTime: "00:32",
    blackName: "AI BOT LEVEL 5",
    blackTime: "11:12"
  });

  checkTimerSelected("black");
});

it("Player (white, current) has 40 seconds. Bot level 1 (black) has 2 minutes", () => {
  render(
    <Timer
      time={{ white: 40 * 1000, black: 60 * 2 * 1000 }}
      moves=""
      gameData={{ currentSide: "white", playerSide: "white", aiStrength: 1 }}
    />
  );

  checkTimerDisplay({
    timerMode: "limited",
    whiteName: "YOU",
    whiteTime: "00:40",
    blackName: "AI BOT LEVEL 1",
    blackTime: "02:00"
  });

  checkTimerSelected("white");
});

it("Player (black) has 0 seconds. Bot level 2 (white, current) has 0 seconds", () => {
  render(
    <Timer
      time={{ white: 0, black: 0 }}
      moves=""
      gameData={{ currentSide: "white", playerSide: "black", aiStrength: 2 }}
    />
  );

  checkTimerDisplay({
    timerMode: "limited",
    whiteName: "AI BOT LEVEL 2",
    whiteTime: "00:00",
    blackName: "YOU",
    blackTime: "00:00"
  });

  checkTimerSelected("white");
});

it("Player (black, current) has 2 minutes and 28 seconds. Bot level 8 (white) has 10 minutes and 9 seconds. There is one move", () => {
  render(
    <Timer
      time={{ white: (60 * 10 + 9) * 1000, black: (60 * 2 + 28) * 1000 }}
      moves="d2d3"
      gameData={{ currentSide: "black", playerSide: "black", aiStrength: 8 }}
    />
  );

  checkTimerDisplay({
    timerMode: "limited",
    whiteName: "AI BOT LEVEL 8",
    whiteTime: "10:09",
    blackName: "YOU",
    blackTime: "02:28"
  });

  checkTimerSelected("black");
});

it("Player (white, current) has unlimited time. Bot level 1 (black) has unlimited time", () => {
  render(
    <Timer
      time={{ white: "unlimited", black: "unlimited" }}
      moves=""
      gameData={{ currentSide: "white", playerSide: "white", aiStrength: 1 }}
    />
  );

  checkTimerDisplay({ timerMode: "unlimited", whiteName: "YOU", blackName: "AI BOT LEVEL 1" });

  checkTimerSelected("white");
});

it("Player (black) has unlimited time. Bot level 1 (white, current) has unlimited time", () => {
  render(
    <Timer
      time={{ white: "unlimited", black: "unlimited" }}
      moves=""
      gameData={{ currentSide: "white", playerSide: "black", aiStrength: 1 }}
    />
  );

  checkTimerDisplay({ timerMode: "unlimited", whiteName: "AI BOT LEVEL 1", blackName: "YOU" });

  checkTimerSelected("white");
});
