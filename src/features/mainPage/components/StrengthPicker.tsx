import "./StrengthPicker.css";
import { Strength } from "../types/strength.interface";

type StrengthPickerProps = {
  strength: Strength;
  setStrength: React.Dispatch<React.SetStateAction<Strength>>;
};

export default function StrengthPicker({ strength, setStrength }: StrengthPickerProps) {
  const strengthVariants: Strength[] = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <div className="settings__strength">
      <h3 className="settings__strength-title">Strength</h3>
      <div className="strengthVariants" data-testid="strengthPicker">
        {strengthVariants.map((e) => (
          <button
            className={`strengthVariants__variant ${e == strength ? "selected" : ""}`}
            onClick={() => setStrength(e)}
            key={e}>
            {e}
          </button>
        ))}
      </div>
    </div>
  );
}
