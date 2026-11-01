import {
  Boxes,
  Building2,
  Calendar,
  Compass,
  Cpu,
  Gauge,
  House,
  Layers,
  Mail,
  Map,
  Palette,
  PenLine,
  Route,
  Shield,
  Sparkles,
  Bot,
  Wallet,
  Workflow,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { SVGProps } from "react";
import type { IconName } from "@/content/types";

export const iconMap: Record<IconName, LucideIcon> = {
  shield: Shield,
  map: Map,
  bot: Bot,
  workflow: Workflow,
  layers: Layers,
  palette: Palette,
  gauge: Gauge,
  boxes: Boxes,
  calendar: Calendar,
  building: Building2,
  cpu: Cpu,
  home: House,
  sparkles: Sparkles,
  wallet: Wallet,
  wrench: Wrench,
  route: Route,
  pen: PenLine,
  mail: Mail,
  compass: Compass,
};

type BrandProps = SVGProps<SVGSVGElement> & { size?: number };

export function GithubIcon({ size = 18, ...props }: BrandProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  );
}

export function LinkedinIcon({ size = 18, ...props }: BrandProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true" {...props}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}

export function LeetcodeIcon({ size = 18, ...props }: BrandProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true" {...props}>
      <path d="M13.48 0a1.37 1.37 0 0 0-.96.44L7.12 6.21l-2.7 2.9A5.85 5.85 0 0 0 3 12.62a5.92 5.92 0 0 0 1.73 4.35l4.29 4.4a5.99 5.99 0 0 0 8.3.18l2.62-2.42a1.37 1.37 0 1 0-1.86-2.01l-2.62 2.42a3.26 3.26 0 0 1-4.48-.1l-4.29-4.4a3.2 3.2 0 0 1-.9-2.3 3.1 3.1 0 0 1 .68-1.97l2.7-2.9 5.4-5.78A1.37 1.37 0 0 0 13.48 0Zm-2.47 12.94a1.37 1.37 0 1 0 0 2.74h9.62a1.37 1.37 0 1 0 0-2.74h-9.62Z" />
    </svg>
  );
}

export function WhatsappIcon({ size = 18, ...props }: BrandProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true" {...props}>
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.41-.08-.13-.27-.2-.57-.35ZM12.04 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.88 9.88Zm8.41-18.3A11.82 11.82 0 0 0 12.04 0C5.5 0 .17 5.33.16 11.88c0 2.1.55 4.14 1.59 5.94L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.88-5.33 11.89-11.89a11.82 11.82 0 0 0-3.49-8.41Z" />
    </svg>
  );
}
