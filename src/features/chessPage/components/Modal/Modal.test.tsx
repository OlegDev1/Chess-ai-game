import { render, screen } from "@testing-library/react";
import Modal from "./Modal";
import * as router from "react-router";
import { GameDataType } from "@features/chessPage/types/GameDataType.types";
import { GameStatus } from "@features/chessPage/types/GameStatus.types";
import userEvent from "@testing-library/user-event";

const mockRouterNavigate = jest.fn();
jest.spyOn(router, "useNavigate").mockImplementation(() => mockRouterNavigate);

type setupProps = {
  gameStatus: GameStatus;
  setGameData: React.Dispatch<React.SetStateAction<GameDataType>>;
  winner?: "white" | "black";
};
function setup({ gameStatus, setGameData, winner }: setupProps) {
  render(
    <Modal
      gameData={{
        gameStatus: gameStatus,
        playerSide: "white",
        currentSide: "white",
        boardOrientation: "white",
        aiStrength: 1,
        winner: winner
      }}
      setGameData={setGameData}
    />
  );
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe("rendering", () => {
  it("does not render the Modal, when the game is in progress", () => {
    setup({ gameStatus: "started", setGameData: jest.fn() });

    expect(screen.queryByTestId("chessboardModal")).not.toBeInTheDocument();
  });

  it("renders the Modal, when the game is over", () => {
    setup({ gameStatus: "mate", setGameData: jest.fn() });

    expect(screen.queryByTestId("chessboardModal")).toBeInTheDocument();
  });
});

describe("winner display", () => {
  it("displays 'Black' as the winner, when the black side wins", () => {
    setup({ gameStatus: "mate", setGameData: jest.fn(), winner: "black" });

    expect(screen.getByTestId("modalWinner")).toHaveTextContent("Black");
  });

  it("displays 'White' as the winner, when the white side wins", () => {
    setup({ gameStatus: "mate", setGameData: jest.fn(), winner: "white" });

    expect(screen.getByTestId("modalWinner")).toHaveTextContent("White");
  });

  it("displays 'Nobody' as the winner, when nobody wins", () => {
    setup({ gameStatus: "mate", setGameData: jest.fn() });

    expect(screen.getByTestId("modalWinner")).toHaveTextContent("Nobody");
  });
});

describe("win reason display", () => {
  it("displays 'Checkmate', when the game is finished with checkmate", () => {
    setup({ gameStatus: "mate", setGameData: jest.fn() });

    expect(screen.getByTestId("modalReason")).toHaveTextContent("checkmate");
  });

  it("displays 'Timeout', when the time is over", () => {
    setup({ gameStatus: "outoftime", setGameData: jest.fn() });

    expect(screen.getByTestId("modalReason")).toHaveTextContent("timeout");
  });

  it("displays the game ending reason based on the game status", () => {
    setup({ gameStatus: "stalemate", setGameData: jest.fn() });

    expect(screen.getByTestId("modalReason")).toHaveTextContent("stalemate");
  });
});

describe("closing and redirecting", () => {
  it("closes the model, when clicking outside of it", async () => {
    const mockSetGameData = jest.fn();
    setup({ gameStatus: "mate", setGameData: mockSetGameData });

    const modalBackground = screen.getByTestId("chessboardModalBackground");
    await userEvent.click(modalBackground);

    expect(mockSetGameData).toHaveBeenCalledTimes(1);
  });

  it("closes the model, when clicking on the close button", async () => {
    const mockSetGameData = jest.fn();
    setup({ gameStatus: "mate", setGameData: mockSetGameData });

    const closeButton = screen.getByTestId("modalCloseButton");
    await userEvent.click(closeButton);

    expect(mockSetGameData).toHaveBeenCalledTimes(1);
  });

  it("redirects to home page, when clicking on back button", async () => {
    setup({ gameStatus: "mate", setGameData: jest.fn() });

    const backButton = screen.getByTestId("modalBackButton");
    await userEvent.click(backButton);

    expect(mockRouterNavigate).toHaveBeenCalledTimes(1);
    expect(mockRouterNavigate).toHaveBeenCalledWith("/");
  });
});
