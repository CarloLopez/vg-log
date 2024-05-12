import { useState } from "react";

type ToggleSwitchProps = {
  stateA: string;
  stateB: string;
  handleToggle: () => void;
}

const ToggleSwitch = ({stateA, stateB, handleToggle}: ToggleSwitchProps) => {

  const [isActive, setIsActive] = useState(false);

  return (
    <div>
      <button onClick={() => {
        handleToggle();
        setIsActive(current => !current);
      }}>
        {isActive? stateB : stateA}
      </button>
    </div>
  )
}

export default ToggleSwitch;