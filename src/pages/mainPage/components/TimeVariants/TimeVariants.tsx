import "./TimeVariants.css";

type TimeVariantsProps = {
  setLimitedGameMinutes: React.Dispatch<React.SetStateAction<number>>;
};

export default function TimeVariants({ setLimitedGameMinutes }: TimeVariantsProps) {
  const timeVariants = [10, 15, 20, 25, 30, 40, 50, 60, 70, 85];

  return (
    <div className="settings__time-variants" data-testid="timePicker">
      {timeVariants.map((e) => (
        <button className="settings__time-variant" onClick={() => setLimitedGameMinutes(e)} key={e}>
          {e} min
        </button>
      ))}
    </div>
  );
}
