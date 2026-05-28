import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";

const EmailInput = z.object({
  purpose: z.string().min(1).max(500),
  tone: z.enum(["professional", "friendly", "formal", "casual"]).default("professional"),
  recipient: z.string().max(200).optional(),
  keyPoints: z.string().max(2000).optional(),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => EmailInput.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const gateway = createLovableAiGatewayProvider(key);
    const model = gateway("google/gemini-3-flash-preview");

    const { text } = await generateText({
      model,
      system:
        "You are an expert email writer. Write clear, professional, and effective emails. Include a subject line, greeting, body, and sign-off. Format with markdown.",
      prompt: `Write a ${data.tone} email for the following purpose: ${data.purpose}\n${data.recipient ? `Recipient: ${data.recipient}\n` : ""}${data.keyPoints ? `Key points to include:\n${data.keyPoints}` : ""}`,
    });

    return { text };
  });

const MeetingNotesInput = z.object({
  notes: z.string().min(10).max(10000),
});

export const summarizeMeetingNotes = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => MeetingNotesInput.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const gateway = createLovableAiGatewayProvider(key);
    const model = gateway("google/gemini-3-flash-preview");

    const { text } = await generateText({
      model,
      system:
        "You are a meeting notes summarizer. Summarize meeting notes into clear, actionable sections: Summary, Key Decisions, Action Items (with owners if mentioned), and Follow-ups. Use markdown formatting.",
      prompt: `Summarize these meeting notes:\n\n${data.notes}`,
    });

    return { text };
  });

const TaskPlannerInput = z.object({
  goal: z.string().min(1).max(500),
  constraints: z.string().max(1000).optional(),
  timeline: z.string().max(200).optional(),
});

export const planTasks = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => TaskPlannerInput.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const gateway = createLovableAiGatewayProvider(key);
    const model = gateway("google/gemini-3-flash-preview");

    const { text } = await generateText({
      model,
      system:
        "You are an expert project planner. Break down goals into actionable, prioritized tasks with clear descriptions. Use markdown with checkboxes for tasks. Group related tasks into phases or categories when appropriate.",
      prompt: `Plan tasks for the following goal: ${data.goal}\n${data.timeline ? `Timeline: ${data.timeline}\n` : ""}${data.constraints ? `Constraints/Context:\n${data.constraints}` : ""}`,
    });

    return { text };
  });

const ResearchInput = z.object({
  topic: z.string().min(1).max(500),
  depth: z.enum(["brief", "detailed", "comprehensive"]).default("detailed"),
  focus: z.string().max(500).optional(),
});

export const conductResearch = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ResearchInput.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const gateway = createLovableAiGatewayProvider(key);
    const model = gateway("google/gemini-3.1-pro-preview");

    const { text } = await generateText({
      model,
      system:
        "You are a thorough research assistant. Provide well-structured research on topics with key findings, context, and actionable insights. Use markdown headings, bullet points, and numbered lists. Always include a Sources / Further Reading section with suggestions for where to look next.",
      prompt: `Conduct ${data.depth} research on: ${data.topic}\n${data.focus ? `Specific focus: ${data.focus}` : ""}`,
    });

    return { text };
  });
