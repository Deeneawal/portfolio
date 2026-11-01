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
            label: "Why hospitals need more than a CRM",
            href: "https://surgy.health/blog/surgycrm-healthcare-crm-patient-journey-management",
            note: "My essay on surgy.health",
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
            note: "My essay on surgy.health",
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
            note: "My essay on surgy.health",
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
    lede: "SurgyCRM is where I've gone deepest, but I also lead development on other products in the family and keep releases safe across all of them.",
    blocks: [
      {
        type: "list",
        heading: "Products",
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
    related: ["planning-delivery", "platform-kit", "surgycrm"],
  },
  {
    slug: "samatvalife",
    lede:
      "Samatvalife is a wellness platform where members book live classes with coaches and attend them online or offline. It spans four apps: member, coach, admin and the service behind them. Both mobile apps are on Google Play.",
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
    lede: "Decovision Infra needed a fast website that ranks well and that their team could keep updating. I've built it twice, each time adapting to what they needed.",
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
];
