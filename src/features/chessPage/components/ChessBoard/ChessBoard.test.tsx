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
      <ChessBoard setTime={jest.fn()} setGameData={jest.fn()} gameId="" setMoves={jest.fn()} />
    );
    func = mockChessboard.mock.calls[0][0].onSquareClick;
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Returns true when there are possible moves from the given position", () => {
    //a2 does have possible moves on starting position
    expect(func("a2")).toBe(true);
  });
  it("Returns false when there are no possible moves from the given position", () => {
    //a1 does not have possible moves on starting position
    expect(func("a1")).toBe(false);
  });
  it("Returns true when the possible move leads to a move", () => {
    //move from b2 to b3 is possible
    expect(func("b3")).toBe(true);
  });
  it("Returns false when the possible move leads to an error", () => {
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
      <ChessBoard setTime={jest.fn()} setGameData={jest.fn()} gameId="" setMoves={jest.fn()} />
    );
    func = mockChessboard.mock.calls[0][0].onPieceDragBegin;
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Returns true when there are possible moves from the given position (a2)", () => {
    //a2 does have possible moves on starting position
    expect(func("wP", "a2")).toBe(true);
  });
  it("Returns false when there are no possible moves from the given position (a1)", () => {
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
      <ChessBoard setTime={jest.fn()} setGameData={jest.fn()} gameId="" setMoves={jest.fn()} />
    );
    func = mockChessboard.mock.calls[0][0].onPieceDrop;
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Returns true when the move is successful", () => {
    //move from a2 to a3 is possible
    expect(func("a2", "a3")).toBe(true);
  });
  it("Returns false when the move is unsuccessful", () => {
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
      <ChessBoard setTime={jest.fn()} setGameData={jest.fn()} gameId="" setMoves={jest.fn()} />
    );
    func = mockChessboard.mock.calls[0][0].onPromotionCheck;
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Returns true when the promotion is possible", () => {
    //promotion of a pawn from b7 to c8 is possible
    expect(func("b7", "c8")).toBe(true);
  });
  it("Returns false when the promotion is not possible", () => {
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
      <ChessBoard setTime={jest.fn()} setGameData={jest.fn()} gameId="" setMoves={jest.fn()} />
    );
    func = mockChessboard.mock.calls[0][0].onPromotionPieceSelect;
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Returns true when the promotion move is successful", () => {
    /* Promotion of a pawn to a queen from b7 to c8,
    it is possible with a given chessBoardFEN*/
    expect(func("wQ", "b7", "c8")).toBe(true);
  });
  it("Returns false when the promotion move is unsuccessful", () => {
    /* Promotion of a pawn to a queen from b7 to d8,
    it is not possible with a given chessBoardFEN*/
    expect(func("wQ", "b7", "d8")).toBe(false);
  });
  it("Returns false if any argument is missing", () => {
    expect(func(undefined, undefined, undefined)).toBe(false);
    expect(func("wQ", undefined, undefined)).toBe(false);
    expect(func("wQ", "b7", undefined)).toBe(false);
    expect(func("wQ", undefined, "c8")).toBe(false);
    expect(func(undefined, "b7", "c8")).toBe(false);
  });
});
