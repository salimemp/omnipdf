import React, { createContext, useContext, useState } from "react";
import { cn } from "@omnipdf/shared/src/utils";

interface SelectContextValue {
  open: boolean;
  value: string;
  onValueChange: (value: string) => void;
  setOpen: (open: boolean) => void;
}

const SelectContext = createContext<SelectContextValue | null>(null);

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export function Select({
  value,
  onValueChange,
  children,
  className,
}: SelectProps) {
  const [open, setOpen] = useState(false);

  return (
    <SelectContext.Provider value={{ open, value, onValueChange, setOpen }}>
      <div className={cn("relative", className)}>{children}</div>
    </SelectContext.Provider>
  );
}

export interface SelectTriggerProps {
  children: React.ReactNode;
  className?: string;
}

export function SelectTrigger({ children, className }: SelectTriggerProps) {
  const context = useContext(SelectContext);
  if (!context) throw new Error("SelectTrigger must be used within Select");

  return (
    <button
      type="button"
      onClick={() => context.setOpen(!context.open)}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm",
        "placeholder:text-surface-400",
        "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "dark:border-surface-600 dark:bg-surface-800 dark:text-white",
        className,
      )}
    >
      {children}
      <svg
        className={cn(
          "h-4 w-4 transition-transform",
          context.open && "rotate-180",
        )}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>
  );
}

export interface SelectContentProps {
  children: React.ReactNode;
  className?: string;
}

export function SelectContent({ children, className }: SelectContentProps) {
  const context = useContext(SelectContext);
  if (!context) throw new Error("SelectContent must be used within Select");

  if (!context.open) return null;

  return (
    <div className="fixed inset-0 z-50" onClick={() => context.setOpen(false)}>
      <div
        className={cn(
          "absolute z-50 mt-1 max-h-60 min-w-[8rem] overflow-auto rounded-lg border border-surface-200 bg-white py-1 shadow-lg",
          "dark:border-surface-700 dark:bg-surface-800",
          className,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

export interface SelectItemProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export function SelectItem({ value, children, className }: SelectItemProps) {
  const context = useContext(SelectContext);
  if (!context) throw new Error("SelectItem must be used within Select");

  const isSelected = context.value === value;

  return (
    <button
      type="button"
      onClick={() => {
        context.onValueChange(value);
        context.setOpen(false);
      }}
      className={cn(
        "flex w-full cursor-pointer items-center px-3 py-2 text-sm",
        "hover:bg-surface-100 dark:hover:bg-surface-700",
        "focus:bg-surface-100 dark:focus:bg-surface-700 focus:outline-none",
        isSelected &&
          "bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300",
        className,
      )}
    >
      {children}
      {isSelected && (
        <svg
          className="ml-auto h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      )}
    </button>
  );
}

export interface SelectValueProps {
  placeholder?: string;
}

export function SelectValue({ placeholder }: SelectValueProps) {
  const context = useContext(SelectContext);
  if (!context) throw new Error("SelectValue must be used within Select");

  return (
    <span className={cn(!context.value && "text-surface-400")}>
      {context.value || placeholder}
    </span>
  );
}
