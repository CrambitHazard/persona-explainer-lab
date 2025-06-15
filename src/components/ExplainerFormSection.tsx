
import React from "react";
import { cn } from "@/lib/utils";

interface ExplainerFormSectionProps {
  title?: string;
  subtitle?: string;
  className?: string;
  children: React.ReactNode;
}

export function ExplainerFormSection({
  title,
  subtitle,
  className,
  children
}: ExplainerFormSectionProps) {
  return (
    <div className={cn("col-span-2", className)}>
      {title && (
        <h1 className="text-2xl font-bold mb-1 transition text-center text-black/40 dark:text-white/25 select-none">{title}</h1>
      )}
      {subtitle && (
        <p className="text-base font-medium max-w-lg mx-auto mb-2 transition text-center text-gray-700/80 dark:text-white/40 select-none">{subtitle}</p>
      )}
      {children}
    </div>
  );
}
