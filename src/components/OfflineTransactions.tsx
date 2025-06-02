'use client';

import { useState } from 'react';
import { useOnlineStatus } from '@/lib/useOnlineStatus';
import { RefreshCw, Clock, DollarSign, TrendingUp, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDisplayDate } from '@/lib/dateUtils';

export const OfflineTransactions = () => {
  const { isOnline, getOfflineData, syncPendingTransactions, isLoading, updatePendingCount } = useOnlineStatus();
  const [isOpen, setIsOpen] = useState(false);
  const offlineData = getOfflineData();

  const handleSync = async () => {
    await syncPendingTransactions();
    updatePendingCount();
  };

  const formatDate = (dateString: string) => {
    return formatDisplayDate(dateString);
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'COP'
    }).format(amount);
  };

  if (offlineData.totalPending === 0) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 rounded-lg hover:bg-orange-200 dark:hover:bg-orange-800 transition-colors"
      >
        <Clock className="w-4 h-4" />
        <span className="text-sm font-medium">
          {offlineData.totalPending} pendiente{offlineData.totalPending !== 1 ? 's' : ''}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 right-0 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Transacciones Offline
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {isOnline && (
                <button
                  onClick={handleSync}
                  disabled={isLoading}
                  className="w-full mb-4 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  {isLoading ? 'Sincronizando...' : 'Sincronizar Todo'}
                </button>
              )}

              <div className="max-h-60 overflow-y-auto space-y-2">
                {/* Gastos offline */}
                {offlineData.gastos.map((gasto) => (
                  <div
                    key={gasto.id}
                    className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg"
                  >
                    <DollarSign className="w-5 h-5 text-red-500" />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {formatAmount(gasto.monto)}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {gasto.descripcion || 'Gasto sin descripción'}
                          </p>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(gasto.fecha)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Ingresos offline */}
                {offlineData.ingresos.map((ingreso) => (
                  <div
                    key={ingreso.id}
                    className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"
                  >
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {formatAmount(ingreso.monto)}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {ingreso.descripcion || ingreso.tipo_ingreso}
                          </p>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(ingreso.fecha)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {!isOnline && (
                <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <p className="text-sm text-yellow-700 dark:text-yellow-400">
                    ⚠️ Sin conexión. Las transacciones se sincronizarán automáticamente cuando se restablezca la conexión.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}; 