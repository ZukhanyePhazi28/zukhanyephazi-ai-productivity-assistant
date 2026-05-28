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
import { generateEmail } from "@/lib/ai-tools.functions";
import { Loader2, Wand2, Copy, Check, Pencil, Save } from "lucide-react";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — AI Workplace" },
      { name: "description", content: "Generate professional emails with AI." },
      { property: "og:title", content: "Smart Email Generator — AI Workplace" },
      { property: "og:description", content: "Generate professional emails with AI." },
    ],
  }),
  component: EmailPage,
});

function EmailPage() {
  const [purpose, setPurpose] = useState("");
  const [tone, setTone] = useState("professional");
  const [recipient, setRecipient] = useState("");
  const [keyPoints, setKeyPoints] = useState("");
  const [output, setOutput] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateFn = useServerFn(generateEmail);

  const mutation = useMutation({
    mutationFn: generateFn,
    onSuccess: (data) => {
      setOutput(data.text);
      setIsEditing(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!purpose.trim()) return;
    mutation.mutate({
      data: {
        purpose,
        tone: tone as "professional" | "friendly" | "formal" | "casual",
        recipient: recipient || undefined,
        keyPoints: keyPoints || undefined,
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
      title="Smart Email Generator"
      description="Describe what you need to communicate, and AI will draft a professional email for you."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Card>
            <CardContent className="space-y-4 p-5">
              <div className="space-y-2">
                <Label htmlFor="purpose">Purpose of the email</Label>
                <Textarea
                  id="purpose"
                  placeholder="e.g., Request a project deadline extension from my manager..."
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  rows={3}
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="tone">Tone</Label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger id="tone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="friendly">Friendly</SelectItem>
                      <SelectItem value="formal">Formal</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recipient">Recipient (optional)</Label>
                  <Input
                    id="recipient"
                    placeholder="e.g., John Smith, Manager"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="keyPoints">Key points to include (optional)</Label>
                <Textarea
                  id="keyPoints"
                  placeholder="List any specific details, numbers, or points that must be included..."
                  value={keyPoints}
                  onChange={(e) => setKeyPoints(e.target.value)}
                  rows={3}
                />
              </div>

              <Button
                type="submit"
                disabled={mutation.isPending || !purpose.trim()}
                className="w-full"
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate Email
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
                  Generated Output
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
                Your generated email will appear here
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
