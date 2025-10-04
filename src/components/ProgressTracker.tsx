import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  name: string;
  status: "complete" | "current" | "upcoming";
}

interface ProgressTrackerProps {
  steps: Step[];
}

const ProgressTracker = ({ steps }: ProgressTrackerProps) => {
  return (
    <div className="w-full">
      <nav aria-label="Progress">
        <ol className="flex items-center justify-between">
          {steps.map((step, stepIdx) => (
            <li
              key={step.name}
              className={cn(
                "relative flex-1",
                stepIdx !== steps.length - 1 ? "pr-4 sm:pr-8" : ""
              )}
            >
              {step.status === "complete" ? (
                <>
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="h-0.5 w-full bg-success" />
                  </div>
                  <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-success">
                    <Check className="h-5 w-5 text-success-foreground" />
                  </div>
                  <span className="absolute top-12 left-1/2 -translate-x-1/2 text-xs font-medium text-success whitespace-nowrap">
                    {step.name}
                  </span>
                </>
              ) : step.status === "current" ? (
                <>
                  {stepIdx !== 0 && (
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="h-0.5 w-full bg-border" />
                    </div>
                  )}
                  <div className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary bg-background">
                    <span className="h-3 w-3 rounded-full bg-primary animate-pulse" />
                  </div>
                  <span className="absolute top-12 left-1/2 -translate-x-1/2 text-xs font-medium text-primary whitespace-nowrap">
                    {step.name}
                  </span>
                </>
              ) : (
                <>
                  {stepIdx !== 0 && (
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="h-0.5 w-full bg-border" />
                    </div>
                  )}
                  <div className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-border bg-background">
                    <span className="h-3 w-3 rounded-full bg-muted" />
                  </div>
                  <span className="absolute top-12 left-1/2 -translate-x-1/2 text-xs font-medium text-muted-foreground whitespace-nowrap">
                    {step.name}
                  </span>
                </>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};

export default ProgressTracker;
