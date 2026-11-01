import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { profile } from "@/content/profile";

export const alt = "Zuhaib Ahmad Khan, Agentic Full-Stack Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const photo = await readFile(path.join(process.cwd(), "public/images/zuhaib-portrait.jpg"));
  const src = `data:image/jpeg;base64,${photo.toString("base64")}`;
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#f5f5f7", padding: 48, gap: 40 }}>
        <div
          style={{
            display: "flex",
            width: 380,
            height: 534,
            borderRadius: 36,
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          }}
        >
          <img src={src} alt="" width={380} height={676} style={{ objectFit: "cover", marginTop: -40 }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", flex: 1 }}>
          <div style={{ fontSize: 26, color: "#6e6e73", fontWeight: 600, letterSpacing: 2 }}>PORTFOLIO</div>
          <div style={{ fontSize: 76, fontWeight: 800, color: "#1d1d1f", lineHeight: 1.02, marginTop: 14, letterSpacing: -2 }}>
            {profile.name}
          </div>
          <div style={{ fontSize: 38, color: "#0071e3", fontWeight: 700, marginTop: 18 }}>{profile.title}</div>
          <div style={{ fontSize: 26, color: "#424245", marginTop: 26, lineHeight: 1.35 }}>
            Multi-tenant healthcare SaaS, end to end. React, TypeScript, PostgreSQL with RLS, Flutter and AI.
          </div>
          <div style={{ display: "flex", marginTop: 34, fontSize: 22, color: "#6e6e73" }}>{profile.location} · {profile.openTo}</div>
        </div>
      </div>
    ),
    size,
  );
}
