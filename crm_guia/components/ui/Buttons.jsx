import { C } from "../../theme/tokens";

export function IconBtn({ onClick, Icon, tone = C.muted, title }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center",
        borderRadius: 8, border: `1px solid ${C.line}`, background: C.panelAlt, color: tone, cursor: "pointer",
      }}
    >
      <Icon size={13} />
    </button>
  );
}

export function PrimaryBtn({ onClick, children, Icon, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: "flex", alignItems: "center", gap: 7, padding: "9px 14px", borderRadius: 10,
        background: C.live + "1A", border: `1px solid ${C.live}55`, color: C.live, fontSize: 13,
        fontWeight: 600, cursor: disabled ? "default" : "pointer", opacity: disabled ? 0.6 : 1,
      }}
    >
      {Icon && <Icon size={14} />} {children}
    </button>
  );
}

export function GhostBtn({ onClick, children, Icon }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 7, padding: "9px 14px", borderRadius: 10,
        background: "transparent", border: `1px solid ${C.line}`, color: C.muted, fontSize: 13,
        fontWeight: 500, cursor: "pointer",
      }}
    >
      {Icon && <Icon size={14} />} {children}
    </button>
  );
}
