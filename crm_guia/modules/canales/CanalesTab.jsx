import { C } from "../../theme/tokens";
import { canalById } from "../../data/canales";
import { MATRIZ } from "../../data/matriz";
import { Card, SectionTitle, Pill } from "../../components/ui";

export function CanalesTab() {
  return (
    <div>
      <SectionTitle eyebrow="Matriz técnica" title="Selección de canales" desc="Criterios usados para justificar la elección de canal en cada caso." />
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {MATRIZ.map((m) => {
          const c = canalById(m.canal);
          return (
            <Card key={m.canal} style={{ padding: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: c.color + "1A", border: `1px solid ${c.color}55` }}>
                  <c.Icon size={15} color={c.color} />
                </div>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 15, color: C.text }}>{c.nombre}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, marginBottom: 10 }}>
                {[["Tiempo real", m.tiempoReal], ["Formalidad", m.formalidad], ["Trazabilidad", m.trazabilidad], ["Urgencia", m.urgencia], ["Complejidad", m.complejidad]].map(([k, v]) => (
                  <div key={k} style={{ background: C.panelAlt, borderRadius: 8, padding: "8px 10px", border: `1px solid ${C.line}` }}>
                    <div style={{ fontSize: 10.5, color: C.mutedDim, marginBottom: 3 }}>{k}</div>
                    <Pill tone={v === "Alta" ? "danger" : v === "Media" ? "warn" : "ok"}>{v}</Pill>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.5 }}>{m.cuando}</div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
