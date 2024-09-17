import "./TimeVariants.css";

type TimeVariantsProps = {
  limitedGameMinutes: number;
  setLimitedGameMinutes: React.Dispatch<React.SetStateAction<number>>;
};

export default function TimeVariants({
  limitedGameMinutes,
  setLimitedGameMinutes
}: TimeVariantsProps) {
  const timeVariants = [10, 15, 20, 25, 30, 40, 50, 60, 70, 85];

  return (
    <ul className="settings__time-variants" role="radiogroup" data-testid="timePicker">
      {timeVariants.map((minutes) => (
        <li
          className="settings__time-variant"
          role="radio"
          aria-checked={limitedGameMinutes === minutes ? "true" : "false"}
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && setLimitedGameMinutes(minutes)}
          onClick={() => setLimitedGameMinutes(minutes)}
          key={minutes}>
          {minutes} min
        </li>
      ))}
    </ul>
  );
}
