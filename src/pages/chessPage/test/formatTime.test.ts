import formatTime from "../utils/formatTime";

it("Should return 2 minutes and 30 seconds", () => {
  expect(formatTime(150000)).toBe("02:30");
});
it("Should return 5 minutes", () => {
  expect(formatTime(300000)).toBe("05:00");
});
it("Should return 0 minutes", () => {
  expect(formatTime(0)).toBe("00:00");
  expect(formatTime(-2000)).toBe("00:00");
});
