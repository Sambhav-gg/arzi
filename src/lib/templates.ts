import type { DocId } from "./documents";

type Values = Record<string, string>;

const BLANK = "__________";

const val = (values: Values, key: string) => values[key] || BLANK;

function list(items: (string | false | undefined)[]): string {
  return items
    .filter((x): x is string => Boolean(x))
    .map((x, i) => `${i + 1}. ${x}`)
    .join("\n");
}

function numberLines(text: string): string {
  return list(
    text
      .split(/\n|(?<=[?.])\s+(?=[A-Z0-9])/)
      .map((l) => l.replace(/^\s*(\d+[.)]|[-*•])\s*/, "").trim()),
  );
}

function signature(values: Values, today: string, label: string): string {
  return [
    `Place: ${val(values, "place")}`,
    `Date: ${today}`,
    "",
    "Yours faithfully,",
    "",
    "(Signature)",
    `${label}: ${val(values, "applicantName")}`,
    `Address: ${val(values, "applicantAddress")}`,
    values.phone ? `Mobile: ${values.phone}` : null,
    values.email ? `Email: ${values.email}` : null,
  ]
    .filter((l) => l !== null)
    .join("\n");
}

const civicCategory: Record<string, string> = {
  Paani: "water supply",
  "Bijli / bill": "electricity / billing",
  "Sadak / gaddhe": "road / potholes",
  "Kachra / safai": "garbage / sanitation",
  Streetlight: "streetlight",
  "Naali / drainage": "drainage",
};

function rtiFeeLine(feeMode: string | undefined): string {
  if (feeMode === "BPL (fee maaf)") {
    return "I belong to the Below Poverty Line (BPL) category. A copy of my BPL certificate is enclosed, and I request exemption from the application fee.";
  }
  if (feeMode === "Online (rtionline.gov.in)") {
    return "The application fee of Rs. 10 has been paid online.";
  }
  return `The application fee of Rs. 10 is paid by ${feeMode || BLANK}, No. ${BLANK}, dated ${BLANK}.`;
}

const templates: Record<DocId, (values: Values, today: string) => string[]> = {
  rti: (values, today) => [
    "To,",
    "The Public Information Officer,",
    val(values, "publicAuthority"),
    values.authorityAddress ?? "",
    "",
    "Subject: Application under Section 6(1) of the Right to Information Act, 2005",
    "",
    "Sir/Madam,",
    "",
    "I request you to provide the following information under the Right to Information Act, 2005:",
    "",
    numberLines(val(values, "informationSought")),
    values.period ? `\nPeriod: ${values.period}` : "",
    "",
    rtiFeeLine(values.feeMode),
    "",
    "Please send the information to my address given below. If any part of it is held by another public authority, kindly transfer the application under Section 6(3) of the Act and inform me.",
    "",
    signature(values, today, "Applicant"),
  ],

  rti_appeal: (values, today) => [
    "To,",
    "The First Appellate Authority under the Right to Information Act, 2005,",
    val(values, "publicAuthority"),
    "",
    "Subject: First Appeal under Section 19(1) of the Right to Information Act, 2005",
    "",
    "Sir/Madam,",
    "",
    "Facts:",
    list([
      `I filed an application under Section 6(1) of the RTI Act, 2005 with the Public Information Officer, ${val(values, "publicAuthority")}, on ${val(values, "rtiDate")}${values.rtiRegNo ? ` (Registration/Tracking No. ${values.rtiRegNo})` : ""}.`,
      `The information sought was:\n${numberLines(val(values, "informationSought"))}`,
      `Status: ${val(values, "replyStatus")}${values.replyDate ? ` (reply dated ${values.replyDate})` : ""}.`,
    ]),
    "",
    "Grounds of Appeal:",
    list(
      values.replyStatus === "30 din mein koi jawab nahi aaya"
        ? [
            "No information was provided within 30 days as required under Section 7(1). This is deemed refusal under Section 7(2).",
            "As the time limit was not met, the information should be provided free of cost under Section 7(6).",
            values.grounds,
          ]
        : [
            "The reply of the Public Information Officer does not provide the complete and correct information sought.",
            "No valid reason under Section 8 of the Act has been given for withholding the information.",
            values.grounds,
          ],
    ),
    "",
    "Relief Sought:",
    list([
      "Direct the Public Information Officer to provide the complete information within a time fixed by this authority.",
      "Direct that the information be provided free of cost, where applicable under Section 7(6).",
    ]),
    "",
    "Enclosures:",
    list(["Copy of the RTI application", "Proof of postage / receipt", "Copy of the PIO's reply (if any)"]),
    "",
    signature(values, today, "Appellant"),
  ],

  bank: (values, today) => [
    "To,",
    "The Branch Manager,",
    `${val(values, "bankName")},`,
    `${val(values, "branch")} Branch`,
    "",
    `Subject: Complaint regarding account ending ${val(values, "accountLast4")}`,
    "",
    "Sir/Madam,",
    "",
    `I hold an account/card ending ${val(values, "accountLast4")} with your branch. I wish to bring the following to your notice:`,
    "",
    list([
      `Date of incident: ${val(values, "incidentDate")}`,
      values.amount && `Amount involved: Rs. ${values.amount.replace(/^(₹|rs\.?)\s*/i, "")}`,
      `Details: ${val(values, "issueDetails")}`,
      values.priorComplaint && `Earlier complaint reference: ${values.priorComplaint}`,
    ]),
    values.issueType === "Unauthorised / fraud transaction"
      ? "\nThis transaction was neither carried out nor authorised by me. Please block the account/card if not already done, and reverse the amount as per RBI rules on customer liability for unauthorised electronic banking transactions."
      : "",
    "",
    `Relief sought: ${val(values, "reliefSought")}`,
    "",
    "Kindly resolve this at the earliest and give me a written reply with a complaint reference number. If the complaint is not resolved within 30 days, I will approach the RBI Ombudsman under the Reserve Bank - Integrated Ombudsman Scheme, 2021.",
    "",
    signature(values, today, "Name"),
  ],

  consumer: (values, today) => [
    "To,",
    "The Grievance Officer / Customer Care Head,",
    val(values, "companyName"),
    values.companyAddress ?? "",
    "",
    `Subject: Notice regarding deficiency in service / defective goods: ${val(values, "productOrService")}`,
    "",
    "Sir/Madam,",
    "",
    list([
      `Product/Service: ${val(values, "productOrService")}`,
      `Order details: ${val(values, "orderDetails")}`,
      `Problem: ${val(values, "issueDetails")}`,
      values.priorContact && `Earlier complaints: ${values.priorContact}. The issue is still unresolved.`,
    ]),
    "",
    "This amounts to deficiency in service and/or unfair trade practice under the Consumer Protection Act, 2019.",
    "",
    `I request: ${val(values, "reliefSought")}, within 15 days of receipt of this notice.`,
    "",
    "If the matter is not resolved within this period, I will approach the National Consumer Helpline and the appropriate Consumer Disputes Redressal Commission and seek compensation and costs, without further notice.",
    "",
    signature(values, today, "Name"),
  ],

  civic: (values, today) => [
    "To,",
    val(values, "authorityName"),
    "",
    `Subject: Complaint regarding ${civicCategory[values.issueCategory] || "civic"} problem at ${val(values, "location")}`,
    "",
    "Sir/Madam,",
    "",
    "I wish to bring the following problem to your attention:",
    "",
    list([
      `Location: ${val(values, "location")}`,
      `Problem: ${val(values, "issueDetails")}`,
      values.since && `Since: ${values.since}`,
      values.consumerNumber && `Consumer/Connection No.: ${values.consumerNumber}`,
      values.priorComplaint && `Earlier complaint: ${values.priorComplaint}`,
    ]),
    "",
    "This is causing serious inconvenience to residents.",
    values.issueCategory === "Bijli / bill"
      ? "\nI request that the meter be tested and the bill revised, and that the supply not be disconnected while this dispute is pending."
      : "",
    "",
    "I request you to take action within 7 days and give a written acknowledgement with a complaint number.",
    "",
    signature(values, today, "Name"),
  ],
};

export function templateDraft(docId: DocId, values: Values, today: string): string {
  return templates[docId](values, today)
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
