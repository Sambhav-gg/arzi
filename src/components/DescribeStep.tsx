import { docList, type DocId } from "@/lib/documents";
import { PrimaryButton } from "./ui";

export function DescribeStep({
  problem,
  onProblemChange,
  onNext,
  onPick,
  loading,
}: {
  problem: string;
  onProblemChange: (s: string) => void;
  onNext: () => void;
  onPick: (id: DocId) => void;
  loading: boolean;
}) {
  return (
    <section>
      <label htmlFor="problem" className="mb-2 block font-semibold">
        Kya problem hai? Jaise kisi dost ko batate, waise likhiye.
      </label>
      <textarea
        id="problem"
        value={problem}
        onChange={(e) => onProblemChange(e.target.value)}
        rows={5}
        placeholder="Jaise: Mere account se bank ne ₹590 kaat liye, jabki mera zero balance account hai"
        className="w-full rounded-xl border border-line bg-card p-4 text-base outline-none focus:border-indigo focus:ring-2 focus:ring-indigo/20"
      />

      <div className="mt-3 flex flex-wrap gap-2">
        {docList.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => onProblemChange(d.examples[0])}
            className="rounded-full border border-line bg-card px-3 py-1.5 text-left text-xs text-muted hover:border-indigo/50 hover:text-ink"
          >
            {d.examples[0]}
          </button>
        ))}
      </div>

      <div className="mt-5 flex justify-end">
        <PrimaryButton
          onClick={onNext}
          loading={loading}
          loadingText="Samajh rahe hain..."
          disabled={problem.trim().length < 10}
        >
          Aage badho
        </PrimaryButton>
      </div>

      <div className="mt-10">
        <p className="mb-3 text-sm font-semibold text-muted">Ya seedha document chuniye</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {docList.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => onPick(d.id)}
              className="rounded-xl border border-line bg-card p-4 text-left transition hover:border-accent/50 hover:shadow-sm"
            >
              <span className="block font-semibold">{d.title}</span>
              <span className="block text-sm text-muted">{d.titleHi}</span>
              <span className="mt-1 block text-xs text-muted">{d.tagline}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
