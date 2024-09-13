import { render, screen } from "@testing-library/react";
import GameSettings from "./GameSettings";
import userEvent from "@testing-library/user-event";
import * as apiClient from "@utils/apiClient.ts";
import * as router from "react-router";
import { AxiosResponse } from "axios";
import { CREATE_GAME_PATH, APP_PLAY_PATH } from "../../../../app.constants.ts";

const mockApiPostRequest = jest.fn(() => Promise.resolve({ data: { id: "2" } } as AxiosResponse));
const mockRouterNavigate = jest.fn();
jest.spyOn(router, "useNavigate").mockImplementation(() => mockRouterNavigate);
jest.spyOn(apiClient, "apiPostRequest").mockImplementation(mockApiPostRequest);

beforeEach(() => {
  mockApiPostRequest.mockClear();
  mockRouterNavigate.mockClear();
  render(<GameSettings />);
});

it("Start a game with default options", async () => {
  await userEvent.click(screen.getByTestId("startGame-button"));

  expect(mockApiPostRequest).toHaveBeenCalledTimes(1);
  expect(mockRouterNavigate).toHaveBeenCalledTimes(1);

  expect(mockApiPostRequest).toHaveBeenCalledWith(
    CREATE_GAME_PATH,
    new URLSearchParams({
      level: "1",
      color: "random",
      variant: "standard",
      "clock.limit": "900",
      "clock.increment": "1"
    })
  );
  expect(mockRouterNavigate).toHaveBeenCalledWith(APP_PLAY_PATH({ gameId: "2" }));
});

it("Start a game with unlimited time", async () => {
  await userEvent.click(screen.getByTestId("unlimitedTime-button"));
  await userEvent.click(screen.getByTestId("startGame-button"));

  expect(mockApiPostRequest).toHaveBeenCalledTimes(1);
  expect(mockRouterNavigate).toHaveBeenCalledTimes(1);

  expect(mockApiPostRequest).toHaveBeenCalledWith(
    CREATE_GAME_PATH,
    new URLSearchParams({
      level: "1",
      color: "random",
      variant: "standard"
    })
  );
  expect(mockRouterNavigate).toHaveBeenCalledWith(APP_PLAY_PATH({ gameId: "2" }));
});
