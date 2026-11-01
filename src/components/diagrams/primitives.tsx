import { Fragment, type ReactNode } from "react";
import { ArrowDown, ArrowRight, CornerDownLeft, RotateCcw } from "lucide-react";
import { cn } from "@/lib/cn";

export interface DiagramNode {
  title: string;
  body?: string;
  items?: string[];
  accent?: boolean;
}

function NodeCard({ node, className }: { node: DiagramNode; className?: string }) {
  return (
    <div
      className={cn(
        "rounded-2xl px-4 py-3.5 text-left shadow-sm ring-1",
        node.accent ? "bg-accent text-white ring-accent" : "bg-white text-ink ring-black/[0.06]",
        className,
      )}
    >
      <p className="text-[15px] font-semibold leading-snug">{node.title}</p>
      {node.body && <p className={cn("mt-1 text-[13px] leading-snug", node.accent ? "text-white" : "text-muted")}>{node.body}</p>}
      {node.items && (
        <ul className={cn("mt-2 space-y-1 text-[13px] leading-snug", node.accent ? "text-white" : "text-ink-2")}>
          {node.items.map((it) => (
            <li key={it} className="flex gap-1.5">
              <span aria-hidden className={node.accent ? "text-white" : "text-accent"}>•</span>
              {it}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Arrow({ direction = "responsive" }: { direction?: "responsive" | "down" }) {
  return (
    <span aria-hidden className="grid shrink-0 place-items-center text-faint">
      {direction === "down" ? (
        <ArrowDown className="size-4" />
      ) : (
        <>
          <ArrowDown className="size-4 lg:hidden" />
          <ArrowRight className="hidden size-4 lg:block" />
        </>
      )}
    </span>
  );
}

/** A left-to-right pipeline on large screens, top-to-bottom on phones. */
export function Flow({ nodes, loopLabel }: { nodes: DiagramNode[]; loopLabel?: string }) {
  return (
    <div>
      <ol className="flex flex-col items-stretch gap-2 lg:flex-row lg:items-center">
        {nodes.map((node, i) => (
          <Fragment key={node.title}>
            <li className="lg:min-w-0 lg:flex-1">
              <NodeCard node={node} className="h-full" />
            </li>
            {i < nodes.length - 1 && (
              <li aria-hidden className="flex justify-center">
                <Arrow />
              </li>
            )}
          </Fragment>
        ))}
      </ol>
      {loopLabel && (
        <p className="mt-4 flex items-center justify-center gap-2 text-[13px] font-medium text-muted">
          <RotateCcw aria-hidden className="size-4 text-accent" /> {loopLabel}
        </p>
      )}
    </div>
  );
}

/** Columns of nodes with arrows between them (sources → core → outputs). */
export function Columns({ columns }: { columns: { label: string; nodes: DiagramNode[]; highlight?: boolean }[] }) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-stretch">
      {columns.map((col, i) => (
        <Fragment key={col.label}>
          <section
            aria-label={col.label}
            className={cn("flex-1 rounded-3xl p-3 sm:p-4", col.highlight ? "bg-accent/[0.08] ring-1 ring-accent/20" : "bg-black/[0.025]")}
          >
            <p className="eyebrow mb-3 px-1 text-ink-2">{col.label}</p>
            <ul className="grid gap-2">
              {col.nodes.map((n) => (
                <li key={n.title}>
                  <NodeCard node={n} />
                </li>
              ))}
            </ul>
          </section>
          {i < columns.length - 1 && <Arrow />}
        </Fragment>
      ))}
    </div>
  );
}

/** Stacked layers, outermost first, ending in what they protect. */
export function Stack({ layers, base }: { layers: DiagramNode[]; base: string }) {
  return (
    <ol className="flex flex-col gap-2">
      {layers.map((layer, i) => (
        <li
          key={layer.title}
          className="flex items-start gap-4 rounded-2xl bg-white px-4 py-3.5 shadow-sm ring-1 ring-black/[0.06]"
          style={{ marginInline: `${i * 1.25}%` }}
        >
          <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-accent/10 text-[13px] font-semibold text-accent">{i + 1}</span>
          <span>
            <span className="block text-[15px] font-semibold text-ink">{layer.title}</span>
            {layer.body && <span className="mt-0.5 block text-[13px] leading-snug text-muted">{layer.body}</span>}
          </span>
        </li>
      ))}
      <li
        className="rounded-2xl bg-ink px-4 py-3.5 text-center text-[15px] font-semibold text-white"
        style={{ marginInline: `${layers.length * 1.25}%` }}
      >
        {base}
      </li>
    </ol>
  );
}

/** A decision pipeline: each step either resolves (exit) or falls through to the next. */
export function Decisions({ steps, end }: { steps: { title: string; body: string; exit?: string }[]; end: DiagramNode }) {
  return (
    <ol className="flex flex-col gap-2">
      {steps.map((step) => (
        <li key={step.title} className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="flex-1 rounded-2xl bg-white px-4 py-3.5 shadow-sm ring-1 ring-black/[0.06]">
            <p className="text-[15px] font-semibold text-ink">{step.title}</p>
            <p className="mt-0.5 text-[13px] leading-snug text-muted">{step.body}</p>
          </div>
          {step.exit && (
            <p className="flex items-center gap-2 self-start rounded-full bg-[#e9f8f1] px-3 py-1.5 text-[13px] font-medium text-[#1d6b40] sm:self-auto">
              <CornerDownLeft aria-hidden className="size-3.5 rotate-180" /> {step.exit}
            </p>
          )}
        </li>
      ))}
      <li>
        <NodeCard node={{ ...end, accent: true }} />
      </li>
    </ol>
  );
}

export function DiagramFrame({ caption, children, dark }: { caption?: string; children: ReactNode; dark?: boolean }) {
  return (
    <figure className={cn("overflow-hidden rounded-[24px] p-4 sm:p-7", dark ? "bg-[#0b0b0d]" : "bg-[#f5f5f7]")}>
      {children}
      {caption && <figcaption className={cn("mt-4 text-center text-[13px]", dark ? "text-white/50" : "text-muted")}>{caption}</figcaption>}
    </figure>
  );
}
