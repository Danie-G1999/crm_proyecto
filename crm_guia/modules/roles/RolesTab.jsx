import { useState } from "react";
import { Shuffle } from "lucide-react";
import { C } from "../../theme/tokens";
import { ROLES } from "../../data/constants";
import { Card, SectionTitle } from "../../components/ui";

export function RolesTab() {
  const [sorteo, setSorteo] = useState(null);

  return (
    <div>
      <SectionTitle eyebrow="Simulación final" title="Rotación de roles" desc="Cada integrante del equipo debe desempeñar los cuatro roles durante la práctica." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, marginBottom: 16 }}>
        {ROLES.map((r) => (
          <Card key={r.rol} style={{ padding: 16, borderColor: sorteo === r.rol ? r.color : C.line }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: r.color }} />
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, color: C.text }}>{r.rol}</span>
            </div>
            <div style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.5 }}>{r.resp}</div>
          </Card>
        ))}
      </div>
      <button
        onClick={() => setSorteo(ROLES[Math.floor(Math.random() * ROLES.length)].rol)}
        style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 10, background: C.live + "1A", border: `1px solid ${C.live}55`, color: C.live, fontSize: 13, cursor: "pointer" }}
      >
        <Shuffle size={15} /> Sortear rol para la ronda
      </button>
      {sorteo && <div style={{ marginTop: 12, fontSize: 13, color: C.text }}>Rol asignado esta ronda: <b>{sorteo}</b></div>}
    </div>
  );
}
