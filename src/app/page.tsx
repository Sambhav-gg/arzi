"use client";

import { useState } from "react";
import { DescribeStep } from "@/components/DescribeStep";
import { DetailsStep } from "@/components/DetailsStep";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ResultStep } from "@/components/ResultStep";
import { Stepper, type Step } from "@/components/Stepper";
import { documents, missingRequired, type DocId, type OutputLanguage } from "@/lib/documents";

async function post<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Kuch gadbad ho gayi. Dobara try kijiye.");
  return data;
}

export default function Home() {
  const [step, setStep] = useState<Step>("describe");
  const [problem, setProblem] = useState("");
  const [docId, setDocId] = useState<DocId>("rti");
  const [summary, setSummary] = useState("");
  const [values, setValues] = useState<Record<string, string>>({});
  const [language, setLanguage] = useState<OutputLanguage>("English");
  const [draft, setDraft] = useState("");
  const [warnings, setWarnings] = useState<string[]>([]);
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState<"classify" | "draft" | null>(null);
  const [error, setError] = useState("");
  const [showMissing, setShowMissing] = useState(false);

  function openDetails(id: DocId, summaryText = "") {
    setDocId(id);
    setSummary(summaryText);
    setShowMissing(false);
    setStep("details");
  }

  async function classify() {
    setError("");
    setLoading("classify");
    try {
      const data = await post<{ docType: DocId; summary: string; fields: Record<string, string> }>(
        "/api/classify",
        { problem },
      );
      setValues((prev) => ({ ...prev, ...data.fields }));
      openDetails(data.docType, data.summary);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(null);
    }
  }

  async function makeDraft() {
    if (missingRequired(documents[docId], values).length > 0) {
      setShowMissing(true);
      setError("Laal nishaan wale zaroori sawaal bhar dijiye.");
      return;
    }
    setError("");
    setLoading("draft");
    try {
      const data = await post<{ draft: string; notice?: string; warnings: string[] }>("/api/draft", {
        docType: docId,
        values,
        language,
      });
      setDraft(data.draft);
      setWarnings(data.warnings);
      setNotice(data.notice ?? "");
      setStep("result");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(null);
    }
  }

  function startOver() {
    setStep("describe");
    setProblem("");
    setValues({});
    setDraft("");
    setWarnings([]);
    setNotice("");
    setSummary("");
    setError("");
  }

  return (
    <>
      <main className="mx-auto max-w-3xl px-4 pb-24 pt-6 sm:pt-10 print:hidden">
        <Header />
        <Stepper step={step} />

        {error && (
          <div role="alert" className="mb-4 rounded-lg border border-accent/30 bg-accent-soft px-4 py-3 text-sm text-accent">
            {error}
          </div>
        )}

        {step === "describe" && (
          <DescribeStep
            problem={problem}
            onProblemChange={setProblem}
            onNext={classify}
            onPick={(id) => openDetails(id)}
            loading={loading === "classify"}
          />
        )}

        {step === "details" && (
          <DetailsStep
            docId={docId}
            onDocChange={setDocId}
            summary={summary}
            values={values}
            onValueChange={(key, value) => setValues((prev) => ({ ...prev, [key]: value }))}
            showMissing={showMissing}
            language={language}
            onLanguageChange={setLanguage}
            onBack={() => setStep("describe")}
            onSubmit={makeDraft}
            loading={loading === "draft"}
          />
        )}

        {step === "result" && (
          <ResultStep
            docId={docId}
            draft={draft}
            onDraftChange={setDraft}
            warnings={warnings}
            notice={notice}
            onEdit={() => setStep("details")}
            onStartOver={startOver}
          />
        )}

        <Footer />
      </main>

      <div id="print-area">{draft}</div>
    </>
  );
}
