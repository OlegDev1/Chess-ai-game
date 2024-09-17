import { Side } from "@pages/mainPage/types/Side.types";
import { BlackSideSVG, WhiteSideSVG, RandomSideSVG } from "@components/svg/chessSide";

import "./SidePicker.css";

type SidePickerProps = {
  side: Side;
  setSide: React.Dispatch<React.SetStateAction<Side>>;
};

export default function SidePicker({ side, setSide }: SidePickerProps) {
  return (
    <section className="settings__sides" aria-label="Your Side">
      <ul className="settings__sides-list" role="radiogroup" data-testid="sidePicker">
        <li
          className="settings__side settings__side--white"
          role="radio"
          aria-checked={side === "white" ? "true" : "false"}
          aria-label="White"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && setSide("white")}
          onClick={() => setSide("white")}>
          <WhiteSideSVG />
        </li>
        <li
          className="settings__side settings__side--random"
          role="radio"
          aria-checked={side === "random" ? "true" : "false"}
          aria-label="Random"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && setSide("random")}
          onClick={() => setSide("random")}>
          <RandomSideSVG />
        </li>
        <li
          className="settings__side settings__side--black"
          role="radio"
          aria-label="Black"
          aria-checked={side === "black" ? "true" : "false"}
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && setSide("black")}
          onClick={() => setSide("black")}>
          <BlackSideSVG />
        </li>
      </ul>
    </section>
  );
}
