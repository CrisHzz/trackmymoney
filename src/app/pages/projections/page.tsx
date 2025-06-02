"use client";
import React, { useState, useEffect, memo } from 'react';
import { motion } from 'framer-motion';
import AnimatedBackground from '@/components/AnimatedBackground';
import Header from '@/components/Header';
import { toast } from 'react-hot-toast';
import { formatDisplayDate } from '@/lib/dateUtils';

// Memoize the AnimatedBackground component
const MemoizedAnimatedBackground = memo(AnimatedBackground);

interface Transaction {
  id: number;
  monto: number;
  descripcion: string;
  fecha: string;
  tipo: 'ingreso' | 'gasto';
  categoria?: {
    id: number;
    nombre: string;
  };
  metodo_pago?: string;
  factura?: boolean;
  tipo_ingreso?: string;
  recurrente?: boolean;
  frecuencia?: string;
}

export default function ProjectionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'todos' | 'ingreso' | 'gasto'>('todos');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      // Fetch both expenses and income
      const [expensesResponse, incomeResponse] = await Promise.all([
        fetch('/api/gastos'),
        fetch('/api/ingresos')
      ]);

      if (!expensesResponse.ok || !incomeResponse.ok) {
        throw new Error('Error al cargar las transacciones');
      }

      const expenses = await expensesResponse.json();
      const income = await incomeResponse.json();

      // Transform and combine the data
      const formattedExpenses = expenses.map((expense: any) => ({
        ...expense,
        tipo: 'gasto' as const
      }));

      const formattedIncome = income.map((income: any) => ({
        ...income,
        tipo: 'ingreso' as const
      }));

      // Combine and sort by date
      const allTransactions = [...formattedExpenses, ...formattedIncome].sort(
        (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
      );

      setTransactions(allTransactions);
    } catch (error) {
      toast.error('Error al cargar las transacciones');
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'todos') return true;
    return transaction.tipo === filter;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return formatDisplayDate(dateString);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-violet-800 to-emerald-500 p-4 md:p-8 relative">
      <Header />
      
      <MemoizedAnimatedBackground numberOfElements={8} />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center justify-center min-h-screen pt-16"
      >
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 shadow-2xl w-full max-w-6xl">
          <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight mb-6 text-center">
            Proyecciones Financieras
          </h1>

          <div className="mb-6 flex justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter('todos')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'todos'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              Todos
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter('ingreso')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'ingreso'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              Ingresos
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter('gasto')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'gasto'
                  ? 'bg-red-600 text-white'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              Gastos
            </motion.button>
          </div>

          {loading ? (
            <div className="text-center text-white">Cargando transacciones...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-white">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="p-4 text-left">Fecha</th>
                    <th className="p-4 text-left">Descripción</th>
                    <th className="p-4 text-left">Categoría</th>
                    <th className="p-4 text-left">Tipo</th>
                    <th className="p-4 text-right">Monto</th>
                    <th className="p-4 text-left">Detalles</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction) => (
                    <motion.tr
                      key={`${transaction.tipo}-${transaction.id}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-white/10 hover:bg-white/5"
                    >
                      <td className="p-4">{formatDate(transaction.fecha)}</td>
                      <td className="p-4">{transaction.descripcion}</td>
                      <td className="p-4">
                        {transaction.categoria?.nombre || 'Sin categoría'}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded-full text-sm ${
                            transaction.tipo === 'ingreso'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-red-500/20 text-red-300'
                          }`}
                        >
                          {transaction.tipo === 'ingreso' ? 'Ingreso' : 'Gasto'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <span
                          className={
                            transaction.tipo === 'ingreso'
                              ? 'text-emerald-400'
                              : 'text-red-400'
                          }
                        >
                          {transaction.tipo === 'ingreso' ? '+' : '-'}
                          {formatCurrency(transaction.monto)}
                        </span>
                      </td>
                      <td className="p-4">
                        {transaction.tipo === 'ingreso' ? (
                          <>
                            {transaction.tipo_ingreso && (
                              <div className="text-sm text-white/60">
                                Tipo: {transaction.tipo_ingreso}
                              </div>
                            )}
                            {transaction.recurrente && (
                              <div className="text-sm text-white/60">
                                Recurrente: {transaction.frecuencia}
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            {transaction.metodo_pago && (
                              <div className="text-sm text-white/60">
                                Método: {transaction.metodo_pago}
                              </div>
                            )}
                            {transaction.factura && (
                              <div className="text-sm text-white/60">
                                Requiere factura
                              </div>
                            )}
                          </>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
