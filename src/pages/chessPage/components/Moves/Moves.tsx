import "./Moves.css";
import _ from "lodash";
import {
  QueenSVG,
  RookSVG,
  KnightSVG,
  KingSVG,
  BishopSVG
} from "@components/svg/chessPiecesMinified";
import useMoves from "@pages/chessPage/hooks/useMoves";
import { GameDataType } from "@pages/chessPage/types/GameDataType.types";
import FlipSVG from "@components/svg/flipIcon";

type MovesProps = {
  moves: string;
  setGameData: React.Dispatch<React.SetStateAction<GameDataType>>;
};

export default function Moves({ moves, setGameData }: MovesProps) {
  const { chessMoves, movesListRef } = useMoves({ moves });

  const pieceMap: { [key: string]: JSX.Element } = {
    q: <QueenSVG />,
    r: <RookSVG />,
    n: <KnightSVG />,
    k: <KingSVG />,
    b: <BishopSVG />
  };

  return (
    <div className="chessboard-moves">
      <button
        className="chessboard-moves__change-side-button"
        onClick={() =>
          setGameData((data) => ({
            ...data,
            boardOrientation: data.boardOrientation == "white" ? "black" : "white"
          }))
        }>
        <FlipSVG />
      </button>
      <ol className="chessboard-moves-list" ref={movesListRef} data-testid="movesList">
        {chessMoves &&
          _.chunk(chessMoves, 2).map((movePair, i) => {
            const firstPieceIcon = pieceMap[movePair[0].piece] || null;
            const secondPieceIcon = pieceMap[movePair[1]?.piece] || null;
            return (
              <li className="chessboard-moves__move-pair" key={i}>
                <span>{i + 1}</span>
                <span
                  className={`chessboard-moves__move ${movePair[0].san.includes("#") ? "win" : ""}`}>
                  {firstPieceIcon}
                  {firstPieceIcon ? movePair[0].san.slice(1) : movePair[0].san}
                </span>
                {movePair[1] && (
                  <span
                    className={`chessboard-moves__move ${movePair[1].san.includes("#") ? "win" : ""}`}>
                    {secondPieceIcon}
                    {secondPieceIcon ? movePair[1].san.slice(1) : movePair[1].san}
                  </span>
                )}
              </li>
            );
          })}
      </ol>
    </div>
  );
}
