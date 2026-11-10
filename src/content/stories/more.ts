import { book, certifications, medium, posts } from "../profile";
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
    lede: `${book.title}: ${book.subtitle} is our newly published handbook for hospital CEOs, CIOs, medical directors and finance heads. It shows what changed in hospital AI in 2026, what is working, what to avoid, and how to choose and govern an AI-first hospital system in 2027. It's free to download.`,
    blocks: [
      {
        type: "image",
        src: "/images/hospital-ai-2027/book-mockup.jpg",
        alt: "The book Hospital AI 2027: From listening to acting to orchestrating, with its three authors named on the cover",
        width: 1600,
        height: 1200,
        href: book.href,
        caption: "Hospital AI 2027, first edition, November 2026. Select the cover to open the book page on surgy.health.",
      },
      {
        type: "cta",
        eyebrow: "Free field guide",
        title: "Get your copy of Hospital AI 2027, free.",
        body: "95 pages for hospital leaders: what changed in 2026, what is working, what to avoid, and a buyer's scorecard, a 90-day plan and a readiness check you can use the same day.",
        primary: { label: "Get the free guide", href: book.href },
        secondary: { label: "Open the PDF", href: book.pdfHref },
        note: `Published by Surgy Health · ISBN ${book.isbn}`,
      },
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
        type: "text",
        heading: "The argument",
        body: [
          "Hospital AI is moving through three stages. It started by listening: scribes that write the note. It is now acting: agents that draft prescriptions, chase approvals and answer patient calls, with a person signing off. Next comes orchestrating: many agents, people and systems coordinated around one hospital goal, with rules and an audit trail holding it together.",
          "Each stage brings real gains and real risk, so every chapter pairs what the evidence shows with what a hospital should do about it.",
        ],
      },
      {
        type: "gallery",
        heading: "Look inside",
        intro: "Four pages from the book. Select any page to open it in the PDF.",
        items: [
          {
            src: "/images/hospital-ai-2027/three-shifts.jpg",
            alt: "Page 11 of Hospital AI 2027: the three shifts at a glance, listening, acting and orchestrating",
            width: 909,
            height: 1287,
            title: "The three shifts at a glance",
            caption: "Page 11 · Listening, acting, orchestrating",
            href: `${book.pdfHref}#page=11`,
          },
          {
            src: "/images/hospital-ai-2027/buyers-scorecard.jpg",
            alt: "Page 43 of Hospital AI 2027: the buyer's scorecard with nine weighted criteria and one veto",
            width: 909,
            height: 1287,
            title: "The buyer's scorecard",
            caption: "Page 43 · Nine criteria, weighted, with one veto",
            href: `${book.pdfHref}#page=43`,
          },
          {
            src: "/images/hospital-ai-2027/eight-controls.jpg",
            alt: "Page 52 of Hospital AI 2027: eight controls for a governed agent",
            width: 909,
            height: 1287,
            title: "Eight controls for a governed agent",
            caption: "Page 52 · Containing agents by design",
            href: `${book.pdfHref}#page=52`,
          },
          {
            src: "/images/hospital-ai-2027/readiness-check.jpg",
            alt: "Page 77 of Hospital AI 2027: a twelve-question self-assessment of hospital AI readiness",
            width: 909,
            height: 1287,
            title: "How ready is your hospital?",
            caption: "Page 77 · A self-check scored out of 24",
            href: `${book.pdfHref}#page=77`,
          },
        ],
      },
      {
        type: "list",
        heading: "What's inside",
        items: [
          { title: "Part I · Listening", body: "Ambient scribes are infrastructure now. What the latest large studies found, and why patient trust is the bottleneck." },
          { title: "Part II · Acting", body: "The health record becomes a platform that agents plug into, the back office pays back first, and rules plus prediction plus generation beat a language model on its own." },
          { title: "Part III · Orchestrating", body: "Agents, people and rules coordinated around one goal such as bed flow, and how to choose a hospital system for 2027." },
          { title: "Part IV · Guardrails and markets", body: "Governance, security for agents that go off-script, where the money went, and the rules in India and the Gulf." },
          { title: "Part V · The playbook", body: "How to prove AI works on your own data, and a 2027 blueprint for hospital leaders." },
        ],
      },
      {
        type: "list",
        heading: "Tools you can use the same day",
        columns: 2,
        items: [
          { title: "A buyer's scorecard", body: "Nine weighted criteria and one veto, the same for every vendor." },
          { title: "Ten tender requirements", body: "What to ask of any hospital system in 2027." },
          { title: "Eight controls for a governed agent", body: "From an identity for each agent to one gateway with a full audit trail." },
          { title: "A 90-day plan", body: "Look, test, decide: a pilot that proves value before any long contract." },
          { title: "A readiness check", body: "Twelve statements, scored out of 24, to run with your leadership team in an afternoon." },
          { title: "Forty-five takeaways", body: "Three from each chapter, on two pages." },
        ],
      },
      {
        type: "text",
        heading: "Who wrote it",
        body: "Three of us at Surgy Health: Mohammed Jamil Nasir (product and technology), Simran Nagekar (product engineering and research) and me (platform engineering and agentic AI). It draws on 56 research briefs and daily digests written between August and November 2026.",
      },
      {
        type: "principle",
        body: "Let AI do the work around care, prove every claim on your own data, and keep a named person accountable for every decision it touches.",
      },
      {
        type: "cta",
        eyebrow: "Read it now",
        title: "Take it to your next steering committee.",
        body: "Download the handbook, share it with your CIO, medical director and finance head, and run the readiness check together.",
        primary: { label: "Get the free guide", href: book.href },
        secondary: { label: "Open the PDF", href: book.pdfHref },
      },
      { type: "tags", items: ["Agentic AI", "Hospital information systems", "Governance", "Agent security", "Evaluation", "India", "GCC"] },
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
            title: "Full-Stack Engineer & Product Lead · Surgy Innovation Labs",
            body: "Bengaluru (hybrid). My first project was Samatvalife (Dec 2025 – May 2026). I built SurgyCRM and SurgyField, and I'm now product lead for SurgyCRM, SurgyScribe and SurgyFrontdesk.",
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
          { label: "Medium", href: medium, note: "Articles on building hospital software" },
        ],
      },
    ],
    related: ["toolkit", "contact"],
  },
  {
    slug: "writing",
    lede: "I write about the products I build: the hospital problems behind them and how the software solves them. So far that is one co-authored book and four articles: three on surgy.health and one on Medium.",
    blocks: [
      {
        type: "links",
        heading: "Book",
        items: [{ label: `${book.title}: ${book.subtitle}`, href: book.href, note: `Co-author · ${book.published} · ISBN ${book.isbn}` }],
      },
      {
        type: "links",
        heading: "Articles",
        items: posts.map((p) => ({
          label: p.title,
          href: p.href,
          note: [p.date, p.where, p.minutes ? `${p.minutes} min read` : null].filter(Boolean).join(" · "),
        })),
      },
      {
        type: "links",
        heading: "Follow",
        items: [{ label: "Medium", href: medium, note: "@zuhaib_99173" }],
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
