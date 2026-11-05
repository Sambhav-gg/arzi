import type { Field } from "@/lib/documents";

export function FieldInput({
  field,
  value,
  onChange,
  invalid,
}: {
  field: Field;
  value: string;
  onChange: (value: string) => void;
  invalid: boolean;
}) {
  const id = `f-${field.key}`;
  const className = `w-full rounded-lg border bg-paper px-3 py-2.5 text-base outline-none focus:border-indigo focus:ring-2 focus:ring-indigo/20 ${
    invalid ? "border-accent" : "border-line"
  }`;

  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium">
        {field.label}
        {field.required && <span className="text-accent"> *</span>}
      </label>

      {field.type === "textarea" ? (
        <textarea id={id} rows={3} value={value} onChange={(e) => onChange(e.target.value)} className={className} />
      ) : field.type === "select" ? (
        <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className={className}>
          <option value="">Chuniye</option>
          {field.options?.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          type={field.type === "date" ? "date" : "text"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={className}
        />
      )}

      {field.hint && <p className="mt-1 text-xs text-muted">{field.hint}</p>}
    </div>
  );
}
