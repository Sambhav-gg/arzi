# Arzi (अर्ज़ी)

Arzi writes formal complaints and applications for people in India. Describe the problem in Hindi, English, Hinglish or another Indian language, fill in a few details, and get a letter in the right format plus a list of what to do next.

Built for the BharatCode Build League on the BharatCode model API.

## Documents

| Document | Use it when |
|---|---|
| RTI Application | You need information or a status update from a government office |
| RTI First Appeal | Your RTI got no reply in 30 days, or a bad one |
| Bank Complaint | Wrong charges, a failed transaction that wasn't refunded, fraud |
| Consumer Complaint Notice | Defective product, refund refused, poor service |
| Civic / Utility Complaint | Water, electricity, roads, garbage, streetlights |

## How it works

1. **Intake.** The model reads the problem, picks the document type and pulls out any details already given. If the model is unavailable, a keyword match picks the type.
2. **Details.** A form asks for the remaining fields. Required fields are enforced in code.
3. **Draft.** The model writes the letter in the chosen language, using the document's rules and a list of checked facts (fees, deadlines, sections). It is told not to invent anything and to leave `__________` for missing details.
4. **Check.** The draft is scanned for a missing name, a full account number, leftover markdown and blanks to fill.
5. **Next steps.** A checklist of where to submit, how long to wait and what to do if there is no reply.

Fees, deadlines and legal sections live in [`src/lib/documents.ts`](src/lib/documents.ts), not in the model. If the API is unavailable, Arzi falls back to a fixed English template so the user still gets a letter.

## Project structure

```
src/
  app/
    page.tsx              flow and state
    api/classify/         problem -> document type + extracted fields
    api/draft/            fields -> letter (AI, or template fallback)
  components/             UI for each step
  lib/
    documents.ts          document types, fields, rules, facts, next steps
    prompts.ts            prompts for intake and drafting
    bharatcode.ts         BharatCode API client
    check.ts              checks on the generated letter
    templates.ts          template letters used without AI
```

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

| Variable | Default | |
|---|---|---|
| `BHARATCODE_API_KEY` | | Needs Lite, Pro or student access |
| `BHARATCODE_BASE_URL` | `https://bharatcode.ai/api/model/v1` | |
| `BHARATCODE_MODEL` | `qwen-3.8-27b` | |
| `ARZI_DEMO` | | Set to `1` to always use templates |

## Adding a document type

Add an entry to `documents` in `src/lib/documents.ts` and a template in `src/lib/templates.ts`. The form, prompts and checklist pick it up from there. State-specific rules are a good place to contribute.

## Privacy

There is no database. Details are sent to the BharatCode API only to write the letter. The bank form asks for the last 4 digits of the account, and the check warns if a full number appears.

## Disclaimer

Arzi helps with drafting. It is not legal advice. Read the letter before sending it, and for serious matters talk to a lawyer or free legal aid ([NALSA](https://nalsa.gov.in/), 15100).
