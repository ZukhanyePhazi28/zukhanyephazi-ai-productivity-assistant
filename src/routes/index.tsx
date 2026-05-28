import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AiDisclaimer } from "@/components/ai-disclaimer";
import {
  Mail,
  FileText,
  ListChecks,
  Search,
  MessageSquare,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — AI Workplace Productivity Assistant" },
      { name: "description", content: "Your AI-powered workplace productivity dashboard." },
      { property: "og:title", content: "Dashboard — AI Workplace Productivity Assistant" },
      { property: "og:description", content: "Your AI-powered workplace productivity dashboard." },
    ],
  }),
  component: DashboardPage,
});

const tools = [
  {
    title: "Smart Email Generator",
    description: "Generate professional emails in seconds with AI-powered suggestions.",
    icon: Mail,
    href: "/email",
    color: "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400",
  },
  {
    title: "Meeting Notes Summarizer",
    description: "Transform raw meeting notes into structured, actionable summaries.",
    icon: FileText,
    href: "/meeting-notes",
    color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400",
  },
  {
    title: "AI Task Planner",
    description: "Break down goals into prioritized, actionable tasks with AI assistance.",
    icon: ListChecks,
    href: "/task-planner",
    color: "bg-violet-50 text-violet-600 dark:bg-violet-950/30 dark:text-violet-400",
  },
  {
    title: "AI Research Assistant",
    description: "Get comprehensive research summaries and insights on any topic.",
    icon: Search,
    href: "/research",
    color: "bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400",
  },
  {
    title: "AI Chatbot",
    description: "Ask anything and get intelligent, contextual responses in real time.",
    icon: MessageSquare,
    href: "/chat",
    color: "bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400",
  },
];

function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      <div className="space-y-2">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">
          Welcome to your AI Workplace
        </h1>
        <p className="text-lg text-muted-foreground">
          Automate tasks, draft communications, and boost productivity with AI-powered tools.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {tools.map((tool) => (
          <Link key={tool.href} to={tool.href}>
            <Card className="group h-full cursor-pointer transition-all hover:shadow-md hover:border-primary/30">
              <CardHeader className="pb-3">
                <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${tool.color}`}>
                  <tool.icon className="h-5 w-5" />
                </div>
                <CardTitle className="font-heading text-base font-semibold">
                  {tool.title}
                </CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  {tool.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center text-sm font-medium text-primary group-hover:underline">
                  Get started <ArrowRight className="ml-1 h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <AiDisclaimer />
    </div>
  );
}
