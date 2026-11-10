import type { StoryBody } from "../types";

export const processStories: StoryBody[] = [
  {
    slug: "agentic-workflow",
    lede:
      "AI agents write much of the code I ship. I do the parts agents are bad at: deciding what to build, writing the rules, reviewing every change and owning production.",
    blocks: [
      { type: "diagram", id: "guardrail-stack", caption: "Every agent action passes through five layers before it reaches production." },
      {
        type: "steps",
        heading: "The loop",
        items: [
          {
            title: "Ground",
            body: "Each session starts from written project context: how the system works, the rules, and what we've learned. Docs are updated in the same change as the code.",
          },
          { title: "Plan", body: "Every non-trivial change starts as a written plan, sized for review." },
          {
            title: "Confirm",
            body: "The agent reads and drafts, then acts only after a human confirms. If a request conflicts with a rule, it says so instead of quietly complying.",
          },
          {
            title: "Act inside guardrails",
            body: "Automatic checks block risky commands before they run, and every edit is type-checked straight away so mistakes are caught immediately.",
          },
          { title: "Ship with a narrow agent", body: "Releases run through a dedicated agent with explicit allowed and forbidden actions, which asks before each deploy." },
          { title: "Learn", body: "Every incident becomes a new rule or check, so the next session starts smarter." },
        ],
      },
      { type: "diagram", id: "hook-terminal", caption: "A guardrail in action: the risky command is stopped before it runs." },
      {
        type: "list",
        heading: "Floor rules: never broken",
        columns: 2,
        items: [
          "Identity and permissions always come from the server, never the client.",
          "Security is enforced in the data layer, not just the UI.",
          "No scripts run against production.",
          "No force-pushes and no automatic pushes.",
          "Shipped database changes are never edited. Fixes go forward.",
        ],
      },
      {
        type: "list",
        heading: "Ceiling rules: scope limits",
        columns: 2,
        items: [
          "Keep diffs minimal; no drive-by refactors.",
          "No speculative feature flags.",
          "Reuse existing components before creating new ones.",
          "Raise conflicts with the rules instead of working around them.",
        ],
      },
      {
        type: "code",
        heading: "What a guardrail looks like",
        caption: "Illustrative. A pre-command check refuses dangerous operations and tells the agent to ask a human.",
        lang: "js",
        code: `// guardrail: runs before every command the agent wants to execute
const RISKY = [/apply\\b.*infra/, /push\\s+.*--force/, /deploy\\s+--prod/, /drop\\s+table/i];

const { command = "" } = JSON.parse(await readStdin()).tool_input;
if (RISKY.some((re) => re.test(command))) {
  console.error("Blocked: this needs a human. Ask first.");
  process.exit(2); // refuse, and explain why to the agent
}`,
      },
      {
        type: "principle",
        body: "Agents bring speed. Guardrails make that speed safe to use. I treat the rules as part of the product.",
      },
      {
        type: "tags",
        heading: "Tools",
        items: ["Claude Code", "Cursor", "Subagents", "Hooks", "Skills", "MCP connectors", "Plan mode", "Lovable", "CI/CD"],
      },
    ],
    related: ["agent-setup", "safeguards", "cost-speed", "hospital-ai-2027"],
  },
  {
    slug: "agent-setup",
    lede:
      "The model is the part I can't change. Everything around it I can: what it knows at the start, what it can run, what it's allowed to touch, what it remembers and what checks its work. That setup decides whether an agent is useful or dangerous.",
    blocks: [
      {
        type: "list",
        heading: "Five things I design for every agent",
        columns: 2,
        items: [
          {
            title: "Context",
            body: "A written project guide in each repository: how the system works, the rules, and what went wrong before. The agent reads it at the start of every session, and it's updated in the same change as the code.",
          },
          {
            title: "Tools",
            body: "The agent gets a way to check its own work. Every file it edits is type-checked straight away, so it sees its mistake while it can still fix it cheaply.",
          },
          {
            title: "Permissions",
            body: "A check runs before every command and refuses the risky ones. Production commands, force-pushes and deploys need a person to say yes.",
          },
          {
            title: "Memory",
            body: "Decisions and lessons are written down where the next session will find them, so nothing has to be explained twice and settled questions stay settled.",
          },
          {
            title: "Checks",
            body: "Tests, a clean-database replay of every data change in CI, and my own review. Nothing the agent writes goes live until I have read it and can explain it.",
          },
        ],
      },
      {
        type: "list",
        heading: "How I extend the agent",
        columns: 2,
        items: [
          {
            title: "Connectors (MCP)",
            body: "The agent reaches the tools I already work in: design files, team chat and documents, the hosting platform for deploys and logs, and the database.",
          },
          {
            title: "Skills I wrote",
            body: "Repeatable jobs packaged as skills: a release routine, a database-change routine, a review and audit routine, and a docs routine. The agent follows the same steps every time.",
          },
          {
            title: "Narrow agents",
            body: "Risky jobs get their own agent with a short list of allowed and forbidden actions. The release agent can do one thing, and it asks before each deploy.",
          },
          {
            title: "Plugins and editor rules",
            body: "Ready-made plugins where they exist, and project rules written for both Claude Code and Cursor, so the agent behaves the same in either.",
          },
        ],
      },
      {
        type: "steps",
        heading: "When an agent gets it wrong",
        items: [
          { title: "Reproduce it", body: "Find the exact step where the agent went off course, from the session log and the diff." },
          {
            title: "Name the layer",
            body: "Was it missing context, missing a tool, allowed too much, or was there no check to catch it? A better prompt is the last answer I reach for, not the first.",
          },
          { title: "Fix that layer", body: "Add the fact to the project guide, add the tool, tighten the permission, or write the check." },
          { title: "Make it permanent", body: "The fix is committed with the code, so every later session and every teammate's agent starts with it." },
        ],
      },
      {
        type: "decisions",
        heading: "Decisions, written down",
        items: [
          {
            title: "Rules in code, not only in the prompt",
            context: "An instruction in a prompt is a request. On a long task an agent can lose track of it.",
            choice: "Anything that must never happen is enforced by a check that runs outside the model.",
            why: "The agent can ignore a sentence. It can't ignore a command that refuses to run.",
          },
          {
            title: "A separate agent for releases",
            context: "A general coding agent with deploy rights can ship by accident.",
            choice: "Releases run through one dedicated agent with explicit allowed and forbidden actions.",
            why: "Small scope means small mistakes, and a short list of permissions is easy to review.",
          },
          {
            title: "One standard for every repository",
            context: "Several products, each with its own agent setup, drift apart.",
            choice: "Shared rules and safety checks live in one engineering standard that every product follows.",
            why: "A lesson learned in one product protects all of them.",
          },
        ],
      },
      { type: "principle", body: "When an agent fails, I fix its context, tools or checks. That fix lasts longer than a better prompt." },
      { type: "tags", heading: "Tools", items: ["Claude Code", "Cursor", "MCP connectors", "Skills", "Plugins", "Hooks", "Subagents", "Plan mode", "Cursor rules", "Session memory", "CI/CD"] },
    ],
    related: ["agentic-workflow", "safeguards", "cost-speed", "platform-kit"],
  },
  {
    slug: "cost-speed",
    lede:
      "AI cost is easy to ignore until the bill arrives, and slow agents waste the time they were meant to save. I treat tokens and seconds as a budget, in the products I ship and in the way I work with agents.",
    blocks: [
      {
        type: "list",
        heading: "In the product",
        columns: 2,
        items: [
          { title: "A budget for each AI use", body: "Every AI feature has its own daily budget and stops safely when it's spent. A bug or a traffic spike can't run up the bill." },
          { title: "The cheap path first", body: "Urgent cases skip AI entirely and approved answers are served as they are. The model handles only what is left." },
          { title: "Pay once", body: "Text is translated once and served from a permanent cache, not paid for on every view." },
          { title: "Every call logged", body: "Each model call is recorded, so I can see where the spend goes, with automatic fallback when a model is unavailable." },
        ],
      },
      {
        type: "list",
        heading: "In my own workflow",
        columns: 2,
        items: [
          { title: "Plan before code", body: "A written plan costs little to review. A wrong build costs a rewrite and all the tokens that went into it." },
          { title: "Small context, narrow agents", body: "Sub-agents do the reading and hand back only what matters, so the main session stays short and focused." },
          { title: "Fail fast", body: "Checks run right after each edit. The agent learns it's wrong in seconds, before it builds more work on the mistake." },
          { title: "Small diffs", body: "No drive-by refactors and no speculative features. Less to generate, less to review, less to break." },
        ],
      },
      {
        type: "beforeAfter",
        heading: "What that looks like in numbers",
        items: [
          {
            label: "AI translations",
            before: "Paid on every view",
            after: "Paid once per label",
            how: "New text is batched and translated once, then served from a permanent cache.",
          },
          {
            label: "Bulk import, 10,000 rows",
            before: "≈30,000 requests",
            after: "35 requests",
            how: "Paged reads and batched writes, with retries that are safe to repeat.",
          },
        ],
      },
      {
        type: "decisions",
        heading: "Decisions, written down",
        items: [
          {
            title: "AI for language, code for actions",
            context: "Asking a model to perform a booking costs tokens and can go wrong.",
            choice: "The model understands the request. Deterministic code does the booking.",
            why: "Code is free to run, instant and right every time.",
          },
          {
            title: "The simplest storage that works",
            context: "A new AI feature needed similarity search over small per-customer datasets.",
            choice: "Use the existing database instead of adding a specialised service.",
            why: "Nothing new to run or pay for. Revisit only when the data outgrows it.",
          },
        ],
      },
      { type: "principle", body: "Every token should buy something: an answer, a check or a decision." },
    ],
    related: ["agent-setup", "ai-gateway", "performance", "surgy-assist"],
  },
  {
    slug: "safeguards",
    lede:
      "Healthcare software holds sensitive data for many organisations at once. A single leak would be one too many, so safety is layered: each layer assumes the one above it might fail.",
    blocks: [
      { type: "diagram", id: "tenancy-layers", caption: "Defence in depth, from the data outward." },
      {
        type: "text",
        heading: "Isolation by design",
        body: [
          "Every customer and branch sees only its own data, and that rule is enforced where the data lives, not just in the interface.",
          "I found and closed cross-customer access gaps, and verified each fix on a throwaway copy before it shipped.",
        ],
      },
      {
        type: "list",
        heading: "Guards above the data",
        columns: 2,
        items: [
          { title: "Scoped caches", body: "Cached data is always keyed to the current customer, so it can't leak across sessions." },
          { title: "Scoped live updates", body: "Real-time updates only reach the people they belong to." },
          { title: "Session checks", body: "A mismatch signs the user out and is logged for review." },
          { title: "Protected secrets", body: "Integration credentials are encrypted and only admins can change them." },
        ],
      },
      {
        type: "list",
        heading: "What an AI agent is never allowed to do",
        columns: 2,
        items: [
          { title: "Reach production", body: "No agent runs scripts against production. Releases go through one narrow agent that asks a person before each deploy." },
          { title: "Hold secrets", body: "Credentials stay out of the repository, and agents are told never to print or commit them." },
          { title: "Rewrite history", body: "No force-pushes, no automatic pushes, and shipped data changes are never edited." },
          { title: "Leave a half-finished job", body: "Data changes are rehearsed on a clean copy, imports and intake are safe to retry, and a failed release rolls back by itself." },
        ],
      },
      {
        type: "steps",
        heading: "Change discipline",
        items: [
          { title: "Write", body: "Every database change is versioned and reviewed: 370+ so far." },
          { title: "Rehearse", body: "Changes are dry-run first and replayed in CI on a clean database." },
          { title: "Fix forward", body: "Shipped changes are never edited. Mistakes are corrected by new changes." },
        ],
      },
      {
        type: "stats",
        heading: "Always-on checks",
        items: [
          { value: "Daily", label: "backups" },
          { value: "Scheduled", label: "integrity checks" },
          { value: "Hourly", label: "messaging health checks" },
          { value: "Auto", label: "rollback if a release fails its smoke test" },
        ],
      },
      { type: "principle", body: "An incident isn't closed until it has become a rule, a check or a test." },
    ],
    related: ["agentic-workflow", "agent-setup", "privacy-controls", "surgycrm"],
  },
  {
    slug: "planning-delivery",
    lede:
      "I bridge client requirements and the development pipeline across several products at once, owning requirements, sprint planning, code review and releases.",
    blocks: [
      { type: "diagram", id: "delivery-loop", caption: "The delivery loop I run for every feature." },
      {
        type: "list",
        heading: "Documents I write before code",
        columns: 2,
        items: [
          { title: "Product requirements", body: "Users, jobs to be done, flows and acceptance criteria." },
          { title: "Integration specs", body: "Clear, versioned contracts for client IT teams." },
          { title: "Runbooks & audits", body: "Go-live audits and day-one runbooks." },
          { title: "Manuals", body: "Admin guides so customers can run the product without us." },
        ],
      },
      {
        type: "decisions",
        heading: "Decisions, written down",
        items: [
          {
            title: "The simplest storage that works",
            context: "A new AI feature needed similarity search over small per-customer datasets.",
            choice: "Use the existing database instead of adding a specialised extension.",
            why: "Fewer moving parts and identical behaviour everywhere it's deployed. Revisit only when the data outgrows it.",
          },
          {
            title: "One codebase, many deployments",
            context: "Some customers need their data kept in their own region.",
            choice: "Deploy the same main branch to each environment rather than forking the code.",
            why: "Data residency without diverging products; every environment gets every fix.",
          },
          {
            title: "AI spend capped by design",
            context: "Model costs can spike with traffic or a bug.",
            choice: "Give each AI use its own daily budget that stops safely when it's spent.",
            why: "Costs are bounded by construction, not by someone noticing a bill.",
          },
          {
            title: "AI for language, code for actions",
            context: "A wrong booking is worse than no booking.",
            choice: "The assistant understands the request; deterministic code performs the action.",
            why: "Models are great at language and unreliable at business rules.",
          },
        ],
      },
      { type: "principle", body: "Decide early, write it down and make the decision cheap to revisit." },
    ],
    related: ["agentic-workflow", "surgy-suite", "ui-ux"],
  },
  {
    slug: "ui-ux",
    lede:
      "My users are call-centre agents with a queue waiting, nurses between patients, field reps in traffic and admins at month-end. Every screen has to work fast for someone short on time.",
    blocks: [
      { type: "diagram", id: "ui-schematic", caption: "The same data as a list for scanning and a board for moving work forward." },
      {
        type: "list",
        heading: "What that looks like",
        columns: 2,
        items: [
          { title: "One design system", body: "A token-based component library, themed per customer at runtime." },
          { title: "List and board", body: "The same work as a filterable list for scanning and a board for moving it forward." },
          { title: "Mobile first where it counts", body: "Bottom navigation, safe areas and an installable web app for staff on phones." },
          { title: "Patient-facing flows", body: "QR-launched, bilingual pages sized for one-thumb use." },
          { title: "Print-grade reports", body: "Reports that print as proper board documents." },
          { title: "Emergency shortcuts", body: "Urgent situations skip the chat and show call buttons." },
        ],
      },
      {
        type: "steps",
        heading: "How I design",
        items: [
          { title: "Map the job", body: "Who uses it, where they are, and how much time they have." },
          { title: "States first", body: "Design the empty, loading, error and offline states before the happy path." },
          { title: "One component, many contexts", body: "Reuse beats one-off screens, and a written UI guide says which component goes where." },
          { title: "Smallest screen first", body: "If it works on a small Android phone, it works everywhere." },
          { title: "Review with screenshots", body: "Automated screenshots of every screen against sample data, so design review never needs real data." },
        ],
      },
      {
        type: "text",
        heading: "This site",
        body: "This portfolio uses the same principles: one light design system, cards that open in place, a dock and a ⌘K palette so nothing is more than one tap away, and motion that respects reduced-motion settings.",
      },
      { type: "tags", heading: "Tools", items: ["Tailwind CSS", "shadcn/ui", "Radix", "Motion", "PWA", "Playwright", "Accessibility"] },
    ],
    related: ["surgycrm", "this-site", "planning-delivery"],
  },
];
