'use client';

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
}

export function Slider({ value, onChange, min, max, step = 1 }: SliderProps) {
  return (
    <input
      type="range"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      min={min}
      max={max}
      step={step}
      className="w-full h-2 rounded-lg cursor-pointer"
      style={{
        background: `linear-gradient(to right, var(--semantic-primary) 0%, var(--semantic-primary) ${((value - min) / (max - min)) * 100}%, var(--semantic-border-light) ${((value - min) / (max - min)) * 100}%, var(--semantic-border-light) 100%)`,
      }}
    />
  );
}
