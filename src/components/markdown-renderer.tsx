import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
  editable?: boolean;
  onChange?: (value: string) => void;
}

export function MarkdownRenderer({ content, editable, onChange }: MarkdownRendererProps) {
  if (editable && onChange) {
    return (
      <textarea
        value={content}
        onChange={(e) => onChange(e.target.value)}
        className="h-full min-h-[300px] w-full resize-y rounded-lg border border-input bg-background p-4 font-mono text-sm leading-relaxed text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
    );
  }

  return (
    <div className="prose prose-sm max-w-none dark:prose-invert">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
