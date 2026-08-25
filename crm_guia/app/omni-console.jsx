import React, { useState, useRef, useEffect } from "react";
import {
  LayoutDashboard, Users, History, Route as RouteIcon, FlaskConical,
  MessageSquareText, ClipboardCheck, GitBranch, UserCog, PenLine, FileText,
  Phone, MessageCircle, Mail, Share2, MonitorSmartphone, ArrowRight,
  Shuffle, CircleCheck, AlertTriangle, Clock3, Plus, Pencil, Trash2, Check, X,
  Download, Save, Loader2, Database, RotateCcw
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts";

/* ---------------------------------------------------------------
   TOKENS
--------------------------------------------------------------- */
const C = {
  bg: "#0A0E13", panel: "#111820", panelAlt: "#161F29", line: "#232E3A",
  text: "#E7EDF3", muted: "#7C8AA0", mutedDim: "#54627A",
  live: "#22D3EE", ok: "#4ADE80", warn: "#F2B84B", danger: "#FB7185",
};

const CANALES = [
  { id: "telefono", nombre: "Teléfono", color: "#F2B84B", Icon: Phone },
  { id: "whatsapp", nombre: "WhatsApp", color: "#4ADE80", Icon: MessageCircle },
  { id: "chat", nombre: "Chat web", color: "#38BDF8", Icon: MonitorSmartphone },
  { id: "correo", nombre: "Correo electrónico", color: "#A78BFA", Icon: Mail },
  { id: "redes", nombre: "Redes sociales", color: "#FB7185", Icon: Share2 },
];
const canalById = (id) => CANALES.find((c) => c.id === id) || CANALES[0];

const ESTADOS_CLIENTE = ["En gestión", "Resuelto", "Cerrado", "Escalado", "Seguimiento"];
const ESTADOS_INTERACCION = ["En gestión", "Resuelto", "Escalado", "Seguimiento"];
const NIVELES = ["Bajo", "Medio", "Alto"];
const PRIORIDADES = ["Baja", "Media", "Alta"];

/* ---------------------------------------------------------------
   SEED DATA
--------------------------------------------------------------- */
const CLIENTES_SEED = [
  { id: "CLI001", nombre: "Rosa Elena Duarte", edad: 68, ciudad: "Bogotá", nivelDigital: "Bajo", canalHabitual: "telefono", campana: "Informativa", necesidad: "Consulta de factura", prioridad: "Media", estado: "En gestión", canalInicial: "telefono", canalActual: "telefono", ultimoContacto: "2026-08-04", responsable: "Agente 1", observaciones: "Prefiere llamada, dificultad con apps móviles." },
  { id: "CLI002", nombre: "Camilo Rojas", edad: 22, ciudad: "Medellín", nivelDigital: "Alto", canalHabitual: "whatsapp", campana: "Promocional", necesidad: "Consulta de producto", prioridad: "Baja", estado: "Cerrado", canalInicial: "whatsapp", canalActual: "whatsapp", ultimoContacto: "2026-08-05", responsable: "Agente 2", observaciones: "Usuario ágil, resuelto en primer contacto." },
  { id: "CLI003", nombre: "Laura Fernanda Gómez", edad: 41, ciudad: "Cali", nivelDigital: "Medio", canalHabitual: "correo", campana: "Contractual", necesidad: "Cotización corporativa formal", prioridad: "Alta", estado: "En gestión", canalInicial: "correo", canalActual: "correo", ultimoContacto: "2026-08-06", responsable: "Agente 3", observaciones: "Cliente corporativo, requiere soporte documental." },
  { id: "CLI004", nombre: "Jorge Iván Salazar", edad: 55, ciudad: "Bogotá", nivelDigital: "Medio", canalHabitual: "telefono", campana: "Reclamos", necesidad: "Cobro duplicado en factura", prioridad: "Alta", estado: "Escalado", canalInicial: "telefono", canalActual: "telefono", ultimoContacto: "2026-08-07", responsable: "Agente 1", observaciones: "Cliente inconforme, requiere atención especializada N2." },
  { id: "CLI005", nombre: "Daniela Torres", edad: 30, ciudad: "Ibagué", nivelDigital: "Alto", canalHabitual: "whatsapp", campana: "Fidelización", necesidad: "Consulta recurrente sobre plan", prioridad: "Media", estado: "En gestión", canalInicial: "whatsapp", canalActual: "chat", ultimoContacto: "2026-08-08", responsable: "Agente 2", observaciones: "Cliente recurrente, usa varios canales." },
  { id: "CLI006", nombre: "Andrés Felipe Rúa", edad: 27, ciudad: "Bucaramanga", nivelDigital: "Alto", canalHabitual: "chat", campana: "Soporte técnico", necesidad: "Falla urgente del servicio", prioridad: "Alta", estado: "En gestión", canalInicial: "chat", canalActual: "telefono", ultimoContacto: "2026-08-09", responsable: "Agente 4", observaciones: "Requiere solución inmediata, se prioriza voz." },
  { id: "CLI007", nombre: "Marcela Peña", edad: 34, ciudad: "Barranquilla", nivelDigital: "Medio", canalHabitual: "whatsapp", campana: "Trámite", necesidad: "Envío de documentos de soporte", prioridad: "Media", estado: "En gestión", canalInicial: "whatsapp", canalActual: "correo", ultimoContacto: "2026-08-10", responsable: "Agente 3", observaciones: "Migró de canal para enviar anexos formales." },
  { id: "CLI008", nombre: "Sebastián Ortiz", edad: 24, ciudad: "Pereira", nivelDigital: "Alto", canalHabitual: "redes", campana: "Reputación", necesidad: "Comentario público sobre servicio", prioridad: "Media", estado: "En gestión", canalInicial: "redes", canalActual: "whatsapp", ultimoContacto: "2026-08-10", responsable: "Agente 2", observaciones: "Contacto inicial vía Instagram, se privatiza el caso." },
  { id: "CLI009", nombre: "Patricia Londoño", edad: 47, ciudad: "Manizales", nivelDigital: "Medio", canalHabitual: "correo", campana: "Postventa", necesidad: "Seguimiento de solicitud anterior", prioridad: "Baja", estado: "Seguimiento", canalInicial: "correo", canalActual: "correo", ultimoContacto: "2026-08-11", responsable: "Agente 4", observaciones: "Requiere confirmación de cierre del caso." },
  { id: "CLI010", nombre: "Esteban Cárdenas", edad: 39, ciudad: "Bogotá", nivelDigital: "Medio", canalHabitual: "telefono", campana: "Migración", necesidad: "Prefiere continuar por otro canal", prioridad: "Media", estado: "En gestión", canalInicial: "telefono", canalActual: "whatsapp", ultimoContacto: "2026-08-12", responsable: "Agente 1", observaciones: "Cambio de canal por disponibilidad de horario." },
];

const INTERACCIONES_SEED = [
  { id: "INT001", cliente: "CLI001", fecha: "2026-08-04 09:12", canal: "telefono", motivo: "Consulta de factura", gestion: "Se explica detalle de cobro y se envía copia por correo del hijo autorizado.", estado: "Resuelto", siguiente: "—", primerContacto: true },
  { id: "INT002", cliente: "CLI002", fecha: "2026-08-05 11:03", canal: "whatsapp", motivo: "Consulta de producto", gestion: "Se informa disponibilidad y precio del plan solicitado.", estado: "Resuelto", siguiente: "—", primerContacto: true },
  { id: "INT003", cliente: "CLI003", fecha: "2026-08-06 08:40", canal: "correo", motivo: "Cotización corporativa", gestion: "Se solicita NIT y volumen estimado para elaborar propuesta.", estado: "En gestión", siguiente: "Enviar cotización formal", primerContacto: true },
  { id: "INT004", cliente: "CLI003", fecha: "2026-08-07 15:20", canal: "correo", motivo: "Cotización corporativa", gestion: "Se envía propuesta con condiciones comerciales.", estado: "En gestión", siguiente: "Esperar aprobación del cliente", primerContacto: false },
  { id: "INT005", cliente: "CLI004", fecha: "2026-08-07 10:05", canal: "telefono", motivo: "Cobro duplicado", gestion: "Se verifica en el sistema y se confirma inconsistencia.", estado: "Escalado", siguiente: "Transferir a Nivel 2 - Facturación", primerContacto: true },
  { id: "INT006", cliente: "CLI005", fecha: "2026-08-08 09:30", canal: "whatsapp", motivo: "Consulta sobre plan", gestion: "Se explica el plan actual y beneficios asociados.", estado: "En gestión", siguiente: "Cliente evalúa cambio de plan", primerContacto: true },
  { id: "INT007", cliente: "CLI005", fecha: "2026-08-08 16:45", canal: "chat", motivo: "Consulta sobre plan", gestion: "Cliente retoma conversación desde el chat web para comparar planes.", estado: "En gestión", siguiente: "Enviar comparativo de planes", primerContacto: false },
  { id: "INT008", cliente: "CLI006", fecha: "2026-08-09 07:55", canal: "chat", motivo: "Falla del servicio", gestion: "Se identifica falla urgente, se prioriza atención por voz.", estado: "En gestión", siguiente: "Contactar por teléfono de inmediato", primerContacto: true },
  { id: "INT009", cliente: "CLI006", fecha: "2026-08-09 08:10", canal: "telefono", motivo: "Falla del servicio", gestion: "Se guía reinicio de equipo y se valida restablecimiento del servicio.", estado: "Resuelto", siguiente: "—", primerContacto: false },
  { id: "INT010", cliente: "CLI007", fecha: "2026-08-10 10:00", canal: "whatsapp", motivo: "Envío de documentos", gestion: "Cliente indica que debe enviar soportes; WhatsApp no es canal formal para el trámite.", estado: "En gestión", siguiente: "Migrar a correo electrónico", primerContacto: true },
  { id: "INT011", cliente: "CLI007", fecha: "2026-08-10 10:25", canal: "correo", motivo: "Envío de documentos", gestion: "Se informa al cliente el cambio de canal y se recibe documentación formal.", estado: "En gestión", siguiente: "Validar documentos recibidos", primerContacto: false },
  { id: "INT012", cliente: "CLI008", fecha: "2026-08-10 13:15", canal: "redes", motivo: "Comentario público", gestion: "Se responde públicamente y se invita a continuar por canal privado.", estado: "En gestión", siguiente: "Continuar gestión por WhatsApp", primerContacto: true },
  { id: "INT013", cliente: "CLI008", fecha: "2026-08-10 13:40", canal: "whatsapp", motivo: "Comentario público", gestion: "Se atiende el caso en privado y se ofrece solución al inconveniente.", estado: "Resuelto", siguiente: "—", primerContacto: false },
  { id: "INT014", cliente: "CLI009", fecha: "2026-08-11 09:00", canal: "correo", motivo: "Seguimiento postventa", gestion: "Se consulta estado de solicitud previa, en espera de área interna.", estado: "Seguimiento", siguiente: "Confirmar cierre en 48 horas", primerContacto: true },
  { id: "INT015", cliente: "CLI010", fecha: "2026-08-12 08:20", canal: "telefono", motivo: "Cambio de canal preferido", gestion: "Cliente solicita continuar por WhatsApp por disponibilidad de horario.", estado: "En gestión", siguiente: "Confirmar continuidad por WhatsApp", primerContacto: true },
  { id: "INT016", cliente: "CLI010", fecha: "2026-08-12 08:35", canal: "whatsapp", motivo: "Cambio de canal preferido", gestion: "Se registra la migración y se conserva el historial del caso.", estado: "En gestión", siguiente: "Dar seguimiento al requerimiento original", primerContacto: false },
];

const MATRIZ = [
  { canal: "telefono", tiempoReal: "Alta", formalidad: "Media", trazabilidad: "Baja", urgencia: "Alta", complejidad: "Baja", cuando: "Casos urgentes, clientes con bajo nivel digital o que requieren resolución inmediata por voz." },
  { canal: "whatsapp", tiempoReal: "Alta", formalidad: "Baja", trazabilidad: "Media", urgencia: "Media", complejidad: "Baja", cuando: "Consultas ágiles y cotidianas con clientes de alto uso de apps móviles." },
  { canal: "chat", tiempoReal: "Alta", formalidad: "Media", trazabilidad: "Media", urgencia: "Media", complejidad: "Media", cuando: "Soporte durante navegación en el sitio web o consultas técnicas puntuales." },
  { canal: "correo", tiempoReal: "Baja", formalidad: "Alta", trazabilidad: "Alta", urgencia: "Baja", complejidad: "Alta", cuando: "Trámites formales, envío de documentos y respuestas que requieren soporte escrito." },
  { canal: "redes", tiempoReal: "Media", formalidad: "Baja", trazabilidad: "Media", urgencia: "Media", complejidad: "Baja", cuando: "Gestión de reputación, comentarios públicos y primer contacto de clientes jóvenes." },
];

const CASOS_SEED = [
  { id: "CASO001", titulo: "Selección del canal", canal: "telefono", contexto: "Un cliente con baja habilidad digital reporta una falla urgente en el servicio.", instruccion: "Determine el canal más adecuado y justifique con base en urgencia, acceso, complejidad, tiempo real y trazabilidad.", resultado: "Canal seleccionado: Teléfono, por su tiempo real alto y facilidad de acceso para el perfil del cliente." },
  { id: "CASO002", titulo: "Inicio de atención", canal: "whatsapp", contexto: "Un cliente joven escribe por WhatsApp preguntando por un producto.", instruccion: "Construya el guion con saludo, identificación del agente y la empresa, propósito, sondeo y confirmación de la necesidad.", resultado: "Guion aplicado siguiendo la estructura estándar del canal (ver pestaña Guiones)." },
  { id: "CASO003", titulo: "Resolver la solicitud", canal: "correo", contexto: "Un cliente corporativo solicita una cotización formal con condiciones específicas.", instruccion: "Identifique, clasifique y gestione la solicitud. Determine si se resuelve, se escala o queda en seguimiento.", resultado: "Solicitud clasificada como trámite formal; queda en seguimiento hasta aprobación del cliente." },
  { id: "CASO004", titulo: "Migración de canal", canal: "correo", contexto: "El cliente inicia por WhatsApp y necesita enviar documentos de soporte.", instruccion: "Explique el cambio, seleccione correo electrónico, informe al cliente, registre la transición y conserve la trazabilidad.", resultado: "Migración registrada: WhatsApp → Correo electrónico, con trazabilidad conservada en la bitácora (caso CLI007)." },
  { id: "CASO005", titulo: "Auditoría", canal: "chat", contexto: "Un aprendiz atiende un caso simulado y otro actúa como auditor de calidad.", instruccion: "Evalúe canal, saludo, identificación, netiqueta, gestión, resolución, cambio de canal, trazabilidad y cierre.", resultado: "Evaluación registrada en el checklist QA de este mismo sistema." },
];

const GUIONES_SEED = [
  { id: "GUION001", titulo: "Guion estándar telefónico", canal: "telefono", saludo: "Buenos días / tardes, gracias por comunicarse.", identificacion: "Habla [Agente], de [Empresa].", proposito: "Quisiera ayudarle con su solicitud el día de hoy.", sondeo: "¿Podría indicarme con más detalle en qué le puedo colaborar?", gestion: "Se registra el caso, se explica el procedimiento y los tiempos de respuesta.", cierre: "¿Hay algo más en lo que pueda ayudarle? Gracias por su llamada, que tenga buen día." },
  { id: "GUION002", titulo: "Guion estándar WhatsApp", canal: "whatsapp", saludo: "¡Hola! 👋 Gracias por escribirnos.", identificacion: "Soy [Agente] de [Empresa], con gusto le ayudo.", proposito: "Estoy aquí para resolver su consulta.", sondeo: "¿Me puede contar un poco más sobre lo que necesita?", gestion: "Se envía información clara y, si aplica, en formato de lista o pasos numerados.", cierre: "¿Quedó resuelta su inquietud? Quedamos atentos, ¡que tenga un buen día!" },
  { id: "GUION003", titulo: "Guion estándar chat web", canal: "chat", saludo: "¡Hola! Bienvenido(a) al chat de soporte.", identificacion: "Mi nombre es [Agente], estaré atendiendo su caso.", proposito: "Estoy para ayudarle con lo que necesite en el sitio.", sondeo: "¿Qué problema está presentando o qué información necesita?", gestion: "Se guía paso a paso mientras el cliente permanece en la página.", cierre: "¿Logramos resolver su inquietud? Gracias por contactarnos." },
  { id: "GUION004", titulo: "Guion estándar correo", canal: "correo", saludo: "Estimado(a) [Nombre del cliente]:", identificacion: "Mi nombre es [Agente], del área de atención al cliente de [Empresa].", proposito: "Escribo en relación con su solicitud recibida el [fecha].", sondeo: "Para continuar, agradecemos confirmar / adjuntar [información requerida].", gestion: "Se detalla la gestión realizada y los próximos pasos con soporte documental.", cierre: "Quedamos atentos a cualquier inquietud adicional. Cordial saludo, [Agente]." },
  { id: "GUION005", titulo: "Guion estándar redes sociales", canal: "redes", saludo: "¡Hola! Gracias por tu mensaje.", identificacion: "Somos el equipo de atención de [Empresa].", proposito: "Queremos ayudarte a resolver tu situación.", sondeo: "¿Nos permites conocer más detalles por mensaje privado?", gestion: "Se traslada la conversación a un canal privado para proteger datos del cliente.", cierre: "Gracias por tu paciencia, seguimos atentos por este medio." },
];

const QA_ITEMS = [
  "Seleccionó correctamente el canal", "Realizó saludo", "Se identificó", "Explicó el propósito",
  "Aplicó netiqueta", "Identificó la necesidad", "Clasificó la solicitud", "Gestionó correctamente",
  "Informó al cliente", "Mantuvo trazabilidad", "Justificó cambio de canal", "Realizó cierre",
];

const ROLES = [
  { rol: "Agente", resp: "Atender y registrar la interacción en el CRM.", color: CANALES[1].color },
  { rol: "Usuario", resp: "Representar al cliente y plantear la situación simulada.", color: CANALES[0].color },
  { rol: "Supervisor / Auditor", resp: "Evaluar calidad, netiqueta y cumplimiento del proceso.", color: CANALES[3].color },
  { rol: "Soporte operativo", resp: "Apoyar consultas, información y decisiones de canal.", color: CANALES[2].color },
];

/* ---------------------------------------------------------------
   FIELD SCHEMAS
--------------------------------------------------------------- */
const FIELDS_CLIENTE = [
  { key: "nombre", label: "Nombre", type: "text", w: 2 },
  { key: "edad", label: "Edad", type: "number", w: 1 },
  { key: "ciudad", label: "Ciudad", type: "text", w: 1 },
  { key: "nivelDigital", label: "Nivel digital", type: "select", options: NIVELES, w: 1 },
  { key: "canalHabitual", label: "Canal habitual", type: "canal", w: 1 },
  { key: "campana", label: "Campaña", type: "text", w: 1 },
  { key: "necesidad", label: "Necesidad", type: "text", w: 2 },
  { key: "prioridad", label: "Prioridad", type: "select", options: PRIORIDADES, w: 1 },
  { key: "estado", label: "Estado", type: "select", options: ESTADOS_CLIENTE, w: 1 },
  { key: "canalInicial", label: "Canal inicial", type: "canal", w: 1 },
  { key: "canalActual", label: "Canal actual", type: "canal", w: 1 },
  { key: "ultimoContacto", label: "Último contacto", type: "date", w: 1 },
  { key: "responsable", label: "Responsable", type: "text", w: 1 },
  { key: "observaciones", label: "Observaciones", type: "textarea", w: 2 },
];

const FIELDS_CASO = [
  { key: "titulo", label: "Título del caso", type: "text", w: 2 },
  { key: "canal", label: "Canal asociado", type: "canal", w: 1 },
  { key: "contexto", label: "Contexto", type: "textarea", w: 2 },
  { key: "instruccion", label: "Instrucción", type: "textarea", w: 2 },
  { key: "resultado", label: "Resultado esperado", type: "textarea", w: 2 },
];

const FIELDS_GUION = [
  { key: "titulo", label: "Título del guion", type: "text", w: 2 },
  { key: "canal", label: "Canal", type: "canal", w: 1 },
  { key: "saludo", label: "Saludo", type: "textarea", w: 2 },
  { key: "identificacion", label: "Identificación", type: "textarea", w: 2 },
  { key: "proposito", label: "Propósito", type: "textarea", w: 2 },
  { key: "sondeo", label: "Sondeo", type: "textarea", w: 2 },
  { key: "gestion", label: "Gestión", type: "textarea", w: 2 },
  { key: "cierre", label: "Cierre", type: "textarea", w: 2 },
];

const BLANK_CLIENTE = { nombre: "", edad: "", ciudad: "", nivelDigital: "Medio", canalHabitual: "whatsapp", campana: "", necesidad: "", prioridad: "Media", estado: "En gestión", canalInicial: "whatsapp", canalActual: "whatsapp", ultimoContacto: "", responsable: "", observaciones: "" };
const BLANK_INTERACCION = { cliente: "", fecha: "", canal: "whatsapp", motivo: "", gestion: "", estado: "En gestión", siguiente: "", primerContacto: true };
const BLANK_CASO = { titulo: "", canal: "whatsapp", contexto: "", instruccion: "", resultado: "" };
const BLANK_GUION = { titulo: "", canal: "whatsapp", saludo: "", identificacion: "", proposito: "", sondeo: "", gestion: "", cierre: "" };

function nextId(list, prefix) {
  const nums = list.map((x) => parseInt(x.id.replace(prefix, ""), 10)).filter((n) => !isNaN(n));
  const next = (nums.length ? Math.max(...nums) : 0) + 1;
  return prefix + String(next).padStart(3, "0");
}

/* ---------------------------------------------------------------
   "BASE DE DATOS" LOCAL — persistencia clave/valor del artefacto.
   No hay servidor propio: cada entidad (clientes, interacciones,
   casos, guiones) se guarda automáticamente bajo una llave y se
   recupera al abrir el CRM de nuevo, incluso en otra sesión.
--------------------------------------------------------------- */
const STORAGE_AVAILABLE = typeof window !== "undefined" && typeof window.localStorage !== "undefined";

function usePersistentState(key, initialValue) {
  const [state, setState] = useState(initialValue);
  const [hydrated, setHydrated] = useState(false);
  const [sync, setSync] = useState(STORAGE_AVAILABLE ? "cargando" : "sin-bd");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!STORAGE_AVAILABLE) return;
      try {
        const res = window.localStorage.getItem(key);
        if (!cancelled && res) setState(JSON.parse(res));
      } catch (e) {
        /* clave aún no existe: se usa el valor semilla */
      }
      if (!cancelled) {
        setHydrated(true);
        setSync("listo");
      }
    })();
    return () => { cancelled = true; };
  }, [key]);

  useEffect(() => {
    if (!hydrated || !STORAGE_AVAILABLE) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSync("guardando");
    const t = setTimeout(() => {
      try {
        window.localStorage.setItem(key, JSON.stringify(state));
        setSync("guardado");
      } catch {
        setSync("error");
      }
    }, 500);
    return () => clearTimeout(t);
  }, [state, hydrated, key]);

  return [state, setState, sync];
}

function resetAllData(keys) {
  if (!STORAGE_AVAILABLE) return;
  for (const k of keys) {
    try { window.localStorage.removeItem(k); } catch { /* el navegador bloqueó el almacenamiento */ }
  }
}

/* ---------------------------------------------------------------
   PRIMITIVES
--------------------------------------------------------------- */
function Tag({ canalId }) {
  const c = canalById(canalId);
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 9px", borderRadius: 999, fontSize: 11.5, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: 0.3, background: c.color + "1A", color: c.color, border: `1px solid ${c.color}40` }}>
      <c.Icon size={12} strokeWidth={2.4} />{c.nombre}
    </span>
  );
}

function Pill({ children, tone = "muted" }) {
  const tones = {
    muted: { bg: C.panelAlt, fg: C.muted, bd: C.line },
    ok: { bg: "#4ADE8018", fg: C.ok, bd: "#4ADE8040" },
    warn: { bg: "#F2B84B18", fg: C.warn, bd: "#F2B84B40" },
    danger: { bg: "#FB718518", fg: C.danger, bd: "#FB718540" },
  };
  const t = tones[tone];
  return <span style={{ padding: "2px 9px", borderRadius: 999, fontSize: 11.5, fontWeight: 600, background: t.bg, color: t.fg, border: `1px solid ${t.bd}`, whiteSpace: "nowrap" }}>{children}</span>;
}

function estadoTone(estado) {
  if (estado === "Resuelto" || estado === "Cerrado") return "ok";
  if (estado === "Escalado") return "danger";
  if (estado === "Seguimiento") return "warn";
  return "muted";
}

function Card({ children, style }) {
  return <div style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 14, padding: 20, ...style }}>{children}</div>;
}

function SectionTitle({ eyebrow, title, desc, action }) {
  return (
    <div style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 12, flexWrap: "wrap" }}>
      <div>
        {eyebrow && <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5, color: C.live, letterSpacing: 1.6, textTransform: "uppercase", marginBottom: 6 }}>{eyebrow}</div>}
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 600, color: C.text, margin: 0 }}>{title}</h2>
        {desc && <p style={{ color: C.muted, fontSize: 13.5, marginTop: 6, maxWidth: 640, lineHeight: 1.5 }}>{desc}</p>}
      </div>
      {action}
    </div>
  );
}

function IconBtn({ onClick, Icon, tone = C.muted, title }) {
  return (
    <button onClick={onClick} title={title} style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8, border: `1px solid ${C.line}`, background: C.panelAlt, color: tone, cursor: "pointer" }}>
      <Icon size={13} />
    </button>
  );
}

function PrimaryBtn({ onClick, children, Icon, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 14px", borderRadius: 10, background: C.live + "1A", border: `1px solid ${C.live}55`, color: C.live, fontSize: 13, fontWeight: 600, cursor: disabled ? "default" : "pointer", opacity: disabled ? 0.6 : 1 }}>
      {Icon && <Icon size={14} />} {children}
    </button>
  );
}

function GhostBtn({ onClick, children, Icon }) {
  return (
    <button onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 14px", borderRadius: 10, background: "transparent", border: `1px solid ${C.line}`, color: C.muted, fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
      {Icon && <Icon size={14} />} {children}
    </button>
  );
}

function FieldInput({ field, value, onChange }) {
  const common = {
    value: value ?? "",
    onChange: (e) => onChange(field.key, e.target.value),
    style: { width: "100%", padding: "8px 10px", borderRadius: 8, background: C.panel, border: `1px solid ${C.line}`, color: C.text, fontSize: 12.5, outline: "none", fontFamily: "'Inter', sans-serif", boxSizing: "border-box" },
  };
  if (field.type === "select") return <select {...common}>{field.options.map((o) => <option key={o} value={o}>{o}</option>)}</select>;
  if (field.type === "canal") return <select {...common}>{CANALES.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}</select>;
  if (field.type === "textarea") return <textarea {...common} rows={2} style={{ ...common.style, resize: "vertical" }} />;
  if (field.type === "date") return <input {...common} type="date" />;
  if (field.type === "number") return <input {...common} type="number" />;
  return <input {...common} type="text" />;
}

function EntityForm({ fields, value, onChange, columns = 4 }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: 10 }}>
      {fields.map((f) => (
        <div key={f.key} style={{ gridColumn: `span ${Math.min(f.w || 1, columns)}` }}>
          <div style={{ fontSize: 10.5, color: C.mutedDim, marginBottom: 4, fontFamily: "'IBM Plex Mono', monospace" }}>{f.label.toUpperCase()}</div>
          <FieldInput field={f} value={value[f.key]} onChange={onChange} />
        </div>
      ))}
    </div>
  );
}

function RutaInteraccion({ desde, hasta, label }) {
  const a = canalById(desde);
  const b = canalById(hasta);
  const mismo = desde === hasta;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: C.panelAlt, border: `1px solid ${C.line}`, borderRadius: 12 }}>
      <div style={{ width: 34, height: 34, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: a.color + "1A", border: `1px solid ${a.color}55` }}><a.Icon size={16} color={a.color} /></div>
      <div style={{ flex: 1, position: "relative", height: 2, background: C.line, borderRadius: 2 }}>
        {!mismo && <div style={{ position: "absolute", top: -3, left: 0, width: 8, height: 8, borderRadius: "50%", background: C.live, boxShadow: `0 0 10px ${C.live}`, animation: "travel 2.6s ease-in-out infinite" }} />}
      </div>
      {!mismo ? <div style={{ width: 34, height: 34, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: b.color + "1A", border: `1px solid ${b.color}55` }}><b.Icon size={16} color={b.color} /></div> : <Pill tone="muted">sin migración</Pill>}
      <div style={{ marginLeft: 8, fontSize: 12.5, color: C.muted, fontFamily: "'IBM Plex Mono', monospace" }}>{label}</div>
      <style>{`@keyframes travel { 0% { left: 0%; } 50% { left: calc(100% - 8px); } 100% { left: 0%; } }`}</style>
    </div>
  );
}

/* generic CRUD list block, reused by Casos and Guiones */
function useCrud(seed, prefix, blank) {
  const [items, setItems] = useState(seed);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(null);
  const [creating, setCreating] = useState(false);

  const startEdit = (item) => { setEditingId(item.id); setDraft({ ...item }); setCreating(false); };
  const startCreate = (overrides = {}) => { setCreating(true); setDraft({ ...blank, ...overrides }); setEditingId(null); };
  const cancel = () => { setEditingId(null); setCreating(false); setDraft(null); };
  const change = (key, val) => setDraft((d) => ({ ...d, [key]: val }));
  const save = (validate) => {
    if (validate && !validate(draft)) return;
    if (creating) {
      setItems((prev) => [...prev, { ...draft, id: nextId(prev, prefix) }]);
    } else {
      setItems((prev) => prev.map((i) => (i.id === editingId ? { ...draft } : i)));
    }
    cancel();
  };
  const remove = (id, confirmMsg) => {
    if (window.confirm(confirmMsg)) setItems((prev) => prev.filter((i) => i.id !== id));
  };

  return { items, setItems, editingId, draft, creating, startEdit, startCreate, cancel, change, save, remove };
}

/* ---------------------------------------------------------------
   TABS: PANEL / CLIENTES / BITÁCORA
--------------------------------------------------------------- */
function PanelTab({ clientes, interacciones }) {
  const total = interacciones.length;
  const resueltas = interacciones.filter((i) => i.estado === "Resuelto").length;
  const escaladas = interacciones.filter((i) => i.estado === "Escalado").length;
  const primerContactoCasos = interacciones.filter((i) => i.primerContacto);
  const fcr = primerContactoCasos.length ? Math.round((primerContactoCasos.filter((i) => i.estado === "Resuelto").length / primerContactoCasos.length) * 100) : 0;
  const tasaResolucion = total ? Math.round((resueltas / total) * 100) : 0;
  const tasaEscalamiento = total ? Math.round((escaladas / total) * 100) : 0;
  const ultimaMigracion = [...clientes].reverse().find((c) => c.canalInicial !== c.canalActual);
  const distribucion = CANALES.map((c) => ({ name: c.nombre, value: interacciones.filter((i) => i.canal === c.id).length, color: c.color }));

  return (
    <div>
      <SectionTitle eyebrow="Torre de control · en vivo" title="Panel de operación omnicanal" desc="Indicadores calculados en tiempo real — se recalculan al crear, editar o eliminar registros." />
      {ultimaMigracion && <div style={{ marginBottom: 20 }}><RutaInteraccion desde={ultimaMigracion.canalInicial} hasta={ultimaMigracion.canalActual} label={`${ultimaMigracion.nombre} · migración registrada`} /></div>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 20 }}>
        {[
          { label: "FCR (1er contacto)", value: `${fcr}%`, icon: CircleCheck, tone: C.ok },
          { label: "Tasa de resolución", value: `${tasaResolucion}%`, icon: ClipboardCheck, tone: C.live },
          { label: "Tasa de escalamiento", value: `${tasaEscalamiento}%`, icon: AlertTriangle, tone: C.danger },
          { label: "Interacciones totales", value: total, icon: Clock3, tone: C.warn },
        ].map((k) => (
          <Card key={k.label}><k.icon size={18} color={k.tone} style={{ marginBottom: 10 }} /><div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, fontWeight: 700, color: C.text }}>{k.value}</div><div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>{k.label}</div></Card>
        ))}
      </div>
      <Card>
        <div style={{ fontSize: 13, color: C.muted, marginBottom: 12, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: 0.5 }}>DISTRIBUCIÓN DE INTERACCIONES POR CANAL</div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={distribucion} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.line} vertical={false} />
            <XAxis dataKey="name" stroke={C.mutedDim} fontSize={11} tickLine={false} axisLine={{ stroke: C.line }} />
            <YAxis stroke={C.mutedDim} fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip contentStyle={{ background: C.panelAlt, border: `1px solid ${C.line}`, borderRadius: 8, fontSize: 12 }} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>{distribucion.map((d, i) => <Cell key={i} fill={d.color} />)}</Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

function ClientesTab({ clientes, setClientes }) {
  const [q, setQ] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(null);
  const [creating, setCreating] = useState(false);
  const startEdit = (c) => { setEditingId(c.id); setDraft({ ...c }); setCreating(false); };
  const startCreate = () => { setCreating(true); setDraft({ ...BLANK_CLIENTE }); setEditingId(null); };
  const cancel = () => { setEditingId(null); setCreating(false); setDraft(null); };
  const change = (key, val) => setDraft((d) => ({ ...d, [key]: val }));
  const save = () => {
    if (!draft.nombre.trim()) return;
    if (creating) setClientes([...clientes, { ...draft, id: nextId(clientes, "CLI"), edad: Number(draft.edad) || 0 }]);
    else setClientes(clientes.map((c) => (c.id === editingId ? { ...draft, edad: Number(draft.edad) || 0 } : c)));
    cancel();
  };
  const remove = (id) => { if (window.confirm("¿Eliminar este cliente? Esta acción no se puede deshacer.")) setClientes(clientes.filter((c) => c.id !== id)); };
  const filtered = clientes.filter((c) => (c.nombre + c.id + c.ciudad).toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <SectionTitle eyebrow="Hoja 1" title="Base de clientes" desc="Cree, edite o elimine clientes ficticios directamente sobre el CRM." action={<PrimaryBtn onClick={startCreate} Icon={Plus}>Agregar cliente</PrimaryBtn>} />
      <input placeholder="Buscar por nombre, ID o ciudad…" value={q} onChange={(e) => setQ(e.target.value)} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, marginBottom: 16, background: C.panelAlt, border: `1px solid ${C.line}`, color: C.text, fontSize: 13, outline: "none", boxSizing: "border-box" }} />
      {creating && (
        <Card style={{ marginBottom: 14, borderColor: C.live + "55" }}>
          <div style={{ fontSize: 12, color: C.live, marginBottom: 10, fontFamily: "'IBM Plex Mono', monospace" }}>NUEVO CLIENTE</div>
          <EntityForm fields={FIELDS_CLIENTE} value={draft} onChange={change} />
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}><PrimaryBtn onClick={save} Icon={Check}>Guardar</PrimaryBtn><IconBtn onClick={cancel} Icon={X} title="Cancelar" /></div>
        </Card>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
        {filtered.map((c) => (
          editingId === c.id ? (
            <Card key={c.id} style={{ gridColumn: "span 2", borderColor: C.live + "55" }}>
              <div style={{ fontSize: 12, color: C.live, marginBottom: 10, fontFamily: "'IBM Plex Mono', monospace" }}>EDITANDO {c.id}</div>
              <EntityForm fields={FIELDS_CLIENTE} value={draft} onChange={change} />
              <div style={{ display: "flex", gap: 8, marginTop: 14 }}><PrimaryBtn onClick={save} Icon={Check}>Guardar cambios</PrimaryBtn><IconBtn onClick={cancel} Icon={X} title="Cancelar" /></div>
            </Card>
          ) : (
            <Card key={c.id} style={{ padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: C.mutedDim }}>{c.id}</div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 600, color: C.text }}>{c.nombre}</div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{c.edad} años · {c.ciudad} · nivel digital {c.nivelDigital}</div>
                </div>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <Pill tone={estadoTone(c.estado)}>{c.estado}</Pill>
                  <IconBtn onClick={() => startEdit(c)} Icon={Pencil} title="Editar" />
                  <IconBtn onClick={() => remove(c.id)} Icon={Trash2} tone={C.danger} title="Eliminar" />
                </div>
              </div>
              <div style={{ marginTop: 10, fontSize: 13, color: C.text }}>{c.necesidad}</div>
              <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap", alignItems: "center" }}>
                <Tag canalId={c.canalInicial} />
                {c.canalInicial !== c.canalActual && <><ArrowRight size={13} color={C.mutedDim} /><Tag canalId={c.canalActual} /></>}
                <Pill tone={c.prioridad === "Alta" ? "danger" : c.prioridad === "Media" ? "warn" : "muted"}>Prioridad {c.prioridad}</Pill>
              </div>
              <div style={{ marginTop: 10, fontSize: 12, color: C.mutedDim, lineHeight: 1.5 }}>{c.observaciones}</div>
              <div style={{ marginTop: 8, fontSize: 11.5, color: C.mutedDim, fontFamily: "'IBM Plex Mono', monospace" }}>{c.responsable} · último contacto {c.ultimoContacto}</div>
            </Card>
          )
        ))}
        {filtered.length === 0 && !creating && <div style={{ gridColumn: "span 2", color: C.mutedDim, fontSize: 13, padding: 20, textAlign: "center" }}>No hay clientes que coincidan con la búsqueda.</div>}
      </div>
    </div>
  );
}

function BitacoraTab({ clientes, interacciones, setInteracciones }) {
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(null);
  const [creating, setCreating] = useState(false);
  const fieldsInteraccion = [
    { key: "cliente", label: "Cliente", type: "select", options: clientes.map((c) => c.id), w: 1 },
    { key: "fecha", label: "Fecha y hora", type: "text", w: 1 },
    { key: "canal", label: "Canal", type: "canal", w: 1 },
    { key: "estado", label: "Estado", type: "select", options: ESTADOS_INTERACCION, w: 1 },
    { key: "motivo", label: "Motivo", type: "text", w: 2 },
    { key: "gestion", label: "Gestión", type: "textarea", w: 2 },
    { key: "siguiente", label: "Próximo paso", type: "text", w: 2 },
  ];
  const startEdit = (i) => { setEditingId(i.id); setDraft({ ...i }); setCreating(false); };
  const startCreate = () => { setCreating(true); setDraft({ ...BLANK_INTERACCION, cliente: clientes[0]?.id || "" }); setEditingId(null); };
  const cancel = () => { setEditingId(null); setCreating(false); setDraft(null); };
  const change = (key, val) => setDraft((d) => ({ ...d, [key]: val }));
  const save = () => {
    if (!draft.cliente || !draft.motivo.trim()) return;
    if (creating) setInteracciones([...interacciones, { ...draft, id: nextId(interacciones, "INT") }]);
    else setInteracciones(interacciones.map((i) => (i.id === editingId ? { ...draft } : i)));
    cancel();
  };
  const remove = (id) => { if (window.confirm("¿Eliminar esta interacción de la bitácora?")) setInteracciones(interacciones.filter((i) => i.id !== id)); };

  return (
    <div>
      <SectionTitle eyebrow="Bitácora omnicanal" title="Registro de interacciones" desc="Cree, edite o elimine interacciones. Marque «primer contacto» al registrar el inicio de un caso nuevo." action={<PrimaryBtn onClick={startCreate} Icon={Plus}>Agregar interacción</PrimaryBtn>} />
      {creating && (
        <Card style={{ marginBottom: 14, borderColor: C.live + "55" }}>
          <div style={{ fontSize: 12, color: C.live, marginBottom: 10, fontFamily: "'IBM Plex Mono', monospace" }}>NUEVA INTERACCIÓN</div>
          <EntityForm fields={fieldsInteraccion} value={draft} onChange={change} columns={2} />
          <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, fontSize: 12.5, color: C.muted }}><input type="checkbox" checked={draft.primerContacto} onChange={(e) => change("primerContacto", e.target.checked)} /> Es el primer contacto de este caso</label>
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}><PrimaryBtn onClick={save} Icon={Check}>Guardar</PrimaryBtn><IconBtn onClick={cancel} Icon={X} title="Cancelar" /></div>
        </Card>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {interacciones.map((i) => {
          const cliente = clientes.find((c) => c.id === i.cliente);
          if (editingId === i.id) {
            return (
              <Card key={i.id} style={{ padding: 16, borderColor: C.live + "55" }}>
                <div style={{ fontSize: 12, color: C.live, marginBottom: 10, fontFamily: "'IBM Plex Mono', monospace" }}>EDITANDO {i.id}</div>
                <EntityForm fields={fieldsInteraccion} value={draft} onChange={change} columns={2} />
                <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, fontSize: 12.5, color: C.muted }}><input type="checkbox" checked={draft.primerContacto} onChange={(e) => change("primerContacto", e.target.checked)} /> Es el primer contacto de este caso</label>
                <div style={{ display: "flex", gap: 8, marginTop: 14 }}><PrimaryBtn onClick={save} Icon={Check}>Guardar cambios</PrimaryBtn><IconBtn onClick={cancel} Icon={X} title="Cancelar" /></div>
              </Card>
            );
          }
          return (
            <Card key={i.id} style={{ padding: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: C.mutedDim }}>{i.id}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{cliente?.nombre || "Cliente eliminado"}</span>
                  <Tag canalId={i.canal} />
                  {!i.primerContacto && <Pill tone="muted">continuación</Pill>}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 11.5, color: C.mutedDim, fontFamily: "'IBM Plex Mono', monospace" }}>{i.fecha}</span>
                  <Pill tone={estadoTone(i.estado)}>{i.estado}</Pill>
                  <IconBtn onClick={() => startEdit(i)} Icon={Pencil} title="Editar" />
                  <IconBtn onClick={() => remove(i.id)} Icon={Trash2} tone={C.danger} title="Eliminar" />
                </div>
              </div>
              <div style={{ marginTop: 8, fontSize: 13, color: C.muted }}><b style={{ color: C.text }}>Motivo:</b> {i.motivo}</div>
              <div style={{ marginTop: 4, fontSize: 13, color: C.muted }}><b style={{ color: C.text }}>Gestión:</b> {i.gestion}</div>
              <div style={{ marginTop: 4, fontSize: 12.5, color: C.mutedDim }}>Próximo paso: {i.siguiente}</div>
            </Card>
          );
        })}
        {interacciones.length === 0 && !creating && <div style={{ color: C.mutedDim, fontSize: 13, padding: 20, textAlign: "center" }}>Aún no hay interacciones registradas.</div>}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   CANALES (referencia estática)
--------------------------------------------------------------- */
function CanalesTab() {
  return (
    <div>
      <SectionTitle eyebrow="Matriz técnica" title="Selección de canales" desc="Criterios usados para justificar la elección de canal en cada caso." />
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {MATRIZ.map((m) => {
          const c = canalById(m.canal);
          return (
            <Card key={m.canal} style={{ padding: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: c.color + "1A", border: `1px solid ${c.color}55` }}><c.Icon size={15} color={c.color} /></div>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 15, color: C.text }}>{c.nombre}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, marginBottom: 10 }}>
                {[["Tiempo real", m.tiempoReal], ["Formalidad", m.formalidad], ["Trazabilidad", m.trazabilidad], ["Urgencia", m.urgencia], ["Complejidad", m.complejidad]].map(([k, v]) => (
                  <div key={k} style={{ background: C.panelAlt, borderRadius: 8, padding: "8px 10px", border: `1px solid ${C.line}` }}><div style={{ fontSize: 10.5, color: C.mutedDim, marginBottom: 3 }}>{k}</div><Pill tone={v === "Alta" ? "danger" : v === "Media" ? "warn" : "ok"}>{v}</Pill></div>
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

/* ---------------------------------------------------------------
   CASOS — CRUD
--------------------------------------------------------------- */
function CasosTab({ casos, setCasos }) {
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(null);
  const [creating, setCreating] = useState(false);
  const startEdit = (c) => { setEditingId(c.id); setDraft({ ...c }); setCreating(false); };
  const startCreate = () => { setCreating(true); setDraft({ ...BLANK_CASO }); setEditingId(null); };
  const cancel = () => { setEditingId(null); setCreating(false); setDraft(null); };
  const change = (key, val) => setDraft((d) => ({ ...d, [key]: val }));
  const save = () => {
    if (!draft.titulo.trim()) return;
    if (creating) setCasos([...casos, { ...draft, id: nextId(casos, "CASO") }]);
    else setCasos(casos.map((c) => (c.id === editingId ? { ...draft } : c)));
    cancel();
  };
  const remove = (id) => { if (window.confirm("¿Eliminar este caso de simulación?")) setCasos(casos.filter((c) => c.id !== id)); };

  return (
    <div>
      <SectionTitle eyebrow="Simulación" title="Casos de simulación" desc="Cree, edite o elimine los casos que el equipo usará durante la práctica." action={<PrimaryBtn onClick={startCreate} Icon={Plus}>Agregar caso</PrimaryBtn>} />
      {creating && (
        <Card style={{ marginBottom: 14, borderColor: C.live + "55" }}>
          <div style={{ fontSize: 12, color: C.live, marginBottom: 10, fontFamily: "'IBM Plex Mono', monospace" }}>NUEVO CASO</div>
          <EntityForm fields={FIELDS_CASO} value={draft} onChange={change} columns={2} />
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}><PrimaryBtn onClick={save} Icon={Check}>Guardar</PrimaryBtn><IconBtn onClick={cancel} Icon={X} title="Cancelar" /></div>
        </Card>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
        {casos.map((c) => (
          editingId === c.id ? (
            <Card key={c.id} style={{ gridColumn: "span 2", borderColor: C.live + "55" }}>
              <div style={{ fontSize: 12, color: C.live, marginBottom: 10, fontFamily: "'IBM Plex Mono', monospace" }}>EDITANDO {c.id}</div>
              <EntityForm fields={FIELDS_CASO} value={draft} onChange={change} columns={2} />
              <div style={{ display: "flex", gap: 8, marginTop: 14 }}><PrimaryBtn onClick={save} Icon={Check}>Guardar cambios</PrimaryBtn><IconBtn onClick={cancel} Icon={X} title="Cancelar" /></div>
            </Card>
          ) : (
            <Card key={c.id} style={{ padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: C.live }}>{c.id}</span>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <Tag canalId={c.canal} />
                  <IconBtn onClick={() => startEdit(c)} Icon={Pencil} title="Editar" />
                  <IconBtn onClick={() => remove(c.id)} Icon={Trash2} tone={C.danger} title="Eliminar" />
                </div>
              </div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 600, color: C.text, marginTop: 6 }}>{c.titulo}</div>
              <div style={{ fontSize: 12.5, color: C.mutedDim, marginTop: 8, lineHeight: 1.5 }}>{c.contexto}</div>
              <div style={{ fontSize: 12.5, color: C.muted, marginTop: 8, lineHeight: 1.5 }}><b style={{ color: C.text }}>Instrucción: </b>{c.instruccion}</div>
              <div style={{ marginTop: 10, padding: "8px 10px", background: C.panelAlt, borderRadius: 8, fontSize: 12, color: C.ok, border: `1px solid ${C.line}` }}>{c.resultado}</div>
            </Card>
          )
        ))}
        {casos.length === 0 && !creating && <div style={{ gridColumn: "span 2", color: C.mutedDim, fontSize: 13, padding: 20, textAlign: "center" }}>No hay casos registrados.</div>}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   GUIONES — CRUD
--------------------------------------------------------------- */
function GuionesTab({ guiones, setGuiones }) {
  const [filtro, setFiltro] = useState("todos");
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(null);
  const [creating, setCreating] = useState(false);
  const startEdit = (g) => { setEditingId(g.id); setDraft({ ...g }); setCreating(false); };
  const startCreate = () => { setCreating(true); setDraft({ ...BLANK_GUION, canal: filtro !== "todos" ? filtro : "whatsapp" }); setEditingId(null); };
  const cancel = () => { setEditingId(null); setCreating(false); setDraft(null); };
  const change = (key, val) => setDraft((d) => ({ ...d, [key]: val }));
  const save = () => {
    if (!draft.titulo.trim()) return;
    if (creating) setGuiones([...guiones, { ...draft, id: nextId(guiones, "GUION") }]);
    else setGuiones(guiones.map((g) => (g.id === editingId ? { ...draft } : g)));
    cancel();
  };
  const remove = (id) => { if (window.confirm("¿Eliminar este guion?")) setGuiones(guiones.filter((g) => g.id !== id)); };
  const filtrados = filtro === "todos" ? guiones : guiones.filter((g) => g.canal === filtro);

  return (
    <div>
      <SectionTitle eyebrow="Netiqueta aplicada" title="Guiones de atención" desc="Cree, edite o elimine guiones. Estructura común: saludo, identificación, propósito, sondeo, gestión y cierre." action={<PrimaryBtn onClick={startCreate} Icon={Plus}>Agregar guion</PrimaryBtn>} />
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <button onClick={() => setFiltro("todos")} style={{ padding: "8px 12px", borderRadius: 999, border: `1px solid ${filtro === "todos" ? C.live : C.line}`, background: filtro === "todos" ? C.live + "1A" : "transparent", color: filtro === "todos" ? C.live : C.muted, fontSize: 12.5, cursor: "pointer" }}>Todos</button>
        {CANALES.map((ch) => (
          <button key={ch.id} onClick={() => setFiltro(ch.id)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", borderRadius: 999, border: `1px solid ${filtro === ch.id ? ch.color : C.line}`, background: filtro === ch.id ? ch.color + "1A" : "transparent", color: filtro === ch.id ? ch.color : C.muted, fontSize: 12.5, cursor: "pointer" }}>
            <ch.Icon size={13} /> {ch.nombre}
          </button>
        ))}
      </div>

      {creating && (
        <Card style={{ marginBottom: 14, borderColor: C.live + "55" }}>
          <div style={{ fontSize: 12, color: C.live, marginBottom: 10, fontFamily: "'IBM Plex Mono', monospace" }}>NUEVO GUION</div>
          <EntityForm fields={FIELDS_GUION} value={draft} onChange={change} columns={2} />
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}><PrimaryBtn onClick={save} Icon={Check}>Guardar</PrimaryBtn><IconBtn onClick={cancel} Icon={X} title="Cancelar" /></div>
        </Card>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtrados.map((g) => {
          const c = canalById(g.canal);
          if (editingId === g.id) {
            return (
              <Card key={g.id} style={{ borderColor: C.live + "55" }}>
                <div style={{ fontSize: 12, color: C.live, marginBottom: 10, fontFamily: "'IBM Plex Mono', monospace" }}>EDITANDO {g.id}</div>
                <EntityForm fields={FIELDS_GUION} value={draft} onChange={change} columns={2} />
                <div style={{ display: "flex", gap: 8, marginTop: 14 }}><PrimaryBtn onClick={save} Icon={Check}>Guardar cambios</PrimaryBtn><IconBtn onClick={cancel} Icon={X} title="Cancelar" /></div>
              </Card>
            );
          }
          return (
            <Card key={g.id}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}><c.Icon size={16} color={c.color} /><span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, color: C.text }}>{g.titulo}</span></div>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <Tag canalId={g.canal} />
                  <IconBtn onClick={() => startEdit(g)} Icon={Pencil} title="Editar" />
                  <IconBtn onClick={() => remove(g.id)} Icon={Trash2} tone={C.danger} title="Eliminar" />
                </div>
              </div>
              {[["Saludo", g.saludo], ["Identificación", g.identificacion], ["Propósito", g.proposito], ["Sondeo", g.sondeo], ["Gestión", g.gestion], ["Cierre", g.cierre]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", gap: 14, padding: "10px 0", borderTop: `1px solid ${C.line}` }}>
                  <div style={{ width: 110, flexShrink: 0, fontSize: 11.5, color: C.mutedDim, fontFamily: "'IBM Plex Mono', monospace", paddingTop: 2 }}>{k.toUpperCase()}</div>
                  <div style={{ fontSize: 13.5, color: C.text, lineHeight: 1.5 }}>{v}</div>
                </div>
              ))}
            </Card>
          );
        })}
        {filtrados.length === 0 && !creating && <div style={{ color: C.mutedDim, fontSize: 13, padding: 20, textAlign: "center" }}>No hay guiones para este canal.</div>}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   FLUJO — diagrama estilo draw.io, exportable
--------------------------------------------------------------- */
function FRect({ x, y, w, h, lines, fill, stroke, textColor = "#111827" }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8} fill={fill} stroke={stroke} strokeWidth={1.6} />
      <text x={x + w / 2} y={y + h / 2} textAnchor="middle" dominantBaseline="middle" fontFamily="Inter, Arial, sans-serif" fontSize="13" fontWeight="600" fill={textColor}>
        {lines.map((l, idx) => <tspan key={idx} x={x + w / 2} dy={idx === 0 ? -((lines.length - 1) * 8) : 16}>{l}</tspan>)}
      </text>
    </g>
  );
}

function FDiamond({ cx, cy, w, h, lines, fill, stroke, textColor = "#7C2D12" }) {
  const pts = `${cx},${cy - h / 2} ${cx + w / 2},${cy} ${cx},${cy + h / 2} ${cx - w / 2},${cy}`;
  return (
    <g>
      <polygon points={pts} fill={fill} stroke={stroke} strokeWidth={1.6} />
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fontFamily="Inter, Arial, sans-serif" fontSize="12.5" fontWeight="600" fill={textColor}>
        {lines.map((l, idx) => <tspan key={idx} x={cx} dy={idx === 0 ? -((lines.length - 1) * 8) : 16}>{l}</tspan>)}
      </text>
    </g>
  );
}

function FPill({ cx, cy, w, h, label, fill, stroke, textColor = "#14532D" }) {
  return (
    <g>
      <rect x={cx - w / 2} y={cy - h / 2} width={w} height={h} rx={h / 2} fill={fill} stroke={stroke} strokeWidth={1.6} />
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fontFamily="Inter, Arial, sans-serif" fontSize="13" fontWeight="700" fill={textColor}>{label}</text>
    </g>
  );
}

function FArrow({ d, label, labelX, labelY }) {
  return (
    <g>
      <path d={d} fill="none" stroke="#334155" strokeWidth={1.8} markerEnd="url(#arrowhead)" />
      {label && <text x={labelX} y={labelY} textAnchor="middle" fontFamily="Inter, Arial, sans-serif" fontSize="11.5" fontWeight="700" fill="#475569" style={{ paintOrder: "stroke", stroke: "#ffffff", strokeWidth: 4 }}>{label}</text>}
    </g>
  );
}

function FlujoTab() {
  const svgRef = useRef(null);
  const W = 900, H = 1240;

  const downloadSVG = () => {
    const source = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "diagrama_flujo_omnicanal.svg"; document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadPNG = () => {
    const source = new XMLSerializer().serializeToString(svgRef.current);
    const svg64 = btoa(unescape(encodeURIComponent(source)));
    const img = new Image();
    img.onload = () => {
      const scale = 2;
      const canvas = document.createElement("canvas");
      canvas.width = W * scale; canvas.height = H * scale;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.scale(scale, scale); ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = "diagrama_flujo_omnicanal.png"; document.body.appendChild(a); a.click(); document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    };
    img.src = "data:image/svg+xml;base64," + svg64;
  };

  const rectFill = "#F3F6FA", rectStroke = "#334155";
  const decFill = "#FEF3C7", decStroke = "#D97706";
  const pillFill = "#DCFCE7", pillStroke = "#16A34A";
  const migFill = "#EDE9FE", migStroke = "#7C3AED";

  return (
    <div>
      <SectionTitle eyebrow="Proceso" title="Diagrama de flujo de atención" desc="Diagrama vectorial tipo draw.io, con conectores y decisiones. Se puede descargar como imagen para anexar al informe."
        action={<div style={{ display: "flex", gap: 8 }}><GhostBtn onClick={downloadSVG} Icon={Download}>SVG</GhostBtn><PrimaryBtn onClick={downloadPNG} Icon={Download}>Descargar PNG</PrimaryBtn></div>} />
      <Card style={{ padding: 12, overflowX: "auto" }}>
        <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} width={W} height={H} xmlns="http://www.w3.org/2000/svg" style={{ background: "#FFFFFF", borderRadius: 8, display: "block", margin: "0 auto" }}>
          <defs>
            <marker id="arrowhead" markerWidth="9" markerHeight="9" refX="7" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" fill="#334155" />
            </marker>
          </defs>

          <FPill cx={450} cy={35} w={140} h={44} label="Cliente" fill={pillFill} stroke={pillStroke} />
          <FArrow d="M450,57 L450,90" />

          <FRect x={310} y={90} w={280} h={50} lines={["Identificación de necesidad"]} fill={rectFill} stroke={rectStroke} />
          <FArrow d="M450,140 L450,170" />

          <FRect x={310} y={170} w={280} h={50} lines={["Perfilamiento"]} fill={rectFill} stroke={rectStroke} />
          <FArrow d="M450,220 L450,250" />

          <FRect x={310} y={250} w={280} h={50} lines={["Selección de canal"]} fill={rectFill} stroke={rectStroke} />
          <FArrow d="M450,300 L450,330" />

          <FRect x={310} y={330} w={280} h={50} lines={["Inicio de atención"]} fill={rectFill} stroke={rectStroke} />
          <FArrow d="M450,380 L450,410" />

          <FRect x={310} y={410} w={280} h={50} lines={["Clasificación"]} fill={rectFill} stroke={rectStroke} />
          <FArrow d="M450,460 L450,490" />

          <FRect x={310} y={490} w={280} h={50} lines={["Gestión"]} fill={rectFill} stroke={rectStroke} />
          <FArrow d="M450,540 L450,565" />

          <FDiamond cx={450} cy={630} w={230} h={100} lines={["¿Se puede", "resolver?"]} fill={decFill} stroke={decStroke} />

          <FArrow d="M335,630 L150,630 L150,700" label="Sí" labelX={230} labelY={618} />
          <FRect x={40} y={700} w={220} h={54} lines={["Resolver / Cerrar"]} fill={pillFill} stroke={pillStroke} />

          <FArrow d="M565,630 L750,630 L750,700" label="No" labelX={670} labelY={618} />
          <FRect x={640} y={700} w={220} h={54} lines={["Escalar / Seguimiento"]} fill={rectFill} stroke={rectStroke} />

          <FArrow d="M150,754 L150,800 L450,800 L450,825" />
          <FArrow d="M750,754 L750,800 L450,800 L450,825" />

          <FDiamond cx={450} cy={890} w={250} h={100} lines={["¿Necesita", "otro canal?"]} fill={decFill} stroke={decStroke} />

          <FArrow d="M335,890 L150,890 L150,960" label="Sí" labelX={230} labelY={878} />
          <FRect x={40} y={960} w={220} h={54} lines={["Migración de canal"]} fill={migFill} stroke={migStroke} />

          <FArrow d="M575,890 L750,890 L750,1020" label="No" labelX={670} labelY={878} />

          <FArrow d="M150,1014 L150,1045 L450,1045" />
          <FRect x={310} y={1045} w={280} h={54} lines={["Trazabilidad"]} fill={rectFill} stroke={rectStroke} />
          <FArrow d="M750,1020 L750,1072 L590,1072" />

          <FArrow d="M450,1099 L450,1125" />
          <FRect x={310} y={1125} w={280} h={50} lines={["Registro en CRM"]} fill={rectFill} stroke={rectStroke} />
          <FArrow d="M450,1175 L450,1195" />

          <FPill cx={450} cy={1218} w={200} h={44} label="Cierre → Auditoría QA" fill={pillFill} stroke={pillStroke} />
        </svg>
      </Card>
    </div>
  );
}

/* ---------------------------------------------------------------
   INFORME — reporte descargable
--------------------------------------------------------------- */
function buildReportHTML({ clientes, interacciones, casos, guiones, kpis }) {
  const row = (arr) => arr.map((c) => `<td>${c ?? ""}</td>`).join("");
  const clientesRows = clientes.map((c) => `<tr>${row([c.id, c.nombre, c.edad, c.ciudad, c.nivelDigital, canalById(c.canalHabitual).nombre, c.necesidad, c.prioridad, c.estado])}</tr>`).join("");
  const interaccionesRows = interacciones.map((i) => {
    const cliente = clientes.find((c) => c.id === i.cliente);
    return `<tr>${row([i.id, cliente ? cliente.nombre : "—", i.fecha, canalById(i.canal).nombre, i.motivo, i.estado, i.siguiente])}</tr>`;
  }).join("");
  const casosBlocks = casos.map((c) => `<div class="item"><h4>${c.id} · ${c.titulo} <span class="tag">${canalById(c.canal).nombre}</span></h4><p><b>Contexto:</b> ${c.contexto}</p><p><b>Instrucción:</b> ${c.instruccion}</p><p><b>Resultado esperado:</b> ${c.resultado}</p></div>`).join("");
  const guionesBlocks = guiones.map((g) => `<div class="item"><h4>${g.titulo} <span class="tag">${canalById(g.canal).nombre}</span></h4><p><b>Saludo:</b> ${g.saludo}</p><p><b>Identificación:</b> ${g.identificacion}</p><p><b>Propósito:</b> ${g.proposito}</p><p><b>Sondeo:</b> ${g.sondeo}</p><p><b>Gestión:</b> ${g.gestion}</p><p><b>Cierre:</b> ${g.cierre}</p></div>`).join("");

  return `<!DOCTYPE html>
<html lang="es"><head><meta charset="UTF-8"><title>Informe CRM Omnicanal</title>
<style>
body{font-family:Arial,Helvetica,sans-serif;color:#111827;max-width:900px;margin:32px auto;padding:0 20px;line-height:1.5;}
h1{font-size:24px;margin-bottom:2px;} h2{font-size:18px;margin-top:36px;border-bottom:2px solid #111827;padding-bottom:6px;}
.sub{color:#6B7280;font-size:13px;margin-bottom:24px;}
.kpis{display:flex;gap:14px;flex-wrap:wrap;margin:16px 0;}
.kpi{border:1px solid #D1D5DB;border-radius:8px;padding:10px 16px;min-width:140px;}
.kpi b{display:block;font-size:22px;}
table{border-collapse:collapse;width:100%;margin-top:10px;font-size:12px;}
th,td{border:1px solid #D1D5DB;padding:6px 8px;text-align:left;}
th{background:#F3F4F6;}
.item{border:1px solid #D1D5DB;border-radius:8px;padding:12px 14px;margin-top:10px;}
.item h4{margin:0 0 8px 0;font-size:14px;}
.tag{font-size:11px;background:#EEF2FF;color:#4338CA;border-radius:999px;padding:2px 8px;margin-left:6px;}
.item p{margin:4px 0;font-size:12.5px;}
footer{margin-top:40px;font-size:11px;color:#9CA3AF;}
@media print{ body{margin:0;} }
</style></head>
<body>
<h1>Informe de operación — CRM Omnicanal</h1>
<div class="sub">Taller: Construcción y Simulación de un CRM para una Operación de Contact Center Omnicanal · Generado ${new Date().toLocaleString("es-CO")}</div>

<h2>1. Resumen ejecutivo</h2>
<div class="kpis">
  <div class="kpi"><b>${kpis.fcr}%</b>FCR (primer contacto)</div>
  <div class="kpi"><b>${kpis.tasaResolucion}%</b>Tasa de resolución</div>
  <div class="kpi"><b>${kpis.tasaEscalamiento}%</b>Tasa de escalamiento</div>
  <div class="kpi"><b>${kpis.total}</b>Interacciones totales</div>
  <div class="kpi"><b>${clientes.length}</b>Clientes registrados</div>
</div>

<h2>2. Base de clientes</h2>
<table><thead><tr><th>ID</th><th>Nombre</th><th>Edad</th><th>Ciudad</th><th>Nivel digital</th><th>Canal habitual</th><th>Necesidad</th><th>Prioridad</th><th>Estado</th></tr></thead><tbody>${clientesRows}</tbody></table>

<h2>3. Bitácora de interacciones</h2>
<table><thead><tr><th>ID</th><th>Cliente</th><th>Fecha</th><th>Canal</th><th>Motivo</th><th>Estado</th><th>Próximo paso</th></tr></thead><tbody>${interaccionesRows}</tbody></table>

<h2>4. Casos de simulación</h2>
${casosBlocks}

<h2>5. Guiones de atención</h2>
${guionesBlocks}

<footer>Documento generado automáticamente desde la consola OmniConsole — Guía 10 · Transferencia de Conocimiento.<br/>Sugerencia: abra este archivo en el navegador y use Imprimir → Guardar como PDF si necesita entregarlo en ese formato.</footer>
</body></html>`;
}

function InformeTab({ clientes, interacciones, casos, guiones }) {
  const total = interacciones.length;
  const resueltas = interacciones.filter((i) => i.estado === "Resuelto").length;
  const escaladas = interacciones.filter((i) => i.estado === "Escalado").length;
  const primerContactoCasos = interacciones.filter((i) => i.primerContacto);
  const fcr = primerContactoCasos.length ? Math.round((primerContactoCasos.filter((i) => i.estado === "Resuelto").length / primerContactoCasos.length) * 100) : 0;
  const tasaResolucion = total ? Math.round((resueltas / total) * 100) : 0;
  const tasaEscalamiento = total ? Math.round((escaladas / total) * 100) : 0;
  const kpis = { fcr, tasaResolucion, tasaEscalamiento, total };

  const descargar = () => {
    const html = buildReportHTML({ clientes, interacciones, casos, guiones, kpis });
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "informe_crm_omnicanal.html"; document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <SectionTitle eyebrow="Entregable" title="Informe de resultados" desc="Compila clientes, bitácora, casos y guiones actuales en un documento único, listo para anexar a la entrega." action={<PrimaryBtn onClick={descargar} Icon={Download}>Descargar informe</PrimaryBtn>} />
      <Card>
        <div style={{ fontSize: 13, color: C.muted, marginBottom: 14, lineHeight: 1.6 }}>
          El informe se genera con los datos que existan <b style={{ color: C.text }}>en este momento</b> en el CRM: clientes, bitácora, casos y guiones. Al descargarlo obtiene un archivo <code style={{ color: C.live }}>.html</code> autocontenido — ábralo con el navegador y use <b style={{ color: C.text }}>Imprimir → Guardar como PDF</b> si necesita entregarlo en ese formato.
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

/* ---------------------------------------------------------------
   ROLES
--------------------------------------------------------------- */
function RolesTab() {
  const [sorteo, setSorteo] = useState(null);
  return (
    <div>
      <SectionTitle eyebrow="Simulación final" title="Rotación de roles" desc="Cada integrante del equipo debe desempeñar los cuatro roles durante la práctica." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, marginBottom: 16 }}>
        {ROLES.map((r) => (
          <Card key={r.rol} style={{ padding: 16, borderColor: sorteo === r.rol ? r.color : C.line }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}><div style={{ width: 8, height: 8, borderRadius: "50%", background: r.color }} /><span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, color: C.text }}>{r.rol}</span></div>
            <div style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.5 }}>{r.resp}</div>
          </Card>
        ))}
      </div>
      <button onClick={() => setSorteo(ROLES[Math.floor(Math.random() * ROLES.length)].rol)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 10, background: C.live + "1A", border: `1px solid ${C.live}55`, color: C.live, fontSize: 13, cursor: "pointer" }}>
        <Shuffle size={15} /> Sortear rol para la ronda
      </button>
      {sorteo && <div style={{ marginTop: 12, fontSize: 13, color: C.text }}>Rol asignado esta ronda: <b>{sorteo}</b></div>}
    </div>
  );
}

/* ---------------------------------------------------------------
   REFLEXIÓN — persistente entre sesiones
--------------------------------------------------------------- */
const REFLEXION_KEY = "senavance_crm_reflexion";

function ReflexionTab() {
  const [texto, setTexto] = useState("");
  const [status, setStatus] = useState("loading"); // loading | idle | saving | saved | error | unavailable
  const storageOk = typeof window !== "undefined" && typeof window.localStorage !== "undefined";

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!storageOk) { setStatus("unavailable"); return; }
      try {
        const res = window.localStorage.getItem(REFLEXION_KEY);
        if (!cancelled) { if (res) setTexto(res); setStatus("idle"); }
      } catch (e) {
        if (!cancelled) setStatus("idle");
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const guardar = async () => {
    if (!storageOk) return;
    setStatus("saving");
    try {
      window.localStorage.setItem(REFLEXION_KEY, texto);
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2200);
    } catch (e) {
      setStatus("error");
    }
  };

  return (
    <div>
      <SectionTitle eyebrow="Cierre individual" title="Reflexión"
        desc={`"Tengo un cliente, una necesidad y varios canales disponibles: ¿qué canal utilizo, cómo atiendo, cómo registro, cuándo cambio de canal, cómo mantengo la trazabilidad y cómo demuestro que la atención fue de calidad?"`} />
      <Card>
        <textarea value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Escriba aquí su reflexión individual…" rows={8}
          style={{ width: "100%", background: C.panelAlt, border: `1px solid ${C.line}`, borderRadius: 10, color: C.text, fontSize: 13.5, padding: 14, resize: "vertical", outline: "none", fontFamily: "'Inter', sans-serif", lineHeight: 1.6, boxSizing: "border-box" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
          <div style={{ fontSize: 11.5, color: C.mutedDim }}>{texto.length} caracteres</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {status === "saved" && <span style={{ fontSize: 12, color: C.ok, display: "flex", alignItems: "center", gap: 4 }}><Check size={13} /> Guardado</span>}
            {status === "error" && <span style={{ fontSize: 12, color: C.danger }}>No se pudo guardar</span>}
            {status === "unavailable" && <span style={{ fontSize: 12, color: C.mutedDim }}>Guardado no disponible en esta vista — se conserva mientras no recargue la página</span>}
            <PrimaryBtn onClick={guardar} disabled={status === "saving" || status === "loading" || !storageOk} Icon={status === "saving" ? Loader2 : Save}>
              {status === "saving" ? "Guardando…" : "Guardar reflexión"}
            </PrimaryBtn>
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ---------------------------------------------------------------
   SHELL
--------------------------------------------------------------- */
const NAV = [
  { id: "panel", label: "Panel", Icon: LayoutDashboard },
  { id: "clientes", label: "Clientes", Icon: Users },
  { id: "bitacora", label: "Bitácora", Icon: History },
  { id: "canales", label: "Canales", Icon: RouteIcon },
  { id: "casos", label: "Casos", Icon: FlaskConical },
  { id: "guiones", label: "Guiones", Icon: MessageSquareText },
  { id: "qa", label: "Auditoría QA", Icon: ClipboardCheck },
  { id: "flujo", label: "Flujo", Icon: GitBranch },
  { id: "informe", label: "Informe", Icon: FileText },
  { id: "roles", label: "Roles", Icon: UserCog },
  { id: "reflexion", label: "Reflexión", Icon: PenLine },
];

function QATab() {
  const [respuestas, setRespuestas] = useState({});
  const set = (idx, val) => setRespuestas((r) => ({ ...r, [idx]: val }));
  const contestadas = Object.keys(respuestas).length;
  const positivas = Object.values(respuestas).filter((v) => v === "Sí").length;
  const score = contestadas ? Math.round((positivas / contestadas) * 100) : null;
  return (
    <div>
      <SectionTitle eyebrow="Caso 5 · Auditoría" title="Checklist de calidad (QA)" desc="Marque cada criterio mientras observa una atención simulada. El puntaje se calcula en vivo." />
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 24, fontWeight: 700, color: score === null ? C.mutedDim : score >= 70 ? C.ok : score >= 40 ? C.warn : C.danger }}>{score === null ? "—" : `${score}%`}</div>
        <div style={{ fontSize: 12, color: C.muted }}>puntaje de cumplimiento ({contestadas}/{QA_ITEMS.length} evaluados)</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {QA_ITEMS.map((item, idx) => (
          <Card key={idx} style={{ padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", flexDirection: "row" }}>
            <span style={{ fontSize: 13.5, color: C.text }}>{item}</span>
            <div style={{ display: "flex", gap: 6 }}>
              {["Sí", "No", "N/A"].map((opt) => (
                <button key={opt} onClick={() => set(idx, opt)} style={{ padding: "5px 12px", borderRadius: 8, fontSize: 12, cursor: "pointer", border: `1px solid ${respuestas[idx] === opt ? (opt === "Sí" ? C.ok : opt === "No" ? C.danger : C.mutedDim) : C.line}`, background: respuestas[idx] === opt ? (opt === "Sí" ? C.ok + "1A" : opt === "No" ? C.danger + "1A" : C.panelAlt) : "transparent", color: respuestas[idx] === opt ? (opt === "Sí" ? C.ok : opt === "No" ? C.danger : C.muted) : C.mutedDim }}>{opt}</button>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

const DB_KEYS = ["crm_clientes_v1", "crm_interacciones_v1", "crm_casos_v1", "crm_guiones_v1"];

function DbBadge({ sync }) {
  const map = {
    "cargando": { label: "Cargando BD…", color: C.warn, spin: true },
    "listo": { label: "BD sincronizada", color: C.ok, spin: false },
    "guardando": { label: "Guardando…", color: C.live, spin: true },
    "guardado": { label: "Guardado en BD", color: C.ok, spin: false },
    "error": { label: "Error al guardar", color: C.danger, spin: false },
    "sin-bd": { label: "Solo en esta sesión", color: C.mutedDim, spin: false },
  };
  const m = map[sync] || map["sin-bd"];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10.5, color: m.color, fontFamily: "'IBM Plex Mono', monospace" }}>
      {m.spin ? <Loader2 size={11} className="spin" /> : <Database size={11} />}
      {m.label}
    </div>
  );
}

export default function ConsolaOmnicanal() {
  const [tab, setTab] = useState("panel");
  const [clientes, setClientes, syncClientes] = usePersistentState(DB_KEYS[0], CLIENTES_SEED);
  const [interacciones, setInteracciones, syncInteracciones] = usePersistentState(DB_KEYS[1], INTERACCIONES_SEED);
  const [casos, setCasos, syncCasos] = usePersistentState(DB_KEYS[2], CASOS_SEED);
  const [guiones, setGuiones, syncGuiones] = usePersistentState(DB_KEYS[3], GUIONES_SEED);
  const [reloj] = useState(() => new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" }));

  const syncs = [syncClientes, syncInteracciones, syncCasos, syncGuiones];
  const globalSync = syncs.includes("error") ? "error" : syncs.includes("guardando") ? "guardando" : syncs.includes("cargando") ? "cargando" : syncs.every((s) => s === "sin-bd") ? "sin-bd" : "listo";

  const reiniciar = async () => {
    if (!window.confirm("¿Restablecer todos los datos a los valores originales del taller? Se perderá lo que haya agregado o editado.")) return;
    await resetAllData(DB_KEYS);
    setClientes(CLIENTES_SEED);
    setInteracciones(INTERACCIONES_SEED);
    setCasos(CASOS_SEED);
    setGuiones(GUIONES_SEED);
  };

  const renderTab = () => {
    switch (tab) {
      case "panel": return <PanelTab clientes={clientes} interacciones={interacciones} />;
      case "clientes": return <ClientesTab clientes={clientes} setClientes={setClientes} />;
      case "bitacora": return <BitacoraTab clientes={clientes} interacciones={interacciones} setInteracciones={setInteracciones} />;
      case "canales": return <CanalesTab />;
      case "casos": return <CasosTab casos={casos} setCasos={setCasos} />;
      case "guiones": return <GuionesTab guiones={guiones} setGuiones={setGuiones} />;
      case "qa": return <QATab />;
      case "flujo": return <FlujoTab />;
      case "informe": return <InformeTab clientes={clientes} interacciones={interacciones} casos={casos} guiones={guiones} />;
      case "roles": return <RolesTab />;
      case "reflexion": return <ReflexionTab />;
      default: return null;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: 640, background: C.bg, color: C.text, fontFamily: "'Inter', sans-serif", borderRadius: 16, overflow: "hidden", border: `1px solid ${C.line}` }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
      `}</style>
      <div style={{ width: 208, background: C.panel, borderRight: `1px solid ${C.line}`, padding: "18px 12px", flexShrink: 0, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "4px 10px 14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={{ width: 8, height: 8, borderRadius: "50%", background: C.live, boxShadow: `0 0 8px ${C.live}` }} /><span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: C.live, letterSpacing: 1 }}>EN VIVO · {reloj}</span></div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 700, marginTop: 8, color: C.text }}>Omni<span style={{ color: C.live }}>Console</span></div>
          <div style={{ fontSize: 11, color: C.mutedDim, marginTop: 2 }}>CRM · Contact Center BPO</div>
          <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${C.line}` }}><DbBadge sync={globalSync} /></div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {NAV.map((n) => (
            <button key={n.id} onClick={() => setTab(n.id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 9, border: "none", cursor: "pointer", textAlign: "left", background: tab === n.id ? C.panelAlt : "transparent", color: tab === n.id ? C.text : C.muted, fontSize: 13, fontWeight: tab === n.id ? 600 : 500, borderLeft: tab === n.id ? `2px solid ${C.live}` : "2px solid transparent" }}>
              <n.Icon size={15} />{n.label}
            </button>
          ))}
        </div>
        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
          <button onClick={reiniciar} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 8, border: `1px solid ${C.line}`, background: "transparent", color: C.mutedDim, fontSize: 11.5, cursor: "pointer" }}>
            <RotateCcw size={12} /> Restablecer datos
          </button>
          <div style={{ padding: "0 10px", fontSize: 10.5, color: C.mutedDim, lineHeight: 1.5 }}>Simulación de operación omnicanal — Guía 10 · Transferencia de Conocimiento.</div>
        </div>
      </div>
      <div style={{ flex: 1, padding: "24px 28px", overflowY: "auto" }}>{renderTab()}</div>
    </div>
  );
}
