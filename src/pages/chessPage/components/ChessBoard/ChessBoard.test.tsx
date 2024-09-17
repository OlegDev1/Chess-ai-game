import { render } from "@testing-library/react";
import ChessBoard from "./ChessBoard";
import React from "react";
import {
  PromotionPieceOption,
  Piece,
  Square,
  ChessboardProps
} from "react-chessboard/dist/chessboard/types";
import * as apiClient from "@utils/apiClient.ts";

/* The FEN (Forsyth-Edwards Notation) string representing
the starting position of the chessboard */
const chessBoardFEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const mockChessboard = jest.fn();

jest.mock("../../hooks/useStreamGame");
jest.mock("@pages/chessPage/utils/playMoveOrCaptureSound", () => jest.fn());
jest.mock("@pages/chessPage/utils/playErrorSound", () => jest.fn());
jest.mock("react-chessboard", () => ({
  Chessboard: (props: ChessboardProps) => {
    mockChessboard(props);
    return <></>;
  }
}));
jest.spyOn(apiClient, "apiPostRequest").mockImplementation(jest.fn());

describe("onSquareClick event handler", () => {
  let func: (sqaure: Square) => boolean;

  beforeEach(() => {
    jest
      .spyOn(React, "useState")
      .mockImplementationOnce(() => [chessBoardFEN, jest.fn()]) // Mock chessBoardFEN state
      .mockImplementationOnce(() => [{ b2: "", b3: "", b4: "", b5: "" }, jest.fn()]) // Mock possibleMoves state
      .mockImplementationOnce(() => [{}, jest.fn()]) // Mock isCheckStyle state
      .mockImplementationOnce(() => [{}, jest.fn()]); // Mock lastMoveStyle state

    render(
      <ChessBoard
        gameId=""
        gameData={{
          gameStatus: "started",
          playerSide: "white",
          currentSide: "white",
          aiStrength: 1,
          boardOrientation: "white"
        }}
        setTime={jest.fn()}
        setGameData={jest.fn()}
        setMoves={jest.fn()}
      />
    );
    func = mockChessboard.mock.calls[0][0].onSquareClick;
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("there are possible moves from the given position", () => {
    //a2 have possible moves on starting position
    expect(func("a2")).toBe(true);
  });
  it("there are no possible moves from the given position", () => {
    //a1 does not have possible moves on starting position
    expect(func("a1")).toBe(false);
  });
  it("possible move leads to a move", () => {
    //move from b2 to b3 is possible
    expect(func("b3")).toBe(true);
  });
  it("possible move leads to an error", () => {
    /* move from b2 to b5 is not possible,
    the possibleMoves state is incorrect intentionally for this test */
    expect(func("b5")).toBe(false);
  });
});

describe("onPieceDragBegin event handler", () => {
  let func: (_piece: Piece, sourceSquare: Square) => boolean;

  beforeEach(() => {
    jest
      .spyOn(React, "useState")
      .mockImplementationOnce(() => [chessBoardFEN, jest.fn()]) // Mock chessBoardFEN state
      .mockImplementationOnce(() => [{}, jest.fn()]) // Mock possibleMoves state
      .mockImplementationOnce(() => [{}, jest.fn()]) // Mock isCheckStyle state
      .mockImplementationOnce(() => [{}, jest.fn()]); // Mock lastMoveStyle state

    render(
      <ChessBoard
        gameId=""
        gameData={{
          gameStatus: "started",
          playerSide: "white",
          currentSide: "white",
          aiStrength: 1,
          boardOrientation: "white"
        }}
        setTime={jest.fn()}
        setGameData={jest.fn()}
        setMoves={jest.fn()}
      />
    );
    func = mockChessboard.mock.calls[0][0].onPieceDragBegin;
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("there are possible moves from the given position", () => {
    //a2 have possible moves on starting position
    expect(func("wP", "a2")).toBe(true);
  });
  it("there are no possible moves from the given position", () => {
    //a1 does not have possible moves on starting position
    expect(func("wR", "a1")).toBe(false);
  });
});

describe("onPieceDrop event handler", () => {
  let func: (sourceSquare: Square, targetSquare: Square) => boolean;

  beforeEach(() => {
    jest
      .spyOn(React, "useState")
      .mockImplementationOnce(() => [chessBoardFEN, jest.fn()]) // Mock chessBoardFEN state
      .mockImplementationOnce(() => [{}, jest.fn()]) // Mock possibleMoves state
      .mockImplementationOnce(() => [{}, jest.fn()]) // Mock isCheckStyle state
      .mockImplementationOnce(() => [{}, jest.fn()]); // Mock lastMoveStyle state

    render(
      <ChessBoard
        gameId=""
        gameData={{
          gameStatus: "started",
          playerSide: "white",
          currentSide: "white",
          aiStrength: 1,
          boardOrientation: "white"
        }}
        setTime={jest.fn()}
        setGameData={jest.fn()}
        setMoves={jest.fn()}
      />
    );
    func = mockChessboard.mock.calls[0][0].onPieceDrop;
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("move is successful", () => {
    //move from a2 to a3 is possible
    expect(func("a2", "a3")).toBe(true);
  });
  it("move is unsuccessful", () => {
    //move from a2 to a5 is not possible
    expect(func("a2", "a5")).toBe(false);
  });
});

describe("onPromotionCheck event handler", () => {
  /* The FEN (Forsyth-Edwards Notation) string representing
  the state of the chessboard where promotion is possible */
  const chessBoardFEN = "rnbqkbnr/1Ppppppp/p7/8/8/8/P1PPPPPP/RNBQKBNR w KQkq - 0 1";
  let func: (sourceSquare: Square, targetSquare: Square) => boolean;

  beforeEach(() => {
    jest
      .spyOn(React, "useState")
      .mockImplementationOnce(() => [chessBoardFEN, jest.fn()]) // Mock chessBoardFEN state
      .mockImplementationOnce(() => [{ b7: "", a8: "", c8: "" }, jest.fn()]) // Mock possibleMoves state
      .mockImplementationOnce(() => [{}, jest.fn()]) // Mock isCheckStyle state
      .mockImplementationOnce(() => [{}, jest.fn()]); // Mock lastMoveStyle state

    render(
      <ChessBoard
        gameId=""
        gameData={{
          gameStatus: "started",
          playerSide: "white",
          currentSide: "white",
          aiStrength: 1,
          boardOrientation: "white"
        }}
        setTime={jest.fn()}
        setGameData={jest.fn()}
        setMoves={jest.fn()}
      />
    );
    func = mockChessboard.mock.calls[0][0].onPromotionCheck;
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("promotion is possible", () => {
    //promotion of a pawn from b7 to c8 is possible
    expect(func("b7", "c8")).toBe(true);
  });
  it("promotion is not possible", () => {
    //promotion of a pawn from b7 to d8 is not possible
    expect(func("b7", "d8")).toBe(false);
  });
});

describe("onPromotionPieceSelect event handler", () => {
  /* The FEN (Forsyth-Edwards Notation) string representing
  the state of the chessboard where promotion is possible */
  const chessBoardFEN = "rnbqkbnr/1Ppppppp/p7/8/8/8/P1PPPPPP/RNBQKBNR w KQkq - 0 1";
  let func: (
    piece?: PromotionPieceOption,
    promoteFromSquare?: Square,
    promoteToSquare?: Square
  ) => boolean;

  beforeEach(() => {
    jest
      .spyOn(React, "useState")
      .mockImplementationOnce(() => [chessBoardFEN, jest.fn()]) // Mock chessBoardFEN state
      .mockImplementationOnce(() => [{ b7: "", a8: "", c8: "" }, jest.fn()]) // Mock possibleMoves state
      .mockImplementationOnce(() => [{}, jest.fn()]) // Mock isCheckStyle state
      .mockImplementationOnce(() => [{}, jest.fn()]); // Mock lastMoveStyle state

    render(
      <ChessBoard
        gameId=""
        gameData={{
          gameStatus: "started",
          playerSide: "white",
          currentSide: "white",
          aiStrength: 1,
          boardOrientation: "white"
        }}
        setTime={jest.fn()}
        setGameData={jest.fn()}
        setMoves={jest.fn()}
      />
    );
    func = mockChessboard.mock.calls[0][0].onPromotionPieceSelect;
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("promotion move is successful", () => {
    /* Promotion of a pawn to a queen from b7 to c8,
    it is possible with a given chessBoardFEN*/
    expect(func("wQ", "b7", "c8")).toBe(true);
  });
  it("promotion move is unsuccessful", () => {
    /* Promotion of a pawn to a queen from b7 to d8,
    it is not possible with a given chessBoardFEN*/
    expect(func("wQ", "b7", "d8")).toBe(false);
  });
  it("any argument is missing", () => {
    expect(func(undefined, undefined, undefined)).toBe(false);
    expect(func("wQ", undefined, undefined)).toBe(false);
    expect(func("wQ", "b7", undefined)).toBe(false);
    expect(func("wQ", undefined, "c8")).toBe(false);
    expect(func(undefined, "b7", "c8")).toBe(false);
  });
});

describe("onSquareClick, onPieceDragBegin, onPieceDrop event handlers. When playerSide is not equal to currentSide", () => {
  beforeEach(() => {
    jest
      .spyOn(React, "useState")
      .mockImplementationOnce(() => [chessBoardFEN, jest.fn()]) // Mock chessBoardFEN state
      .mockImplementationOnce(() => [{}, jest.fn()]) // Mock possibleMoves state
      .mockImplementationOnce(() => [{}, jest.fn()]) // Mock isCheckStyle state
      .mockImplementationOnce(() => [{}, jest.fn()]); // Mock lastMoveStyle state
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("onSquareClick, there are no possible moves, because it's not the player's turn", () => {
    render(
      <ChessBoard
        gameId=""
        gameData={{
          gameStatus: "started",
          playerSide: "white",
          currentSide: "black",
          aiStrength: 1,
          boardOrientation: "white"
        }}
        setTime={jest.fn()}
        setGameData={jest.fn()}
        setMoves={jest.fn()}
      />
    );
    const func: (sqaure: Square) => boolean = mockChessboard.mock.calls[0][0].onSquareClick;

    /* there are no possible moves at a2 for the player,
    because playerSide != currentSide */
    expect(func("a2")).toBe(false);
  });

  it("onPieceDragBegin, there are no possible moves, because it's not the player's turn", () => {
    render(
      <ChessBoard
        gameId=""
        gameData={{
          gameStatus: "started",
          playerSide: "white",
          currentSide: "black",
          aiStrength: 1,
          boardOrientation: "white"
        }}
        setTime={jest.fn()}
        setGameData={jest.fn()}
        setMoves={jest.fn()}
      />
    );
    const func: (_piece: Piece, sourceSquare: Square) => boolean =
      mockChessboard.mock.calls[0][0].onPieceDragBegin;

    /* a2 does not have possible moves on starting position for the player,
    because playerSide != currentSide */
    expect(func("wP", "a2")).toBe(false);
  });

  it("onPieceDrop, there are no possible moves, because it's not the player's turn", () => {
    render(
      <ChessBoard
        gameId=""
        gameData={{
          gameStatus: "started",
          playerSide: "white",
          currentSide: "black",
          aiStrength: 1,
          boardOrientation: "white"
        }}
        setTime={jest.fn()}
        setGameData={jest.fn()}
        setMoves={jest.fn()}
      />
    );
    const func: (sourceSquare: Square, targetSquare: Square) => boolean =
      mockChessboard.mock.calls[0][0].onPieceDrop;

    /* move from a2 to a3 is not possible for the player,
    because playerSide != currentSide */
    expect(func("a2", "a3")).toBe(false);
  });
});
