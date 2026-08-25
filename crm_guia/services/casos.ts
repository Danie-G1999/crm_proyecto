// services/casos.ts
import { api } from '@/lib/api';

export interface CasoSimulacion {
  id?: number;
  titulo: string;
  cliente_id: number | string;
  producto_cliente_id: number | string;
  situacion: string;
  actitud_cliente?: string;
  objetivo_asesor?: string;
  dias_mora?: number;
  capacidad_estimada_pago?: number;
  estado_simulacion?: string;
  created_at?: string;
  updated_at?: string;
}

export const getCasos = async (): Promise<CasoSimulacion[]> => {
  const response = await api.get('/casos-simulacion');
  return response.data.data || response.data;
};

export const getCasoById = async (id: number | string): Promise<CasoSimulacion> => {
  const response = await api.get(`/casos-simulacion/${id}`);
  return response.data.data || response.data;
};

export const createCaso = async (caso: Partial<CasoSimulacion>): Promise<CasoSimulacion> => {
  const response = await api.post('/casos-simulacion', caso);
  return response.data;
};

export const updateCaso = async (id: number | string, caso: Partial<CasoSimulacion>): Promise<CasoSimulacion> => {
  const response = await api.put(`/casos-simulacion/${id}`, caso);
  return response.data;
};

export const deleteCaso = async (id: number | string): Promise<void> => {
  await api.delete(`/casos-simulacion/${id}`);
};

export const casosService = {
  getAll: getCasos,
  getById: getCasoById,
  create: createCaso,
  update: updateCaso,
  delete: deleteCaso,
};