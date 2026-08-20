/**
 * ITCYBER — centralized business content.
 * Services, agents, automations, industries, scenarios, jobs, resources.
 * Components consume this data; an admin dashboard can replace it later.
 */

/* ---------------------------------- types ---------------------------------- */

export type ServiceCategory = {
  id: string;
  index: string;
  title: string;
  tagline: string;
  description: string;
  items: { name: string; blurb: string }[];
  exampleFlow: string[];
  integrations: string[];
  page: string;
  pageLabel: string;
};

export type Agent = {
  id: string;
  name: string;
  role: string;
  description: string;
  inputs: string;
  actions: string;
  systems: string;
  outputs: string;
  handoff: string;
  demo: "chat" | "score" | "ticket" | "calendar" | "report" | "build";
};

export type Industry = {
  slug: string;
  name: string;
  short: string;
  challenges: string[];
  opportunities: string[];
  automations: string[];
  workflow: string[];
  integrations: string[];
  agents: string[];
  faq: { q: string; a: string }[];
};

export type FunctionSolution = {
  id: string;
  label: string;
  problem: string;
  solution: string;
  outcome: string;
  workflow: string[];
  tech: string[];
};

export type Scenario = {
  id: string;
  label: string;
  trigger: string;
  steps: { node: string; action: string; detail: string; tone: "info" | "ai" | "action" | "done" }[];
};

/* ------------------------------ trust / pillars ----------------------------- */

export const trustItems = [
  { title: "Custom Architecture", text: "No recycled templates — systems designed around your workflows." },
  { title: "Business-first Approach", text: "We start from the operational problem, not the technology." },
  { title: "Secure Integrations", text: "Scoped credentials, encrypted secrets, audited access." },
  { title: "Human Support", text: "Real engineers behind every system we deploy." },
  { title: "Scalable Systems", text: "Built to absorb growth without re-platforming." },
];

export const beforeFlow = ["Lead arrives", "Copied to Excel", "Human follows up (eventually)", "Manually entered in CRM", "Reminder set by hand", "Report built from spreadsheets"];
export const afterFlow = ["Lead arrives", "AI qualifies instantly", "CRM record created", "Personalised follow-up sent", "Meeting auto-booked", "Live dashboard updates"];

/* ------------------------------ core capabilities --------------------------- */
/* Five engineering groups: AI, Software, Web, Applications, Automation.      */

export const serviceCategories: ServiceCategory[] = [
  {
    id: "ai",
    index: "01",
    title: "AI & Intelligent Systems",
    tagline: "Agents, assistants and AI woven into your operations",
    description:
      "Purpose-built AI agents, chatbots and assistants that talk to leads, resolve support queries, qualify opportunities and reason over your documents — connected to your CRM, WhatsApp and calendars, with human escalation built in.",
    items: [
      { name: "AI Agents", blurb: "Autonomous workers across sales, support and operations." },
      { name: "AI Chatbots & Assistants", blurb: "Conversational interfaces grounded in your business." },
      { name: "AI-Integrated Apps", blurb: "Intelligence embedded where your team already works." },
      { name: "Document AI & Processing", blurb: "Extract, classify and summarise documents at scale." },
      { name: "AI Search & Knowledge Bases", blurb: "Answers from your own data, with sources." },
      { name: "AI Analytics & Recommendations", blurb: "Signals and next-best actions from live data." },
      { name: "AI Lead Qualification", blurb: "Every enquiry scored and routed automatically." },
      { name: "AI Workflow Systems", blurb: "Multi-step AI processes with policy checks." },
      { name: "Custom AI Agents", blurb: "Designed around your exact business logic." },
    ],
    exampleFlow: ["New enquiry", "Agent conversation", "Qualification & score", "CRM update", "Human handoff"],
    integrations: ["WhatsApp", "CRM", "Calendars", "Knowledge base", "Email"],
    page: "/ai-agents",
    pageLabel: "Explore AI Systems",
  },
  {
    id: "software",
    index: "02",
    title: "Custom Software Development",
    tagline: "Business software, SaaS, CRM/ERP and internal systems",
    description:
      "When off-the-shelf can't fit, we engineer it: CRM and ERP-style systems, business dashboards, client and vendor portals, SaaS platforms and internal tools — built for your exact processes, with AI where it earns its place.",
    items: [
      { name: "Custom Business Software", blurb: "Systems shaped around your operations, not the reverse." },
      { name: "SaaS Platforms", blurb: "Multi-tenant products built to scale and bill." },
      { name: "CRM Systems", blurb: "Pipeline, contacts and activity your team will actually use." },
      { name: "ERP-Style Systems", blurb: "Inventory, orders, billing and ops in one place." },
      { name: "Business Dashboards", blurb: "Live operational visibility across every system." },
      { name: "Client & Vendor Portals", blurb: "Self-service that removes the status-call traffic." },
      { name: "Internal Management Tools", blurb: "Replace the spreadsheet that runs your business." },
      { name: "Workflow Platforms", blurb: "Approvals, tasks and handoffs on rails." },
      { name: "Custom APIs & Backends", blurb: "Documented, versioned APIs for your ecosystem." },
    ],
    exampleFlow: ["Discovery", "Architecture", "Build & test", "Deploy", "Iterate"],
    integrations: ["React & TypeScript", "Node / serverless", "Postgres / Supabase", "CI/CD"],
    page: "/custom-software",
    pageLabel: "Explore Software",
  },
  {
    id: "web",
    index: "03",
    title: "Web & Digital Products",
    tagline: "Custom websites, web applications and AI-powered web experiences",
    description:
      "Custom digital experiences engineered like products: corporate and business websites, web applications, e-commerce and AI-integrated websites — with admin panels, CMS, lead capture and integrations built in from day one.",
    items: [
      { name: "Custom Websites", blurb: "Corporate, business and institutional sites, engineered." },
      { name: "Web Applications", blurb: "Fast, secure, mobile-ready business apps." },
      { name: "AI-Integrated Websites", blurb: "Sites with assistants, search and routing built in." },
      { name: "E-Commerce Experiences", blurb: "Stores with inventory, payments and automation." },
      { name: "CMS-Enabled Websites", blurb: "Your team publishes; engineering stays out of the way." },
      { name: "Booking-Enabled Websites", blurb: "Appointments and site visits booked straight from the site." },
      { name: "Interactive 3D Web Experiences", blurb: "Premium WebGL moments where they earn attention." },
      { name: "Client Portals", blurb: "Private areas wired to your backend." },
      { name: "Lead-Generation Websites", blurb: "Every visit captured, scored and routed." },
    ],
    exampleFlow: ["Strategy & UX", "Design system", "Build", "CMS + forms", "Launch & SEO"],
    integrations: ["Responsive engineering", "Admin panels", "CRM-connected forms", "Analytics"],
    page: "/web-development",
    pageLabel: "Explore Web",
  },
  {
    id: "apps",
    index: "04",
    title: "Mobile & PWA Applications",
    tagline: "Customer, employee and operations apps — mobile-ready by design",
    description:
      "Business applications for the pocket: customer apps, employee and operations apps, booking and service apps, and progressive web apps — cross-platform, offline-aware, with AI features where they create value.",
    items: [
      { name: "Cross-Platform Apps", blurb: "One codebase, every screen your users carry." },
      { name: "Customer Apps", blurb: "Booking, tracking and self-service in one place." },
      { name: "Employee & Operations Apps", blurb: "Field teams, approvals and updates from anywhere." },
      { name: "Booking & Service Apps", blurb: "Scheduling with reminders that actually reduce no-shows." },
      { name: "Progressive Web Apps", blurb: "Installable, offline-ready web experiences." },
      { name: "AI-Powered Apps", blurb: "Chat, voice, scan and recommendations on-device." },
      { name: "Mobile Dashboards", blurb: "The numbers that matter, in a pocket." },
    ],
    exampleFlow: ["Use-case mapping", "UX & flows", "Build", "Publish / install", "Monitor"],
    integrations: ["Offline-ready sync", "Push notifications", "Camera & document scan", "Payments"],
    page: "/app-development",
    pageLabel: "Explore Apps",
  },
  {
    id: "automation",
    index: "05",
    title: "Automation & Integrations",
    tagline: "CRM, WhatsApp, email, ERP and every system in between",
    description:
      "End-to-end automation of the work that eats your team's day — lead capture, follow-ups, CRM hygiene, invoicing, reporting — orchestrated across every tool you already use through clean APIs, webhooks and event pipelines.",
    items: [
      { name: "CRM Automation", blurb: "Records, stages and tasks that maintain themselves." },
      { name: "WhatsApp Automation", blurb: "Broadcasts, journeys and two-way AI conversations." },
      { name: "Email & Outreach Automation", blurb: "Routing, responses and sequences tied to behaviour." },
      { name: "Sales & Lead Automation", blurb: "Speed-to-lead, scoring, nurturing, stall alerts." },
      { name: "Reporting Automation", blurb: "Daily summaries generated and delivered automatically." },
      { name: "Operations Automation", blurb: "HR, documents, invoices and approvals on rails." },
      { name: "API & Webhook Integrations", blurb: "Event-driven bridges between any two systems." },
      { name: "ERP & Billing Integrations", blurb: "Tally, Marg and custom ERPs brought into the loop." },
      { name: "Payment & Workspace Integrations", blurb: "Razorpay, Google Workspace and the SaaS long tail." },
    ],
    exampleFlow: ["Trigger", "AI decision", "CRM lookup", "WhatsApp reply", "Task + booking", "Report"],
    integrations: ["Zoho / HubSpot / Salesforce", "WhatsApp API", "Google Workspace", "Tally / billing"],
    page: "/automations",
    pageLabel: "Explore Automation",
  },
];

/* --------------------- homepage: what we build (6 capabilities) --------------------- */

export type BuildCapability = {
  id: string;
  num: string;
  title: string;
  line: string;
  description: string;
  deliverables: string[];
  page: string;
  pageLabel: string;
  glyph: "browser" | "app" | "stack" | "phone" | "spark" | "flow";
};

export const whatWeBuild: BuildCapability[] = [
  {
    id: "websites",
    num: "01",
    title: "Custom Websites",
    line: "Business websites engineered like products",
    description:
      "Corporate, institutional and lead-generation websites with custom UI/UX, animation, CMS and admin panels — connected to your CRM, WhatsApp and booking systems from day one.",
    deliverables: ["Corporate & business websites", "AI-integrated websites", "Booking-enabled sites", "CMS + admin panel", "Lead capture & routing", "SEO & performance engineering"],
    page: "/web-development",
    pageLabel: "Explore Web Development",
    glyph: "browser",
  },
  {
    id: "webapps",
    num: "02",
    title: "Web Applications",
    line: "Dashboards, portals and management systems",
    description:
      "Business management systems, client and vendor portals, dashboards and SaaS products — secure, role-controlled and built around your workflows instead of forcing your team into someone else's.",
    deliverables: ["Business management systems", "Client & vendor portals", "Dashboards & analytics", "Booking & marketplace platforms", "SaaS products", "AI-powered web apps"],
    page: "/web-development",
    pageLabel: "Explore Web Applications",
    glyph: "app",
  },
  {
    id: "software",
    num: "03",
    title: "Custom Software",
    line: "CRM, ERP-style systems and internal tooling",
    description:
      "When off-the-shelf can't fit, we engineer it: CRM and ERP-style software, inventory and order systems, workflow platforms and internal tools — documented, monitored and handed over to you.",
    deliverables: ["CRM & ERP-style systems", "Inventory & order management", "Workflow & approval platforms", "Document management", "Custom APIs & backends", "Reporting platforms"],
    page: "/custom-software",
    pageLabel: "Explore Custom Software",
    glyph: "stack",
  },
  {
    id: "apps",
    num: "04",
    title: "Mobile & PWA Applications",
    line: "Customer, employee and operations apps",
    description:
      "Cross-platform and progressive web applications for customers and teams: booking apps, service apps, field-operations apps and mobile dashboards — with AI features where they create real value.",
    deliverables: ["Customer & booking apps", "Employee & operations apps", "Progressive Web Apps", "AI chat, voice & scan", "Push notifications & offline sync", "Mobile dashboards"],
    page: "/app-development",
    pageLabel: "Explore App Development",
    glyph: "phone",
  },
  {
    id: "ai",
    num: "05",
    title: "AI-Powered Products",
    line: "Agents, assistants and intelligence in-product",
    description:
      "AI agents and assistants embedded in websites, apps and internal systems — sales agents, support agents, document AI, intelligent search and recommendations, each with decision traces and human handoff.",
    deliverables: ["AI sales & support agents", "AI assistants & chatbots", "Document AI & summarisation", "AI search & knowledge bases", "Recommendations & personalisation", "Decision traces + human escalation"],
    page: "/ai-agents",
    pageLabel: "Explore AI Systems",
    glyph: "spark",
  },
  {
    id: "automation",
    num: "06",
    title: "Automation & AI Agents",
    line: "Workflows that run themselves across your stack",
    description:
      "Lead capture, follow-ups, CRM hygiene, invoicing and reporting automated end-to-end — orchestrated across WhatsApp, email, CRM, ERP and billing through monitored, logged workflows.",
    deliverables: ["CRM & sales automation", "WhatsApp & email automation", "Lead capture & nurturing", "Invoice & billing automation", "Reporting automation", "ERP & third-party integrations"],
    page: "/automations",
    pageLabel: "Explore Automation",
    glyph: "flow",
  },
];

/* --------------------- product architecture layers --------------------- */

export const architectureLayers: { id: string; label: string; items: string[]; tone: string }[] = [
  { id: "frontend", label: "Custom Frontend", items: ["Website", "Web App", "Mobile App", "Dashboard"], tone: "#56D9FF" },
  { id: "app", label: "Application Layer", items: ["Business Logic", "Permissions", "Workflows"], tone: "#8FB4FF" },
  { id: "ai", label: "AI Layer", items: ["LLM", "AI Agents", "Knowledge Base", "Document AI", "Recommendations"], tone: "#3E7BFF" },
  { id: "backend", label: "Backend", items: ["Supabase", "PostgreSQL", "APIs", "Storage", "Auth"], tone: "#8FB4FF" },
  { id: "business", label: "Business Systems", items: ["CRM", "WhatsApp", "Email", "Payments", "ERP", "Calendar", "Analytics"], tone: "#3DDC97" },
];

export const traditionalVsAi = {
  traditional: [
    "User inputs data",
    "Software stores the data",
    "User manually decides the next action",
    "Someone updates the other tools by hand",
    "Reports are built at month-end",
  ],
  ai: [
    "Data enters the system",
    "AI analyses the context",
    "AI recommends — or performs — the next action",
    "CRM, WhatsApp and calendars update themselves",
    "A human reviews the decisions that matter",
  ],
};

/* --------------------- lifecycle: idea → intelligent system --------------------- */

export const lifecyclePhases: { phase: string; steps: string[] }[] = [
  { phase: "Discover", steps: ["Idea", "Product Strategy", "UI/UX"] },
  { phase: "Build", steps: ["Website / App / Software", "Backend"] },
  { phase: "Make Intelligent", steps: ["AI", "Automation", "Integrations"] },
  { phase: "Run", steps: ["Deployment", "Monitoring & Improvement"] },
];

/* --------------------- illustrative solution architectures --------------------- */

export const solutionArchitectures: { sector: string; tone: string; components: string[]; outcome: string }[] = [
  { sector: "Real Estate", tone: "#56D9FF", components: ["Business Website", "Property CRM", "AI Lead Agent", "WhatsApp Automation", "Site-Visit Booking"], outcome: "Portal leads answered, scored and booked without a manual touch." },
  { sector: "Healthcare", tone: "#3DDC97", components: ["Clinic Website", "Appointment System", "Patient Portal", "AI Assistant", "Reminder Automation"], outcome: "Front desk handles patients, not phone tag and no-shows." },
  { sector: "Education", tone: "#8FB4FF", components: ["Institution Website", "Admissions Portal", "Student Management", "AI Enquiry Assistant", "Follow-up Automation"], outcome: "Every admission enquiry chased, documented and converted." },
  { sector: "Retail", tone: "#FFB454", components: ["E-Commerce Store", "Inventory System", "Customer App", "AI Support", "Order Automation"], outcome: "Orders, stock and support questions flow through one system." },
  { sector: "Professional Services", tone: "#3E7BFF", components: ["Firm Website", "Client Portal", "CRM", "AI Assistant", "Document Automation"], outcome: "Clients self-serve status while documents generate themselves." },
];

/* --------------------- contact / assessment options --------------------- */

export const projectTypes = [
  "Custom Website", "Web Application", "Custom Software", "Mobile Application",
  "AI-Integrated Website/App", "AI Agent", "AI Automation", "CRM / ERP System",
  "Business Dashboard", "API / Integration", "E-Commerce", "Not Sure — Need Consultation",
];

export const buildOptions = [
  "Website", "Web App", "Software", "Mobile App", "AI System",
  "Automation", "Integration", "Multiple Systems", "Not Sure",
];

/* --------------------------------- AI agents -------------------------------- */

export const agents: Agent[] = [
  {
    id: "sales",
    name: "AI Sales Agent",
    role: "Revenue",
    description: "Talks with leads the moment they arrive, qualifies prospects against your criteria and schedules meetings straight into your team's calendars.",
    inputs: "Website forms, WhatsApp messages, ad leads, calls transcripts",
    actions: "Converses naturally, asks qualification questions, handles objections with your playbook",
    systems: "CRM, WhatsApp API, Google Calendar, lead sources",
    outputs: "Qualified lead records, scored opportunities, booked meetings",
    handoff: "Hot leads and edge cases routed to a human with full context",
    demo: "chat",
  },
  {
    id: "support",
    name: "AI Support Agent",
    role: "Customer Experience",
    description: "Resolves repetitive support queries instantly using your knowledge base, and escalates complex cases with the conversation history attached.",
    inputs: "WhatsApp, email, website chat, helpdesk tickets",
    actions: "Matches intent, retrieves answers, performs safe account actions",
    systems: "Knowledge base, helpdesk, order & billing systems",
    outputs: "Resolved tickets, CSAT-ready conversations, escalation briefs",
    handoff: "Sensitive or unresolved issues reach a human in one click",
    demo: "ticket",
  },
  {
    id: "qualification",
    name: "AI Lead Qualification Agent",
    role: "Pipeline Quality",
    description: "Analyses every enquiry — budget signals, intent, fit — and tags high-priority opportunities so your closers work the right list first.",
    inputs: "Enquiry content, behavioural data, past deal patterns",
    actions: "Extracts entities, scores against your ICP, detects urgency",
    systems: "CRM, lead database, analytics events",
    outputs: "Lead scores, priority tags, routed assignments",
    handoff: "Ambiguous scores flagged for a quick human review",
    demo: "score",
  },
  {
    id: "appointment",
    name: "AI Appointment Agent",
    role: "Scheduling",
    description: "Checks real availability across calendars, negotiates slots with the customer and books appointments — including reschedules and reminders.",
    inputs: "Booking requests, calendar availability, service catalogue",
    actions: "Proposes slots, confirms, writes to calendar, sends reminders",
    systems: "Google / Outlook calendars, booking systems, WhatsApp",
    outputs: "Confirmed appointments, reminder sequences, utilisation data",
    handoff: "VIP or complex scheduling passed to your coordinator",
    demo: "calendar",
  },
  {
    id: "operations",
    name: "AI Operations Assistant",
    role: "Internal Ops",
    description: "An always-on analyst for your team: daily reports, anomaly alerts, summaries of what happened across systems, and answers from your own data.",
    inputs: "CRM, ERP, Sheets, databases, logs",
    actions: "Aggregates, compares to targets, narrates what changed",
    systems: "Data warehouse, BI tools, Slack / WhatsApp / email",
    outputs: "Morning briefs, exception alerts, on-demand answers",
    handoff: "Decisions always stay with your people — the agent briefs, never acts blindly",
    demo: "report",
  },
  {
    id: "custom",
    name: "Custom AI Agent",
    role: "Your Logic",
    description: "Designed around your specific business rules — from document processing to vendor negotiation support. If it follows a logic, it can be an agent.",
    inputs: "Whatever your process consumes — files, messages, records, sensors",
    actions: "Your documented SOPs converted into agent reasoning",
    systems: "Any system with an API, database or screen we can integrate",
    outputs: "Defined with you during the architecture phase",
    handoff: "Permission boundaries set per action — nothing runs without your rules",
    demo: "build",
  },
];

/* -------------------------------- automations ------------------------------- */

export const automationAnatomy = [
  { stage: "Trigger", text: "A new enquiry, payment, file, schedule tick or system event starts the run." },
  { stage: "Logic", text: "Rules and branches decide the path — with AI handling the fuzzy decisions." },
  { stage: "AI Step", text: "Classification, extraction, scoring or generation where templates fall short." },
  { stage: "Integrations", text: "Reads and writes across CRM, WhatsApp, email, calendars, ERP and databases." },
  { stage: "Actions", text: "Messages sent, records created, tasks assigned, documents generated." },
  { stage: "Monitoring", text: "Every run logged, timed and alertable — failures page a human." },
  { stage: "Human Approval", text: "High-stakes steps pause for a one-tap human sign-off." },
];

export const automationExample = [
  "New enquiry received",
  "AI categorises intent",
  "CRM lookup & dedupe",
  "Lead score computed",
  "WhatsApp response sent",
  "Follow-up task created",
  "Calendar slot offered",
  "Daily report updated",
];

/* ------------------------------- tech ecosystem ------------------------------ */

export const techEcosystem = [
  {
    category: "AI Models & Assistants",
    items: ["OpenAI GPT-4o", "Claude", "Gemini", "Open-source LLMs", "Custom fine-tunes"],
  },
  {
    category: "Automation Platforms",
    items: ["n8n", "Make", "Zapier", "Custom orchestrators", "Webhook pipelines"],
  },
  {
    category: "Communication",
    items: ["WhatsApp Business API", "Twilio", "Exotel", "Email / SMTP", "Telephony APIs"],
  },
  {
    category: "CRM",
    items: ["Zoho CRM", "HubSpot", "Salesforce", "Pipedrive", "Custom CRM builds"],
  },
  {
    category: "Cloud & Data",
    items: ["Supabase", "PostgreSQL", "Firebase", "AWS", "Google Cloud"],
  },
  {
    category: "Productivity",
    items: ["Google Workspace", "Microsoft 365", "Slack", "Notion", "Calendars"],
  },
  {
    category: "Development",
    items: ["React & TypeScript", "Node.js", "Python", "REST & GraphQL", "Serverless"],
  },
  {
    category: "Business Systems",
    items: ["Tally", "Marg ERP", "Razorpay", "Shipping APIs", "Accounting tools"],
  },
];

/* --------------------------- solutions by function --------------------------- */

export const functionSolutions: FunctionSolution[] = [
  {
    id: "sales",
    label: "Sales",
    problem: "Leads arrive around the clock but follow-up depends on whoever is free. Hot prospects cool down in spreadsheets while the team chases cold ones.",
    solution: "An AI agent answers and qualifies instantly, the CRM maintains itself, and follow-ups go out on schedule across WhatsApp and email.",
    outcome: "Every lead contacted in minutes, pipeline stages that update themselves, and a sales team that only talks to people ready to buy.",
    workflow: ["Incoming Lead", "AI Qualification", "CRM Record", "WhatsApp Follow-up", "Sales Team", "Meeting Booked"],
    tech: ["AI Sales Agent", "CRM Automation", "WhatsApp API", "Calendar sync", "Pipeline dashboard"],
  },
  {
    id: "marketing",
    label: "Marketing",
    problem: "Campaigns generate enquiries across channels, but attribution is guesswork and nurture sequences live in someone's memory.",
    solution: "Every channel feeds one pipeline; AI tags intent and source, then runs personalised multi-step nurture until the lead is sales-ready.",
    outcome: "Clean attribution, automated nurture that adapts to replies, and marketing spend judged on pipeline — not clicks.",
    workflow: ["Ad / Campaign", "Lead Captured", "Intent Tagging", "Nurture Sequence", "Sales-ready Flag", "Handover"],
    tech: ["Lead Capture Automation", "Multi-channel Outreach", "AI Lead Nurturing", "Analytics"],
  },
  {
    id: "support",
    label: "Customer Support",
    problem: "The same ten questions consume the team's day, response times stretch after hours, and context is lost between channels.",
    solution: "An AI support agent resolves repetitive queries from your knowledge base on WhatsApp, chat and email — escalating the rest with history.",
    outcome: "Instant answers 24×7, a human team focused on complex cases, and every conversation logged against the customer record.",
    workflow: ["Customer Query", "AI Resolution", "Knowledge Lookup", "Ticket Update", "Escalation if needed", "CSAT Capture"],
    tech: ["AI Support Agent", "Helpdesk Integration", "WhatsApp Automation", "Knowledge base"],
  },
  {
    id: "operations",
    label: "Operations",
    problem: "Status lives in five tools. Managers rebuild the same reports daily and find out about problems from customers.",
    solution: "Systems are integrated into one operational picture; an AI assistant generates daily briefs and alerts the moment something drifts.",
    outcome: "One source of truth, automated daily reporting, and exceptions surfaced before they become complaints.",
    workflow: ["System Events", "Data Sync", "AI Briefing", "Exception Alerts", "Manager Dashboard", "Action Tasks"],
    tech: ["AI Operations Assistant", "Reporting Automation", "Dashboards", "ERP integration"],
  },
  {
    id: "finance",
    label: "Finance",
    problem: "Invoices are raised manually, payments reconciled by eye, and overdue follow-up depends on someone remembering.",
    solution: "Billing automation raises and sends invoices from your system, reconciles payments, and chases overdue accounts politely but persistently.",
    outcome: "Faster collections, zero missed invoices, and month-end numbers that assemble themselves.",
    workflow: ["Order / Milestone", "Invoice Generated", "Auto-send", "Payment Reconciled", "Overdue Chase", "Ledger Updated"],
    tech: ["Invoice Automation", "Payment gateway APIs", "Tally integration", "Reporting"],
  },
  {
    id: "hr",
    label: "HR",
    problem: "Screening dozens of applications, scheduling interviews and answering repeat policy questions drown a small HR team.",
    solution: "HR automation screens resumes against your criteria, self-schedules interviews, and an internal agent answers employee policy questions.",
    outcome: "Shortlists ready every morning, interviews that book themselves, and policy answers without the queue.",
    workflow: ["Application In", "AI Screening", "Shortlist", "Interview Scheduled", "Feedback Looped", "Offer Stage"],
    tech: ["HR Automation", "AI Screening", "Calendar sync", "Internal Assistant"],
  },
  {
    id: "management",
    label: "Management",
    problem: "Founders and managers make decisions on stale snapshots because pulling live numbers means a day of spreadsheet work.",
    solution: "A live executive dashboard with an AI analyst on top — ask questions in plain language, get answers from your actual systems.",
    outcome: "Decisions from live data, weekly reviews that start with answers, and targets tracked automatically.",
    workflow: ["All Systems", "Unified Data Layer", "Live Dashboard", "AI Analyst Q&A", "Weekly Brief", "Decisions"],
    tech: ["Executive Dashboard", "AI Data Analysis Agent", "Data warehouse", "Alerting"],
  },
];

/* --------------------------------- industries -------------------------------- */

export const industries: Industry[] = [
  {
    slug: "real-estate",
    name: "Real Estate",
    short: "Speed-to-lead decides property deals. AI answers every enquiry in seconds, qualifies budget and intent, and books site visits automatically.",
    challenges: [
      "Enquiries from 99acres, MagicBricks, Meta ads and WhatsApp arrive in bursts — and go cold within minutes",
      "Sales teams waste hours on unqualified enquiries",
      "Site visit scheduling handled manually over calls",
      "Follow-up discipline collapses during peak periods",
    ],
    opportunities: [
      "Instant AI response on WhatsApp for every enquiry, 24×7",
      "Budget, location and timeline qualification before a human ever calls",
      "Automated site-visit booking synced with sales calendars",
      "Nurture sequences for long decision cycles",
    ],
    automations: ["Lead capture from portals & ads", "WhatsApp qualification conversations", "Site visit scheduling", "Broker / channel partner management", "Daily lead reports"],
    workflow: ["Portal / Ad Lead", "AI WhatsApp Response", "Budget & Intent Score", "CRM Allocation", "Site Visit Booked", "Sales Follow-up"],
    integrations: ["99acres / MagicBricks exports", "Meta Lead Ads", "WhatsApp API", "Zoho / HubSpot CRM", "Google Calendar"],
    agents: ["AI Sales Agent", "AI Appointment Agent", "AI Lead Nurturing Agent"],
    faq: [
      { q: "Can the AI handle leads from property portals?", a: "Yes. We ingest portal leads via exports, email parsing or API — then the agent takes over on WhatsApp within seconds." },
      { q: "Will the AI pressure buyers?", a: "No. Agents follow your tone guidelines — helpful, informative conversations that qualify and schedule, never push." },
    ],
  },
  {
    slug: "healthcare",
    name: "Healthcare",
    short: "Clinics and hospitals lose patients at the front desk. AI handles booking, reminders and FAQs while staff focus on care.",
    challenges: [
      "Front-desk teams juggle calls, walk-ins and WhatsApp messages",
      "No-shows drain doctor schedules",
      "Patient FAQs repeat endlessly",
      "Follow-up and review collection rarely happens",
    ],
    opportunities: [
      "24×7 appointment booking with live doctor availability",
      "Automated reminder sequences that cut no-shows",
      "AI answers for timing, fees, preparation instructions",
      "Post-visit follow-ups and feedback collection",
    ],
    automations: ["Appointment booking & rescheduling", "Reminder sequences", "Patient FAQ agent", "Feedback collection", "Daily schedule briefs"],
    workflow: ["Patient Enquiry", "AI Triage & FAQ", "Slot Selection", "Appointment Confirmed", "Reminders Sent", "Post-visit Follow-up"],
    integrations: ["Hospital / clinic management system", "WhatsApp API", "Google Calendar", "Google Reviews"],
    agents: ["AI Appointment Agent", "AI Support Agent", "AI Operations Assistant"],
    faq: [
      { q: "Does the AI give medical advice?", a: "No. It handles scheduling and administrative questions. Clinical queries are always routed to your staff, and boundaries are hard-coded." },
      { q: "Is patient data handled carefully?", a: "Yes — scoped access, encrypted secrets and audit logs. We only touch the fields the workflow needs." },
    ],
  },
  {
    slug: "education",
    name: "Education",
    short: "Admissions are a follow-up game. AI responds to every parent and student instantly, nurtures enquiries and keeps counsellors on the hot list.",
    challenges: [
      "Admission enquiries spike seasonally and overwhelm counsellors",
      "Follow-up across calls, email and WhatsApp is manual",
      "Campus visit and demo-class scheduling is friction-heavy",
      "Fee reminders and document collection drag on",
    ],
    opportunities: [
      "Instant AI responses to course, fee and eligibility questions",
      "Automated nurturing through long admission cycles",
      "Self-booking for campus visits and demo classes",
      "Document and fee-stage automation",
    ],
    automations: ["Admission enquiry capture", "Course counselling flows", "Demo class booking", "Document checklists", "Fee reminder sequences"],
    workflow: ["Enquiry (Ads / Website)", "AI Counselling Chat", "Eligibility Check", "Demo / Visit Booked", "Counsellor Handoff", "Admission Stage Tracking"],
    integrations: ["Meta Lead Ads", "Website forms", "WhatsApp API", "CRM / SIS", "Payment gateway"],
    agents: ["AI Sales Agent", "AI Appointment Agent", "AI Support Agent"],
    faq: [
      { q: "Can it answer curriculum questions accurately?", a: "The agent is grounded in your prospectus and FAQs, and escalates anything outside its knowledge base to a counsellor." },
      { q: "Does it work for seasonal admission spikes?", a: "That's exactly when it matters most — capacity scales without adding temporary staff." },
    ],
  },
  {
    slug: "ecommerce",
    name: "E-commerce",
    short: "Order queries, abandoned carts and COD verification eat margins. AI handles the conversation layer across the entire order lifecycle.",
    challenges: [
      "\"Where is my order?\" tickets flood support channels",
      "Abandoned carts recover only if someone chases them",
      "COD orders need verification before shipping",
      "Review and repeat-purchase follow-up is inconsistent",
    ],
    opportunities: [
      "Instant WISMO answers pulled from shipping APIs",
      "AI recovery conversations on WhatsApp",
      "Automated COD confirmation calls / messages",
      "Post-delivery review and reorder sequences",
    ],
    automations: ["Order status agent", "Cart recovery sequences", "COD verification", "Review collection", "Return / exchange flows"],
    workflow: ["Order Placed", "COD Verified", "Shipping Updates", "Delivery Confirm", "Review Request", "Reorder Nudge"],
    integrations: ["Shopify / WooCommerce", "Shipping APIs (Delhivery, Shiprocket)", "WhatsApp API", "Payment gateways"],
    agents: ["AI Support Agent", "AI Sales Agent", "AI Operations Assistant"],
    faq: [
      { q: "Can it read live order status?", a: "Yes — we integrate with your store and shipping providers so answers come from real tracking data, not scripts." },
      { q: "What about refunds and complaints?", a: "Policy-eligible actions run automatically; anything sensitive escalates to your team with full order context." },
    ],
  },
  {
    slug: "agencies",
    name: "Agencies",
    short: "Marketing and service agencies run on client communication. AI keeps clients informed, reports automatic and delivery on rails.",
    challenges: [
      "Client updates and reports are built by hand every month",
      "New lead response time varies with team load",
      "Scope creep and approvals get lost in chat threads",
      "Onboarding new clients is a manual maze",
    ],
    opportunities: [
      "Auto-generated client performance reports",
      "Instant AI response to inbound leads",
      "Approval and feedback collection flows",
      "Self-service client portals",
    ],
    automations: ["Client reporting", "Lead response agent", "Approval workflows", "Client onboarding", "Renewal reminders"],
    workflow: ["Lead In", "AI Qualifies", "Proposal Sent", "eSign + Onboarding", "Auto Reporting", "Renewal Nudge"],
    integrations: ["Meta / Google Ads", "Looker Studio", "CRM", "WhatsApp API", "DocuSign-class tools"],
    agents: ["AI Sales Agent", "AI Operations Assistant", "AI Research Agent"],
    faq: [
      { q: "Can reports pull from ad platforms automatically?", a: "Yes — we connect ad accounts and analytics so reports assemble from live data on your schedule." },
      { q: "Will clients know they're talking to AI?", a: "Your call — most agencies introduce the agent transparently as part of the service experience." },
    ],
  },
  {
    slug: "professional-services",
    name: "Professional Services",
    short: "CA firms, law practices and consultancies bill for expertise, not admin. AI absorbs scheduling, reminders and document chasing.",
    challenges: [
      "Client scheduling and reminders consume billable hours",
      "Document collection for filings drags across weeks",
      "Repetitive compliance questions interrupt deep work",
      "Engagement letters and invoicing are manual",
    ],
    opportunities: [
      "Self-booking for consultations",
      "Automated document checklist chasing",
      "AI answers for routine compliance FAQs",
      "Engagement and billing automation",
    ],
    automations: ["Consultation scheduling", "Document collection", "Compliance deadline reminders", "Engagement letters", "Invoice automation"],
    workflow: ["Client Enquiry", "Consultation Booked", "Document Checklist Sent", "Auto Chase", "Filing / Delivery", "Invoice Raised"],
    integrations: ["Google Calendar", "WhatsApp API", "Document storage", "Billing / Tally", "Practice management"],
    agents: ["AI Appointment Agent", "AI Support Agent", "AI Operations Assistant"],
    faq: [
      { q: "Is confidentiality preserved?", a: "Agents operate with scoped permissions and audit trails; sensitive matters always route to professionals." },
      { q: "Can it handle deadline-driven work?", a: "Compliance calendars drive automated reminders to clients and staff well ahead of due dates." },
    ],
  },
  {
    slug: "startups",
    name: "Startups",
    short: "Small teams, big surface area. AI gives a five-person startup the operational coverage of a fifty-person company.",
    challenges: [
      "Founders personally handle sales, support and ops",
      "No budget for large teams or enterprise software",
      "Processes live in founders' heads, not systems",
      "Investor reporting is a monthly fire drill",
    ],
    opportunities: [
      "AI agents covering first-line sales and support",
      "Lean automations that grow with the product",
      "Lightweight dashboards from day one",
      "Metrics that assemble themselves for reviews",
    ],
    automations: ["Lead-to-CRM pipeline", "Support triage", "Onboarding emails", "Metrics dashboards", "Investor updates"],
    workflow: ["Sign-up / Lead", "AI Conversation", "Product Onboarding", "Usage Signals", "Founder Alert", "Growth Review"],
    integrations: ["Stripe / Razorpay", "Product analytics", "CRM", "Slack", "WhatsApp / email"],
    agents: ["AI Sales Agent", "AI Support Agent", "AI Data Analysis Agent"],
    faq: [
      { q: "Can we start small?", a: "Yes — most startups begin with one high-volume workflow (usually lead response or support) and expand." },
      { q: "Will systems survive a pivot?", a: "We build modularly; workflows are reconfigurable without rebuilding from scratch." },
    ],
  },
  {
    slug: "sme",
    name: "SMEs",
    short: "Established businesses with real volume — where manual processes silently tax every order, enquiry and invoice.",
    challenges: [
      "Order and enquiry handling depends on key individuals",
      "ERP, billing and communication don't talk to each other",
      "Reporting means exporting to Excel, again",
      "Growth means more headcount, not better systems",
    ],
    opportunities: [
      "Enquiry-to-order workflows across WhatsApp and email",
      "ERP / billing integrations that remove double entry",
      "Automated daily business reports",
      "Scale capacity without scaling headcount linearly",
    ],
    automations: ["Enquiry handling", "Order processing", "Invoice & payment follow-up", "Daily reporting", "Vendor coordination"],
    workflow: ["Enquiry / Order", "AI Processing", "ERP Entry", "Invoice & Payment", "Dispatch Update", "Daily Report"],
    integrations: ["Tally / Marg", "WhatsApp API", "Email", "Banking APIs", "Google Workspace"],
    agents: ["AI Operations Assistant", "AI Sales Agent", "AI Data Analysis Agent"],
    faq: [
      { q: "We already use Tally. Can it integrate?", a: "Yes — Tally is one of our most common integrations, alongside Marg and custom ERPs." },
      { q: "How disruptive is implementation?", a: "We run new systems in parallel with your existing process until the team trusts them — no big-bang cutover." },
    ],
  },
];

/* ----------------------------- workflow scenarios ---------------------------- */

export const scenarios: Scenario[] = [
  {
    id: "sales",
    label: "Sales",
    trigger: "Facebook lead form submitted at 11:42 PM",
    steps: [
      { node: "Lead Source", action: "Facebook Lead", detail: "Priya S. · 3BHK enquiry · Budget ₹1.2Cr", tone: "info" },
      { node: "AI Agent", action: "Qualification", detail: "Agent starts WhatsApp conversation in 40 seconds", tone: "ai" },
      { node: "AI Agent", action: "Lead Scored", detail: "Score 92 · High intent · Timeline: 3 months", tone: "ai" },
      { node: "CRM", action: "Record Created", detail: "Assigned to Arjun (South zone) · Stage: Qualified", tone: "action" },
      { node: "WhatsApp", action: "Follow-up Sent", detail: "Personalised brochure + tower availability", tone: "action" },
      { node: "Calendar", action: "Follow-up Scheduled", detail: "Callback set for tomorrow 10:00 AM", tone: "action" },
      { node: "Sales Team", action: "Team Notified", detail: "Hot-lead alert with full conversation context", tone: "action" },
      { node: "Booking", action: "Meeting Booked", detail: "Site visit Saturday 11:00 AM · Confirmed", tone: "done" },
    ],
  },
  {
    id: "support",
    label: "Customer Support",
    trigger: "WhatsApp message: \"Where is my order #4821?\"",
    steps: [
      { node: "WhatsApp", action: "Message Received", detail: "Customer asks about order #4821", tone: "info" },
      { node: "AI Agent", action: "Intent Detected", detail: "Order status query · Sentiment: neutral", tone: "ai" },
      { node: "Store API", action: "Order Lookup", detail: "#4821 · Shipped · Out for delivery today", tone: "action" },
      { node: "AI Agent", action: "Reply Composed", detail: "Status + tracking link + expected time", tone: "ai" },
      { node: "WhatsApp", action: "Reply Sent", detail: "Answered in 12 seconds, no human involved", tone: "action" },
      { node: "Helpdesk", action: "Ticket Logged", detail: "Auto-resolved · Linked to customer profile", tone: "action" },
      { node: "CRM", action: "Profile Updated", detail: "Support history synced for future conversations", tone: "done" },
    ],
  },
  {
    id: "appointment",
    label: "Appointment Booking",
    trigger: "Website chat: \"Can I see a dentist this week?\"",
    steps: [
      { node: "Website", action: "Chat Received", detail: "New patient · General consultation", tone: "info" },
      { node: "AI Agent", action: "Requirements", detail: "Collects symptoms summary & preferred days", tone: "ai" },
      { node: "Calendar", action: "Availability", detail: "Dr. Mehta: Thu 4:30, Fri 11:00, Fri 5:15", tone: "action" },
      { node: "WhatsApp", action: "Slots Offered", detail: "Patient picks Friday 11:00 AM", tone: "action" },
      { node: "Booking", action: "Appointment Made", detail: "Calendar updated · Patient record created", tone: "action" },
      { node: "Automation", action: "Reminders Set", detail: "24h and 2h reminders via WhatsApp", tone: "action" },
      { node: "Front Desk", action: "Team Briefed", detail: "New-patient summary on the morning sheet", tone: "done" },
    ],
  },
  {
    id: "operations",
    label: "Operations",
    trigger: "Daily 8:00 AM scheduled run",
    steps: [
      { node: "Scheduler", action: "Run Triggered", detail: "Morning operations sweep begins", tone: "info" },
      { node: "Integrations", action: "Data Collected", detail: "CRM, ERP, billing and support systems polled", tone: "action" },
      { node: "AI Agent", action: "Analysis", detail: "Revenue vs target, open tickets, stock alerts", tone: "ai" },
      { node: "AI Agent", action: "Anomaly Found", detail: "Refund requests up 3× from one product", tone: "ai" },
      { node: "Dashboard", action: "Report Generated", detail: "One-page morning brief with charts", tone: "action" },
      { node: "Alerts", action: "Managers Notified", detail: "Brief + refund anomaly flagged on WhatsApp", tone: "action" },
      { node: "Tasks", action: "Actions Created", detail: "QC check task assigned to ops lead", tone: "done" },
    ],
  },
  {
    id: "lead",
    label: "Lead Management",
    trigger: "Website form + missed call, same prospect",
    steps: [
      { node: "Channels", action: "Two Touchpoints", detail: "Form at 2:10 PM, missed call at 2:14 PM", tone: "info" },
      { node: "AI Agent", action: "Identity Merged", detail: "Same phone → single prospect profile", tone: "ai" },
      { node: "CRM", action: "Dedupe & Enrich", detail: "Existing cold lead reactivated · Source updated", tone: "action" },
      { node: "AI Agent", action: "Re-scored", detail: "Score 41 → 78 · Renewed buying signals", tone: "ai" },
      { node: "WhatsApp", action: "Callback Offered", detail: "\"Saw you tried calling — free now or 5 PM?\"", tone: "action" },
      { node: "Sales Team", action: "Warm Handoff", detail: "Agent briefs rep with full interaction history", tone: "action" },
      { node: "Pipeline", action: "Stage Advanced", detail: "Moved to Negotiation · Next step scheduled", tone: "done" },
    ],
  },
];

/* ----------------------------------- process --------------------------------- */

export const processSteps = [
  { index: "01", title: "Understand", text: "We study your existing workflows, systems and bottlenecks — where time and leads are actually being lost.", deliverable: "Workflow map & opportunity list" },
  { index: "02", title: "Architect", text: "Our team designs the AI and automation architecture: agents, integrations, permission boundaries and fallbacks.", deliverable: "System blueprint & success criteria" },
  { index: "03", title: "Build", text: "Agents, integrations and software are engineered, wired to your tools and tested against real scenarios.", deliverable: "Working system in staging" },
  { index: "04", title: "Deploy", text: "Systems go live securely in your environment, running in parallel with your current process until trusted.", deliverable: "Live deployment & team training" },
  { index: "05", title: "Optimize", text: "Performance is monitored, prompts and flows are tuned, and new workflows are added as you grow.", deliverable: "Monthly performance reviews" },
];

/* -------------------------------- why itcyber -------------------------------- */

export const whyPillars = [
  { title: "Business-first Engineering", text: "Technology follows the business problem. We start with your P&L and workflows, not with a demo.", icon: "compass" },
  { title: "Custom Architecture", text: "Every system is designed around how your business actually runs — no forced templates.", icon: "blueprint" },
  { title: "End-to-End Delivery", text: "Strategy, development, deployment and support handled by one accountable team.", icon: "route" },
  { title: "AI + Automation + Software", text: "One partner for the entire solution — agents, workflows and the software around them.", icon: "layers" },
  { title: "Integration Focused", text: "New capabilities work with the tools your team already uses. Adoption beats replacement.", icon: "plug" },
  { title: "Built to Scale", text: "Architecture designed for your next stage of growth, not just this quarter's problem.", icon: "growth" },
];

/* ----------------------------- security & control ---------------------------- */

export const securityPillars = [
  { title: "Role-based Access", text: "Every agent and automation runs with the minimum permissions its job needs — nothing more." },
  { title: "Secure API Management", text: "Scoped tokens and keys per integration, rotated on schedule, never shared across clients." },
  { title: "Encrypted Secrets", text: "Credentials stored encrypted at rest and injected at runtime — never in code or client bundles." },
  { title: "Logging & Audit Trails", text: "Every automated action is logged: what ran, who triggered it, what changed, when." },
  { title: "Backups & Recovery", text: "Data touchpoints are backed up with tested restore paths before anything goes live." },
  { title: "Monitoring & Alerts", text: "Runs are watched continuously; failures and anomalies alert engineers before you notice." },
  { title: "Fail-safe Architecture", text: "When a step fails, workflows degrade safely — records stay consistent, humans get paged." },
  { title: "Human Escalation", text: "High-stakes actions pause for human approval. Agents advise and execute within set boundaries." },
  { title: "Permission Boundaries", text: "Hard-coded limits on what AI can touch in each system — written into the architecture, not policy docs." },
  { title: "Data Privacy", text: "Only the fields a workflow needs are accessed, processed minimally and handled per your privacy requirements." },
];

/* ----------------------------------- careers --------------------------------- */

export type Job = {
  id: string;
  title: string;
  team: "Engineering" | "Automation" | "Business";
  location: string;
  type: string;
  experience: string;
  about: string;
  responsibilities: string[];
  requirements: string[];
};

export const jobs: Job[] = [
  {
    id: "ai-automation-engineer",
    title: "AI Automation Engineer",
    team: "Automation",
    location: "India · Remote-friendly",
    type: "Full-time",
    experience: "2–4 years",
    about: "Build the AI workflows that run real businesses — agents, integrations and orchestrations that clients depend on daily.",
    responsibilities: [
      "Design and ship AI agent workflows across WhatsApp, CRM, email and calendars",
      "Build integrations with CRMs, payment gateways, ERPs and custom APIs",
      "Prompt-engineer and evaluate LLM steps for accuracy and cost",
      "Monitor live automations and improve reliability week over week",
    ],
    requirements: [
      "Hands-on experience with n8n / Make / Zapier or custom orchestration",
      "Working knowledge of REST APIs, webhooks and JSON data flows",
      "Practical LLM experience (GPT / Claude) in production settings",
      "Scripting ability in JavaScript/TypeScript or Python",
    ],
  },
  {
    id: "fullstack-developer",
    title: "Full-Stack Developer",
    team: "Engineering",
    location: "India · Remote-friendly",
    type: "Full-time",
    experience: "3–5 years",
    about: "Engineer dashboards, portals and AI-enabled applications that make automated businesses visible and controllable.",
    responsibilities: [
      "Build business dashboards, internal tools and client portals end-to-end",
      "Design clean data models and APIs on Postgres / Supabase",
      "Integrate AI features into product surfaces",
      "Own deployments, monitoring and iteration of what you ship",
    ],
    requirements: [
      "Strong React + TypeScript production experience",
      "Node.js and relational database design",
      "API design (REST/GraphQL) and auth patterns",
      "Care for performance, accessibility and clean architecture",
    ],
  },
  {
    id: "ai-solutions-architect",
    title: "AI Solutions Architect",
    team: "Automation",
    location: "India · Hybrid",
    type: "Full-time",
    experience: "4+ years",
    about: "Translate business problems into AI and automation architectures — the blueprint layer between client operations and engineering.",
    responsibilities: [
      "Run discovery sessions and map client workflows",
      "Design agent, automation and integration architectures",
      "Define permission boundaries, fallbacks and success metrics",
      "Guide delivery teams and review shipped systems",
    ],
    requirements: [
      "Experience delivering automation / integration projects",
      "Ability to read a business process and design its system",
      "Strong communication with founders and operations leads",
      "Depth in at least two of: LLMs, iPaaS, custom software",
    ],
  },
  {
    id: "business-development-executive",
    title: "Business Development Executive",
    team: "Business",
    location: "India",
    type: "Full-time",
    experience: "1–3 years",
    about: "Connect business owners who are drowning in manual work with AI systems that give them their time back.",
    responsibilities: [
      "Contact business owners through calls, WhatsApp, email and LinkedIn",
      "Run discovery conversations and demo relevant workflows",
      "Coordinate proposals and assessment calls with the solutions team",
      "Maintain a clean, automated pipeline in our CRM",
    ],
    requirements: [
      "Confident communicator in English and Hindi",
      "Genuine interest in AI and business operations",
      "Comfortable with targets and structured follow-up",
      "Prior B2B sales or SDR experience is a plus",
    ],
  },
  {
    id: "automation-intern",
    title: "Automation Intern",
    team: "Automation",
    location: "India · Remote",
    type: "Internship · 6 months",
    experience: "0–1 years",
    about: "Learn by shipping: assist on live client automations while building your own AI workflow portfolio.",
    responsibilities: [
      "Assist in building and testing client automations",
      "Document workflows, prompts and integration notes",
      "Monitor live runs and triage simple failures",
      "Build one portfolio automation per month",
    ],
    requirements: [
      "Basic understanding of APIs and JSON",
      "Familiarity with any automation tool or scripting",
      "Strong written English",
      "Curiosity that shows up in what you've tinkered with",
    ],
  },
  {
    id: "content-growth",
    title: "Content & Growth Marketer",
    team: "Business",
    location: "India · Remote-friendly",
    type: "Full-time",
    experience: "2+ years",
    about: "Explain AI automation to business owners without jargon — and build the pipeline that keeps our engineers busy.",
    responsibilities: [
      "Own LinkedIn and content calendars for ITCYBER",
      "Write case-study-style content from real deployments",
      "Run experiments across organic and paid channels",
      "Report on pipeline, not vanity metrics",
    ],
    requirements: [
      "Portfolio of B2B content that performed",
      "Understanding of funnel metrics and attribution",
      "Ability to interview engineers and translate to business value",
      "Bonus: experience marketing to Indian SMEs",
    ],
  },
];

/* ---------------------------------- resources -------------------------------- */

export const resources = [
  {
    title: "The First Automation Playbook",
    kind: "Guide",
    minutes: "8 min read",
    to: "/automations",
    blurb: "How to pick the first workflow worth automating — and avoid the three mistakes that kill most automation projects.",
  },
  {
    title: "Chatbot vs. AI Agent: The Real Difference",
    kind: "Explainer",
    minutes: "6 min read",
    to: "/ai-agents",
    blurb: "Scripts answer questions. Agents do work. A practical breakdown of what changes when AI gets access to your systems.",
  },
  {
    title: "WhatsApp Automation Without Getting Blocked",
    kind: "Field Note",
    minutes: "7 min read",
    to: "/automations",
    blurb: "Official API, templates, opt-ins and conversation design — the difference between automation and spam.",
  },
  {
    title: "What AI Automation Really Costs in India",
    kind: "Guide",
    minutes: "9 min read",
    to: "/contact",
    blurb: "An honest framework for budgeting: build costs, run costs, and the manual hours you should measure against.",
  },
];

/* ---------------------------------- insights --------------------------------- */

export const capabilitiesIntro = {
  heading: "One team for the entire stack of intelligent business.",
  text: "AI agents do the thinking, automation does the moving, integrations do the connecting, and custom software gives your team control. Most partners sell one slice — we deliver the system.",
};
