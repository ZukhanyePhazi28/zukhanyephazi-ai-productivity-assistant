import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ToolLayout } from "@/components/tool-layout";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { planTasks } from "@/lib/ai-tools.functions";
import { Loader2, Wand2, Copy, Check, Pencil, Save } from "lucide-react";

export const Route = createFileRoute("/task-planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — AI Workplace" },
      { name: "description", content: "Plan tasks with AI assistance." },
      { property: "og:title", content: "AI Task Planner — AI Workplace" },
      { property: "og:description", content: "Plan tasks with AI assistance." },
    ],
  }),
  component: TaskPlannerPage,
});

function TaskPlannerPage() {
  const [goal, setGoal] = useState("");
  const [constraints, setConstraints] = useState("");
  const [timeline, setTimeline] = useState("");
  const [output, setOutput] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  const planFn = useServerFn(planTasks);

  const mutation = useMutation({
    mutationFn: planFn,
    onSuccess: (data) => {
      setOutput(data.text);
      setIsEditing(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.trim()) return;
    mutation.mutate({
      data: {
        goal,
        constraints: constraints || undefined,
        timeline: timeline || undefined,
      },
    });
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout
      title="AI Task Planner"
      description="Describe your goal and constraints, and AI will create a structured, prioritized task plan."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Card>
            <CardContent className="space-y-4 p-5">
              <div className="space-y-2">
                <Label htmlFor="goal">Goal or Project</Label>
                <Textarea
                  id="goal"
                  placeholder="e.g., Launch a new marketing campaign for our Q4 product line..."
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeline">Timeline (optional)</Label>
                <Input
                  id="timeline"
                  placeholder="e.g., 3 weeks, by end of Q4, etc."
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="constraints">Constraints or Context (optional)</Label>
                <Textarea
                  id="constraints"
                  placeholder="Any limitations, team size, budget considerations, dependencies..."
                  value={constraints}
                  onChange={(e) => setConstraints(e.target.value)}
                  rows={4}
                />
              </div>

              <Button
                type="submit"
                disabled={mutation.isPending || !goal.trim()}
                className="w-full"
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Planning...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate Task Plan
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </form>

        <div className="flex flex-col gap-3">
          {output && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Task Plan
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing((v) => !v)}
                  >
                    {isEditing ? (
                      <Save className="mr-1.5 h-3.5 w-3.5" />
                    ) : (
                      <Pencil className="mr-1.5 h-3.5 w-3.5" />
                    )}
                    {isEditing ? "Done" : "Edit"}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleCopy}>
                    {copied ? (
                      <Check className="mr-1.5 h-3.5 w-3.5" />
                    ) : (
                      <Copy className="mr-1.5 h-3.5 w-3.5" />
                    )}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                </div>
              </div>
              <Card>
                <CardContent className="p-5">
                  <MarkdownRenderer
                    content={output}
                    editable={isEditing}
                    onChange={setOutput}
                  />
                </CardContent>
              </Card>
            </>
          )}
          {!output && !mutation.isPending && (
            <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-border">
              <p className="text-sm text-muted-foreground">
                Your task plan will appear here
              </p>
            </div>
          )}
          {mutation.isPending && !output && (
            <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-border">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
