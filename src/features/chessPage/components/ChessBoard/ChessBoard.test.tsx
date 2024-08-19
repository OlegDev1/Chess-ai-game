import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ChessBoard from "./ChessBoard";

jest.mock("../../hooks/useStreamGame");
jest.mock("axios");
const chessBoardFEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";

beforeEach(() => {
  jest
    .spyOn(React, "useState")
    .mockImplementationOnce(() => [chessBoardFEN, jest.fn()]) // Mock chessBoardFEN state
    .mockImplementationOnce(() => [{}, jest.fn()]) // Mock possibleMoves state
    .mockImplementationOnce(() => [{}, jest.fn()]) // Mock isCheckStyle state
    .mockImplementationOnce(() => [{}, jest.fn()]); // Mock lastMoveStyle state

  render(<ChessBoard />);
});

describe("handleSquareClick", () => {
  test("Returns true when the valid move is made", () => {});
});
