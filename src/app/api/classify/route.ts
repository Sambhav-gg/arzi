import { NextResponse } from "next/server";
import { chat, extractJson, hasApiKey } from "@/lib/bharatcode";
import { allFields, documents, isDocId, type DocId } from "@/lib/documents";
import { classifyMessages, keywordClassify } from "@/lib/prompts";

interface ModelReply {
  docType?: string;
  summary?: string;
  fields?: Record<string, unknown>;
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const problem = typeof body?.problem === "string" ? body.problem.trim() : "";

  if (problem.length < 10) {
    return NextResponse.json({ error: "Thoda aur detail mein bataiye." }, { status: 400 });
  }
  if (problem.length > 4000) {
    return NextResponse.json({ error: "Problem 4000 characters se chhoti likhiye." }, { status: 400 });
  }

  if (hasApiKey() && process.env.ARZI_DEMO !== "1") {
    try {
      const reply = extractJson<ModelReply>(
        await chat(classifyMessages(problem), { temperature: 0.1, maxTokens: 4000 }),
      );
      if (reply && isDocId(reply.docType)) {
        return NextResponse.json({
          docType: reply.docType,
          summary: typeof reply.summary === "string" ? reply.summary : "",
          fields: sanitizeFields(reply.docType, reply.fields),
        });
      }
    } catch (err) {
      console.error("classify: model failed, using keywords", err);
    }
  }

  return NextResponse.json({ docType: keywordClassify(problem), summary: "", fields: {} });
}

function sanitizeFields(docType: DocId, raw: unknown): Record<string, string> {
  if (!raw || typeof raw !== "object") return {};
  const out: Record<string, string> = {};
  for (const f of allFields(documents[docType])) {
    const v = (raw as Record<string, unknown>)[f.key];
    if (typeof v !== "string" && typeof v !== "number") continue;
    const value = String(v).trim().slice(0, 2000);
    if (!value) continue;
    if (f.options && !f.options.includes(value)) continue;
    if (f.type === "date" && !/^\d{4}-\d{2}-\d{2}$/.test(value)) continue;
    out[f.key] = value;
  }
  return out;
}
