import "./StrengthPicker.css";
import { Strength } from "../../types/Strength.types";

type StrengthPickerProps = {
  strength: Strength;
  setStrength: React.Dispatch<React.SetStateAction<Strength>>;
};

export default function StrengthPicker({ strength, setStrength }: StrengthPickerProps) {
  const strengthVariants: Strength[] = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <section className="settings__strength" aria-labelledby="settings__strength-title">
      <h2 className="settings__strength-title" id="settings__strength-title">
        Strength
      </h2>
      <ul className="settings__strength-variants" role="radiogroup" data-testid="strengthPicker">
        {strengthVariants.map((strengthVariant) => (
          <li
            className="settings__strength-variant"
            role="radio"
            aria-checked={strengthVariant === strength ? "true" : "false"}
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setStrength(strengthVariant)}
            onClick={() => setStrength(strengthVariant)}
            key={strengthVariant}>
            {strengthVariant}
          </li>
        ))}
      </ul>
    </section>
  );
}
