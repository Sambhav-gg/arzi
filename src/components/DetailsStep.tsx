import {
  applicantFields,
  docList,
  documents,
  outputLanguages,
  type DocId,
  type DocType,
  type Field,
  type OutputLanguage,
} from "@/lib/documents";
import { FieldInput } from "./FieldInput";
import { FormSection, PrimaryButton } from "./ui";

export function DetailsStep({
  docId,
  onDocChange,
  summary,
  values,
  onValueChange,
  showMissing,
  language,
  onLanguageChange,
  onBack,
  onSubmit,
  loading,
}: {
  docId: DocId;
  onDocChange: (id: DocId) => void;
  summary: string;
  values: Record<string, string>;
  onValueChange: (key: string, value: string) => void;
  showMissing: boolean;
  language: OutputLanguage;
  onLanguageChange: (l: OutputLanguage) => void;
  onBack: () => void;
  onSubmit: () => void;
  loading: boolean;
}) {
  const doc = documents[docId];

  const renderField = (f: Field) => (
    <FieldInput
      key={f.key}
      field={f}
      value={values[f.key] ?? ""}
      onChange={(v) => onValueChange(f.key, v)}
      invalid={showMissing && !!f.required && !values[f.key]?.trim()}
    />
  );

  return (
    <section>
      <div className="mb-5 rounded-xl border border-line bg-card p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Aapke liye sahi document</p>
            <h2 className="mt-1 text-xl font-bold">{doc.title}</h2>
            <p className="text-muted">{doc.titleHi}</p>
          </div>
          <label className="text-sm">
            <span className="sr-only">Document badliye</span>
            <select
              value={docId}
              onChange={(e) => onDocChange(e.target.value as DocId)}
              className="rounded-md border border-line bg-paper px-2 py-1.5 text-sm"
            >
              {docList.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.title}
                </option>
              ))}
            </select>
          </label>
        </div>
        <p className="mt-3 text-sm">{doc.tagline}</p>
        {summary && <p className="mt-3 rounded-md bg-paper px-3 py-2 text-sm">{summary}</p>}
      </div>

      <Facts doc={doc} />

      <FormSection title="Problem ki details">{doc.fields.map(renderField)}</FormSection>

      <FormSection title="Aapki jaankari" note="Letter aapke naam se sign hoga.">
        {applicantFields.map(renderField)}
      </FormSection>

      <FormSection title="Letter kis bhasha mein chahiye?">
        <div className="flex flex-wrap gap-2">
          {outputLanguages.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => onLanguageChange(l)}
              className={`rounded-full border px-3 py-1.5 text-sm transition ${
                language === l ? "border-indigo bg-indigo text-white" : "border-line bg-card hover:border-indigo/50"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted">
          Sarkari daftar mein English ya Hindi sabse zyada chalti hai. Baaki bhashayein bhi kaam karti hain, bas ek baar
          dhyaan se padh lijiye.
        </p>
      </FormSection>

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <button type="button" onClick={onBack} className="rounded-lg px-4 py-3 text-muted hover:text-ink">
          Peeche
        </button>
        <PrimaryButton onClick={onSubmit} loading={loading} loadingText="Letter likh rahe hain...">
          Letter taiyar karo
        </PrimaryButton>
      </div>
    </section>
  );
}

function Facts({ doc }: { doc: DocType }) {
  return (
    <details className="mb-5 rounded-xl border border-indigo/20 bg-indigo/5 p-4" open>
      <summary className="cursor-pointer text-sm font-semibold text-indigo">Zaroori baatein</summary>
      <dl className="mt-3 grid gap-2 text-sm">
        {doc.facts.map((f) => (
          <div key={f.label} className="grid gap-0.5 sm:grid-cols-[10rem_1fr] sm:gap-3">
            <dt className="font-medium">{f.label}</dt>
            <dd className="text-muted">{f.value}</dd>
          </div>
        ))}
      </dl>
    </details>
  );
}
