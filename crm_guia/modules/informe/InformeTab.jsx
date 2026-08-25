import { Download } from "lucide-react";
import { C } from "../../theme/tokens";
import { Card, SectionTitle, PrimaryBtn } from "../../components/ui";
import { buildReportHTML } from "./reportBuilder";

export function InformeTab({ clientes, interacciones, casos, guiones }) {
  const total = interacciones.length;
  const resueltas = interacciones.filter((i) => i.estado === "Resuelto").length;
  const escaladas = interacciones.filter((i) => i.estado === "Escalado").length;
  const primerContactoCasos = interacciones.filter((i) => i.primerContacto);
  const fcr = primerContactoCasos.length
    ? Math.round((primerContactoCasos.filter((i) => i.estado === "Resuelto").length / primerContactoCasos.length) * 100)
    : 0;
  const tasaResolucion = total ? Math.round((resueltas / total) * 100) : 0;
  const tasaEscalamiento = total ? Math.round((escaladas / total) * 100) : 0;
  const kpis = { fcr, tasaResolucion, tasaEscalamiento, total };

  const descargar = () => {
    const html = buildReportHTML({ clientes, interacciones, casos, guiones, kpis });
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "informe_crm_omnicanal.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <SectionTitle
        eyebrow="Entregable"
        title="Informe de resultados"
        desc="Compila clientes, bitácora, casos y guiones actuales en un documento único, listo para anexar a la entrega."
        action={<PrimaryBtn onClick={descargar} Icon={Download}>Descargar informe</PrimaryBtn>}
      />
      <Card>
        <div style={{ fontSize: 13, color: C.muted, marginBottom: 14, lineHeight: 1.6 }}>
          El informe se genera con los datos que existan <b style={{ color: C.text }}>en este momento</b> en el CRM: clientes, bitácora, casos y guiones.
          Al descargarlo obtiene un archivo <code style={{ color: C.live }}>.html</code> autocontenido — ábralo con el navegador y use{" "}
          <b style={{ color: C.text }}>Imprimir → Guardar como PDF</b> si necesita entregarlo en ese formato.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
          {[["Clientes", clientes.length], ["Interacciones", total], ["Casos", casos.length], ["Guiones", guiones.length], ["FCR", `${fcr}%`]].map(([label, value]) => (
            <div key={label} style={{ background: C.panelAlt, border: `1px solid ${C.line}`, borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 700, color: C.text }}>{value}</div>
              <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
