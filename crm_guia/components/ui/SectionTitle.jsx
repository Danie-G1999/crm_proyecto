import { C } from "../../theme/tokens";

export function SectionTitle({ eyebrow, title, desc, action }) {
  return (
    <div style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 12, flexWrap: "wrap" }}>
      <div>
        {eyebrow && (
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5, color: C.live, letterSpacing: 1.6, textTransform: "uppercase", marginBottom: 6 }}>
            {eyebrow}
          </div>
        )}
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 600, color: C.text, margin: 0 }}>{title}</h2>
        {desc && <p style={{ color: C.muted, fontSize: 13.5, marginTop: 6, maxWidth: 640, lineHeight: 1.5 }}>{desc}</p>}
      </div>
      {action}
    </div>
  );
}
