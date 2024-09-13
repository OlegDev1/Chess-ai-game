import { useEffect, useRef, useMemo } from "react";
import { Chess } from "chess.js";

type useMovesProps = {
  moves: string;
};

export default function useMoves({ moves }: useMovesProps) {
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

  return { chessMoves, movesListRef };
}
