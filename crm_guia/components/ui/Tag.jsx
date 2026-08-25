import { canalById } from "../../data/canales";

export function Tag({ canalId }) {
  const c = canalById(canalId);
  return (
    <span
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "3px 9px", borderRadius: 999, fontSize: 11.5,
        fontFamily: "'IBM Plex Mono', monospace", letterSpacing: 0.3,
        background: c.color + "1A", color: c.color, border: `1px solid ${c.color}40`,
      }}
    >
      <c.Icon size={12} strokeWidth={2.4} />
      {c.nombre}
    </span>
  );
}
