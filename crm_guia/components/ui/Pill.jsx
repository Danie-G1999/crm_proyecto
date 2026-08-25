import { C } from "../../theme/tokens";

const TONES = {
  muted: { bg: C.panelAlt, fg: C.muted, bd: C.line },
  ok: { bg: "#4ADE8018", fg: C.ok, bd: "#4ADE8040" },
  warn: { bg: "#F2B84B18", fg: C.warn, bd: "#F2B84B40" },
  danger: { bg: "#FB718518", fg: C.danger, bd: "#FB718540" },
};

export function Pill({ children, tone = "muted" }) {
  const t = TONES[tone] ?? TONES.muted;
  return (
    <span
      style={{
        padding: "2px 9px", borderRadius: 999, fontSize: 11.5, fontWeight: 600,
        background: t.bg, color: t.fg, border: `1px solid ${t.bd}`, whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}
