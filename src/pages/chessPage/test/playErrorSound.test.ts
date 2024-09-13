import playErrorSound from "../utils/playErrorSound";

jest.mock("../../../public/Error.ogg", () => "mockError.ogg");

const mockPlay = jest.fn(() => Promise.resolve());
global.Audio = jest.fn().mockImplementation(() => ({
  play: mockPlay
}));

const consoleSpy = jest.spyOn(console, "error").mockImplementation();

beforeEach(() => {
  jest.clearAllMocks();
});

it("Play an error sound", async () => {
  await playErrorSound();

  expect(mockPlay).toHaveBeenCalledTimes(1);
  expect(consoleSpy).not.toHaveBeenCalled();
});

it("Handle an error when playing an error sound", async () => {
  mockPlay.mockImplementationOnce(() => Promise.reject(new Error("Can not play an error sound")));

  await playErrorSound();

  expect(mockPlay).toHaveBeenCalledTimes(1);
  expect(consoleSpy).toHaveBeenCalledTimes(1);
});
