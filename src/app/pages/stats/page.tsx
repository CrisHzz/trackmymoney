"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AnimatedBackground from '@/components/AnimatedBackground';
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  AreaChart,
  Area
} from 'recharts';

interface Categoria {
  id: number;
  nombre: string;
}

interface Gasto {
  id: number;
  monto: number;
  fecha: string;
  descripcion: string;
  categoria?: Categoria;
  metodo_pago?: string;
}

interface Ingreso {
  id: number;
  monto: number;
  fecha: string;
  descripcion: string;
  categoria?: Categoria;
  tipo_ingreso?: string;
}

interface MonthlyData {
  month: string;
  ingresos: number;
  gastos: number;
  balance: number;
}

export default function StatsPage() {
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [ingresos, setIngresos] = useState<Ingreso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');

  // Colores para los gráficos
  const COLORS = {
    expenses: ['#ef4444', '#f97316', '#eab308', '#84cc16', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'],
    income: ['#10b981', '#059669', '#047857', '#065f46', '#064e3b', '#022c22', '#1f2937', '#374151']
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        setDebugInfo('Iniciando carga de datos...');

        console.log('🔍 Obteniendo gastos...');
        const gastosResponse = await fetch('/api/gastos');
        console.log('📊 Gastos response status:', gastosResponse.status);
        
        if (!gastosResponse.ok) {
          const errorText = await gastosResponse.text();
          console.error('❌ Gastos error response:', errorText);
          throw new Error(`Error fetching gastos: ${gastosResponse.status}`);
        }

        console.log('🔍 Obteniendo ingresos...');
        const ingresosResponse = await fetch('/api/ingresos');
        console.log('📊 Ingresos response status:', ingresosResponse.status);
        
        if (!ingresosResponse.ok) {
          const errorText = await ingresosResponse.text();
          console.error('❌ Ingresos error response:', errorText);
          throw new Error(`Error fetching ingresos: ${ingresosResponse.status}`);
        }

        const gastosData = await gastosResponse.json();
        const ingresosData = await ingresosResponse.json();

        console.log('💰 Gastos data:', gastosData);
        console.log('💵 Ingresos data:', ingresosData);

        setGastos(Array.isArray(gastosData) ? gastosData : []);
        setIngresos(Array.isArray(ingresosData) ? ingresosData : []);
        setDebugInfo('Datos cargados correctamente');
      } catch (error: any) {
        console.error('❌ Error fetching data:', error);
        setError(`Error al cargar los datos: ${error.message}`);
        setDebugInfo(`Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Procesar datos para gráficos de gastos por categoría
  const gastosData = React.useMemo(() => {
    if (!Array.isArray(gastos) || gastos.length === 0) return [];
    
    const categoryTotals = gastos.reduce((acc, gasto) => {
      const category = gasto.categoria?.nombre || 'Sin categoría';
      acc[category] = (acc[category] || 0) + Number(gasto.monto);
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value: Number(value.toFixed(2))
    }));
  }, [gastos]);

  // Procesar datos para gráficos de ingresos por categoría
  const ingresosData = React.useMemo(() => {
    if (!Array.isArray(ingresos) || ingresos.length === 0) return [];
    
    const categoryTotals = ingresos.reduce((acc, ingreso) => {
      const category = ingreso.categoria?.nombre || ingreso.tipo_ingreso || 'Sin categoría';
      acc[category] = (acc[category] || 0) + Number(ingreso.monto);
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value: Number(value.toFixed(2))
    }));
  }, [ingresos]);

  // Datos mensuales para gráfico de líneas
  const monthlyData = React.useMemo(() => {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const currentYear = new Date().getFullYear();
    const data: MonthlyData[] = [];

    months.forEach((month, index) => {
      const monthGastos = Array.isArray(gastos) ? gastos
        .filter(g => {
          const fecha = new Date(g.fecha);
          return fecha.getMonth() === index && fecha.getFullYear() === currentYear;
        })
        .reduce((sum, g) => sum + Number(g.monto), 0) : 0;
      
      const monthIngresos = Array.isArray(ingresos) ? ingresos
        .filter(i => {
          const fecha = new Date(i.fecha);
          return fecha.getMonth() === index && fecha.getFullYear() === currentYear;
        })
        .reduce((sum, i) => sum + Number(i.monto), 0) : 0;

      data.push({
        month,
        ingresos: Number(monthIngresos.toFixed(2)),
        gastos: Number(monthGastos.toFixed(2)),
        balance: Number((monthIngresos - monthGastos).toFixed(2))
      });
    });

    return data;
  }, [gastos, ingresos]);

  // Calcular totales
  const totalGastos = Array.isArray(gastos) ? gastos.reduce((sum, gasto) => sum + Number(gasto.monto), 0) : 0;
  const totalIngresos = Array.isArray(ingresos) ? ingresos.reduce((sum, ingreso) => sum + Number(ingreso.monto), 0) : 0;
  const balance = totalIngresos - totalGastos;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 backdrop-blur-md p-3 rounded-lg border border-white/20 shadow-lg">
          <p className="text-gray-800 font-medium">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="font-medium">
              {`${entry.name}: $${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-violet-800 to-emerald-500 flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-2xl mb-4">Cargando estadísticas...</div>
          <div className="text-white/60 text-sm">{debugInfo}</div>
        </div>
      </div>
    );
  }

  if (error) {
  return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-violet-800 to-emerald-500 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-lg max-w-lg text-center">
          <div className="text-red-400 text-2xl mb-4">Error</div>
          <div className="text-white mb-4">{error}</div>
          <div className="text-white/60 text-sm mb-4">{debugInfo}</div>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-violet-800 to-emerald-500 p-4 md:p-8 relative">
      <AnimatedBackground numberOfElements={8} />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight mb-4">
            Estadísticas
          </h1>
          <p className="text-xl text-white/80">
            Análisis detallado de tus finanzas personales
          </p>
          {/* Debug info en desarrollo */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-2 text-white/50 text-sm">
              Debug: {debugInfo} | Gastos: {gastos.length} | Ingresos: {ingresos.length}
            </div>
          )}
        </div>

        {/* Resumen de totales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-lg text-center"
          >
            <div className="text-emerald-400 text-3xl font-bold">
              ${totalIngresos.toFixed(2)}
            </div>
            <div className="text-white/80 text-lg">Total Ingresos</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-lg text-center"
          >
            <div className="text-red-400 text-3xl font-bold">
              ${totalGastos.toFixed(2)}
            </div>
            <div className="text-white/80 text-lg">Total Gastos</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-lg text-center"
          >
            <div className={`text-3xl font-bold ${balance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              ${balance.toFixed(2)}
            </div>
            <div className="text-white/80 text-lg">Balance</div>
          </motion.div>
        </div>

        {/* Gráficos principales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Gráfico de torta - Gastos */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-lg"
          >
            <h3 className="text-2xl font-bold text-white mb-4 text-center">
              Gastos por Categoría
            </h3>
            {gastosData.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={gastosData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {gastosData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS.expenses[index % COLORS.expenses.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[350px] text-white/60 text-center">
                <div>
                  <div className="text-xl mb-2">No hay datos de gastos</div>
                  <div className="text-sm">Agrega algunos gastos para ver el gráfico</div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Gráfico de torta - Ingresos */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-lg"
          >
            <h3 className="text-2xl font-bold text-white mb-4 text-center">
              Ingresos por Categoría
            </h3>
            {ingresosData.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={ingresosData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {ingresosData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS.income[index % COLORS.income.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[350px] text-white/60 text-center">
                <div>
                  <div className="text-xl mb-2">No hay datos de ingresos</div>
                  <div className="text-sm">Agrega algunos ingresos para ver el gráfico</div>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Gráfico de barras comparativo */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-lg mb-8"
        >
          <h3 className="text-2xl font-bold text-white mb-4 text-center">
            Comparación Mensual de Ingresos vs Gastos
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="month" 
                tick={{ fill: 'white' }}
                axisLine={{ stroke: 'rgba(255,255,255,0.3)' }}
              />
              <YAxis 
                tick={{ fill: 'white' }}
                axisLine={{ stroke: 'rgba(255,255,255,0.3)' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                dataKey="ingresos" 
                fill="#10b981" 
                name="Ingresos"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="gastos" 
                fill="#ef4444" 
                name="Gastos"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Gráfico de área - Balance mensual */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-lg"
        >
          <h3 className="text-2xl font-bold text-white mb-4 text-center">
            Evolución del Balance Mensual
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="month" 
                tick={{ fill: 'white' }}
                axisLine={{ stroke: 'rgba(255,255,255,0.3)' }}
              />
              <YAxis 
                tick={{ fill: 'white' }}
                axisLine={{ stroke: 'rgba(255,255,255,0.3)' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="balance"
                stroke="#8b5cf6"
                fill="url(#colorBalance)"
                strokeWidth={3}
              />
              <defs>
                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </motion.div>
    </div>
  );
}