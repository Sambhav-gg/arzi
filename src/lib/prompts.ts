import type { ChatMessage } from "./bharatcode";
import { allFields, docList, type DocId, type DocType, type OutputLanguage } from "./documents";

export function classifyMessages(problem: string): ChatMessage[] {
  const catalogue = docList
    .map((d) => {
      const fields = allFields(d)
        .map((f) => `    - ${f.key}: ${f.label}${f.options ? ` (one of: ${f.options.join(" | ")})` : ""}`)
        .join("\n");
      return `- id "${d.id}": ${d.title}. ${d.tagline}\n  fields:\n${fields}`;
    })
    .join("\n");

  const system = `You are the intake step of Arzi, which helps people in India write formal complaints and applications.

The user describes a problem in any language (Hindi, English, Hinglish or another Indian language).
Pick the ONE document type that fits best, and extract field values the user has ALREADY stated.

Document types:
${catalogue}

Routing:
- Bank, ATM, UPI debit, card or loan problems: "bank".
- Problems with a company, shop, online order or service provider: "consumer".
- Wants information or status from a government office: "rti".
- Already filed an RTI and got no reply or a bad reply: "rti_appeal".
- Water, electricity, roads, garbage, streetlights, drainage, local body issues: "civic".

Rules:
- Only fill a field if the user clearly said it. Never guess names, numbers, dates or addresses.
- Date fields must be YYYY-MM-DD. Fill them only if day and month are known; assume the year is ${new Date().getFullYear()} if not given.
- For select fields, use exactly one of the listed options, or leave the field out.
- Keep extracted values close to the user's own words.
- "summary" is one short sentence in simple Hinglish saying what the user should do first.

Reply with ONLY a JSON object:
{"docType": "<id>", "summary": "<one sentence>", "fields": {"<fieldKey>": "<value>"}}`;

  return [
    { role: "system", content: system },
    { role: "user", content: problem },
  ];
}

export function keywordClassify(problem: string): DocId {
  const p = problem.toLowerCase();
  const has = (...words: string[]) => words.some((w) => p.includes(w));
  if (has("rti") && has("appeal", "jawab nahi", "reply nahi", "no reply", "reject")) return "rti_appeal";
  if (has("rti", "information", "jaankari", "jankari", "status", "सूचना")) return "rti";
  if (has("bank", "atm", "upi", "account", "card", "loan", "बैंक", "khata", "kat gaye", "debit")) return "bank";
  if (
    has("paani", "pani", "water", "bijli", "electricity", "sadak", "road", "kachra", "garbage", "streetlight", "naali", "drain", "nagar nigam", "municipal")
  )
    return "civic";
  return "consumer";
}

export function draftMessages(
  doc: DocType,
  values: Record<string, string>,
  language: OutputLanguage,
  today: string,
): ChatMessage[] {
  const details = allFields(doc)
    .filter((f) => values[f.key])
    .map((f) => `- ${f.label} [${f.key}]: ${values[f.key]}`)
    .join("\n");

  const languageRule =
    language === "English"
      ? "Write the whole document in clear, formal Indian English."
      : `Write the whole document in formal ${language}, in its native script. The first time an Act is named, give the ${language} name followed by the English name in brackets.`;

  const system = `You are Arzi. You write formal Indian ${doc.title} documents for ordinary citizens.

DOCUMENT RULES:
${doc.rules.map((r, i) => `${i + 1}. ${r}`).join("\n")}

VERIFIED FACTS (the only legal facts, fees, deadlines and section numbers you may use):
${doc.facts.map((f) => `- ${f.label}: ${f.value}`).join("\n")}

GENERAL RULES:
- ${languageRule}
- Use only the details the user gave. Never invent names, numbers, dates, amounts, addresses or reference numbers.
- Do not add factual claims the user did not make, even likely ones (e.g. "no prior notice was received", "no earlier complaint was made", "this is a Jan Dhan account"). You may state the legal consequence of the facts given.
- If the format needs a detail that is missing, write "__________" so the user can fill it by hand.
- Turn informal or emotional wording into calm, precise, formal language without dropping any fact.
- Date the letter ${today}.
- Output only the final document as plain text. No markdown, no commentary.`;

  return [
    { role: "system", content: system },
    { role: "user", content: `Draft the ${doc.title} using these details:\n${details}` },
  ];
}
