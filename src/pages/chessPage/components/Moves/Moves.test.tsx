import { render, screen } from "@testing-library/react";
import Moves from "./Moves";

it("displays a pawn in the first move", () => {
  render(<Moves setGameData={jest.fn()} moves="e2e3" />);
  const listElement = screen.getByTestId("movesList").children[0];
  const index = listElement.children[0];
  const move = listElement.children[1];
  expect(index).toHaveTextContent("1");
  expect(move).toHaveTextContent("e3");
});

it("displays a pawn in the second move", () => {
  render(<Moves setGameData={jest.fn()} moves="e2e3 e7e6" />);
  const listElement = screen.getByTestId("movesList").children[0];
  const index = listElement.children[0];
  const move = listElement.children[2];
  expect(index).toHaveTextContent("1");
  expect(move).toHaveTextContent("e6");
});

it("displays a knight in the last move", () => {
  render(<Moves setGameData={jest.fn()} moves="e2e3 e7e6 b1a3" />);
  const listElement = screen.getByTestId("movesList").children[1];
  const knightSVG = screen.getByTestId("knightSVG");
  const index = listElement.children[0];
  const move = listElement.children[1];
  expect(index).toHaveTextContent("2");
  expect(move).toHaveTextContent("a3");
  expect(knightSVG).toBeInTheDocument();
});

it("displays a queen in the last move", () => {
  render(<Moves setGameData={jest.fn()} moves="e2e3 e7e6 d1e2" />);
  const listElement = screen.getByTestId("movesList").children[1];
  const queenSVG = screen.getByTestId("queenSVG");
  const index = listElement.children[0];
  const move = listElement.children[1];
  expect(index).toHaveTextContent("2");
  expect(move).toHaveTextContent("e2");
  expect(queenSVG).toBeInTheDocument();
});

it("displays a king in the last move", () => {
  render(<Moves setGameData={jest.fn()} moves="e2e3 e7e6 e1e2" />);
  const listElement = screen.getByTestId("movesList").children[1];
  const kingSVG = screen.getByTestId("kingSVG");
  const index = listElement.children[0];
  const move = listElement.children[1];
  expect(index).toHaveTextContent("2");
  expect(move).toHaveTextContent("e2");
  expect(kingSVG).toBeInTheDocument();
});

it("displays a rook in the last move", () => {
  render(<Moves setGameData={jest.fn()} moves="e2e3 e7e6 a2a3 e6e5 a1a2" />);
  const listElement = screen.getByTestId("movesList").children[2];
  const rookSVG = screen.getByTestId("rookSVG");
  const index = listElement.children[0];
  const move = listElement.children[1];
  expect(index).toHaveTextContent("3");
  expect(move).toHaveTextContent("a2");
  expect(rookSVG).toBeInTheDocument();
});

it("displays a bishop in the last move", () => {
  render(<Moves setGameData={jest.fn()} moves="b2b3 e7e6 c1b2" />);
  const listElement = screen.getByTestId("movesList").children[1];
  const bishopSVG = screen.getByTestId("bishopSVG");
  const index = listElement.children[0];
  const move = listElement.children[1];
  expect(index).toHaveTextContent("2");
  expect(move).toHaveTextContent("b2");
  expect(bishopSVG).toBeInTheDocument();
});
