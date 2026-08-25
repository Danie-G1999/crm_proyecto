/** Traduce un estado de negocio (cliente o interacción) al tono visual del Pill correspondiente. */
export function estadoTone(estado) {
  if (estado === "Resuelto" || estado === "Cerrado") return "ok";
  if (estado === "Escalado") return "danger";
  if (estado === "Seguimiento") return "warn";
  return "muted";
}
