"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FAQItemProps {
  question: string;
  answer: string;
}

export function FAQItem({ question, answer }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-lg border border-surface-200 dark:border-surface-800 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left bg-white dark:bg-surface-900 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors"
      >
        <span className="font-medium text-surface-900 dark:text-white">
          {question}
        </span>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-surface-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-surface-500" />
        )}
      </button>
      {isOpen && (
        <div className="p-4 bg-surface-50 dark:bg-surface-800 border-t border-surface-200 dark:border-surface-800">
          <p className="text-surface-600 dark:text-surface-400">{answer}</p>
        </div>
      )}
    </div>
  );
}
