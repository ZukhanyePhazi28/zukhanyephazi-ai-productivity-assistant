import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ToolLayout } from "@/components/tool-layout";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { summarizeMeetingNotes } from "@/lib/ai-tools.functions";
import { Loader2, Wand2, Copy, Check, Pencil, Save } from "lucide-react";

export const Route = createFileRoute("/meeting-notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — AI Workplace" },
      { name: "description", content: "Summarize meeting notes with AI." },
      { property: "og:title", content: "Meeting Notes Summarizer — AI Workplace" },
      { property: "og:description", content: "Summarize meeting notes with AI." },
    ],
  }),
  component: MeetingNotesPage,
});

function MeetingNotesPage() {
  const [notes, setNotes] = useState("");
  const [output, setOutput] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  const summarizeFn = useServerFn(summarizeMeetingNotes);

  const mutation = useMutation({
    mutationFn: summarizeFn,
    onSuccess: (data) => {
      setOutput(data.text);
      setIsEditing(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) return;
    mutation.mutate({ data: { notes } });
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout
      title="Meeting Notes Summarizer"
      description="Paste your raw meeting notes and get a structured, actionable summary instantly."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Card>
            <CardContent className="space-y-4 p-5">
              <div className="space-y-2">
                <Label htmlFor="notes">Meeting Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Paste your raw meeting notes here. Include attendees, discussion points, decisions made, and any action items..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={14}
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={mutation.isPending || !notes.trim()}
                className="w-full"
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Summarizing...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Summarize Notes
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
                  Structured Summary
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
                Your structured summary will appear here
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
