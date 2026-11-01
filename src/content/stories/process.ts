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
        items: ["Claude Code", "Subagents", "Hooks", "Plan mode", "Lovable", "Cursor", "CI/CD"],
      },
    ],
    related: ["safeguards", "planning-delivery", "platform-kit", "this-site"],
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
    related: ["agentic-workflow", "surgycrm", "platform-kit"],
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
