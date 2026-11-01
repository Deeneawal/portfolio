import type { ReactNode } from "react";
import type { DiagramId } from "@/content/types";
import { Columns, Decisions, DiagramFrame, Flow, Stack } from "./primitives";

function GuardrailStack() {
  return (
    <Stack
      layers={[
        { title: "Context", body: "Written project context and past decisions load at the start of every session." },
        { title: "Rules", body: "Floor rules that are never broken, and ceiling rules that limit scope." },
        { title: "Plan & confirm", body: "A written plan comes first. Nothing acts until a human approves it." },
        { title: "Guardrails", body: "Risky commands are blocked, and every edit is type-checked automatically." },
        { title: "Review & release", body: "Reviewed changes, CI checks and a narrowly scoped release agent." },
      ]}
      base="Production"
    />
  );
}

function HookTerminal() {
  const lines: { who: string; text: string; tone: string }[] = [
    { who: "agent", text: "Run: apply infrastructure changes", tone: "text-white/85" },
    { who: "guard", text: "pre-command check › blocked", tone: "text-[#ff6961]" },
    { who: "guard", text: "“This needs a human. Ask first.”", tone: "text-[#ff9f0a]" },
    { who: "agent", text: "Understood. Here is the plan for your review…", tone: "text-white/85" },
    { who: "you", text: "Approved. Ship it through the release workflow.", tone: "text-[#30d158]" },
  ];
  return (
    <div className="mx-auto max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-[#141416] font-mono text-[12.5px] leading-6 sm:text-[13.5px]">
      <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-2.5" aria-hidden>
        <span className="size-3 rounded-full bg-[#ff5f57]" />
        <span className="size-3 rounded-full bg-[#febc2e]" />
        <span className="size-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 text-[12px] text-white/40">agent session</span>
      </div>
      <ol className="space-y-1.5 px-4 py-4 sm:px-5">
        {lines.map((l) => (
          <li key={l.text} className="flex gap-3">
            <span className="w-12 shrink-0 text-right text-white/35">{l.who}</span>
            <span className={`min-w-0 break-words ${l.tone}`}>{l.text}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function TenancyLayers() {
  return (
    <Stack
      layers={[
        { title: "Session checks", body: "Anything that doesn't match the signed-in organisation ends the session and is logged." },
        { title: "Scoped client", body: "Cached data and live updates are always keyed to the current organisation." },
        { title: "Server checks", body: "Identity and permissions come from the server, never from the request." },
        { title: "Data-layer rules", body: "Access rules enforced where the data lives, per organisation and per branch." },
      ]}
      base="Sensitive data"
    />
  );
}

function DeliveryLoop() {
  return (
    <Flow
      nodes={[
        { title: "Listen", body: "Ops, calls, site visits" },
        { title: "Specify", body: "Requirements, specs" },
        { title: "Plan", body: "Written & reviewed" },
        { title: "Design", body: "States first" },
        { title: "Build", body: "Agents in guardrails", accent: true },
        { title: "Verify", body: "Tests, rehearsals" },
        { title: "Ship", body: "Reviewed releases" },
        { title: "Observe", body: "Heartbeats, reports" },
      ]}
      loopLabel="What we observe feeds the next round of listening"
    />
  );
}

function UiSchematic() {
  const bar = (w: string, tone = "bg-black/10") => <span className={`block h-2 rounded-full ${tone}`} style={{ width: w }} />;
  return (
    <div className="grid gap-4 md:grid-cols-2" aria-hidden>
      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/[0.06]">
        <div className="mb-3 flex items-center gap-2">
          <span className="rounded-full bg-accent px-2.5 py-1 text-[11px] font-semibold text-white">List</span>
          <span className="rounded-full bg-black/5 px-2.5 py-1 text-[11px] font-semibold text-muted">Kanban</span>
          <span className="ml-auto h-6 w-24 rounded-full bg-black/5" />
        </div>
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-3 border-t border-black/5 py-2.5">
            <span className="size-7 shrink-0 rounded-full bg-accent/15" />
            <span className="flex flex-1 flex-col gap-1.5">
              {bar(`${60 - i * 6}%`, "bg-black/15")}
              {bar(`${38 + i * 5}%`)}
            </span>
            <span className={`h-5 w-14 rounded-full ${["bg-[#ffe3d1]", "bg-[#d4e6ff]", "bg-[#d3f1e3]"][i % 3]}`} />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/[0.06]">
        {["#0071e3", "#ff9f0a", "#7c3aed"].map((c, col) => (
          <div key={c} className="flex flex-col gap-2 rounded-xl bg-black/[0.03] p-2">
            <span className="h-1 rounded-full" style={{ background: c }} />
            {Array.from({ length: 3 - (col % 2) }).map((_, i) => (
              <span key={i} className="flex flex-col gap-1.5 rounded-lg bg-white p-2 shadow-sm">
                {bar("80%", "bg-black/15")}
                {bar("55%")}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function SurgycrmArchitecture() {
  return (
    <Columns
      columns={[
        {
          label: "Capture",
          nodes: [
            { title: "Ads & website", body: "Every enquiry, from any campaign" },
            { title: "Chat assistant", body: "Conversations become leads" },
            { title: "Phone & field", body: "Calls and visits become activity" },
            { title: "Hospital systems", body: "Patient records kept in sync" },
          ],
        },
        {
          label: "Secure core",
          highlight: true,
          nodes: [
            { title: "One source of truth", body: "Isolated per hospital and branch", accent: true },
            { title: "Automations", body: "Assignment, reminders, follow-ups" },
            { title: "Verified intake", body: "No duplicates, safe to retry" },
          ],
        },
        {
          label: "Engage & insight",
          nodes: [
            { title: "Staff app", body: "Web and mobile, built for speed" },
            { title: "Patient touchpoints", body: "Messages, feedback, surveys" },
            { title: "Leadership reports", body: "Audit-grade and printable" },
          ],
        },
      ]}
    />
  );
}

function RagPipeline() {
  return (
    <Decisions
      steps={[
        { title: "Safety check", body: "Urgent situations bypass AI entirely.", exit: "Show call options" },
        { title: "Curated answers", body: "Common questions get hospital-approved answers.", exit: "Approved answer" },
        { title: "Grounded retrieval", body: "Only the hospital's own documents, and only on a confident match.", exit: "No match → human" },
        { title: "Cost check", body: "Each AI use has a daily budget and stops safely when it's spent.", exit: "Safe fallback" },
        { title: "Generate", body: "A language model answers from the retrieved content only, with automatic fallback." },
      ]}
      end={{ title: "Answer → book (in code) → lead in the CRM", body: "Every model call is logged for review." }}
    />
  );
}

function LeadFlow() {
  return (
    <Flow
      nodes={[
        { title: "Capture", items: ["Ads", "Website", "Chat", "Phone"] },
        { title: "Ingest", items: ["Verified", "Deduplicated", "Retried safely"], accent: true },
        { title: "Assign", items: ["Fair distribution", "Right team, right branch"] },
        { title: "Engage", items: ["Timely reminders", "Activity logged"] },
        { title: "Follow up", items: ["Feedback survey", "Low score → ticket", "Escalates on time"] },
      ]}
    />
  );
}

function OfflineSync() {
  return (
    <Flow
      nodes={[
        { title: "Check in", body: "Inside the geofence only" },
        { title: "Queue", body: "Stored on the device while offline" },
        { title: "Batch", body: "Stable ids per item", accent: true },
        { title: "Sync", body: "Retry-safe upload when online" },
        { title: "Realtime", body: "Supervisors see it live" },
      ]}
    />
  );
}

function FamilyMap() {
  const areas = ["Hospital records", "Clinical AI", "Patient engagement", "Revenue & claims", "Training", "Analytics"];
  return (
    <div className="grid gap-3">
      <div className="rounded-2xl bg-ink px-5 py-4 text-center text-white">
        <p className="text-[15px] font-semibold">One engineering standard</p>
        <p className="mt-1 text-[13px] text-white/80">Security · data changes · releases · integrations · compliance · AI rules</p>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {areas.map((a) => (
          <div
            key={a}
            className={`rounded-2xl px-3 py-3 text-center text-[14px] font-semibold shadow-sm ring-1 ${a === "Patient engagement" ? "bg-accent text-white ring-accent" : "bg-white text-ink ring-black/[0.06]"}`}
          >
            {a}
          </div>
        ))}
      </div>
    </div>
  );
}

function IotPipeline() {
  return (
    <Flow
      nodes={[
        { title: "ESP32 + DHT", body: "C++ firmware" },
        { title: "MQTT", body: "Publish every 5 s" },
        { title: "Mosquitto", body: "Broker on a Raspberry Pi" },
        { title: "Node.js", body: "Express subscriber", accent: true },
        { title: "PostgreSQL", body: "Indexed time series" },
        { title: "Dashboard", body: "Live via Socket.IO" },
      ]}
    />
  );
}

const registry: Record<DiagramId, { render: () => ReactNode; dark?: boolean }> = {
  "guardrail-stack": { render: GuardrailStack },
  "hook-terminal": { render: HookTerminal, dark: true },
  "tenancy-layers": { render: TenancyLayers },
  "delivery-loop": { render: DeliveryLoop },
  "ui-schematic": { render: UiSchematic },
  "surgycrm-architecture": { render: SurgycrmArchitecture },
  "rag-pipeline": { render: RagPipeline },
  "lead-flow": { render: LeadFlow },
  "offline-sync": { render: OfflineSync },
  "family-map": { render: FamilyMap },
  "iot-pipeline": { render: IotPipeline },
};

export const diagramIds = Object.keys(registry) as DiagramId[];

export function Diagram({ id, caption }: { id: DiagramId; caption?: string }) {
  const entry = registry[id];
  return (
    <DiagramFrame caption={caption} dark={entry.dark}>
      {entry.render()}
    </DiagramFrame>
  );
}
