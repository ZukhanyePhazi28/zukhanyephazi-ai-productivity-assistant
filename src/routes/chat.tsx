import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AiDisclaimer } from "@/components/ai-disclaimer";
import { Card, CardContent } from "@/components/ui/card";
import { Send, Loader2, User, Bot, Copy, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chatbot — AI Workplace" },
      { name: "description", content: "Chat with your AI workplace assistant." },
      { property: "og:title", content: "AI Chatbot — AI Workplace" },
      { property: "og:description", content: "Chat with your AI workplace assistant." },
    ],
  }),
  component: ChatPage,
});

const transport = new DefaultChatTransport({ api: "/api/chat" });

function ChatPage() {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { messages, sendMessage, status, error } = useChat({
    id: "workplace-chat",
    transport,
  });

  const isLoading = status === "submitted" || status === "streaming";

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (!isLoading) {
      textareaRef.current?.focus();
    }
  }, [isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input.trim() });
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const textParts = (msg: (typeof messages)[number]) =>
    msg.parts
      .filter((p) => p.type === "text")
      .map((p) => p.text)
      .join("");

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col">
      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="space-y-1">
            <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
              AI Chatbot
            </h1>
            <p className="text-muted-foreground">
              Ask anything about your work, get help drafting content, or brainstorm ideas.
            </p>
          </div>

          {messages.length === 0 && (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Bot className="h-6 w-6" />
                </div>
                <h3 className="font-heading text-lg font-semibold">
                  How can I help you today?
                </h3>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  Ask questions, get help with writing, brainstorm ideas, or get workplace advice.
                </p>
                <div className="mt-6 grid w-full max-w-sm gap-2">
                  {[
                    "Help me write a project proposal",
                    "Summarize the key principles of agile methodology",
                    "What are good time management strategies?",
                    "Draft a follow-up email after a job interview",
                  ].map((suggestion) => (
                    <Button
                      key={suggestion}
                      variant="outline"
                      className="justify-start text-left text-sm font-normal"
                      onClick={() => {
                        sendMessage({ text: suggestion });
                      }}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {messages.map((msg) => {
            const text = textParts(msg);
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {msg.role === "user" ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                </div>
                <div
                  className={`flex max-w-[85%] flex-col gap-1 ${
                    msg.role === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-card text-foreground shadow-sm border border-border"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <p>{text}</p>
                    ) : (
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {text}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                  {msg.role === "assistant" && text && (
                    <div className="flex gap-1">
                      <CopyButton text={text} />
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <Bot className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-1 rounded-2xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground shadow-sm">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: "0ms" }} />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: "150ms" }} />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: "300ms" }} />
                <span className="ml-2 text-xs">Thinking...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
              Something went wrong: {error.message}. Please try again.
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t bg-card p-4">
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-3xl gap-3"
        >
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask your AI assistant..."
            rows={1}
            className="min-h-[44px] resize-none py-3"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            size="icon"
            className="h-[44px] w-[44px] shrink-0"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
        <div className="mx-auto mt-2 max-w-3xl">
          <AiDisclaimer />
        </div>
      </div>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCopy}>
      {copied ? (
        <Check className="h-3 w-3" />
      ) : (
        <Copy className="h-3 w-3" />
      )}
    </Button>
  );
}
