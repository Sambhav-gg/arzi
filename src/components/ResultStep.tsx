"use client";

import { useState } from "react";
import { documents, type DocId } from "@/lib/documents";
import { SecondaryButton } from "./ui";

export function ResultStep({
  docId,
  draft,
  onDraftChange,
  warnings,
  notice,
  onEdit,
  onStartOver,
}: {
  docId: DocId;
  draft: string;
  onDraftChange: (s: string) => void;
  warnings: string[];
  notice: string;
  onEdit: () => void;
  onStartOver: () => void;
}) {
  const doc = documents[docId];
  const [copied, setCopied] = useState(false);
  const [done, setDone] = useState<boolean[]>([]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(draft);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked; the text is still selectable in the textarea.
    }
  }

  return (
    <section>
      <div className="mb-4 rounded-xl border border-ok/30 bg-ok/5 px-4 py-3 text-sm text-ok">
        Aapka <strong>{doc.title}</strong> taiyar hai. Neeche padhiye aur zaroorat ho toh wahin edit kijiye.
      </div>

      {notice && (
        <div className="mb-4 rounded-xl border border-indigo/30 bg-indigo/5 px-4 py-3 text-sm text-indigo">
          <span className="mr-2 rounded bg-indigo px-1.5 py-0.5 text-xs font-semibold text-white">TEMPLATE</span>
          {notice}
        </div>
      )}

      {warnings.length > 0 && (
        <div className="mb-4 rounded-xl border border-warn/30 bg-warn-soft px-4 py-3 text-sm text-warn">
          <p className="mb-1 font-semibold">Print se pehle check kijiye:</p>
          <ul className="list-disc pl-5">
            {warnings.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mb-3 flex flex-wrap gap-2">
        <SecondaryButton onClick={() => window.print()}>Print / PDF</SecondaryButton>
        <SecondaryButton onClick={copy}>{copied ? "Copied" : "Copy"}</SecondaryButton>
        <a
          href={`https://wa.me/?text=${encodeURIComponent(draft)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-line bg-card px-3 py-2 text-sm hover:border-indigo/50"
        >
          WhatsApp
        </a>
        <SecondaryButton onClick={onEdit}>Details badliye</SecondaryButton>
      </div>

      <label htmlFor="draft" className="sr-only">
        Letter
      </label>
      <textarea
        id="draft"
        value={draft}
        onChange={(e) => onDraftChange(e.target.value)}
        rows={24}
        className="w-full rounded-xl border border-line bg-white p-5 font-serif text-[15px] leading-relaxed shadow-sm outline-none focus:border-indigo"
      />

      <div className="mt-6 rounded-xl border border-line bg-card p-5">
        <h3 className="mb-3 font-semibold">Aage kya karein</h3>
        <ol className="grid gap-2">
          {doc.nextSteps.map((step, i) => (
            <li key={step}>
              <label className="flex cursor-pointer gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={!!done[i]}
                  onChange={(e) => setDone((d) => Object.assign([...d], { [i]: e.target.checked }))}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--accent)]"
                />
                <span className={done[i] ? "text-muted line-through" : ""}>{step}</span>
              </label>
            </li>
          ))}
        </ol>
        <p className="mt-4 border-t border-line pt-3 text-xs text-muted">
          Official links:{" "}
          {doc.sources.map((s, i) => (
            <span key={s.url}>
              {i > 0 && ", "}
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-ink">
                {s.label}
              </a>
            </span>
          ))}
        </p>
      </div>

      <div className="mt-6 flex justify-center">
        <button type="button" onClick={onStartOver} className="text-sm text-muted underline hover:text-ink">
          Naya letter shuru kijiye
        </button>
      </div>
    </section>
  );
}
