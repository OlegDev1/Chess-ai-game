import { render, screen } from "@testing-library/react";
import Moves from "./Moves";

it("First move with a pawn", () => {
  render(<Moves moves="e2e3" />);
  const listElement = screen.getByTestId("movesList").children[0];
  const index = listElement.children[0];
  const move = listElement.children[1];
  expect(index).toHaveTextContent("1");
  expect(move).toHaveTextContent("e3");
});

it("Second move with a pawn", () => {
  render(<Moves moves="e2e3 e7e6" />);
  const listElement = screen.getByTestId("movesList").children[0];
  const index = listElement.children[0];
  const move = listElement.children[2];
  expect(index).toHaveTextContent("1");
  expect(move).toHaveTextContent("e6");
});

it("A move with a knight", () => {
  render(<Moves moves="e2e3 e7e6 b1a3" />);
  const listElement = screen.getByTestId("movesList").children[1];
  const knightSVG = screen.getByTestId("knightSVG");
  const index = listElement.children[0];
  const move = listElement.children[1];
  expect(index).toHaveTextContent("2");
  expect(move).toHaveTextContent("a3");
  expect(knightSVG).toBeInTheDocument();
});

it("A move with a queen", () => {
  render(<Moves moves="e2e3 e7e6 d1e2" />);
  const listElement = screen.getByTestId("movesList").children[1];
  const queenSVG = screen.getByTestId("queenSVG");
  const index = listElement.children[0];
  const move = listElement.children[1];
  expect(index).toHaveTextContent("2");
  expect(move).toHaveTextContent("e2");
  expect(queenSVG).toBeInTheDocument();
});

it("A move with a king", () => {
  render(<Moves moves="e2e3 e7e6 e1e2" />);
  const listElement = screen.getByTestId("movesList").children[1];
  const kingSVG = screen.getByTestId("kingSVG");
  const index = listElement.children[0];
  const move = listElement.children[1];
  expect(index).toHaveTextContent("2");
  expect(move).toHaveTextContent("e2");
  expect(kingSVG).toBeInTheDocument();
});

it("A move with a rook", () => {
  render(<Moves moves="e2e3 e7e6 a2a3 e6e5 a1a2" />);
  const listElement = screen.getByTestId("movesList").children[2];
  const rookSVG = screen.getByTestId("rookSVG");
  const index = listElement.children[0];
  const move = listElement.children[1];
  expect(index).toHaveTextContent("3");
  expect(move).toHaveTextContent("a2");
  expect(rookSVG).toBeInTheDocument();
});

it("A move with a bishop", () => {
  render(<Moves moves="b2b3 e7e6 c1b2" />);
  const listElement = screen.getByTestId("movesList").children[1];
  const bishopSVG = screen.getByTestId("bishopSVG");
  const index = listElement.children[0];
  const move = listElement.children[1];
  expect(index).toHaveTextContent("2");
  expect(move).toHaveTextContent("b2");
  expect(bishopSVG).toBeInTheDocument();
});
