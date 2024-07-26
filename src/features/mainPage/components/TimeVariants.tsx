import "./TimeVariants.css";

type TimeVariantsProps = {
  setLimitedGameMinutes: React.Dispatch<React.SetStateAction<number>>;
};

export default function TimeVariants({ setLimitedGameMinutes }: TimeVariantsProps) {
  const timeVariants = [10, 15, 20, 25, 30, 40, 50, 60, 70, 85];

  return (
    <div className="timeVariants" data-testid="timePicker">
      {timeVariants.map((e) => (
        <button className="timeVariants__variant" onClick={() => setLimitedGameMinutes(e)} key={e}>
          {e} min
        </button>
      ))}
    </div>
  );
}
