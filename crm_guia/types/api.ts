// types/api.ts

export type RolAsesor = 'ASESOR' | 'SUPERVISOR' | 'EVALUADOR_CALIDAD' | 'ADMIN';
export type TipoIdentificacion = 'TARJETA_IDENTIDAD' | 'CEDULA_CIUDADANIA' | 'PASAPORTE';
export type NivelDigital = 'BAJO' | 'MEDIO' | 'ALTO';
export type Canal = 'TELEFONO' | 'WHATSAPP' | 'CHAT_WEB' | 'CORREO_ELECTRONICO' | 'REDES_SOCIALES';
export type Prioridad = 'BAJO' | 'MEDIO' | 'ALTO';
export type EstadoGestion = 'en_gestion' | 'resuelto' | 'cerrado' | 'escalado' | 'seguimiento';

export interface Asesor {
  id: number;
  nombre: string;
  correo: string;
  rol: RolAsesor;
  estado: string;
  created_at?: string;
  updated_at?: string;
}

export interface Cliente {
  id: number;
  tipo_identificacion?: TipoIdentificacion;
  numero_identificacion: string;
  nombre: string;
  apellidos: string;
  correo_electronico?: string;
  direccion?: string;
  edad?: number;
  ingresos_mensuales?: number;
  nivel_digital?: NivelDigital;
  canal_habitual?: Canal;
  campaña?: string;
  prioridad?: Prioridad;
  estado?: EstadoGestion;
  canal_inicial?: Canal;
  canal_actual?: Canal;
  ultimo_contacto?: string;
  asesor_id: number;
  observaciones?: string;
  asesor?: Asesor;
}

export interface CasoSimulacion {
  id: number;
  titulo: string;
  cliente_id: number;
  producto_cliente_id: number;
  dias_mora: number;
  ultimo_pago_fecha?: string;
  situacion: string;
  capacidad_estimada_pago?: number;
  actitud_cliente?: string;
  objetivo_asesor?: string;
  estado_simulacion: string;
  cliente?: Cliente;
}