import type { StoryBody } from "../types";

/*
 * Company and client products are described at the level of capabilities, role and outcomes only.
 * No vendors, architecture, infrastructure, thresholds or internal names: see tests/unit/content.test.ts.
 */
export const workStories: StoryBody[] = [
  {
    slug: "surgycrm",
    lede:
      "SurgyCRM is a healthcare-native CRM that follows a patient from first enquiry to long-term relationship: acquisition, care journeys, feedback, referrals and field sales in one place. I built it end to end, and hospitals use it every day.",
    blocks: [
      {
        type: "stats",
        heading: "Engineering at scale",
        items: [
          { value: "370+", label: "database migrations shipped" },
          { value: "45+", label: "serverless APIs shipped" },
          { value: "15", label: "audit-grade reports" },
          { value: "55+", label: "test files written" },
        ],
      },
      { type: "diagram", id: "surgycrm-architecture", caption: "The shape of the product: capture, a secure core, engagement and insight." },
      {
        type: "list",
        heading: "What it does",
        columns: 2,
        items: [
          { title: "Captures every enquiry", body: "Leads arrive from ads, the website, a chat assistant and phone calls, and land in one queue without duplicates." },
          { title: "Guides care journeys", body: "Clinical pathways with automated follow-ups, so fewer patients drop off between consultation and treatment." },
          { title: "Closes the feedback loop", body: "Patients give feedback in seconds; unhappy responses become tracked tickets with deadlines." },
          { title: "Connects field sales", body: "Referral visits and partner activity tie back to the patients and revenue they produce." },
          { title: "Reports for leadership", body: "Fifteen audit-grade reports, from funnel conversion to service levels, ready to print." },
          { title: "Safe for many hospitals", body: "Each hospital and branch sees only its own data, by design." },
        ],
      },
      {
        type: "list",
        heading: "My role",
        items: [
          "Turned hospital requirements into specs, plans and releases",
          "Designed the data model and the security model",
          "Built the web app, APIs, integrations and automations",
          "Owned testing, deployment and production support",
        ],
      },
      {
        type: "links",
        heading: "Read more",
        items: [
          {
            label: "Inside SurgyCRM: building a hospital CRM that doesn't let patients slip through",
            href: "https://medium.com/@zuhaib_99173/inside-surgycrm-building-a-hospital-crm-that-doesnt-let-patients-slip-through-ddacf54fccc5",
            note: "My article on Medium · 28 Oct 2026",
          },
          {
            label: "Why hospitals need more than a CRM",
            href: "https://surgy.health/blog/surgycrm-healthcare-crm-patient-journey-management",
            note: "My article on surgy.health · 11 Jun 2026",
          },
        ],
      },
    ],
    related: ["safeguards", "surgy-assist", "automation", "performance", "surgyfield"],
  },
  {
    slug: "surgy-assist",
    lede:
      "Hospitals wanted a website assistant that never makes things up. I built one that answers only from each hospital's own content, hands anything uncertain to a person, and turns useful conversations into leads.",
    blocks: [
      { type: "diagram", id: "rag-pipeline", caption: "Every question takes the safest path to an answer." },
      {
        type: "steps",
        heading: "How it stays trustworthy",
        items: [
          { title: "Safety first", body: "Urgent situations skip AI entirely and show direct call options." },
          { title: "Curated answers", body: "Common questions get answers the hospital has approved." },
          { title: "Grounded retrieval", body: "Everything else is answered only from the hospital's own documents, and only when the match is confident." },
          { title: "Human handoff", body: "If nothing relevant is found, a person takes over instead of the assistant guessing." },
          { title: "Actions in code", body: "Booking is handled by deterministic logic, not by the model." },
        ],
      },
      {
        type: "list",
        heading: "Built to be run responsibly",
        columns: 2,
        items: [
          { title: "Costs capped by design", body: "Each AI use has its own daily budget and stops safely when it's reached." },
          { title: "Observable", body: "Every model call is logged, with automatic fallback when a model is unavailable." },
        ],
      },
      { type: "tags", items: ["LLMs", "RAG", "Embeddings", "Prompt engineering", "AI evaluation", "Product design"] },
      {
        type: "links",
        heading: "Read more",
        items: [
          {
            label: "The Hospital Chatbot Playbook",
            href: "https://surgy.health/blog/hospital-website-chatbot-surgy-assist",
            note: "My article on surgy.health · 24 Jul 2026",
          },
        ],
      },
    ],
    related: ["surgycrm", "automation", "planning-delivery"],
  },
  {
    slug: "automation",
    lede:
      "A lead that arrives at 2 a.m. should be a patient record, an assigned agent and a friendly reminder by morning, with no copy-pasting. I automated that path end to end and made every step safe to repeat.",
    blocks: [
      { type: "diagram", id: "lead-flow", caption: "From first touch to post-treatment feedback." },
      {
        type: "steps",
        heading: "The pipeline",
        items: [
          { title: "Capture", body: "Ads, web forms, the chat assistant and phone calls all feed one intake." },
          { title: "Ingest safely", body: "Every incoming event is verified and deduplicated, so retries never create duplicate patients." },
          { title: "Assign", body: "New leads are spread fairly across the right team automatically." },
          { title: "Engage", body: "Messaging reminders go out on schedule, with health checks watching the queue." },
          { title: "Close the loop", body: "Outcomes flow back to marketing so campaigns optimise for real patients, not form fills." },
          { title: "Follow up", body: "After treatment, patients are asked for feedback; a low score opens a ticket that escalates if it isn't handled in time." },
        ],
      },
      { type: "principle", body: "Automation is only useful when it's safe to run twice." },
    ],
    related: ["surgycrm", "surgy-assist", "safeguards"],
  },
  {
    slug: "performance",
    lede: "Hospitals run on modest phones and busy networks. The fastest request is the one you never send, so I remove work rather than add hardware.",
    blocks: [
      {
        type: "beforeAfter",
        items: [
          {
            label: "Bulk import, 10,000 rows",
            before: "≈30,000 requests",
            after: "35 requests",
            how: "Paged reads and batched writes, with timeouts, retries and automatic splitting of failing batches. Stable batch identities make retries safe, and long imports keep running in the background.",
          },
          {
            label: "Mobile app startup",
            before: "16 sequential calls",
            after: "1 parallel batch",
            how: "Everything the first screen needs is fetched together, so the app is usable sooner on slow networks.",
          },
          {
            label: "AI translations",
            before: "Paid on every view",
            after: "Paid once per label",
            how: "New text is batched and translated once, then served from a permanent cache.",
          },
        ],
      },
      {
        type: "text",
        heading: "Lists that stay fast",
        body: "Counts and filters are computed where the data lives, not in the browser, and long lists load in small windows ahead of the scroll.",
      },
      { type: "principle", body: "Measure first, then delete work. Caching comes after." },
    ],
    related: ["surgycrm", "surgyfield", "platform-kit"],
  },
  {
    slug: "surgyfield",
    lede:
      "Field teams visit doctors and clinics to grow referrals. SurgyField makes every visit count: location-verified, usable without signal, and linked to the outcomes it produces.",
    blocks: [
      { type: "diagram", id: "offline-sync", caption: "Work offline, sync once, never double-count." },
      {
        type: "list",
        heading: "What it does",
        columns: 2,
        items: [
          { title: "Verified visits", body: "A visit counts only when the rep is actually at the location." },
          { title: "Works offline", body: "Check-ins, notes and photos are saved on the device when there's no signal." },
          { title: "Syncs safely", body: "Queued work uploads when the network returns, without ever creating duplicates." },
          { title: "Live for supervisors", body: "Maps, schedules, teams and activity reports update in real time." },
          { title: "Fast to open", body: "Startup went from 16 sequential calls to one parallel batch." },
          { title: "One platform", body: "Shares data and permissions with the CRM, so nothing is entered twice." },
        ],
      },
      { type: "tags", items: ["Flutter", "Mobile", "Offline-first", "Geolocation", "Realtime"] },
      {
        type: "links",
        heading: "Read more",
        items: [
          {
            label: "Field force management for healthcare",
            href: "https://surgy.health/blog/surgyfield-field-force-management-healthcare",
            note: "My article on surgy.health · 24 Jul 2026",
          },
        ],
      },
    ],
    related: ["surgycrm", "performance", "ui-ux"],
  },
  {
    slug: "platform-kit",
    lede:
      "Surgy builds a family of healthcare products. I wrote the shared engineering standard they follow, so every team ships the same way, safely, and with AI agents working inside the same guardrails.",
    blocks: [
      { type: "diagram", id: "family-map", caption: "One standard, shared by the whole product family." },
      {
        type: "list",
        heading: "What the standard covers",
        columns: 2,
        items: [
          { title: "Engineering standards", body: "Security and access, data changes, releases, integrations, compliance and AI use." },
          { title: "Reusable building blocks", body: "Battle-tested modules for common problems, so teams don't reinvent them." },
          { title: "Delivery templates", body: "Ready-made pipelines for testing, releasing and scheduled checks." },
          { title: "Agent guardrails", body: "Shared rules and safety checks for AI coding agents in every repository." },
          { title: "Go-live checklists", body: "Repeatable launch, migration and compliance checklists." },
          { title: "Lessons learned", body: "Past production issues written down, each tied to the rule that prevents it." },
        ],
      },
      {
        type: "text",
        heading: "Audited by me, on purpose",
        body: "Before a major launch I audited my own plan, rated every issue by severity and fixed them all before going live.",
      },
    ],
    related: ["agentic-workflow", "safeguards", "surgy-suite"],
  },
  {
    slug: "surgy-suite",
    lede: "SurgyCRM is where I've gone deepest. Since November 2026 I'm also product lead for SurgyScribe and SurgyFrontdesk, and I keep releases safe across the product family.",
    blocks: [
      {
        type: "list",
        heading: "Products I lead now",
        columns: 2,
        items: [
          { title: "SurgyScribe", body: "Clinical documentation: a consultation becomes a structured note that the doctor reviews and signs." },
          { title: "SurgyFrontdesk", body: "A voice agent that answers and makes patient calls on the hospital's own phone line, and hands complex calls to staff." },
        ],
      },
      {
        type: "list",
        heading: "Earlier work",
        columns: 2,
        items: [
          { title: "SurgyDischarge", body: "Secure discharge management, deployed in isolation for compliance-heavy hospitals." },
          { title: "SurgyLearn proctoring", body: "Computer-vision monitoring for online assessments, with 30–50% fewer false positives." },
        ],
      },
      {
        type: "text",
        heading: "Releases you can trust",
        body: "Releases are gated, backed up first and smoke-tested afterwards, with automatic rollback if anything fails.",
      },
      {
        type: "list",
        heading: "My role",
        items: [
          "Requirements and sprint planning across concurrent releases",
          "Code review and release management",
          "Bridging hospital stakeholders and the engineering team",
        ],
      },
    ],
    related: ["surgycrm", "ai-gateway", "privacy-controls", "platform-kit"],
  },
  {
    slug: "samatvalife",
    lede:
      "Samatvalife is a wellness platform where members book live classes with coaches and attend them online or offline. It spans four apps: member, coach, admin and the service behind them. It was my first project at Surgy, from December 2025 to May 2026, and I was the lead engineer in the team. Both mobile apps are on Google Play.",
    blocks: [
      {
        type: "stats",
        items: [
          { value: "4", label: "apps" },
          { value: "~109k", label: "lines of code" },
          { value: "2", label: "apps on Google Play" },
        ],
      },
      {
        type: "list",
        heading: "What it does",
        columns: 2,
        items: [
          { title: "For members", body: "Discover, book and pay for live classes, with reminders and notifications." },
          { title: "For coaches", body: "Availability, classes, attendance and certificates." },
          { title: "For admins", body: "A web portal for operations, scheduling and reporting." },
          { title: "Under it all", body: "A service that handles bookings, payments, notifications and background jobs." },
        ],
      },
      {
        type: "list",
        heading: "Engineering worth noting",
        items: [
          "A written timezone contract with a test matrix, so classes never land at the wrong hour",
          "A documented payment flow",
          "Repair tooling that reconciles and replays missed notifications",
          "Deployment guides so the client's team can run it themselves",
        ],
      },
      { type: "links", items: [{ label: "samatvalife.com", href: "https://samatvalife.com", note: "Live site" }] },
    ],
    related: ["surgyfield", "decovision"],
  },
  {
    slug: "decovision",
    lede: "A side project outside my day job. Decovision Infra needed a fast website that ranks well and that their team could keep updating. I've built it twice, each time adapting to what they needed.",
    blocks: [
      {
        type: "list",
        heading: "Two versions",
        columns: 2,
        items: [
          { title: "v1", body: "React 19, Vite 6, Tailwind CSS v4 and shadcn/ui, deployed on Vercel with client-side routing." },
          {
            title: "v2",
            body: "React 18 and Vite with motion-based page transitions, a scroll-progress bar, data-driven projects, services and blog pages, and per-page SEO. I prototyped it quickly with Lovable and finished it by hand.",
          },
        ],
      },
      { type: "tags", items: ["React", "Vite", "Tailwind CSS", "shadcn/ui", "Motion", "SEO", "Vercel", "Lovable"] },
    ],
    related: ["samatvalife", "ui-ux"],
  },
  {
    slug: "ai-gateway",
    lede:
      "In November 2026 I moved every AI call in the product behind one wrapper and onto an in-region provider. No feature talks to a model directly any more, so privacy, cost and reliability are handled once, in one place.",
    blocks: [
      {
        type: "steps",
        heading: "What happens to every AI call",
        items: [
          { title: "Remove personal details", body: "Names, numbers and other identifiers are replaced with placeholders before anything leaves the system." },
          { title: "Guard the exit", body: "A final check looks for anything that slipped through. If it finds an identifier, the call is refused, not sent." },
          { title: "Check the budget", body: "Each AI use has a daily allowance and an answer-length cap. A spent allowance stops the call before any provider is contacted." },
          { title: "Call the in-region provider", body: "The request goes to the main provider with a time limit and one retry for temporary failures." },
          { title: "Fall back only when it's safe", body: "If the main provider fails, a second one takes over. A call blocked for privacy or budget is never retried elsewhere." },
          { title: "Log every attempt", body: "Each attempt is recorded with its purpose, model and outcome, and what was disclosed is logged too." },
          { title: "Restore the details", body: "Placeholders in the answer are swapped back, so the user sees real names and the model never did." },
        ],
      },
      {
        type: "decisions",
        heading: "Decisions, written down",
        items: [
          {
            title: "One door, not many",
            context: "A privacy or cost rule added to one feature is easy to miss in the next.",
            choice: "Every feature goes through the same wrapper.",
            why: "A privacy rule or a budget written once applies everywhere, and a new feature can't forget it.",
          },
          {
            title: "Fail closed",
            context: "A privacy check that fails open sends the data anyway.",
            choice: "If the check can't be sure, the call doesn't go out.",
            why: "A missing AI answer is an inconvenience. A leaked identifier can't be taken back.",
          },
          {
            title: "One allowance across providers",
            context: "A fallback provider could quietly double the spend.",
            choice: "The daily budget is one allowance, whichever provider answers.",
            why: "Reliability shouldn't be a way around the cost limit.",
          },
        ],
      },
      { type: "principle", body: "The model sees placeholders. People see names. The budget sees every call." },
      { type: "tags", items: ["LLMs", "De-identification", "Cost control", "Fallbacks", "Observability", "Testing"] },
    ],
    related: ["surgy-assist", "cost-speed", "privacy-controls", "safeguards"],
  },
  {
    slug: "privacy-controls",
    lede:
      "Hospitals hold some of the most sensitive data there is, and data-protection law now expects them to prove how they handle it. In November 2026 I built the controls that let a hospital show its work, not just promise it.",
    blocks: [
      {
        type: "list",
        heading: "What I built",
        columns: 2,
        items: [
          { title: "Consent and basis records", body: "For each person, a record of what they agreed to, or the legal basis the hospital relies on, and when." },
          { title: "An audit trail", body: "A record of who looked at or changed sensitive data, and when." },
          { title: "Masked phone numbers", body: "Phone numbers are masked for staff who don't need the full number." },
          { title: "A privacy centre", body: "One place for a hospital to handle requests to see, export or erase a person's data, and to set how long data is kept." },
          { title: "Details removed before AI", body: "Personal identifiers are replaced with placeholders before any text reaches a model." },
          { title: "Tested from outside", body: "Findings from a penetration test were fixed and then retested." },
        ],
      },
      {
        type: "text",
        heading: "Why I could build it",
        body: "I studied the data-protection law before writing the code, and passed a certification on it with 98% in October 2026. The features follow what the law asks a hospital to be able to show.",
      },
      { type: "principle", body: "Privacy that can't be shown to an auditor is only a promise." },
      { type: "tags", items: ["Data protection", "Consent", "Audit trail", "Access control", "Security testing"] },
    ],
    related: ["safeguards", "ai-gateway", "surgycrm", "journey"],
  },
];
