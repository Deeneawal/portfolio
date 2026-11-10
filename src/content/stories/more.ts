import { book, certifications, posts } from "../profile";
import type { StoryBody } from "../types";

export const labStories: StoryBody[] = [
  {
    slug: "iot-sensors",
    lede: "A real-time IoT telemetry pipeline. An ESP32 reads its sensors and publishes over MQTT every five seconds. The readings are stored as indexed time series and streamed live to a dashboard.",
    blocks: [
      { type: "diagram", id: "iot-pipeline", caption: "Edge to dashboard in one hop per layer." },
      {
        type: "list",
        heading: "How it works",
        items: [
          { title: "Edge", body: "An ESP32 (C++) reads a DHT sensor and publishes to an MQTT topic every 5 seconds." },
          { title: "Broker", body: "Mosquitto runs on a Raspberry Pi on the local network." },
          { title: "Server", body: "Node.js and Express subscribe to the topic, write to PostgreSQL and push updates to browsers over Socket.IO." },
          { title: "History", body: "Indexed time-series tables power the graphs and historical queries." },
        ],
      },
      { type: "tags", items: ["ESP32", "MQTT", "Mosquitto", "Node.js", "Socket.IO", "PostgreSQL", "Raspberry Pi"] },
    ],
    related: ["apartment-management", "streecare"],
  },
  {
    slug: "apartment-management",
    lede: "A full-stack system that runs an apartment community: tenants, leases and maintenance, with the right access for each role.",
    blocks: [
      {
        type: "stats",
        items: [
          { value: "500+", label: "tenant records" },
          { value: "40%", label: "faster queries" },
        ],
      },
      {
        type: "list",
        heading: "What I built",
        items: [
          "Role-based access control",
          "Automated lease alerts",
          "Maintenance workflows",
          "MongoDB compound indexes and aggregation pipelines, which made queries 40% faster",
        ],
      },
      { type: "tags", items: ["Node.js", "Express", "MongoDB", "React"] },
    ],
    related: ["iot-sensors", "splitr"],
  },
  {
    slug: "streecare",
    lede: "StreeCare estimates how safe a locality is from signals such as zone, time of day, crowd level and whether a police station or bar is nearby.",
    blocks: [
      { type: "stats", items: [{ value: "95%", label: "classifier accuracy" }] },
      {
        type: "list",
        heading: "Pieces",
        items: [
          { title: "Model", body: "A scikit-learn classifier trained on engineered locality features." },
          { title: "API", body: "Django REST Framework serves the predictions." },
          { title: "Dashboard", body: "A React dashboard shows each locality's safety score." },
          { title: "Companion", body: "An Express and Socket.IO app shares live location on a Leaflet map." },
        ],
      },
      { type: "tags", items: ["Python", "scikit-learn", "Django REST", "React", "Leaflet", "Socket.IO"] },
    ],
    related: ["iot-sensors", "surgy-assist"],
  },
  {
    slug: "splitr",
    lede: "An expense-splitting app for friends and groups, built to learn the newest full-stack tools.",
    blocks: [
      {
        type: "list",
        items: [
          { title: "Frontend", body: "Next.js 15 and React 19." },
          { title: "Data", body: "Convex for a reactive backend and database." },
          { title: "Auth", body: "Clerk." },
          { title: "Jobs", body: "Inngest for background work such as reminders." },
        ],
      },
      { type: "tags", items: ["Next.js 15", "React 19", "Convex", "Clerk", "Inngest"] },
    ],
    related: ["apartment-management", "this-site"],
  },
];

export const aboutStories: StoryBody[] = [
  {
    slug: "hospital-ai-2027",
    lede: `${book.title}: ${book.subtitle} is a field guide for hospital leaders on agentic AI. Surgy Health published it in November 2026 as a free PDF with its own ISBN. I'm one of its three authors, credited for platform engineering and agentic AI.`,
    blocks: [
      {
        type: "stats",
        items: [
          { value: "15", label: "chapters in five parts" },
          { value: "283", label: "sources cited, each with a date and a link" },
          { value: "200", label: "news claims re-checked against the source" },
          { value: "95", label: "pages" },
        ],
      },
      {
        type: "links",
        heading: "Read it",
        items: [
          { label: "Hospital AI 2027 on surgy.health", href: book.href, note: "Book page and free download" },
          { label: "Direct PDF", href: book.pdfHref, note: `First edition · ISBN ${book.isbn}` },
        ],
      },
      {
        type: "text",
        heading: "The argument",
        body: [
          "Hospital AI is moving through three stages. It started by listening: scribes that write the note. It is now acting: agents that draft prescriptions, chase approvals and answer patient calls, with a person signing off. Next comes orchestrating: many agents, people and systems coordinated around one hospital goal, with rules and an audit trail holding it together.",
          "The book shows what changed in 2026, what is working, what to avoid, and how to choose and govern an AI-first hospital system in 2027.",
        ],
      },
      {
        type: "list",
        heading: "My part",
        items: [
          {
            title: "Daily Platform & Agentic AI Insights",
            body: "From October I wrote a daily digest on platform engineering and agentic AI. It was one of the book's two research streams and kept it current into November.",
          },
          {
            title: "A builder's view",
            body: "My day job is building the systems that let AI agents run safely inside hospital software. I brought that view to the book: what an agent may do, what it must never reach, and who answers for it.",
          },
        ],
      },
      {
        type: "list",
        heading: "The chapters closest to my daily work",
        columns: 2,
        items: [
          { title: "04 · The model is not the moat", body: "Prices are falling and models can be swapped. Match the model to the stakes and keep the model layer replaceable." },
          { title: "05 · When agents work together", body: "Open protocols, gateways, and a supervisor with a human escalation path instead of a swarm." },
          { title: "09 · When agents go off-script", body: "Six real ways agents failed in 2026, and eight controls that contain them: own identity, no secrets inside, least privilege, approval for writes." },
          { title: "14 · Proving it works", body: "An evaluation ladder: backtest on your own history, build tests from real failures, let the tool refuse, audit selectively." },
        ],
      },
      {
        type: "text",
        heading: "Why it matters for how I build",
        body: "The controls the book asks hospitals to demand are the ones I already put around my own coding agents: scoped permissions, checks that run outside the model, a person approving anything that matters, and a record of what happened.",
      },
      {
        type: "principle",
        body: "Let AI do the work around care, prove every claim on your own data, and keep a named person accountable for every decision it touches.",
      },
      { type: "tags", items: ["Agentic AI", "Platform engineering", "Agent security", "Evaluation", "Governance", "Healthcare", "Technical writing"] },
    ],
    related: ["agentic-workflow", "agent-setup", "safeguards", "writing"],
  },
  {
    slug: "toolkit",
    lede: "I work across the whole stack. These are the tools I use in production, grouped by layer.",
    blocks: [
      { type: "tags", heading: "Languages", items: ["TypeScript", "JavaScript (ES6+)", "SQL / PL/pgSQL", "Python", "Dart", "Java", "HTML5", "CSS3"] },
      {
        type: "tags",
        heading: "Frontend & mobile",
        items: ["React 18/19", "Next.js", "Vite", "Tailwind CSS", "shadcn/ui", "TanStack Query", "React Hook Form + Zod", "Flutter", "PWA"],
      },
      {
        type: "tags",
        heading: "Backend & APIs",
        items: ["Node.js", "Express", "Supabase (Postgres, Auth, Realtime, Storage)", "Deno Edge Functions", "Django", "FastAPI", "REST", "Webhooks"],
      },
      { type: "tags", heading: "Data", items: ["PostgreSQL", "Row-Level Security", "Triggers", "pg_cron", "MongoDB", "MySQL", "Redis / BullMQ", "Database design"] },
      {
        type: "tags",
        heading: "AI & integrations",
        items: ["Gemini", "Claude", "OpenAI", "RAG with embeddings", "Prompt engineering", "WhatsApp Business API", "Meta Lead Ads", "Razorpay"],
      },
      {
        type: "tags",
        heading: "Testing, DevOps & agents",
        items: ["Vitest", "Deno test", "Flutter test", "Playwright", "GitHub Actions", "Terraform", "AWS", "GCP", "Vercel", "Claude Code", "Cursor", "Lovable", "Postman"],
      },
    ],
    related: ["agentic-workflow", "journey"],
  },
  {
    slug: "journey",
    lede: "Computer science at JSS Academy of Technical Education, then straight into building and leading healthcare products.",
    blocks: [
      {
        type: "timeline",
        heading: "Experience & education",
        items: [
          {
            when: "Nov 2026",
            title: "Co-author · Hospital AI 2027",
            body: `A field guide to agentic AI for hospital leaders, published by Surgy Health. ISBN ${book.isbn}.`,
          },
          {
            when: "Dec 2025 – now",
            title: "Platform & Agentic AI Engineer · Product Lead · Surgy Innovation Labs",
            body: "Bengaluru (hybrid). Built SurgyCRM and SurgyField, and lead development across SurgyCRM, SurgyDischarge and SurgyLearn.",
          },
          {
            when: "Jul 2025",
            title: "B.E. Computer Science · JSS Academy of Technical Education",
            body: "Bengaluru. CGPA 8.3.",
          },
        ],
      },
      {
        type: "timeline",
        heading: "Certifications",
        items: certifications.map((c) => ({ when: c.when, title: c.title, body: c.issuer })),
      },
      {
        type: "links",
        heading: "Elsewhere",
        items: [
          { label: "LeetCode", href: "https://leetcode.com/deeneawal", note: "Problem-solving practice" },
          { label: "GitHub", href: "https://github.com/Deeneawal", note: "Code and experiments" },
          { label: "LinkedIn", href: "https://www.linkedin.com/in/zuhaib-ahmad-khan", note: "Professional profile" },
        ],
      },
    ],
    related: ["toolkit", "contact"],
  },
  {
    slug: "writing",
    lede: "I write about the products I build: the hospital problems behind them and how the software solves them. That now includes a co-authored book and three essays, all published by Surgy Health.",
    blocks: [
      {
        type: "links",
        heading: "Book",
        items: [{ label: `${book.title}: ${book.subtitle}`, href: book.href, note: `Co-author · ${book.published} · ISBN ${book.isbn}` }],
      },
      {
        type: "links",
        heading: "Essays",
        items: posts.map((p) => ({ label: p.title, href: p.href, note: `${p.date} · ${p.minutes} min read` })),
      },
    ],
    related: ["hospital-ai-2027", "surgycrm", "surgy-assist", "surgyfield"],
  },
  {
    slug: "this-site",
    lede: "This portfolio was built the way I build products: with an AI agent working inside guardrails, from a quiz about my goals to a deploy I approved.",
    blocks: [
      {
        type: "steps",
        heading: "How it was made",
        items: [
          { title: "Quiz", body: "The agent asked me about layout, theme, analytics, privacy, framing and contact options before writing any code." },
          { title: "Research", body: "Sub-agents read my repositories and pulled out facts, leaving out client names and secrets." },
          { title: "Plan", body: "A written plan, reviewed by a second agent and approved by me before any code was written." },
          { title: "Build", body: "Next.js 15, React 19, Tailwind CSS v4 and Motion. The content is typed data rendered by one block renderer." },
          { title: "Verify", body: "Unit tests, Playwright on desktop and mobile, a Lighthouse audit and a production smoke test." },
          { title: "Ship", body: "GitHub, then Vercel, with analytics that only I can see." },
        ],
      },
      {
        type: "list",
        heading: "Under the hood",
        columns: 2,
        items: [
          { title: "Cards that open in place", body: "Parallel and intercepting routes, so every story has a real URL and also opens as a sheet." },
          { title: "Private analytics", body: "A first-party event pipeline on Supabase. Row-Level Security with zero policies, visitor hashes that rotate daily, and an owner-only dashboard." },
          { title: "Static by default", body: "Every page is pre-rendered. Only the analytics endpoints run on the server." },
          { title: "Accessible", body: "Full keyboard navigation, focus that returns where it came from, and reduced-motion support." },
        ],
      },
      {
        type: "links",
        items: [{ label: "Source on GitHub", href: "https://github.com/Deeneawal/portfolio", note: "Deeneawal/portfolio" }],
      },
    ],
    related: ["agentic-workflow", "ui-ux"],
  },
  {
    slug: "contact",
    lede: "I'm open to full-time roles in agentic AI, full-stack engineering and mobile, remote, in Bengaluru or relocating, especially with teams working on real-world problems.",
    blocks: [{ type: "contact" }],
    related: ["journey", "toolkit"],
  },
];
