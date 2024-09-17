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
  expect(screen.getByTestId("timerName-white")).toHaveAttribute(
    "aria-checked",
    side === "white" ? "true" : "false"
  );
  expect(screen.getByTestId("timerTime-white")).toHaveAttribute(
    "aria-checked",
    side === "white" ? "true" : "false"
  );
  expect(screen.getByTestId("timerName-black")).toHaveAttribute(
    "aria-checked",
    side === "black" ? "true" : "false"
  );
  expect(screen.getByTestId("timerTime-black")).toHaveAttribute(
    "aria-checked",
    side === "black" ? "true" : "false"
  );
}

it("rendering with default values", () => {
  render(
    <Timer
      time={{ white: 0, black: 0 }}
      moves=""
      gameData={{
        gameStatus: "started",
        currentSide: "white",
        playerSide: "white",
        aiStrength: 1,
        boardOrientation: "white"
      }}
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

it("rendering when white player has 32 seconds, black bot has 11 minutes and 12 seconds", () => {
  render(
    <Timer
      time={{ white: 32 * 1000, black: (60 * 11 + 12) * 1000 }}
      moves=""
      gameData={{
        gameStatus: "started",
        currentSide: "black",
        playerSide: "white",
        aiStrength: 5,
        boardOrientation: "white"
      }}
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

it("rendering when white player has 40 seconds, white bot has 2 minutes", () => {
  render(
    <Timer
      time={{ white: 40 * 1000, black: 60 * 2 * 1000 }}
      moves=""
      gameData={{
        gameStatus: "started",
        currentSide: "white",
        playerSide: "white",
        aiStrength: 1,
        boardOrientation: "white"
      }}
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

it("rendering when black player has 0 seconds, white bot has 0 seconds", () => {
  render(
    <Timer
      time={{ white: 0, black: 0 }}
      moves=""
      gameData={{
        gameStatus: "started",
        currentSide: "white",
        playerSide: "black",
        aiStrength: 2,
        boardOrientation: "white"
      }}
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

it("rendering when black player has 2 minutes and 28 seconds, white bot has 10 minutes and 9 seconds, there is a move", () => {
  render(
    <Timer
      time={{ white: (60 * 10 + 9) * 1000, black: (60 * 2 + 28) * 1000 }}
      moves="d2d3"
      gameData={{
        gameStatus: "started",
        currentSide: "black",
        playerSide: "black",
        aiStrength: 8,
        boardOrientation: "white"
      }}
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

it("rendering when white player has unlimited time, black bot has unlimited time", () => {
  render(
    <Timer
      time={{ white: "unlimited", black: "unlimited" }}
      moves=""
      gameData={{
        gameStatus: "started",
        currentSide: "white",
        playerSide: "white",
        aiStrength: 1,
        boardOrientation: "white"
      }}
    />
  );

  checkTimerDisplay({ timerMode: "unlimited", whiteName: "YOU", blackName: "AI BOT LEVEL 1" });

  checkTimerSelected("white");
});

it("rendering when black player has unlimited time, white bot has unlimited time", () => {
  render(
    <Timer
      time={{ white: "unlimited", black: "unlimited" }}
      moves=""
      gameData={{
        gameStatus: "started",
        currentSide: "white",
        playerSide: "black",
        aiStrength: 1,
        boardOrientation: "white"
      }}
    />
  );

  checkTimerDisplay({ timerMode: "unlimited", whiteName: "AI BOT LEVEL 1", blackName: "YOU" });

  checkTimerSelected("white");
});

it("rendering white timer at the bottom and black at the top, when the board orientation is white", () => {
  render(
    <Timer
      time={{ white: 0, black: 0 }}
      moves=""
      gameData={{
        gameStatus: "started",
        currentSide: "white",
        playerSide: "white",
        aiStrength: 1,
        boardOrientation: "white"
      }}
    />
  );

  const whiteTimer = screen.getByTestId("timer-white");
  const blackTimer = screen.getByTestId("timer-black");

  expect(whiteTimer.className).toContain("bottom");
  expect(blackTimer.className).toContain("top");
});

it("rendering white timer at the top and black at the bottom, when the board orientation is black", () => {
  render(
    <Timer
      time={{ white: 0, black: 0 }}
      moves=""
      gameData={{
        gameStatus: "started",
        currentSide: "white",
        playerSide: "white",
        aiStrength: 1,
        boardOrientation: "black"
      }}
    />
  );

  const whiteTimer = screen.getByTestId("timer-white");
  const blackTimer = screen.getByTestId("timer-black");

  expect(whiteTimer.className).toContain("top");
  expect(blackTimer.className).toContain("bottom");
});
