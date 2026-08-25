import { C } from "../../theme/tokens";

export function Card({ children, style }) {
  return (
    <div style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 14, padding: 20, ...style }}>
      {children}
    </div>
  );
}
