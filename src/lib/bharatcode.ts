export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export class BharatCodeError extends Error {
  constructor(
    message: string,
    public status = 500,
  ) {
    super(message);
  }
}

const BASE_URL = (process.env.BHARATCODE_BASE_URL || "https://bharatcode.ai/api/model/v1").replace(/\/$/, "");
const MODEL = process.env.BHARATCODE_MODEL || "qwen-3.8-27b";

function apiKey(): string {
  return (process.env.BHARATCODE_API_KEY || "").trim().replace(/^["']|["']$/g, "");
}

export function hasApiKey(): boolean {
  return apiKey() !== "";
}

export async function chat(
  messages: ChatMessage[],
  { temperature = 0.3, maxTokens = 2000 }: { temperature?: number; maxTokens?: number } = {},
): Promise<string> {
  const key = apiKey();
  if (!key) throw new BharatCodeError("BHARATCODE_API_KEY is not set.", 503);

  const res = await fetch(`${BASE_URL}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({ model: MODEL, messages, temperature, max_tokens: maxTokens }),
    signal: AbortSignal.timeout(180_000),
  });

  if (res.status === 402) {
    throw new BharatCodeError("Account has no API access (needs Lite, Pro or student plan).", 402);
  }
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new BharatCodeError(`BharatCode API error ${res.status}: ${body.slice(0, 300)}`, 502);
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  if (typeof content !== "string" || !content.trim()) {
    throw new BharatCodeError("BharatCode API returned an empty response.", 502);
  }
  // Qwen can emit its reasoning inline.
  return content.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
}

export function extractJson<T>(text: string): T | null {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : text;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end <= start) return null;
  try {
    return JSON.parse(candidate.slice(start, end + 1)) as T;
  } catch {
    return null;
  }
}
