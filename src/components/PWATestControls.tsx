'use client';

import { useState } from 'react';
import { useOnlineStatus } from '@/lib/useOnlineStatus';
import { getAllOfflineData, clearAllOfflineData } from '@/lib/offlineStorage';
import { getTodayLocalDate } from '@/lib/dateUtils';
import { Bug, Wifi, WifiOff, Trash2, RefreshCw, Eye } from 'lucide-react';

// ⚠️ COMPONENTE SOLO PARA TESTING - REMOVER EN PRODUCCIÓN
export const PWATestControls = () => {
  const { isOnline, pendingCount, syncPendingTransactions, createGasto, createIngreso } = useOnlineStatus();
  const [isExpanded, setIsExpanded] = useState(false);
  const [testCount, setTestCount] = useState(1);

  // Simular estados offline/online
  const simulateOffline = () => {
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: false
    });
    window.dispatchEvent(new Event('offline'));
  };

  const simulateOnline = () => {
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: true
    });
    window.dispatchEvent(new Event('online'));
  };

  // Crear datos de prueba offline
  const createTestData = async () => {
    try {
      await createGasto({
        monto: Math.random() * 100 + 10,
        fecha: getTodayLocalDate(),
        descripcion: `Gasto de prueba #${testCount}`,
        factura: false
      });

      await createIngreso({
        monto: Math.random() * 200 + 50,
        fecha: getTodayLocalDate(),
        descripcion: `Ingreso de prueba #${testCount}`,
        tipo_ingreso: 'Salario'
      });

      setTestCount(prev => prev + 1);
    } catch (error) {
      console.error('Error creando datos de prueba:', error);
    }
  };

  // Ver datos offline
  const viewOfflineData = () => {
    const data = getAllOfflineData();
    const todayLocal = getTodayLocalDate();
    const todayISO = new Date().toISOString().split('T')[0];
    
    console.group('📊 Datos Offline');
    console.log('Fecha local actual:', todayLocal);
    console.log('Fecha ISO actual:', todayISO);
    console.log('Gastos offline:', data.gastos);
    console.log('Ingresos offline:', data.ingresos);
    console.log('Total pendientes:', data.totalPending);
    console.groupEnd();
    
    alert(`Datos offline:\n- Gastos: ${data.gastos.length}\n- Ingresos: ${data.ingresos.length}\n- Total: ${data.totalPending}\n- Fecha local: ${todayLocal}\n- Fecha ISO: ${todayISO}\n\nRevisa la consola para detalles.`);
  };

  // Limpiar datos offline
  const clearOfflineData = () => {
    clearAllOfflineData();
    alert('✅ Datos offline limpiados');
    window.location.reload();
  };

  if (process.env.NODE_ENV === 'production') {
    return null; // No mostrar en producción
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      {/* Botón principal */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-gray-900 text-white p-3 rounded-full shadow-lg hover:bg-gray-800 transition-colors"
        title="PWA Test Controls"
      >
        <Bug className="w-5 h-5" />
      </button>

      {/* Panel expandido */}
      {isExpanded && (
        <div className="absolute bottom-16 left-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 w-80">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Bug className="w-5 h-5" />
              PWA Test Controls
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Estado actual: <span className={`font-semibold ${isOnline ? 'text-green-600' : 'text-orange-600'}`}>
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Pendientes: <span className="font-semibold text-blue-600">{pendingCount}</span>
            </p>
          </div>

          <div className="space-y-3">
            {/* Simular estados */}
            <div className="flex gap-2">
              <button
                onClick={simulateOffline}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition-colors"
              >
                <WifiOff className="w-4 h-4" />
                Offline
              </button>
              <button
                onClick={simulateOnline}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm transition-colors"
              >
                <Wifi className="w-4 h-4" />
                Online
              </button>
            </div>

            {/* Crear datos de prueba */}
            <button
              onClick={createTestData}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Crear Datos Test
            </button>

            {/* Ver datos offline */}
            <button
              onClick={viewOfflineData}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm transition-colors"
            >
              <Eye className="w-4 h-4" />
              Ver Datos Offline
            </button>

            {/* Sincronizar manualmente */}
            <button
              onClick={syncPendingTransactions}
              disabled={!isOnline || pendingCount === 0}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-400 text-white rounded-lg text-sm transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Sync Manual
            </button>

            {/* Limpiar datos */}
            <button
              onClick={clearOfflineData}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Limpiar Todo
            </button>
          </div>

          <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              💡 <strong>Tip:</strong> También puedes usar Chrome DevTools → Network → Throttling → Offline
            </p>
          </div>
        </div>
      )}
    </div>
  );
}; 