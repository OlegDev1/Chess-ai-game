import "./Moves.css";
import { Chess } from "chess.js";
import _ from "lodash";
import { useEffect, useMemo, useRef } from "react";
import {
  QueenSVG,
  RookSVG,
  KnightSVG,
  KingSVG,
  BishopSVG
} from "../../../../components/SVG/chessPiecesMinified";

type MovesProps = {
  moves: string;
};

export default function Moves({ moves }: MovesProps) {
  const movesListRef = useRef<HTMLOListElement>(null);
  const chessMoves = useMemo(() => {
    if (!moves) return;
    const chess = new Chess();
    const movesArray = moves.trim().split(" ");
    for (const el of movesArray) {
      chess.move(el);
    }
    return chess.history({ verbose: true });
  }, [moves]);

  useEffect(() => {
    if (movesListRef.current) {
      movesListRef.current.scrollTop = movesListRef.current.scrollHeight;
    }
  }, [moves]);

  const pieceMap: { [key: string]: JSX.Element } = {
    q: <QueenSVG />,
    r: <RookSVG />,
    n: <KnightSVG />,
    k: <KingSVG />,
    b: <BishopSVG />
  };

  return (
    <ol className="moves__list" ref={movesListRef} data-testid="movesList">
      {chessMoves &&
        _.chunk(chessMoves, 2).map((movePair, i) => {
          const firstPieceIcon = pieceMap[movePair[0].piece] || null;
          const secondPieceIcon = pieceMap[movePair[1]?.piece] || null;
          return (
            <li className="moves__item" key={i}>
              <span>{i + 1}</span>
              <span className={`move__item ${movePair[0].san.includes("#") ? "win" : ""}`}>
                {firstPieceIcon}
                {firstPieceIcon ? movePair[0].san.slice(1) : movePair[0].san}
              </span>
              {movePair[1] && (
                <span className={`move__item ${movePair[1].san.includes("#") ? "win" : ""}`}>
                  {secondPieceIcon}
                  {secondPieceIcon ? movePair[1].san.slice(1) : movePair[1].san}
                </span>
              )}
            </li>
          );
        })}
    </ol>
  );
}
