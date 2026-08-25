import { CANALES } from "./canales";

export const ESTADOS_CLIENTE = ["En gestión", "Resuelto", "Cerrado", "Escalado", "Seguimiento"];
export const ESTADOS_INTERACCION = ["En gestión", "Resuelto", "Escalado", "Seguimiento"];
export const NIVELES = ["Bajo", "Medio", "Alto"];
export const PRIORIDADES = ["Baja", "Media", "Alta"];

export const QA_ITEMS = [
  "Seleccionó correctamente el canal",
  "Realizó saludo",
  "Se identificó",
  "Explicó el propósito",
  "Aplicó netiqueta",
  "Identificó la necesidad",
  "Clasificó la solicitud",
  "Gestionó correctamente",
  "Informó al cliente",
  "Mantuvo trazabilidad",
  "Justificó cambio de canal",
  "Realizó cierre",
];

export const ROLES = [
  { rol: "Agente", resp: "Atender y registrar la interacción en el CRM.", color: CANALES[1].color },
  { rol: "Usuario", resp: "Representar al cliente y plantear la situación simulada.", color: CANALES[0].color },
  { rol: "Supervisor / Auditor", resp: "Evaluar calidad, netiqueta y cumplimiento del proceso.", color: CANALES[3].color },
  { rol: "Soporte operativo", resp: "Apoyar consultas, información y decisiones de canal.", color: CANALES[2].color },
];
