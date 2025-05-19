"use client";
import React from 'react';
import { motion } from 'framer-motion';
import AnimatedBackground from '@/components/AnimatedBackground';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-violet-800 to-emerald-500 p-4 md:p-8 relative">
      <div className="absolute top-0 right-0 p-6 flex items-center gap-4 z-10">

      </div>
      
      <AnimatedBackground numberOfElements={8} />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center justify-center min-h-screen"
      >
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 shadow-2xl max-w-2xl w-full text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-6">
            Dashboard
          </h1>
          <p className="text-xl text-white/80 mb-8">
            Bienvenido a tu panel de control financiero personal
          </p>
          
          <div className="flex flex-col md:flex-row justify-center gap-4 mb-8">
            <Link href="/pages/income">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors shadow-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Ingresar Dinero
              </motion.button>
            </Link>
            
            <Link href="/pages/expenses">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors shadow-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
                Registrar Gasto
              </motion.button>
            </Link>
          </div>
          
          <div className="p-4 bg-white/10 backdrop-blur-sm rounded-lg">
            <p className="text-white">
              Aquí podrás ver un resumen de tus finanzas y gestionar tus gastos e ingresos
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}