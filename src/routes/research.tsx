import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { ToolLayout } from "@/components/tool-layout";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { conductResearch } from "@/lib/ai-tools.functions";
import { Loader2, Wand2, Copy, Check, Pencil, Save } from "lucide-react";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — AI Workplace" },
      { name: "description", content: "Research topics with AI assistance." },
      { property: "og:title", content: "AI Research Assistant — AI Workplace" },
      { property: "og:description", content: "Research topics with AI assistance." },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  const [topic, setTopic] = useState("");
  const [depth, setDepth] = useState("detailed");
  const [focus, setFocus] = useState("");
  const [output, setOutput] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  const researchFn = useServerFn(conductResearch);

  const mutation = useMutation({
    mutationFn: researchFn,
    onSuccess: (data) => {
      setOutput(data.text);
      setIsEditing(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    mutation.mutate({
      data: {
        topic,
        depth: depth as "brief" | "detailed" | "comprehensive",
        focus: focus || undefined,
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
      title="AI Research Assistant"
      description="Enter a topic and get well-structured research with key findings and insights."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Card>
            <CardContent className="space-y-4 p-5">
              <div className="space-y-2">
                <Label htmlFor="topic">Research Topic</Label>
                <Input
                  id="topic"
                  placeholder="e.g., Remote work productivity trends in 2024"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="depth">Research Depth</Label>
                  <Select value={depth} onValueChange={setDepth}>
                    <SelectTrigger id="depth">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="brief">Brief Overview</SelectItem>
                      <SelectItem value="detailed">Detailed Analysis</SelectItem>
                      <SelectItem value="comprehensive">Comprehensive Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="focus">Specific Focus (optional)</Label>
                  <Input
                    id="focus"
                    placeholder="e.g., Impact on mental health"
                    value={focus}
                    onChange={(e) => setFocus(e.target.value)}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={mutation.isPending || !topic.trim()}
                className="w-full"
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Researching...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Conduct Research
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
                  Research Results
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
                Your research results will appear here
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
