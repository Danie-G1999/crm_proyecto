export const BLANK_CLIENTE = {
  nombre: "",
  tipoIdentificacion: "CEDULA_CIUDADANIA",
  numeroIdentificacion: "",
  correoElectronico: "",
  edad: "",
  ingresosMensuales: "",
  ciudad: "",
  campaña: "",
  ultimoContacto: "",
  nivelDigital: "MEDIO",
  canalHabitual: "TELEFONO",
  prioridad: "MEDIO",
  estado: "en_gestion",
  canalInicial: "TELEFONO",
  canalActual: "TELEFONO",
  observaciones: "",
};

export const BLANK_INTERACCION = {
  cliente: "", fecha: "", canal: "whatsapp", motivo: "", gestion: "",
  estado: "En gestión", siguiente: "", primerContacto: true,
};

export const BLANK_CASO = { titulo: "", canal: "whatsapp", contexto: "", instruccion: "", resultado: "" };

export const BLANK_GUION = {
  titulo: "", canal: "whatsapp", saludo: "", identificacion: "", proposito: "",
  sondeo: "", gestion: "", cierre: "",
};
