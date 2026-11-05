export function PrimaryButton({
  onClick,
  loading,
  loadingText,
  disabled,
  children,
}: {
  onClick: () => void;
  loading?: boolean;
  loadingText?: string;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading || disabled}
      className="rounded-lg bg-accent px-6 py-3 font-semibold text-white shadow-sm transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading ? loadingText : children}
    </button>
  );
}

export function SecondaryButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-lg border border-line bg-card px-3 py-2 text-sm hover:border-indigo/50"
    >
      {children}
    </button>
  );
}

export function FormSection({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <fieldset className="mb-5 rounded-xl border border-line bg-card p-5">
      <legend className="px-1 font-semibold">{title}</legend>
      {note && <p className="-mt-1 mb-3 text-xs text-muted">{note}</p>}
      <div className="grid gap-4">{children}</div>
    </fieldset>
  );
}
