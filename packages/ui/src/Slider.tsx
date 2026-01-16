import React from "react";
import { cn } from "@omnipdf/shared/src/utils";

export interface SliderProps {
  value: number[];
  onValueChange: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  className?: string;
}

export function Slider({
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  className,
}: SliderProps) {
  const percentage = ((value[0] - min) / (max - min)) * 100;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    onValueChange([newValue]);
  };

  const handleMouseDown = () => {
    document.addEventListener("mouseup", handleMouseUp, { once: true });
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
  };

  const handleMouseMove = (e: MouseEvent) => {
    const slider = e.currentTarget as HTMLElement;
    const rect = slider.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const newValue =
      Math.min(Math.max(x / rect.width, 0), 1) * (max - min) + min;
    onValueChange([Math.round(newValue / step) * step]);
  };

  return (
    <div
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className,
      )}
    >
      <div className="relative h-2 w-full grow overflow-hidden rounded-full bg-surface-200 dark:bg-surface-700">
        <div
          className="absolute h-full bg-primary-600"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value[0]}
        onChange={handleChange}
        disabled={disabled}
        className={cn(
          "absolute w-full h-full opacity-0 cursor-pointer",
          disabled && "cursor-not-allowed opacity-50",
        )}
      />
    </div>
  );
}
