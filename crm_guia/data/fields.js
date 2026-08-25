import { NIVELES, PRIORIDADES, ESTADOS_CLIENTE } from "./constants";

export const FIELDS_CLIENTE = [
  { key: "nombre", label: "Nombre Completo", type: "text" },
  { key: "tipoIdentificacion", label: "Tipo Identificación", type: "select", options: ["TARJETA_IDENTIDAD", "CEDULA_CIUDADANIA", "PASAPORTE"] },
  { key: "numeroIdentificacion", label: "Número de Identificación", type: "text" },
  { key: "correoElectronico", label: "Correo Electrónico", type: "text" },
  { key: "edad", label: "Edad", type: "number" },
  { key: "ingresosMensuales", label: "Ingresos Mensuales", type: "number" },
  { key: "ciudad", label: "Ciudad / Dirección", type: "text" },
  { key: "campaña", label: "Campaña", type: "text" },
  { key: "ultimoContacto", label: "Último Contacto", type: "modal-date" }, // Cambiamos el tipo a modal-date
  { key: "nivelDigital", label: "Nivel Digital", type: "select", options: ["BAJO", "MEDIO", "ALTO"] },
  { key: "canalHabitual", label: "Canal Habitual", type: "select", options: ["TELEFONO", "WHATSAPP", "CHAT_WEB", "CORREO_ELECTRONICO", "REDES_SOCIALES"] },
  { key: "prioridad", label: "Prioridad", type: "select", options: ["BAJO", "MEDIO", "ALTO"] },
  { key: "estado", label: "Estado", type: "select", options: ["en_gestion", "resuelto", "cerrado", "escalado", "seguimiento"] },
  { key: "canalInicial", label: "Canal Inicial", type: "select", options: ["TELEFONO", "WHATSAPP", "CHAT_WEB", "CORREO_ELECTRONICO", "REDES_SOCIALES"] },
  { key: "canalActual", label: "Canal Actual", type: "select", options: ["TELEFONO", "WHATSAPP", "CHAT_WEB", "CORREO_ELECTRONICO", "REDES_SOCIALES"] },
  { key: "observaciones", label: "Observaciones / Necesidad", type: "textarea" },
];

// src/data/fields.js (o fields.ts)

export const FIELDS_CASO = [
  { 
    key: "titulo", 
    label: "Título del Caso", 
    type: "text", 
    required: true, 
    placeholder: "Ej. Cliente con mora de 30 días" 
  },
  { 
    key: "situacion", 
    label: "Situación", 
    type: "textarea", // O "text" según tus componentes UI
    required: true, 
    placeholder: "Describe detalladamente la situación inicial del cliente..." 
  },
  { 
    key: "actitud_cliente", 
    label: "Actitud del Cliente", 
    type: "text", 
    placeholder: "Ej. Adefesio, Molesto, Receptivo" 
  },
  { 
    key: "objetivo_asesor", 
    label: "Objetivo del Asesor", 
    type: "text", 
    placeholder: "Ej. Conseguir promesa de pago a 3 días" 
  },
  { 
    key: "dias_mora", 
    label: "Días de Mora", 
    type: "number", 
    placeholder: "30" 
  },
  { 
    key: "capacidad_estimada_pago", 
    label: "Capacidad Estimada de Pago", 
    type: "number", 
    placeholder: "500000" 
  },
];

export const FIELDS_GUION = [
  { key: "titulo", label: "Título del guion", type: "text", w: 2 },
  { key: "canal", label: "Canal", type: "canal", w: 1 },
  { key: "saludo", label: "Saludo", type: "textarea", w: 2 },
  { key: "identificacion", label: "Identificación", type: "textarea", w: 2 },
  { key: "proposito", label: "Propósito", type: "textarea", w: 2 },
  { key: "sondeo", label: "Sondeo", type: "textarea", w: 2 },
  { key: "gestion", label: "Gestión", type: "textarea", w: 2 },
  { key: "cierre", label: "Cierre", type: "textarea", w: 2 },
];
