import type { DocType } from "./documents";

export function checkDraft(doc: DocType, values: Record<string, string>, draft: string): string[] {
  const warnings: string[] = [];

  if (draft.length < 300) {
    warnings.push("Letter bahut chhota hai. Ek baar dhyaan se padh lijiye.");
  }
  if (/[#*]{2,}|^#+\s/m.test(draft)) {
    warnings.push("Letter mein formatting symbols (# ya **) reh gaye hain. Print se pehle hata dijiye.");
  }

  // In non-Latin scripts the name is transliterated, so this check can't work there.
  const name = values.applicantName;
  if (name && isLatinScript(draft) && !draft.toLowerCase().includes(name.toLowerCase())) {
    warnings.push("Aapka naam letter mein nahi mila. Signature wala hissa check kijiye.");
  }

  if (doc.id === "bank") {
    const phone = (values.phone || "").replace(/\D/g, "");
    const longNumbers = (draft.match(/\b\d{9,18}\b/g) || []).filter((n) => !phone.includes(n));
    if (longNumbers.length > 0) {
      warnings.push("Letter mein ek lamba number hai. Poora account/card number mat likhiye, sirf aakhri 4 digit.");
    }
  }

  const blanks = draft
    .split("\n")
    .filter((line) => !/signature|हस्ताक्षर/i.test(line))
    .reduce((n, line) => n + (line.match(/_{5,}/g) || []).length, 0);
  if (blanks > 0) {
    warnings.push(`${blanks} jagah khaali hai (_____). Print karke haath se bhariye.`);
  }

  return warnings;
}

function isLatinScript(text: string): boolean {
  return (text.match(/[a-z]/gi) || []).length > text.length * 0.5;
}
