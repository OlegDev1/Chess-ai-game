import { Side } from "../../types/side.types";
import { BlackSideSVG, WhiteSideSVG, RandomSideSVG } from "../../../../components/SVG/chessSide";
import "./SidePicker.css";

type SidePickerProps = {
  side: Side;
  setSide: React.Dispatch<React.SetStateAction<Side>>;
};

export default function SidePicker({ side, setSide }: SidePickerProps) {
  return (
    <div className="settings__side" data-testid="sidePicker">
      <button
        className={`side side-white ${side == "white" ? "selected" : ""}`}
        onClick={() => setSide("white")}>
        <WhiteSideSVG />
      </button>
      <button
        className={`side side-random ${side == "random" ? "selected" : ""}`}
        onClick={() => setSide("random")}>
        <RandomSideSVG />
      </button>
      <button
        className={`side side-black ${side == "black" ? "selected" : ""}`}
        onClick={() => setSide("black")}>
        <BlackSideSVG />
      </button>
    </div>
  );
}
