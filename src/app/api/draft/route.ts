import { NextResponse } from "next/server";
import { BharatCodeError, chat, hasApiKey } from "@/lib/bharatcode";
import { checkDraft } from "@/lib/check";
import {
  allFields,
  documents,
  isDocId,
  isOutputLanguage,
  missingRequired,
  type DocId,
  type OutputLanguage,
} from "@/lib/documents";
import { draftMessages } from "@/lib/prompts";
import { templateDraft } from "@/lib/templates";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  if (!isDocId(body?.docType)) {
    return NextResponse.json({ error: "Unknown document type." }, { status: 400 });
  }
  const docId: DocId = body.docType;
  const doc = documents[docId];
  const language: OutputLanguage = isOutputLanguage(body?.language) ? body.language : "English";

  const values: Record<string, string> = {};
  for (const f of allFields(doc)) {
    const v = body?.values?.[f.key];
    if (typeof v === "string" && v.trim()) values[f.key] = v.trim().slice(0, 3000);
  }

  const missing = missingRequired(doc, values);
  if (missing.length > 0) {
    return NextResponse.json(
      { error: "Kuch zaroori details baaki hain.", missing: missing.map((f) => f.key) },
      { status: 422 },
    );
  }

  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });

  const respond = (draft: string, notice?: string) =>
    NextResponse.json({ draft, notice, warnings: checkDraft(doc, values, draft) });

  const fromTemplate = (reason: string) => {
    const langNote = language === "English" ? "" : ` Template sirf English mein hai, ${language} ke liye AI chahiye.`;
    return respond(templateDraft(docId, values, today), reason + langNote);
  };

  if (process.env.ARZI_DEMO === "1" || !hasApiKey()) {
    return fromTemplate("Demo mode: yeh letter AI se nahi, fixed template se bana hai.");
  }

  try {
    const draft = await chat(draftMessages(doc, values, language, today), { temperature: 0.3, maxTokens: 8000 });
    return respond(draft.replace(/^```[a-z]*\n?|```$/gim, "").trim());
  } catch (err) {
    console.error("draft: model failed, using template", err);
    const noAccess = err instanceof BharatCodeError && err.status === 402;
    return fromTemplate(
      noAccess
        ? "BharatCode account pe API access on nahi hai, isliye yeh letter fixed template se bana hai."
        : "BharatCode AI se jawab nahi aaya, isliye yeh letter fixed template se bana hai.",
    );
  }
}
