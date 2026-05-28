import { AiDisclaimer } from "./ai-disclaimer";
import type { ReactNode } from "react";

interface ToolLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function ToolLayout({ title, description, children }: ToolLayoutProps) {
  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      <div className="space-y-1">
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      {children}
      <AiDisclaimer />
    </div>
  );
}
