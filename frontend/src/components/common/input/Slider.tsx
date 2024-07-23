import { ChangeEvent, useState } from "react";

type SliderProps = {
  initial: number;
  min: number;
  max: number;
  step: number;
  metric?: string;
  handleChange: (value: number) => void;
}

const Slider = ({initial, min, max, step, metric, handleChange}: SliderProps) => {
  
  const [current, setCurrent] = useState(initial);

  return (
    <div className="flex justify-center gap-2">
      <input 
      type="range" 
      value={current} 
      min={min} 
      max={max} 
      step={step} 
      onChange={(event: ChangeEvent<HTMLInputElement>) => {
        handleChange(Number(event.target.value));
        setCurrent(Number(event.target.value));
        }}
      />
      <div className="font-semibold text-orange-300">{(current === 0 && metric ? 'All' : current)}{(metric ? ` ${metric}` : '')}</div>
    </div>
  )
}

export default Slider;