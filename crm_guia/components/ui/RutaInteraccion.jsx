import { C } from "../../theme/tokens";
import { canalById } from "../../data/canales";
import { Pill } from "./Pill";

export function RutaInteraccion({ desde, hasta, label }) {
  const a = canalById(desde);
  const b = canalById(hasta);
  const mismo = desde === hasta;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: C.panelAlt, border: `1px solid ${C.line}`, borderRadius: 12 }}>
      <div style={{ width: 34, height: 34, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: a.color + "1A", border: `1px solid ${a.color}55` }}>
        <a.Icon size={16} color={a.color} />
      </div>
      <div style={{ flex: 1, position: "relative", height: 2, background: C.line, borderRadius: 2 }}>
        {!mismo && (
          <div
            className="ruta-dot"
            style={{ position: "absolute", top: -3, left: 0, width: 8, height: 8, borderRadius: "50%", background: C.live, boxShadow: `0 0 10px ${C.live}` }}
          />
        )}
      </div>
      {!mismo ? (
        <div style={{ width: 34, height: 34, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: b.color + "1A", border: `1px solid ${b.color}55` }}>
          <b.Icon size={16} color={b.color} />
        </div>
      ) : (
        <Pill tone="muted">sin migración</Pill>
      )}
      <div style={{ marginLeft: 8, fontSize: 12.5, color: C.muted, fontFamily: "'IBM Plex Mono', monospace" }}>{label}</div>
    </div>
  );
}
