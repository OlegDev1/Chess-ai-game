import { Side } from "../../types/side.types";
import { BlackSideSVG, WhiteSideSVG, RandomSideSVG } from "@components/SVG/chessSide";

import "./SidePicker.css";

type SidePickerProps = {
  side: Side;
  setSide: React.Dispatch<React.SetStateAction<Side>>;
};

export default function SidePicker({ side, setSide }: SidePickerProps) {
  return (
    <div className="settings__sides" data-testid="sidePicker">
      <button
        className={`settings__side settings__side--white ${side == "white" ? "selected" : ""}`}
        onClick={() => setSide("white")}>
        <WhiteSideSVG />
      </button>
      <button
        className={`settings__side settings__side--random ${side == "random" ? "selected" : ""}`}
        onClick={() => setSide("random")}>
        <RandomSideSVG />
      </button>
      <button
        className={`settings__side settings__side--black ${side == "black" ? "selected" : ""}`}
        onClick={() => setSide("black")}>
        <BlackSideSVG />
      </button>
    </div>
  );
}
