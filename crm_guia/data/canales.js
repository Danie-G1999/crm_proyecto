import { Phone, MessageCircle, Mail, Share2, MonitorSmartphone } from "lucide-react";

export const CANALES = [
  { id: "telefono", nombre: "Teléfono", color: "#F2B84B", Icon: Phone },
  { id: "whatsapp", nombre: "WhatsApp", color: "#4ADE80", Icon: MessageCircle },
  { id: "chat", nombre: "Chat web", color: "#38BDF8", Icon: MonitorSmartphone },
  { id: "correo", nombre: "Correo electrónico", color: "#A78BFA", Icon: Mail },
  { id: "redes", nombre: "Redes sociales", color: "#FB7185", Icon: Share2 },
];

export const canalById = (id) => CANALES.find((c) => c.id === id) || CANALES[0];
