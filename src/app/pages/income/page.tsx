"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AnimatedBackground from '@/components/AnimatedBackground';
import Header from '@/components/Header';

export default function IncomePage() {
  const [incomes, setIncomes] = useState<Array<{ id: number; amount: number; description: string; date: string }>>([]);
  const [newIncome, setNewIncome] = useState({ amount: '', description: '' });

  const handleAddIncome = () => {
    if (newIncome.amount && newIncome.description) {
      setIncomes([
        ...incomes,
        {
          id: Date.now(),
          amount: parseFloat(newIncome.amount),
          description: newIncome.description,
          date: new Date().toLocaleDateString()
        }
      ]);
      setNewIncome({ amount: '', description: '' });
    }
  };

  const handleDeleteIncome = (id: number) => {
    setIncomes(incomes.filter(income => income.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-violet-800 to-emerald-500 p-4 md:p-8 relative">
      <Header />
      
      <AnimatedBackground numberOfElements={8} />
      
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
                value={newIncome.amount}
                onChange={(e) => setNewIncome({ ...newIncome, amount: e.target.value })}
                className="p-3 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/20 focus:outline-none focus:border-white/40"
              />
              <input
                type="text"
                placeholder="Descripción"
                value={newIncome.description}
                onChange={(e) => setNewIncome({ ...newIncome, description: e.target.value })}
                className="p-3 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/20 focus:outline-none focus:border-white/40"
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

          <div className="space-y-4">
            {incomes.map((income) => (
              <motion.div
                key={income.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/10 backdrop-blur-sm p-4 rounded-lg flex justify-between items-center"
              >
                <div>
                  <p className="text-white font-medium">{income.description}</p>
                  <p className="text-emerald-400">${income.amount.toFixed(2)}</p>
                  <p className="text-white/60 text-sm">{income.date}</p>
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
        </div>
      </motion.div>
    </div>
  );
}
