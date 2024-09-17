import { Chess, Move } from "chess.js";
import playMoveOrCaptureSound from "../utils/playMoveOrCaptureSound";

jest.mock("../../../public/Capture.ogg", () => "mockCapture.ogg");
jest.mock("../../../public/Move.ogg", () => "mockMove.ogg");

const mockPlay = jest.fn(() => Promise.resolve());
const mockAudio = jest.fn().mockImplementation(() => ({
  play: mockPlay
}));
global.Audio = mockAudio;

const consoleSpy = jest.spyOn(console, "error").mockImplementation();

type setupProps = { hasMoves: boolean; moveIsCapture: boolean };
function setup({ hasMoves, moveIsCapture }: setupProps) {
  const chess = new Chess();
  const moveObj = moveIsCapture
    ? { from: "a2", to: "a3", captured: "p" }
    : { from: "a2", to: "a3" };

  if (hasMoves) {
    jest.spyOn(chess, "history").mockReturnValueOnce([moveObj as Move]);
  } else {
    jest.spyOn(chess, "history").mockReturnValueOnce([]);
  }

  return chess;
}

beforeEach(() => {
  jest.clearAllMocks();
});

it("does not play a sound, when there are no moves", async () => {
  const chess = setup({ hasMoves: false, moveIsCapture: false });

  await playMoveOrCaptureSound(chess);

  expect(mockAudio).not.toHaveBeenCalled();
  expect(mockPlay).not.toHaveBeenCalled();
  expect(consoleSpy).not.toHaveBeenCalled();
});

describe.each([
  ["move", "mockMove.ogg", false],
  ["capture", "mockCapture.ogg", true]
])("play sounds and handle errors", (action, movePath, moveIsCapture) => {
  it(`plays ${action} sound, when there is ${action}`, async () => {
    const chess = setup({ hasMoves: true, moveIsCapture: moveIsCapture });

    await playMoveOrCaptureSound(chess);

    expect(mockAudio).toHaveBeenCalledWith(movePath);
    expect(mockPlay).toHaveBeenCalledTimes(1);
    expect(consoleSpy).not.toHaveBeenCalled();
  });

  it(`handles an error, when playing ${action} sound`, async () => {
    const chess = setup({ hasMoves: true, moveIsCapture: moveIsCapture });
    mockPlay.mockImplementationOnce(() =>
      Promise.reject(new Error(`Can not play ${action} sound`))
    );

    await playMoveOrCaptureSound(chess);

    expect(mockAudio).toHaveBeenCalledWith(movePath);
    expect(mockPlay).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledTimes(1);
  });
});
