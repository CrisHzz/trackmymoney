export interface OfflineGasto {
  id?: string;
  monto: number;
  fecha: string;
  descripcion?: string;
  categoria_id?: number;
  factura?: boolean;
  metodo_pago?: string;
  offline?: boolean;
  timestamp: number;
}

export interface OfflineIngreso {
  id?: string;
  monto: number;
  fecha: string;
  descripcion?: string;
  categoria_id?: number;
  tipo_ingreso: string;
  recurrente?: boolean;
  frecuencia?: string;
  fecha_fin?: string;
  offline?: boolean;
  timestamp: number;
}

const STORAGE_KEYS = {
  GASTOS_OFFLINE: 'gastos_offline',
  INGRESOS_OFFLINE: 'ingresos_offline',
  LAST_SYNC: 'last_sync_timestamp'
};

// Funciones para Gastos
export const saveOfflineGasto = (gasto: Omit<OfflineGasto, 'timestamp'>): OfflineGasto => {
  const gastoWithTimestamp: OfflineGasto = {
    ...gasto,
    id: gasto.id || Date.now().toString(),
    timestamp: Date.now()
  };

  const existingGastos = getOfflineGastos();
  const updatedGastos = [...existingGastos, gastoWithTimestamp];
  
  localStorage.setItem(STORAGE_KEYS.GASTOS_OFFLINE, JSON.stringify(updatedGastos));
  return gastoWithTimestamp;
};

export const getOfflineGastos = (): OfflineGasto[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.GASTOS_OFFLINE);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading offline gastos:', error);
    return [];
  }
};

export const removeOfflineGasto = (id: string): void => {
  const gastos = getOfflineGastos();
  const filtered = gastos.filter(gasto => gasto.id !== id);
  localStorage.setItem(STORAGE_KEYS.GASTOS_OFFLINE, JSON.stringify(filtered));
};

export const clearOfflineGastos = (): void => {
  localStorage.removeItem(STORAGE_KEYS.GASTOS_OFFLINE);
};

// Funciones para Ingresos
export const saveOfflineIngreso = (ingreso: Omit<OfflineIngreso, 'timestamp'>): OfflineIngreso => {
  const ingresoWithTimestamp: OfflineIngreso = {
    ...ingreso,
    id: ingreso.id || Date.now().toString(),
    timestamp: Date.now()
  };

  const existingIngresos = getOfflineIngresos();
  const updatedIngresos = [...existingIngresos, ingresoWithTimestamp];
  
  localStorage.setItem(STORAGE_KEYS.INGRESOS_OFFLINE, JSON.stringify(updatedIngresos));
  return ingresoWithTimestamp;
};

export const getOfflineIngresos = (): OfflineIngreso[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.INGRESOS_OFFLINE);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading offline ingresos:', error);
    return [];
  }
};

export const removeOfflineIngreso = (id: string): void => {
  const ingresos = getOfflineIngresos();
  const filtered = ingresos.filter(ingreso => ingreso.id !== id);
  localStorage.setItem(STORAGE_KEYS.INGRESOS_OFFLINE, JSON.stringify(filtered));
};

export const clearOfflineIngresos = (): void => {
  localStorage.removeItem(STORAGE_KEYS.INGRESOS_OFFLINE);
};

// Funciones de sincronización
export const getAllOfflineData = () => {
  return {
    gastos: getOfflineGastos(),
    ingresos: getOfflineIngresos(),
    totalPending: getOfflineGastos().length + getOfflineIngresos().length
  };
};

export const setLastSyncTimestamp = (timestamp: number): void => {
  localStorage.setItem(STORAGE_KEYS.LAST_SYNC, timestamp.toString());
};

export const getLastSyncTimestamp = (): number => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.LAST_SYNC);
    return stored ? parseInt(stored) : 0;
  } catch (error) {
    console.error('Error reading last sync timestamp:', error);
    return 0;
  }
};

export const clearAllOfflineData = (): void => {
  clearOfflineGastos();
  clearOfflineIngresos();
  localStorage.removeItem(STORAGE_KEYS.LAST_SYNC);
}; 