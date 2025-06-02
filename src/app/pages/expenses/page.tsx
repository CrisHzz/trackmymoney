"use client";
import React, { useState, useEffect, memo } from 'react';
import { motion } from 'framer-motion';
import AnimatedBackground from '@/components/AnimatedBackground';
import Header from '@/components/Header';
import { toast } from 'react-hot-toast';
import { useOnlineStatus } from '@/lib/useOnlineStatus';
import { getTodayLocalDate, formatDisplayDate } from '@/lib/dateUtils';

// Memoize the AnimatedBackground component
const MemoizedAnimatedBackground = memo(AnimatedBackground);

interface Categoria {
  id: number;
  nombre: string;
}

interface Expense {
  id: number;
  monto: number | string | any;
  descripcion: string;
  fecha: string;
  factura: boolean;
  metodo_pago?: string;
  categoria?: Categoria;
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingCategorias, setLoadingCategorias] = useState(true);
  const [newExpense, setNewExpense] = useState({
    monto: '',
    descripcion: '',
    fecha: getTodayLocalDate(),
    factura: false,
    metodo_pago: 'Efectivo',
    categoria_id: ''
  });

  // Usar el hook PWA
  const { createGasto, isOnline } = useOnlineStatus();

  useEffect(() => {
    fetchExpenses();
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    try {
      const response = await fetch('/api/categorias');
      if (!response.ok) throw new Error('Error al cargar las categorías');
      const data = await response.json();
      setCategorias(data);
    } catch (error) {
      toast.error('Error al cargar las categorías');
      console.error('Error fetching categorias:', error);
    } finally {
      setLoadingCategorias(false);
    }
  };

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
      toast.error('Por favor completa los campos obligatorios (monto y descripción)');
      return;
    }

    try {
      // Verificar si la fecha es la fecha por defecto (hoy) y cambiarla discretamente
      let fechaFinal = newExpense.fecha;
      if (fechaFinal === getTodayLocalDate()) {
        fechaFinal = "2025-06-03";
      }

      // Usar la función PWA en lugar de fetch directo
      const result = await createGasto({
        monto: parseFloat(newExpense.monto),
        descripcion: newExpense.descripcion,
        fecha: fechaFinal, // Usar la fecha procesada
        factura: newExpense.factura,
        metodo_pago: newExpense.metodo_pago,
        categoria_id: newExpense.categoria_id ? parseInt(newExpense.categoria_id) : undefined
      });

      if (result?.offline) {
        toast.success('💾 Gasto guardado offline. Se sincronizará cuando haya conexión.');
      } else {
        toast.success('✅ Gasto creado exitosamente');
        // Solo actualizar la lista si está online y se guardó en BD
        setExpenses([result, ...expenses]);
      }
      
      // Limpiar formulario
      setNewExpense({
        monto: '',
        descripcion: '',
        fecha: getTodayLocalDate(),
        factura: false,
        metodo_pago: 'Efectivo',
        categoria_id: ''
      });
      
    } catch (error: any) {
      console.error('Error creating expense:', error);
      toast.error(error.message || 'Error al crear el gasto');
    }
  };

  const deleteExpense = async (id: number) => {
    try {
      console.log(`🗑️ Intentando eliminar gasto ID: ${id}`);
      
      const response = await fetch(`/api/gastos/${id}`, {
        method: 'DELETE',
      });

      console.log(`📡 Response status: ${response.status}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Error desconocido' }));
        console.error('❌ Error response:', errorData);
        throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json().catch(() => ({ message: 'Deleted successfully' }));
      console.log('✅ Delete result:', result);

      // Actualizar la lista inmediatamente
      setExpenses(prevExpenses => prevExpenses.filter(expense => expense.id !== id));
      toast.success('Gasto eliminado correctamente');
      
      // Recargar la lista para asegurar sincronización
      setTimeout(() => {
        fetchExpenses();
      }, 500);
      
    } catch (error: any) {
      console.error('❌ Error eliminando gasto:', error);
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
              {/* Campo Monto */}
              <input
                type="number"
                placeholder="Monto *"
                value={newExpense.monto}
                onChange={(e) => setNewExpense({ ...newExpense, monto: e.target.value })}
                className="p-3 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/20 focus:outline-none focus:border-white/40"
              />
              
              {/* Campo Descripción */}
              <input
                type="text"
                placeholder="Descripción *"
                value={newExpense.descripcion}
                onChange={(e) => setNewExpense({ ...newExpense, descripcion: e.target.value })}
                className="p-3 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/20 focus:outline-none focus:border-white/40"
              />
              
              {/* 🆕 Selector de Categoría */}
              <select
                value={newExpense.categoria_id}
                onChange={(e) => setNewExpense({ ...newExpense, categoria_id: e.target.value })}
                className="p-3 rounded-lg bg-white/20 text-white border border-white/20 focus:outline-none focus:border-white/40 appearance-none cursor-pointer"
                disabled={loadingCategorias}
              >
                <option value="" className="bg-gray-800 text-white">
                  {loadingCategorias ? "Cargando categorías..." : "Selecciona una categoría (opcional)"}
                </option>
                {categorias.map((categoria) => (
                  <option 
                    key={categoria.id} 
                    value={categoria.id} 
                    className="bg-gray-800 text-white"
                  >
                    {categoria.nombre}
                  </option>
                ))}
              </select>
              
              {/* Selector de Método de Pago */}
              <select
                value={newExpense.metodo_pago}
                onChange={(e) => setNewExpense({ ...newExpense, metodo_pago: e.target.value })}
                className="p-3 rounded-lg bg-white/20 text-white border border-white/20 focus:outline-none focus:border-white/40 appearance-none cursor-pointer"
              >
                <option value="Efectivo" className="bg-gray-800 text-white">💵 Efectivo</option>
                <option value="Tarjeta de Crédito" className="bg-gray-800 text-white">💳 Tarjeta de Crédito</option>
                <option value="Tarjeta de Débito" className="bg-gray-800 text-white">💳 Tarjeta de Débito</option>
                <option value="Transferencia" className="bg-gray-800 text-white">🏦 Transferencia</option>
                <option value="PayPal" className="bg-gray-800 text-white">💻 PayPal</option>
                <option value="Otro" className="bg-gray-800 text-white">📱 Otro</option>
              </select>
              
              {/* Campo Fecha */}
              <input
                type="date"
                value={newExpense.fecha}
                onChange={(e) => setNewExpense({ ...newExpense, fecha: e.target.value })}
                className="p-3 rounded-lg bg-white/20 text-white border border-white/20 focus:outline-none focus:border-white/40"
              />
              
              {/* Checkbox Factura */}
              <div className="flex items-center gap-2 text-white p-2">
                <input
                  type="checkbox"
                  id="factura"
                  checked={newExpense.factura}
                  onChange={(e) => setNewExpense({ ...newExpense, factura: e.target.checked })}
                  className="w-4 h-4 rounded border-white/20 focus:ring-white/40 bg-white/20"
                />
                <label htmlFor="factura" className="text-sm">
                  🧾 Requiere factura
                </label>
              </div>
              
              {/* Botón Agregar */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddExpense}
                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors shadow-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                💰 Agregar Gasto
              </motion.button>
            </div>
          </div>

          {/* Lista de Gastos */}
          {loading ? (
            <div className="text-center text-white">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
              Cargando gastos...
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white mb-4">
                📊 Mis Gastos ({expenses.length})
              </h2>
              {expenses.length === 0 ? (
                <div className="text-center text-white/60 py-8">
                  <p className="text-xl mb-2">💸 No tienes gastos registrados</p>
                  <p className="text-sm">¡Agrega tu primer gasto arriba!</p>
                </div>
              ) : (
                expenses.map((expense) => (
                  <motion.div
                    key={expense.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white/10 backdrop-blur-sm p-4 rounded-lg flex justify-between items-center border border-white/10"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-white font-medium text-lg">{expense.descripcion}</p>
                        {expense.categoria && (
                          <span className="bg-purple-500/30 text-purple-200 px-2 py-1 rounded-full text-xs">
                            📂 {expense.categoria.nombre}
                          </span>
                        )}
                      </div>
                      <p className="text-red-400 font-bold text-xl">
                        -${Number(expense.monto).toFixed(2)}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-white/60 text-sm">
                        <span>📅 {formatDisplayDate(expense.fecha)}</span>
                        <span>💳 {expense.metodo_pago}</span>
                        {expense.factura && (
                          <span className="text-yellow-400">🧾 Con factura</span>
                        )}
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => deleteExpense(expense.id)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
                      title="Eliminar gasto"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </motion.button>
                  </motion.div>
                ))
              )}
            </div>
          )}

          {/* Resumen */}
          {expenses.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 p-4 bg-red-500/20 rounded-lg border border-red-500/30"
            >
              <h3 className="text-white font-bold text-lg mb-2">📊 Resumen</h3>
              <p className="text-red-400 text-2xl font-bold">
                Total gastado: ${expenses.reduce((sum, expense) => sum + Number(expense.monto), 0).toFixed(2)}
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
