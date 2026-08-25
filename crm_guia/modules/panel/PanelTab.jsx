import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { CircleCheck, ClipboardCheck, AlertTriangle, Clock3, Loader2 } from "lucide-react";
import { C } from "../../theme/tokens";
import { CANALES } from "../../data/canales";
import { Card, SectionTitle, RutaInteraccion } from "../../components/ui";
import { api } from "../../lib/api";

export function PanelTab() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function fetchStats() {
      try {
        const response = await api.get("/dashboard/stats");
        if (!ignore) {
          setStats(response.data);
        }
      } catch (err) {
        if (!ignore) {
          console.error("Error al cargar estadísticas del dashboard:", err);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    fetchStats();

    return () => {
      ignore = true;
    };
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: 60, color: C.muted }}>
        <Loader2 className="animate-spin" style={{ marginRight: 8 }} /> Cargando indicadores en tiempo real...
      </div>
    );
  }

  const { fcr, tasaResolucion, tasaEscalamiento, total, ultimaMigracion, conteoCanales } = stats || {};

  // Formatear distribución conectando conteos reales con colores e íconos locales
  const distribucion = CANALES.map((c) => ({
    name: c.nombre,
    value: conteoCanales?.[c.id] || 0,
    color: c.color,
  }));

  return (
    <div>
      <SectionTitle
        eyebrow="Torre de control · en vivo"
        title="Panel de operación omnicanal"
        desc="Indicadores calculados en tiempo real — se recalculan al crear, editar o eliminar registros."
      />

      {ultimaMigracion && (
        <div style={{ marginBottom: 20 }}>
          <RutaInteraccion
            desde={ultimaMigracion.canal_inicial}
            hasta={ultimaMigracion.canal_actual}
            label={`${ultimaMigracion.nombre} · migración registrada`}
          />
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 20 }}>
        {[
          { label: "FCR (1er contacto)", value: `${fcr}%`, icon: CircleCheck, tone: C.ok },
          { label: "Tasa de resolución", value: `${tasaResolucion}%`, icon: ClipboardCheck, tone: C.live },
          { label: "Tasa de escalamiento", value: `${tasaEscalamiento}%`, icon: AlertTriangle, tone: C.danger },
          { label: "Interacciones totales", value: total, icon: Clock3, tone: C.warn },
        ].map((k) => (
          <Card key={k.label}>
            <k.icon size={18} color={k.tone} style={{ marginBottom: 10 }} />
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, fontWeight: 700, color: C.text }}>
              {k.value}
            </div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>{k.label}</div>
          </Card>
        ))}
      </div>

      <Card>
        <div style={{ fontSize: 13, color: C.muted, marginBottom: 12, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: 0.5 }}>
          DISTRIBUCIÓN DE INTERACCIONES POR CANAL
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={distribucion} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.line} vertical={false} />
            <XAxis dataKey="name" stroke={C.mutedDim} fontSize={11} tickLine={false} axisLine={{ stroke: C.line }} />
            <YAxis stroke={C.mutedDim} fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip contentStyle={{ background: C.panelAlt, border: `1px solid ${C.line}`, borderRadius: 8, fontSize: 12 }} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {distribucion.map((d, i) => (
                <Cell key={i} fill={d.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}