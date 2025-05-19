"use client";
import React, { useState, useEffect, memo } from 'react';
import { motion } from 'framer-motion';
import AnimatedBackground from '@/components/AnimatedBackground';
import Header from '@/components/Header';
import { toast } from 'react-hot-toast';

// Memoize the AnimatedBackground component
const MemoizedAnimatedBackground = memo(AnimatedBackground);

interface Income {
  id: number;
  monto: number | string | any;
  descripcion: string;
  fecha: string;
  tipo_ingreso: string;
  categoria?: {
    id: number;
    nombre: string;
  };
}

export default function IncomePage() {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [loading, setLoading] = useState(true);
  const [newIncome, setNewIncome] = useState({
    monto: '',
    descripcion: '',
    tipo_ingreso: 'Salario',
    fecha: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchIncomes();
  }, []);

  const fetchIncomes = async () => {
    try {
      const response = await fetch('/api/ingresos');
      if (!response.ok) throw new Error('Error al cargar los ingresos');
      const data = await response.json();
      setIncomes(data);
    } catch (error) {
      toast.error('Error al cargar los ingresos');
      console.error('Error fetching incomes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddIncome = async () => {
    if (!newIncome.monto || !newIncome.descripcion) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    try {
      const response = await fetch('/api/ingresos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          monto: parseFloat(newIncome.monto),
          descripcion: newIncome.descripcion,
          tipo_ingreso: newIncome.tipo_ingreso,
          fecha: newIncome.fecha,
        }),
      });

      if (!response.ok) throw new Error('Error al crear el ingreso');
      
      const createdIncome = await response.json();
      setIncomes([...incomes, createdIncome]);
      setNewIncome({
        monto: '',
        descripcion: '',
        tipo_ingreso: 'Salario',
        fecha: new Date().toISOString().split('T')[0]
      });
      toast.success('Ingreso creado exitosamente');
    } catch (error) {
      toast.error('Error al crear el ingreso');
      console.error('Error creating income:', error);
    }
  };

  const handleDeleteIncome = async (id: number) => {
    try {
      const response = await fetch(`/api/ingresos/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar el ingreso');
      }
      
      setIncomes(incomes.filter(income => income.id !== id));
      toast.success('Ingreso eliminado exitosamente');
    } catch (error: any) {
      console.error('Error deleting income:', error);
      toast.error(error.message || 'Error al eliminar el ingreso');
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
            Gestión de Ingresos
          </h1>

          <div className="mb-8">
            <div className="flex flex-col gap-4 mb-4">
              <input
                type="number"
                placeholder="Monto"
                value={newIncome.monto}
                onChange={(e) => setNewIncome({ ...newIncome, monto: e.target.value })}
                className="p-3 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/20 focus:outline-none focus:border-white/40"
              />
              <input
                type="text"
                placeholder="Descripción"
                value={newIncome.descripcion}
                onChange={(e) => setNewIncome({ ...newIncome, descripcion: e.target.value })}
                className="p-3 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/20 focus:outline-none focus:border-white/40"
              />
              <select
                value={newIncome.tipo_ingreso}
                onChange={(e) => setNewIncome({ ...newIncome, tipo_ingreso: e.target.value })}
                className="p-3 rounded-lg bg-white/20 text-white border border-white/20 focus:outline-none focus:border-white/40 appearance-none cursor-pointer"
              >
                <option value="Salario" className="bg-gray-800 text-white">Salario</option>
                <option value="Freelance" className="bg-gray-800 text-white">Freelance</option>
                <option value="Inversiones" className="bg-gray-800 text-white">Inversiones</option>
                <option value="Otros" className="bg-gray-800 text-white">Otros</option>
              </select>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <input
                type="date"
                value={newIncome.fecha}
                onChange={(e) => setNewIncome({ ...newIncome, fecha: e.target.value })}
                className="p-3 rounded-lg bg-white/20 text-white border border-white/20 focus:outline-none focus:border-white/40"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddIncome}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors shadow-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Agregar Ingreso
              </motion.button>
            </div>
          </div>

          {loading ? (
            <div className="text-center text-white">Cargando ingresos...</div>
          ) : (
            <div className="space-y-4">
              {incomes.map((income) => (
                <motion.div
                  key={income.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white/10 backdrop-blur-sm p-4 rounded-lg flex justify-between items-center"
                >
                  <div>
                    <p className="text-white font-medium">{income.descripcion}</p>
                    <p className="text-emerald-400">${Number(income.monto).toFixed(2)}</p>
                    <p className="text-white/60 text-sm">{new Date(income.fecha).toLocaleDateString()}</p>
                    <p className="text-white/80 text-sm">{income.tipo_ingreso}</p>
                    {income.categoria && (
                      <p className="text-white/60 text-sm">Categoría: {income.categoria.nombre}</p>
                    )}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDeleteIncome(income.id)}
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
