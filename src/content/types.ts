export type GroupId = "today" | "process" | "work" | "lab" | "about";

export type TileSize = "lg" | "big" | "wide" | "tall" | "sm";
export type TileTone = "light" | "dark" | "blue" | "mint" | "sunset" | "violet" | "graphite";

export type TileVisual =
  | { kind: "stat"; value: string; label: string }
  | { kind: "beforeAfter"; before: string; after: string; label: string }
  | { kind: "icon"; icon: IconName }
  | { kind: "terminal"; lines: string[] }
  | { kind: "journey"; steps: string[] }
  | { kind: "chips"; items: string[] }
  | { kind: "cover"; src: string; alt: string; width: number; height: number; facts: string[] };

export type IconName =
  | "shield"
  | "map"
  | "bot"
  | "workflow"
  | "layers"
  | "palette"
  | "gauge"
  | "boxes"
  | "calendar"
  | "building"
  | "cpu"
  | "home"
  | "sparkles"
  | "wallet"
  | "wrench"
  | "route"
  | "pen"
  | "mail"
  | "compass";

/** Light metadata used by the home bento, the dock and the command palette. */
export interface StoryMeta {
  slug: string;
  group: GroupId;
  eyebrow: string;
  title: string;
  /** One or two sentences shown on the card. */
  summary: string;
  size: TileSize;
  tone: TileTone;
  visual?: TileVisual;
  /** Extra words for the command palette search. */
  keywords?: string[];
}

export type DiagramId =
  | "guardrail-stack"
  | "hook-terminal"
  | "tenancy-layers"
  | "delivery-loop"
  | "ui-schematic"
  | "surgycrm-architecture"
  | "rag-pipeline"
  | "lead-flow"
  | "offline-sync"
  | "family-map"
  | "iot-pipeline";

export type Block =
  | { type: "text"; heading?: string; body: string | string[] }
  | { type: "stats"; heading?: string; items: { value: string; label: string }[] }
  | { type: "steps"; heading?: string; items: { title: string; body: string }[] }
  | { type: "list"; heading?: string; items: (string | { title: string; body: string })[]; columns?: 1 | 2 | 3 }
  | { type: "diagram"; id: DiagramId; caption?: string }
  | { type: "tags"; heading?: string; items: string[] }
  | { type: "links"; heading?: string; items: { label: string; href: string; note?: string }[] }
  | { type: "principle"; body: string }
  | { type: "beforeAfter"; heading?: string; items: { label: string; before: string; after: string; how: string }[] }
  | { type: "decisions"; heading?: string; items: { title: string; context: string; choice: string; why: string }[] }
  | { type: "timeline"; heading?: string; items: { when: string; title: string; body?: string }[] }
  | { type: "code"; heading?: string; caption?: string; lang: string; code: string }
  | { type: "contact" };

export interface StoryBody {
  slug: string;
  /** Large intro paragraph under the title. */
  lede: string;
  blocks: Block[];
  related?: string[];
}
