import "./Slider.css";
import { useState, useRef } from "react";
import useSlider from "../../hooks/useSlider";

type SliderProps = {
  limitedGameMinutes: number;
  setLimitedGameMinutes: React.Dispatch<React.SetStateAction<number>>;
};

export default function Slider({ limitedGameMinutes, setLimitedGameMinutes }: SliderProps) {
  const [isPointerMouseDown, setIsPointerMouseDown] = useState(false);
  const sliderElement = useRef<HTMLDivElement | null>(null);
  const pointerElement = useRef<HTMLSpanElement | null>(null);
  const pointerTextElement = useRef<HTMLSpanElement | null>(null);
  useSlider({
    isPointerMouseDown,
    setIsPointerMouseDown,
    limitedGameMinutes,
    setLimitedGameMinutes,
    sliderElement,
    pointerElement,
    pointerTextElement,
  });

  return (
    <div className="slider" ref={sliderElement}>
      <span
        className="slider__pointer"
        onPointerDown={(e) => {
          e.preventDefault();
          if (pointerElement.current) pointerElement.current.setPointerCapture(e.pointerId);
          setIsPointerMouseDown(true);
        }}
        ref={pointerElement}></span>
      <span
        className="slider__pointerText"
        ref={pointerTextElement}
        data-testid="sliderPointerText">
        {limitedGameMinutes} min
      </span>
    </div>
  );
}
