import { useEffect, useMemo, useState } from "react";
import { throttle } from "lodash";

type useSliderProps = {
  isPointerMouseDown: boolean;
  setIsPointerMouseDown: React.Dispatch<React.SetStateAction<boolean>>;
  limitedGameMinutes: number;
  setLimitedGameMinutes: React.Dispatch<React.SetStateAction<number>>;
  sliderElement: React.MutableRefObject<HTMLDivElement | null>;
  pointerElement: React.MutableRefObject<HTMLSpanElement | null>;
  pointerTextElement: React.MutableRefObject<HTMLSpanElement | null>;
};

export default function useSlider({
  isPointerMouseDown,
  setIsPointerMouseDown,
  limitedGameMinutes,
  setLimitedGameMinutes,
  sliderElement,
  pointerElement,
  pointerTextElement,
}: useSliderProps) {
  const [resize, setResize] = useState(0);

  /*
    The slider is divided into small chunks, each corresponding to a specific value. 
    This is an array of these values.
  */
  const values = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => i + 10).concat(
        Array.from({ length: 10 }, (_, i) => 40 + i * 5)
      ),
    []
  );

  //Handles the resizing of the window, which then affects the third useEffect.
  useEffect(() => {
    const throttledHandleResize = throttle(() => setResize((e) => e + 1), 50);
    window.addEventListener("resize", throttledHandleResize);
    return () => {
      window.removeEventListener("resize", throttledHandleResize);
    };
  }, []);

  /*
    Updates limitedGameMinutes while dragging the slider pointer.
    Which then updates the pointer position on the page (in the third useEffect).
  */
  useEffect(() => {
    if (!isPointerMouseDown || !sliderElement.current) return;

    const sliderChunkSliceLength = (sliderElement.current.getBoundingClientRect().width - 5) / 35;

    const mouseMoveHandler = (e: PointerEvent, sliderChunkSliceLength: number) => {
      if (!sliderElement.current) return;

      document.documentElement.style.cursor = "pointer";
      let pointerPosition = e.clientX - sliderElement.current.getBoundingClientRect().left;
      pointerPosition = Math.max(
        -5,
        Math.min(pointerPosition, sliderElement.current.getBoundingClientRect().width - 5)
      );
      const sliderChunkIndex = Math.trunc(pointerPosition / sliderChunkSliceLength);

      /*
        The change of limitedGameMinutes fires the third useEffect.
        Which updates the position of the pointer and it's text.
      */
      setLimitedGameMinutes(values[sliderChunkIndex]);
    };
    const throttledMouseMoveHandler = throttle(
      (e) => mouseMoveHandler(e, sliderChunkSliceLength),
      5
    );

    const mouseUpHandler = () => {
      document.documentElement.style.cursor = "";
      document.removeEventListener("pointermove", throttledMouseMoveHandler);
      document.removeEventListener("pointerup", mouseUpHandler);
      setIsPointerMouseDown(false);
    };

    document.addEventListener("pointermove", throttledMouseMoveHandler);
    document.addEventListener("pointerup", mouseUpHandler);
    return () => mouseUpHandler();
  }, [
    isPointerMouseDown,
    setLimitedGameMinutes,
    values,
    sliderElement,
    pointerElement,
    pointerTextElement,
    setIsPointerMouseDown,
  ]);

  //Updates the position of the pointer and the text above it, when the limitedGameMinutes or window size changes.
  useEffect(() => {
    if (!sliderElement.current) return;

    const updatePointerAndTextPosition = (
      sliderChunkIndex: number,
      sliderChunkSliceLength: number
    ) => {
      if (!sliderElement.current || !pointerElement.current || !pointerTextElement.current) return;

      pointerElement.current.style.left = `${sliderChunkIndex * sliderChunkSliceLength}px`;

      let pointerTextElementPosition =
        sliderChunkIndex * sliderChunkSliceLength -
        pointerTextElement.current.getBoundingClientRect().width / 2;
      const maxTextPosition =
        sliderElement.current.getBoundingClientRect().width -
        pointerTextElement.current.getBoundingClientRect().width;
      pointerTextElementPosition = Math.max(
        0,
        Math.min(pointerTextElementPosition, maxTextPosition)
      );

      pointerTextElement.current.style.left = `${pointerTextElementPosition}px`;
    };

    const sliderChunkSliceLength = (sliderElement.current.getBoundingClientRect().width - 5) / 35;
    const sliderChunkIndex = values.findIndex((e) => e === limitedGameMinutes);

    updatePointerAndTextPosition(sliderChunkIndex, sliderChunkSliceLength);
  }, [limitedGameMinutes, values, sliderElement, pointerElement, pointerTextElement, resize]);
}
