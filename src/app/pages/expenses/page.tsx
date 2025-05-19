"use client";
import React, { useState, useEffect, memo } from 'react';
import { motion } from 'framer-motion';
import AnimatedBackground from '@/components/AnimatedBackground';
import Header from '@/components/Header';
import { toast } from 'react-hot-toast';

// Memoize the AnimatedBackground component
const MemoizedAnimatedBackground = memo(AnimatedBackground);

interface Expense {
  id: number;
  monto: number | string | any;
  descripcion: string;
  fecha: string;
  factura: boolean;
  metodo_pago?: string;
  categoria?: {
    id: number;
    nombre: string;
  };
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [newExpense, setNewExpense] = useState({
    monto: '',
    descripcion: '',
    fecha: new Date().toISOString().split('T')[0],
    factura: false,
    metodo_pago: 'Efectivo'
  });

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await fetch('/api/gastos');
      if (!response.ok) throw new Error('Error al cargar los gastos');
      const data = await response.json();
      setExpenses(data);
    } catch (error) {
      toast.error('Error al cargar los gastos');
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async () => {
    if (!newExpense.monto || !newExpense.descripcion) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    try {
      const response = await fetch('/api/gastos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          monto: parseFloat(newExpense.monto),
          descripcion: newExpense.descripcion,
          fecha: newExpense.fecha,
          factura: newExpense.factura,
          metodo_pago: newExpense.metodo_pago
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear el gasto');
      }
      
      const createdExpense = await response.json();
      setExpenses([...expenses, createdExpense]);
      setNewExpense({
        monto: '',
        descripcion: '',
        fecha: new Date().toISOString().split('T')[0],
        factura: false,
        metodo_pago: 'Efectivo'
      });
      toast.success('Gasto creado exitosamente');
    } catch (error: any) {
      console.error('Error creating expense:', error);
      toast.error(error.message || 'Error al crear el gasto');
    }
  };

  const deleteExpense = async (id: number) => {
    try {
      const response = await fetch(`/api/gastos/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar el gasto');
      }

      setExpenses(expenses.filter(expense => expense.id !== id));
      toast.success('Gasto eliminado correctamente');
    } catch (error: any) {
      console.error('Error deleting expense:', error);
      toast.error(error.message || 'Error al eliminar el gasto');
    }
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
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 shadow-2xl max-w-2xl w-full">
          <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight mb-6 text-center">
            Gestión de Gastos
          </h1>

          <div className="mb-8">
            <div className="flex flex-col gap-4 mb-4">
              <input
                type="number"
                placeholder="Monto"
                value={newExpense.monto}
                onChange={(e) => setNewExpense({ ...newExpense, monto: e.target.value })}
                className="p-3 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/20 focus:outline-none focus:border-white/40"
              />
              <input
                type="text"
                placeholder="Descripción"
                value={newExpense.descripcion}
                onChange={(e) => setNewExpense({ ...newExpense, descripcion: e.target.value })}
                className="p-3 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/20 focus:outline-none focus:border-white/40"
              />
              <select
                value={newExpense.metodo_pago}
                onChange={(e) => setNewExpense({ ...newExpense, metodo_pago: e.target.value })}
                className="p-3 rounded-lg bg-white/20 text-white border border-white/20 focus:outline-none focus:border-white/40 appearance-none cursor-pointer"
              >
                <option value="Efectivo" className="bg-gray-800 text-white">Efectivo</option>
                <option value="Tarjeta de Crédito" className="bg-gray-800 text-white">Tarjeta de Crédito</option>
                <option value="Tarjeta de Débito" className="bg-gray-800 text-white">Tarjeta de Débito</option>
                <option value="Transferencia" className="bg-gray-800 text-white">Transferencia</option>
              </select>
              <input
                type="date"
                value={newExpense.fecha}
                onChange={(e) => setNewExpense({ ...newExpense, fecha: e.target.value })}
                className="p-3 rounded-lg bg-white/20 text-white border border-white/20 focus:outline-none focus:border-white/40"
              />
              <div className="flex items-center gap-2 text-white">
                <input
                  type="checkbox"
                  id="factura"
                  checked={newExpense.factura}
                  onChange={(e) => setNewExpense({ ...newExpense, factura: e.target.checked })}
                  className="w-4 h-4 rounded border-white/20 focus:ring-white/40"
                />
                <label htmlFor="factura">Requiere factura</label>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddExpense}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors shadow-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Agregar Gasto
              </motion.button>
            </div>
          </div>

          {loading ? (
            <div className="text-center text-white">Cargando gastos...</div>
          ) : (
            <div className="space-y-4">
              {expenses.map((expense) => (
                <motion.div
                  key={expense.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white/10 backdrop-blur-sm p-4 rounded-lg flex justify-between items-center"
                >
                  <div>
                    <p className="text-white font-medium">{expense.descripcion}</p>
                    <p className="text-red-400">${Number(expense.monto).toFixed(2)}</p>
                    <p className="text-white/60 text-sm">{new Date(expense.fecha).toLocaleDateString()}</p>
                    <p className="text-white/80 text-sm">{expense.metodo_pago}</p>
                    {expense.factura && (
                      <p className="text-white/60 text-sm">Requiere factura</p>
                    )}
                    {expense.categoria && (
                      <p className="text-white/60 text-sm">Categoría: {expense.categoria.nombre}</p>
                    )}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => deleteExpense(expense.id)}
                    className="p-2 text-red-400 hover:text-red-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </motion.button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
