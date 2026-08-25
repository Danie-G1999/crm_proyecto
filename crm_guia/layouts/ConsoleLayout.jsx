import { useState } from "react";
import { C } from "../theme/tokens";
import { MODULE_REGISTRY } from "../modules/registry";

/**
 * Shell fijo de la aplicación: sidebar de navegación + reloj "en vivo".
 * El contenido variable (el módulo activo) se recibe como children desde App.jsx.
 */
export function ConsoleLayout({ activeTab, onTabChange, children }) {
  const [reloj] = useState(() => new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" }));

  return (
    <div style={{ display: "flex", minHeight: 640, background: C.bg, color: C.text, fontFamily: "'Inter', sans-serif", borderRadius: 16, overflow: "hidden", border: `1px solid ${C.line}` }}>
      <aside style={{ width: 208, background: C.panel, borderRight: `1px solid ${C.line}`, padding: "18px 12px", flexShrink: 0, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "4px 10px 14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.live, boxShadow: `0 0 8px ${C.live}` }} />
            <span suppressHydrationWarning style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: C.live, letterSpacing: 1 }}>EN VIVO · {reloj}</span>
          </div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 700, marginTop: 8, color: C.text }}>
            Omni<span style={{ color: C.live }}>Console</span>
          </div>
          <div style={{ fontSize: 11, color: C.mutedDim, marginTop: 2 }}>CRM · Contact Center BPO</div>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {MODULE_REGISTRY.map((m) => (
            <button
              key={m.id}
              onClick={() => onTabChange(m.id)}
              style={{
                display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 9,
                border: "none", cursor: "pointer", textAlign: "left",
                background: activeTab === m.id ? C.panelAlt : "transparent",
                color: activeTab === m.id ? C.text : C.muted,
                fontSize: 13, fontWeight: activeTab === m.id ? 600 : 500,
                borderLeft: activeTab === m.id ? `2px solid ${C.live}` : "2px solid transparent",
              }}
            >
              <m.Icon size={15} />{m.label}
            </button>
          ))}
        </nav>

        <div style={{ marginTop: "auto", padding: "0 10px", fontSize: 10.5, color: C.mutedDim, lineHeight: 1.5 }}>
          Simulación de operación omnicanal — Guía 10 · Transferencia de Conocimiento.
        </div>
      </aside>

      <main style={{ flex: 1, padding: "24px 28px", overflowY: "auto" }}>{children}</main>
    </div>
  );
}