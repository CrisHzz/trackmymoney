/**
 * APIClient - Cliente simplificado para pruebas BDD básicas
 */

import { APIResponse } from './world';

export interface GastoInput {
  monto: number;
  fecha: string;
  descripcion?: string;
  categoria_id?: number;
  factura?: boolean;
  metodo_pago?: string;
}

export interface IngresoInput {
  monto: number;
  fecha: string;
  descripcion?: string;
  categoria_id?: number;
  tipo_ingreso: string;
  recurrente?: boolean;
  frecuencia?: string;
  fecha_fin?: string;
}

export interface CategoriaInput {
  nombre: string;
  usuario_id: number;
}

/**
 * APIClient Class - Versión simplificada para pruebas básicas
 */
export class APIClient {
  private world: any;
  
  constructor(world: any) {
    this.world = world;
  }
  
  public gastos = {
    create: async (data: GastoInput): Promise<APIResponse> => {
      this.world.log('📝 Creando gasto (mock):', data);
      
      const response: APIResponse = {
        status: 200,
        data: { id: Math.floor(Math.random() * 1000), ...data }
      };
      
      this.world.setLastResponse(response);
      return response;
    },
    
    list: async (): Promise<APIResponse> => {
      this.world.log('📋 Listando gastos (mock)');
      
      const response: APIResponse = {
        status: 200,
        data: []
      };
      
      this.world.setLastResponse(response);
      return response;
    }
  };
  
  public ingresos = {
    create: async (data: IngresoInput): Promise<APIResponse> => {
      this.world.log('📝 Creando ingreso (mock):', data);
      
      const response: APIResponse = {
        status: 200,
        data: { id: Math.floor(Math.random() * 1000), ...data }
      };
      
      this.world.setLastResponse(response);
      return response;
    },
    
    list: async (): Promise<APIResponse> => {
      this.world.log('📋 Listando ingresos (mock)');
      
      const response: APIResponse = {
        status: 200,
        data: []
      };
      
      this.world.setLastResponse(response);
      return response;
    }
  };
  
  public categorias = {
    create: async (data: CategoriaInput): Promise<APIResponse> => {
      this.world.log('📝 Creando categoría (mock):', data);
      
      const response: APIResponse = {
        status: 200,
        data: { id: Math.floor(Math.random() * 1000), ...data }
      };
      
      this.world.setLastResponse(response);
      return response;
    },
    
    list: async (): Promise<APIResponse> => {
      this.world.log('📋 Listando categorías (mock)');
      
      const response: APIResponse = {
        status: 200,
        data: []
      };
      
      this.world.setLastResponse(response);
      return response;
    },
    
    getById: async (id: number): Promise<APIResponse> => {
      this.world.log('🔍 Buscando categoría por ID (mock):', id);
      
      const response: APIResponse = {
        status: 404,
        data: null,
        error: 'Categoría no encontrada'
      };
      
      this.world.setLastResponse(response);
      return response;
    }
  };
  
  public isSuccessResponse(response: APIResponse): boolean {
    return response.status >= 200 && response.status < 300 && !response.error;
  }
  
  public getErrorMessage(response: APIResponse): string {
    return response.error || response.details || 'Error desconocido';
  }
}