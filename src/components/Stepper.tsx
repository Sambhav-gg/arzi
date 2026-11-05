export type Step = "describe" | "details" | "result";

const steps: { id: Step; label: string }[] = [
  { id: "describe", label: "Problem" },
  { id: "details", label: "Details" },
  { id: "result", label: "Letter" },
];

export function Stepper({ step }: { step: Step }) {
  const current = steps.findIndex((s) => s.id === step);
  return (
    <ol className="mb-6 flex items-center gap-2 text-sm" aria-label="Progress">
      {steps.map((s, i) => (
        <li key={s.id} className="flex items-center gap-2">
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
              i <= current ? "bg-accent text-white" : "bg-line text-muted"
            }`}
          >
            {i + 1}
          </span>
          <span className={i === current ? "font-semibold" : "text-muted"}>{s.label}</span>
          {i < steps.length - 1 && <span className="mx-1 h-px w-6 bg-line sm:w-10" />}
        </li>
      ))}
    </ol>
  );
}
