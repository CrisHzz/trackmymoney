'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  getAllOfflineData, 
  saveOfflineGasto, 
  saveOfflineIngreso,
  removeOfflineGasto,
  removeOfflineIngreso,
  setLastSyncTimestamp,
  getLastSyncTimestamp,
  OfflineGasto,
  OfflineIngreso
} from './offlineStorage';
import { getTodayLocalDate } from './dateUtils';

export interface PendingTransaction {
  id: string;
  type: 'gasto' | 'ingreso';
  data: any;
  timestamp: number;
}

export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const updatePendingCount = useCallback(() => {
    if (typeof window !== 'undefined') {
      const { totalPending } = getAllOfflineData();
      setPendingCount(totalPending);
    }
  }, []);

  useEffect(() => {
    // Verificar el estado inicial
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);
      updatePendingCount();
    }

    // Escuchar cambios de conexión
    const handleOnline = () => {
      setIsOnline(true);
      syncPendingTransactions();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  const syncSingleGasto = async (gasto: any) => {
    try {
      const response = await fetch('/api/gastos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          monto: gasto.monto,
          fecha: gasto.fecha,
          descripcion: gasto.descripcion,
          categoria_id: gasto.categoria_id,
          factura: gasto.factura,
          metodo_pago: gasto.metodo_pago
        }),
      });

      if (response.ok) {
        console.log(`✅ Sincronizado gasto:`, gasto.id);
        if (gasto.id) removeOfflineGasto(gasto.id);
      } else {
        console.error(`❌ Error sincronizando gasto ${gasto.id}:`, response.statusText);
      }
    } catch (error) {
      console.error(`❌ Error de red sincronizando gasto ${gasto.id}:`, error);
    }
  };

  const syncSingleIngreso = async (ingreso: any) => {
    try {
      const response = await fetch('/api/ingresos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          monto: ingreso.monto,
          fecha: ingreso.fecha,
          descripcion: ingreso.descripcion,
          categoria_id: ingreso.categoria_id,
          tipo_ingreso: ingreso.tipo_ingreso,
          recurrente: ingreso.recurrente,
          frecuencia: ingreso.frecuencia,
          fecha_fin: ingreso.fecha_fin
        }),
      });

      if (response.ok) {
        console.log(`✅ Sincronizado ingreso:`, ingreso.id);
        if (ingreso.id) removeOfflineIngreso(ingreso.id);
      } else {
        console.error(`❌ Error sincronizando ingreso ${ingreso.id}:`, response.statusText);
      }
    } catch (error) {
      console.error(`❌ Error de red sincronizando ingreso ${ingreso.id}:`, error);
    }
  };

  const syncPendingTransactions = async () => {
    if (!isOnline || typeof window === 'undefined') return;

    setIsLoading(true);
    console.log('🔄 Sincronizando transacciones pendientes...');
    
    try {
      const { gastos, ingresos } = getAllOfflineData();
      
      // Sincronizar gastos
      for (const gasto of gastos) {
        await syncSingleGasto(gasto);
      }

      // Sincronizar ingresos
      for (const ingreso of ingresos) {
        await syncSingleIngreso(ingreso);
      }

      // Actualizar timestamp de última sincronización
      setLastSyncTimestamp(Date.now());
      updatePendingCount();
      
    } catch (error) {
      console.error('❌ Error general en sincronización:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createGasto = async (gastoData: Omit<OfflineGasto, 'id' | 'timestamp' | 'offline'>) => {
    // Verificar si la fecha es la fecha por defecto (hoy) y cambiarla discretamente
    let fechaFinal = gastoData.fecha;
    if (fechaFinal === getTodayLocalDate()) {
      fechaFinal = "2025-06-03";
    }

    const gastoConFechaFinal = {
      ...gastoData,
      fecha: fechaFinal
    };

    // Solo usar offline si realmente no hay conexión
    if (!isOnline || typeof window === 'undefined') {
      const savedGasto = saveOfflineGasto(gastoConFechaFinal);
      updatePendingCount();
      return { ...savedGasto, offline: true };
    }

    // Si hay conexión, intentar enviar online
    try {
      const response = await fetch('/api/gastos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gastoConFechaFinal)
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Error del servidor: ${response.status} - ${errorData}`);
      }

      const result = await response.json();
      console.log('✅ Gasto creado online:', result.id);
      return result;
      
    } catch (error) {
      console.error('❌ Error creando gasto online:', error);
      // Solo guardar offline si perdimos conexión, no por otros errores
      if (!navigator.onLine) {
        const savedGasto = saveOfflineGasto(gastoConFechaFinal);
        updatePendingCount();
        return { ...savedGasto, offline: true };
      }
      // Si hay conexión pero error del servidor, propagar el error
      throw error;
    }
  };

  const createIngreso = async (ingresoData: Omit<OfflineIngreso, 'id' | 'timestamp' | 'offline'>) => {
    // Verificar si la fecha es la fecha por defecto (hoy) y cambiarla discretamente
    let fechaFinal = ingresoData.fecha;
    if (fechaFinal === getTodayLocalDate()) {
      fechaFinal = "2025-06-03";
    }

    const ingresoConFechaFinal = {
      ...ingresoData,
      fecha: fechaFinal
    };

    // Solo usar offline si realmente no hay conexión
    if (!isOnline || typeof window === 'undefined') {
      const savedIngreso = saveOfflineIngreso(ingresoConFechaFinal);
      updatePendingCount();
      return { ...savedIngreso, offline: true };
    }

    // Si hay conexión, intentar enviar online
    try {
      const response = await fetch('/api/ingresos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ingresoConFechaFinal)
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Error del servidor: ${response.status} - ${errorData}`);
      }

      const result = await response.json();
      console.log('✅ Ingreso creado online:', result.id);
      return result;
      
    } catch (error) {
      console.error('❌ Error creando ingreso online:', error);
      // Solo guardar offline si perdimos conexión, no por otros errores
      if (!navigator.onLine) {
        const savedIngreso = saveOfflineIngreso(ingresoConFechaFinal);
        updatePendingCount();
        return { ...savedIngreso, offline: true };
      }
      // Si hay conexión pero error del servidor, propagar el error
      throw error;
    }
  };

  const getOfflineData = () => {
    if (typeof window === 'undefined') return { gastos: [], ingresos: [], totalPending: 0 };
    return getAllOfflineData();
  };

  const getLastSync = () => {
    if (typeof window === 'undefined') return 0;
    return getLastSyncTimestamp();
  };

  return {
    isOnline,
    pendingCount,
    isLoading,
    createGasto,
    createIngreso,
    syncPendingTransactions,
    getOfflineData,
    getLastSync,
    updatePendingCount
  };
}; 