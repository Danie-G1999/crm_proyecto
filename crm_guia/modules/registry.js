import {
  LayoutDashboard, Users, History, Route as RouteIcon, FlaskConical,
  MessageSquareText, ClipboardCheck, GitBranch, FileText, UserCog, PenLine, UserCheck,
} from "lucide-react";

import { PanelTab } from "./panel/PanelTab";
import { ClientesTab } from "./clientes/ClientesTab";
import { BitacoraTab } from "./bitacora/BitacoraTab";
import { CanalesTab } from "./canales/CanalesTab";
import { CasosTab } from "./casos/CasosTab";
import { GuionesTab } from "./guiones/GuionesTab";
import { QATab } from "./qa/QATab";
import { FlujoTab } from "./flujo/FlujoTab";
import { InformeTab } from "./informe/InformeTab";
import { RolesTab } from "./roles/RolesTab";
import { ReflexionTab } from "./reflexion/ReflexionTab";
import { AsesoresTab } from "./asesores/AsesoresTab";

/**
 * Única fuente de verdad para la navegación.
 */
export const MODULE_REGISTRY = [
  { id: "panel", label: "Panel", Icon: LayoutDashboard, Component: PanelTab },
  { id: "clientes", label: "Clientes", Icon: Users, Component: ClientesTab },
  { id: "asesores", label: "Asesores", Icon: UserCheck, Component: AsesoresTab },
  { id: "bitacora", label: "Bitácora", Icon: History, Component: BitacoraTab },
  { id: "canales", label: "Canales", Icon: RouteIcon, Component: CanalesTab },
  { id: "casos", label: "Casos", Icon: FlaskConical, Component: CasosTab },
  { id: "guiones", label: "Guiones", Icon: MessageSquareText, Component: GuionesTab },
  { id: "qa", label: "Auditoría QA", Icon: ClipboardCheck, Component: QATab },
  { id: "flujo", label: "Flujo", Icon: GitBranch, Component: FlujoTab },
  { id: "informe", label: "Informe", Icon: FileText, Component: InformeTab },
  { id: "roles", label: "Roles", Icon: UserCog, Component: RolesTab },
  { id: "reflexion", label: "Reflexión", Icon: PenLine, Component: ReflexionTab },
];