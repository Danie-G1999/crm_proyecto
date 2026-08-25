// services/clientes.ts
import { api } from '@/lib/api';
import { Cliente } from '@/types/api';

export interface ProductoCliente {
  id: number;
  cliente_id: number;
  producto_id: number;
  valor?: number;
  saldo?: number;
  cuota_mensual?: number;
  producto?: {
    id: number;
    nombre: string;
  };
  nombre?: string;
}

export const getClientes = async (): Promise<Cliente[]> => {
  const response = await api.get('/clientes');
  return response.data.data || response.data;
};

export const getClienteById = async (id: number | string): Promise<Cliente> => {
  const response = await api.get(`/clientes/${id}`);
  return response.data.data || response.data;
};

export const getProductosByCliente = async (clienteId: number | string): Promise<ProductoCliente[]> => {
  try {
    // Intenta consumir la ruta directa si agregaste la función en Laravel
    const response = await api.get(`/clientes/${clienteId}/productos`);
    return response.data.data || response.data;
  } catch (err) {
    // Fallback: Si no existe la ruta, usa la colección estándar de 'productos-clientes'
    const fallbackResponse = await api.get('/productos-clientes', {
      params: { cliente_id: clienteId }
    });
    const data = fallbackResponse.data.data || fallbackResponse.data;
    
    if (Array.isArray(data)) {
      return data.filter((item: ProductoCliente) => String(item.cliente_id) === String(clienteId));
    }
    return [];
  }
};

export const createCliente = async (cliente: Partial<Cliente>): Promise<Cliente> => {
  const response = await api.post('/clientes', cliente);
  return response.data;
};

export const updateCliente = async (id: number | string, cliente: Partial<Cliente>): Promise<Cliente> => {
  const response = await api.put(`/clientes/${id}`, cliente);
  return response.data;
};

export const deleteCliente = async (id: number | string): Promise<void> => {
  await api.delete(`/clientes/${id}`);
};