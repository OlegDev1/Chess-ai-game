import formatTime from "../utils/formatTime";

it("formats ms to mm:ss", () => {
  expect(formatTime(150000)).toBe("02:30");
  expect(formatTime(300000)).toBe("05:00");
});

it("fomats ms to 00:00, when ms is 0 or less", () => {
  expect(formatTime(0)).toBe("00:00");
  expect(formatTime(-2000)).toBe("00:00");
});
