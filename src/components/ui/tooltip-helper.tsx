
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import React from "react";

export function TooltipHelper({ children, text }: { children: React.ReactNode; text: string }) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <span className="ml-1 align-middle inline-block text-muted-foreground cursor-pointer">
            <Info size={16} />
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <span className="max-w-xs text-xs">{text}</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
