export type DocId = "rti" | "rti_appeal" | "bank" | "consumer" | "civic";

export interface Field {
  key: string;
  label: string;
  hint?: string;
  type: "text" | "textarea" | "date" | "select";
  required?: boolean;
  options?: string[];
}

export interface DocType {
  id: DocId;
  title: string;
  titleHi: string;
  tagline: string;
  examples: string[];
  fields: Field[];
  /** Drafting instructions for the model. */
  rules: string[];
  /** Checked by hand. Shown to the user and passed to the model as the only legal facts it may use. */
  facts: { label: string; value: string }[];
  nextSteps: string[];
  sources: { label: string; url: string }[];
}

export const applicantFields: Field[] = [
  { key: "applicantName", label: "Aapka poora naam", type: "text", required: true },
  {
    key: "applicantAddress",
    label: "Aapka pata",
    hint: "Jahan jawab aana chahiye",
    type: "textarea",
    required: true,
  },
  { key: "phone", label: "Mobile number", hint: "Optional", type: "text" },
  { key: "email", label: "Email", hint: "Optional", type: "text" },
  { key: "place", label: "Shehar / kasba", type: "text", required: true },
];

export const documents: Record<DocId, DocType> = {
  rti: {
    id: "rti",
    title: "RTI Application",
    titleHi: "सूचना का अधिकार आवेदन",
    tagline: "Kisi bhi sarkari office se jaankari maangiye. Section 6(1), RTI Act 2005.",
    examples: [
      "Mere ration card ki application 6 mahine se pending hai, status jaanna hai",
      "Hamari gali ki sadak ke liye kitna budget aaya aur kahan kharch hua",
    ],
    fields: [
      {
        key: "publicAuthority",
        label: "Kis office/vibhag se jaankari chahiye?",
        hint: "Jaise: Food & Civil Supplies Dept, Lucknow",
        type: "text",
        required: true,
      },
      {
        key: "authorityLevel",
        label: "Central ya State sarkar ka office?",
        type: "select",
        options: ["Central Government", "State Government / Local body", "Pata nahi"],
        required: true,
      },
      { key: "authorityAddress", label: "Office ka pata", hint: "Optional", type: "textarea" },
      {
        key: "informationSought",
        label: "Aapko kya-kya jaankari chahiye?",
        hint: "Seedhe sawaal likhiye, Arzi inhe sahi format mein badal dega",
        type: "textarea",
        required: true,
      },
      { key: "period", label: "Kis samay ki jaankari?", hint: "Optional, jaise: April 2024 se ab tak", type: "text" },
      {
        key: "feeMode",
        label: "Fee kaise denge?",
        type: "select",
        options: [
          "Indian Postal Order (IPO)",
          "Demand Draft",
          "Court fee stamp",
          "Online (rtionline.gov.in)",
          "Cash at office",
          "BPL (fee maaf)",
        ],
      },
    ],
    rules: [
      "Address it to: The Public Information Officer (PIO), followed by the office name and address.",
      "Subject line: Application under Section 6(1) of the Right to Information Act, 2005.",
      "List the information sought as numbered, specific, answerable points. Ask for information or certified copies of records, not opinions. Rephrase 'why' questions into requests for records, file notings or status, because 'why' questions are often rejected.",
      "Do not state any reason for seeking the information. Section 6(2) says none is required.",
      "Mention the fee with the mode the applicant chose, leaving the IPO/DD number as '__________'. If BPL, say a copy of the BPL certificate is attached and the fee is exempt.",
      "Ask for the information to be sent to the applicant's address, and for transfer under Section 6(3) if another authority holds it.",
      "Keep it concise. For Central Government authorities the RTI Rules, 2012 limit the application to 500 words.",
      "End with place, date, applicant's name and a signature line.",
    ],
    facts: [
      { label: "Fee (Central)", value: "₹10 (RTI Rules, 2012)" },
      { label: "Fee (State)", value: "State ke niyam ke hisaab se, zyadatar ₹10" },
      { label: "BPL", value: "Fee maaf, BPL certificate ki copy lagaiye" },
      { label: "Jawab ki deadline", value: "30 din (Section 7(1)). Jaan ya aazadi ka sawaal ho toh 48 ghante." },
      { label: "Kaaran batana?", value: "Zaroori nahi (Section 6(2))" },
    ],
    nextSteps: [
      "Application ki ek photocopy apne paas rakhiye.",
      "Fee (IPO/DD) lagakar Registered/Speed Post se bhejiye, ya office mein dekar receiving lijiye. Central vibhag ke liye rtionline.gov.in pe online bhi kar sakte hain.",
      "Post ki receipt aur tracking number sambhal ke rakhiye, appeal mein kaam aayega.",
      "30 din tak jawab ka intezaar kijiye.",
      "Jawab na aaye ya adhoora ho toh 30 din ke andar First Appeal kijiye. Arzi woh bhi likh dega.",
    ],
    sources: [
      { label: "RTI Act, 2005", url: "https://rti.gov.in/" },
      { label: "RTI Online (Central)", url: "https://rtionline.gov.in/" },
    ],
  },

  rti_appeal: {
    id: "rti_appeal",
    title: "RTI First Appeal",
    titleHi: "आरटीआई प्रथम अपील",
    tagline: "RTI ka jawab nahi aaya ya galat aaya? Section 19(1) ke tahat appeal.",
    examples: [
      "Maine 2 mahine pehle RTI daali thi, abhi tak koi jawab nahi aaya",
      "PIO ne meri RTI bina sahi kaaran ke reject kar di",
    ],
    fields: [
      { key: "publicAuthority", label: "Kis office mein RTI daali thi?", type: "text", required: true },
      { key: "rtiDate", label: "RTI kis date ko bheji thi?", type: "date", required: true },
      { key: "rtiRegNo", label: "RTI registration / post tracking number", hint: "Optional", type: "text" },
      {
        key: "replyStatus",
        label: "PIO ka jawab kya raha?",
        type: "select",
        options: [
          "30 din mein koi jawab nahi aaya",
          "Jawab aaya par adhoora / galat hai",
          "Application reject kar di gayi",
          "Zyada fees maangi gayi",
        ],
        required: true,
      },
      { key: "replyDate", label: "Jawab ki date", hint: "Optional, agar jawab aaya tha", type: "date" },
      { key: "informationSought", label: "RTI mein kya jaankari maangi thi?", type: "textarea", required: true },
      { key: "grounds", label: "Aapko kya galat laga?", hint: "Optional", type: "textarea" },
    ],
    rules: [
      "Address it to: The First Appellate Authority under the Right to Information Act, 2005, followed by the office name (same public authority as the original RTI).",
      "Subject line: First Appeal under Section 19(1) of the Right to Information Act, 2005.",
      "Short facts section: date of RTI application, registration/tracking number if given, public authority, and what happened.",
      "If there was no reply within 30 days, state that this is deemed refusal under Section 7(2) and ask for the information free of cost under Section 7(6).",
      "Numbered 'Grounds of Appeal' based on the applicant's situation. Only cite these sections: 6(1), 6(3), 7(1), 7(2), 7(6), 8, 19(1).",
      "Numbered 'Relief Sought': direct the PIO to provide complete information within a fixed time, free of cost where applicable.",
      "Enclosures: copy of RTI application, proof of postage/receipt, copy of PIO reply if any.",
      "End with place, date, appellant's name and a signature line.",
    ],
    facts: [
      { label: "Appeal ki deadline", value: "RTI ki deadline khatam hone ya jawab milne ke 30 din ke andar (Section 19(1))" },
      { label: "Fee", value: "Central mein koi fee nahi. Kuch states ke niyam alag hain." },
      { label: "Kisko?", value: "Usi vibhag ke First Appellate Authority (PIO se senior officer)" },
      { label: "Agla kadam", value: "FAA bhi jawab na de toh 90 din mein Information Commission (CIC/SIC) mein Second Appeal" },
    ],
    nextSteps: [
      "Original RTI ki copy, post ki receipt aur PIO ka jawab (agar aaya) saath lagaiye.",
      "Registered/Speed Post se bhejiye ya office mein dekar receiving lijiye. Central vibhag ke liye rtionline.gov.in pe online appeal bhi ho sakti hai.",
      "First Appellate Authority ko aam taur par 30 din (zyada se zyada 45 din) mein faisla dena hota hai.",
      "Phir bhi jawab na mile toh 90 din ke andar Central/State Information Commission mein Second Appeal kijiye.",
    ],
    sources: [
      { label: "RTI Act, 2005", url: "https://rti.gov.in/" },
      { label: "Central Information Commission", url: "https://cic.gov.in/" },
    ],
  },

  bank: {
    id: "bank",
    title: "Bank Complaint",
    titleHi: "बैंक शिकायत पत्र",
    tagline: "Galat charge, atka refund, fraud. Pehle bank ko likhit shikayat, phir RBI Ombudsman.",
    examples: [
      "SBI ne zero balance account pe minimum balance charge kaat liya",
      "ATM se paise nahi nikle par account se kat gaye, 10 din ho gaye",
    ],
    fields: [
      { key: "bankName", label: "Bank ka naam", type: "text", required: true },
      { key: "branch", label: "Branch", type: "text", required: true },
      {
        key: "accountLast4",
        label: "Account / card number ke aakhri 4 digit",
        hint: "Poora number mat likhiye",
        type: "text",
        required: true,
      },
      {
        key: "issueType",
        label: "Problem kis tarah ki hai?",
        type: "select",
        options: [
          "Galat charges / penalty",
          "Failed transaction, paise wapas nahi aaye",
          "Unauthorised / fraud transaction",
          "Loan / credit card ki problem",
          "Kharab service / kaam mein deri",
          "Kuch aur",
        ],
        required: true,
      },
      { key: "incidentDate", label: "Kis date ko hua?", type: "date", required: true },
      { key: "amount", label: "Kitni rakam (₹)?", hint: "Optional", type: "text" },
      { key: "issueDetails", label: "Kya hua, detail mein bataiye", type: "textarea", required: true },
      { key: "priorComplaint", label: "Pehle bank ko complaint ki thi? Reference number?", hint: "Optional", type: "text" },
      { key: "reliefSought", label: "Aap kya chahte hain?", hint: "Jaise: ₹590 wapas aur aage se charge na lage", type: "text" },
    ],
    rules: [
      "Address it to: The Branch Manager, followed by bank name and branch.",
      "Specific subject line, e.g. 'Complaint regarding wrongful debit of ₹___ from account ending XXXX'. Use only the last 4 digits of the account. Never write a full account number.",
      "Facts in short numbered points: date, transaction details, amount, what went wrong, earlier complaint reference if any.",
      "State the relief sought clearly (reversal/refund, correction, written explanation).",
      "Ask for a written reply and a complaint reference number.",
      "Add that if the complaint is not resolved within 30 days, the complainant will approach the RBI Ombudsman under the Reserve Bank - Integrated Ombudsman Scheme, 2021.",
      "For unauthorised/fraud transactions: say the transaction was not done or authorised by the complainant, ask for the card/account to be blocked if not already, and ask for reversal as per RBI's rules on customer liability for unauthorised electronic transactions. Do not invent circular numbers.",
      "End with place, date, name, contact details and a signature line.",
    ],
    facts: [
      { label: "Pehla kadam", value: "Bank ko likhit shikayat zaroori hai. Iske bina Ombudsman complaint nahi leta." },
      { label: "Bank ke paas", value: "30 din. Jawab na aaye ya reject ho toh RBI Ombudsman." },
      { label: "RBI Ombudsman", value: "cms.rbi.org.in pe free complaint, helpline 14448" },
      { label: "Fraud ho toh", value: "3 din ke andar bank ko bataiye (zero liability ke liye). Cyber fraud: 1930 ya cybercrime.gov.in" },
    ],
    nextSteps: [
      "Fraud hua hai toh pehle bank helpline pe card/account block karwaiye aur 1930 pe call kijiye. Letter uske baad.",
      "Letter ki do copy branch le jaiye. Ek copy pe stamp aur date ke saath receiving lijiye. Ya bank ki website/email pe complaint karke reference number lijiye.",
      "Statement ki entry, SMS, ATM slip, sab ki copy saath lagaiye.",
      "30 din intezaar kijiye. Jawab na aaye ya aap santusht na hon toh cms.rbi.org.in pe RBI Ombudsman ko complaint kijiye. Yeh free hai.",
      "Ombudsman complaint bank ke jawab ke 1 saal ke andar karni hoti hai.",
    ],
    sources: [
      { label: "RBI Complaint Management System", url: "https://cms.rbi.org.in/" },
      { label: "National Cyber Crime Portal", url: "https://cybercrime.gov.in/" },
    ],
  },

  consumer: {
    id: "consumer",
    title: "Consumer Complaint Notice",
    titleHi: "उपभोक्ता शिकायत नोटिस",
    tagline: "Kharab product, refund nahi mila, service mein dhokha. Company ko formal notice.",
    examples: [
      "Online phone order kiya, dabba khali aaya, company refund nahi de rahi",
      "Gym ne saal bhar ke paise le liye aur band ho gaya",
    ],
    fields: [
      { key: "companyName", label: "Company / dukaan ka naam", type: "text", required: true },
      {
        key: "companyAddress",
        label: "Company ka pata / email",
        hint: "Optional. Website ke Contact ya Grievance Officer page pe milta hai.",
        type: "textarea",
      },
      { key: "productOrService", label: "Kaunsa product ya service?", type: "text", required: true },
      { key: "orderDetails", label: "Order ID, khareed ki date, kitne ka tha", type: "text", required: true },
      { key: "issueDetails", label: "Kya problem hui?", type: "textarea", required: true },
      { key: "priorContact", label: "Customer care se baat ki? Ticket number?", hint: "Optional", type: "text" },
      {
        key: "reliefSought",
        label: "Aap kya chahte hain?",
        type: "select",
        options: ["Poora refund", "Replacement", "Repair", "Refund + compensation", "Kuch aur"],
        required: true,
      },
    ],
    rules: [
      "Format as a formal notice addressed to The Grievance Officer / Customer Care Head, then company name and address/email.",
      "Subject line: 'Notice regarding deficiency in service / defective goods - Order No. ___'.",
      "Numbered facts: purchase date, order ID, amount paid, what was promised, what went wrong, earlier complaints with ticket numbers.",
      "State that this is 'deficiency in service' and/or 'unfair trade practice' under the Consumer Protection Act, 2019. Do not cite section numbers.",
      "State the relief demanded and give the company 15 days from receipt of the notice.",
      "State that otherwise the complainant will approach the National Consumer Helpline and the appropriate Consumer Disputes Redressal Commission, and seek compensation and costs.",
      "Firm and factual, never abusive.",
      "End with place, date, name, contact details and a signature line.",
    ],
    facts: [
      { label: "Kanoon", value: "Consumer Protection Act, 2019" },
      { label: "Consumer Helpline", value: "1915 ya consumerhelpline.gov.in (court se pehle free madad)" },
      { label: "Case kahan?", value: "₹50 lakh tak District Commission mein. Apne district mein bhi kar sakte hain." },
      { label: "Time limit", value: "Problem hone ke 2 saal ke andar" },
      { label: "Fee", value: "₹5 lakh tak ke maamle mein koi fee nahi" },
    ],
    nextSteps: [
      "Notice company ke grievance officer ko email kijiye aur Speed Post se bhi bhejiye.",
      "Invoice, order screenshot, chat/email aur product ki photo sambhal ke rakhiye.",
      "15 din intezaar kijiye.",
      "Hal na ho toh National Consumer Helpline (1915 ya consumerhelpline.gov.in) pe complaint kijiye.",
      "Phir bhi na ho toh District Consumer Commission mein online complaint kar sakte hain (e-Jagriti portal). ₹5 lakh tak koi fee nahi.",
    ],
    sources: [
      { label: "National Consumer Helpline", url: "https://consumerhelpline.gov.in/" },
      { label: "Department of Consumer Affairs", url: "https://consumeraffairs.nic.in/" },
    ],
  },

  civic: {
    id: "civic",
    title: "Civic / Utility Complaint",
    titleHi: "नगर निगम / बिजली-पानी शिकायत",
    tagline: "Sadak, kachra, paani, bijli, streetlight. Sahi office ko formal shikayat.",
    examples: [
      "Hamare mohalle mein 2 hafte se paani nahi aa raha",
      "Bijli ka bill 3 guna aa gaya, meter kharab lagta hai",
    ],
    fields: [
      {
        key: "authorityName",
        label: "Kis office ko?",
        hint: "Jaise: Ward Office, Nagar Nigam Indore",
        type: "text",
        required: true,
      },
      {
        key: "issueCategory",
        label: "Problem kis cheez ki hai?",
        type: "select",
        options: ["Paani", "Bijli / bill", "Sadak / gaddhe", "Kachra / safai", "Streetlight", "Naali / drainage", "Kuch aur"],
        required: true,
      },
      { key: "location", label: "Exact jagah (gali, ward, landmark)", type: "text", required: true },
      { key: "issueDetails", label: "Problem detail mein", type: "textarea", required: true },
      { key: "since", label: "Kab se hai?", hint: "Optional", type: "text" },
      { key: "consumerNumber", label: "Consumer / connection number", hint: "Bijli-paani ke liye, optional", type: "text" },
      { key: "priorComplaint", label: "Pehle shikayat ki thi? Kab, number?", hint: "Optional", type: "text" },
    ],
    rules: [
      "Address it to the officer/office named by the applicant (e.g. The Ward Officer, The Executive Engineer), with department and city.",
      "Subject line: the specific issue and exact location.",
      "Numbered facts: exact location with landmark, since when, how it affects residents, earlier complaints with dates/numbers.",
      "For electricity bill disputes: ask for meter testing and bill revision, and that supply not be disconnected while the dispute is pending.",
      "Ask for action within a reasonable time (e.g. 7 days) and a written acknowledgement with a complaint number.",
      "If written on behalf of residents, leave space for co-signatures at the end.",
      "End with place, date, name, address, contact and a signature line.",
    ],
    facts: [
      { label: "Online", value: "Zyadatar shehron ka apna nagar nigam app/portal hai, wahan bhi complaint daaliye" },
      { label: "Bijli ki shikayat", value: "Pehle discom ko. Hal na ho toh CGRF, phir Electricity Ombudsman." },
      { label: "Kaam nahi hua?", value: "RTI se poochh sakte hain ki shikayat pe kya action hua" },
    ],
    nextSteps: [
      "Letter office mein dekar receiving lijiye (copy pe stamp aur date), ya Speed Post se bhejiye.",
      "Problem ki photo/video date ke saath lijiye aur letter ke saath lagaiye.",
      "Mohalle ke log bhi sign karein toh shikayat zyada asardaar hoti hai.",
      "Shehar ke nagar nigam app/portal ya CPGRAMS (pgportal.gov.in) pe bhi complaint register kijiye.",
      "7 se 15 din mein action na ho toh RTI daal ke poochhiye ki shikayat pe kya kaarwai hui.",
    ],
    sources: [{ label: "CPGRAMS", url: "https://pgportal.gov.in/" }],
  },
};

export const docList = Object.values(documents);

export const outputLanguages = [
  "English",
  "Hindi",
  "Marathi",
  "Bengali",
  "Tamil",
  "Telugu",
  "Kannada",
  "Gujarati",
  "Punjabi",
  "Malayalam",
] as const;

export type OutputLanguage = (typeof outputLanguages)[number];

export function isDocId(x: unknown): x is DocId {
  return typeof x === "string" && x in documents;
}

export function isOutputLanguage(x: unknown): x is OutputLanguage {
  return outputLanguages.includes(x as OutputLanguage);
}

export function allFields(doc: DocType): Field[] {
  return [...doc.fields, ...applicantFields];
}

export function missingRequired(doc: DocType, values: Record<string, string>): Field[] {
  return allFields(doc).filter((f) => f.required && !values[f.key]?.trim());
}
