import { useState } from "react";

type RecommenderFilterButtonProps = {
  label: string;
  id: string;
  checkIsActive: (id: string) => boolean;
  handleOnClick: (id: string) => void;
}

const RecommenderFilterButton = ({label, id, checkIsActive, handleOnClick}: RecommenderFilterButtonProps) => {

  const [isActive, setIsActive] = useState(checkIsActive(id));

  // Apply conditional styling based on the isActive state
  const buttonStyle = isActive ? { backgroundColor: 'green', color: 'white' } : {};
  
  return (
    <button 
      onClick={() => {
        handleOnClick(id);
        setIsActive(current => !current);
      }}
      style={buttonStyle}
    >
      {label}
    </button>
  )
}

export default RecommenderFilterButton;