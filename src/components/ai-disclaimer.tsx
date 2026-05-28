import { AlertTriangle } from "lucide-react";

export function AiDisclaimer() {
  return (
    <div className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
        <div className="space-y-1">
          <p className="font-medium text-foreground">Responsible AI Use</p>
          <p>
            AI-generated content may contain inaccuracies or bias. Always review outputs before
            using them in professional contexts. Do not input sensitive personal, financial,
            or confidential information. AI suggestions are meant to assist, not replace human
            judgment.
          </p>
        </div>
      </div>
    </div>
  );
}
