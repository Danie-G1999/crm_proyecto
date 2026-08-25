import { Database, Loader2 } from "lucide-react";
import { C } from "../../theme/tokens";

const STATUS_MAP = {
  "cargando": { label: "Cargando BD…", color: C.warn, spin: true },
  "listo": { label: "BD sincronizada", color: C.ok, spin: false },
  "guardando": { label: "Guardando…", color: C.live, spin: true },
  "guardado": { label: "Guardado en BD", color: C.ok, spin: false },
  "error": { label: "Error al guardar", color: C.danger, spin: false },
  "sin-bd": { label: "Solo en esta sesión", color: C.mutedDim, spin: false },
};

export function DbBadge({ sync }) {
  const m = STATUS_MAP[sync] ?? STATUS_MAP["sin-bd"];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10.5, color: m.color, fontFamily: "'IBM Plex Mono', monospace" }}>
      {m.spin ? <Loader2 size={11} className="spin" /> : <Database size={11} />}
      {m.label}
    </div>
  );
}
