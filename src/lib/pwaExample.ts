// Ejemplo de uso de las funciones PWA en componentes de formularios

import { useOnlineStatus } from './useOnlineStatus';
import { getTodayLocalDate, formatDateForInput } from './dateUtils';

// Ejemplo para un formulario de Gastos
export const ExampleGastoForm = () => {
  const { createGasto, isOnline } = useOnlineStatus();

  const handleSubmitGasto = async (formData: any) => {
    try {
      const gastoData = {
        monto: parseFloat(formData.monto),
        fecha: formData.fecha || getTodayLocalDate(), // Usar fecha local por defecto
        descripcion: formData.descripcion,
        categoria_id: formData.categoria_id ? parseInt(formData.categoria_id) : undefined,
        factura: formData.factura || false,
        metodo_pago: formData.metodo_pago
      };

      const result = await createGasto(gastoData);
      
      if (result.offline) {
        // Mostrar mensaje de que se guardó offline
        alert('Gasto guardado offline. Se sincronizará cuando haya conexión.');
      } else {
        // Mostrar mensaje de éxito normal
        alert('Gasto guardado exitosamente.');
      }
      
      // Limpiar formulario o redirigir
      console.log('Gasto creado:', result);
      
    } catch (error) {
      console.error('Error al crear gasto:', error);
      alert('Error al crear el gasto.');
    }
  };

  return {
    handleSubmitGasto,
    isOnline,
    statusMessage: isOnline ? 'Conectado' : 'Modo Offline',
    defaultDate: getTodayLocalDate() // Proporcionar fecha por defecto
  };
};

// Ejemplo para un formulario de Ingresos
export const ExampleIngresoForm = () => {
  const { createIngreso, isOnline } = useOnlineStatus();

  const handleSubmitIngreso = async (formData: any) => {
    try {
      const ingresoData = {
        monto: parseFloat(formData.monto),
        fecha: formData.fecha || getTodayLocalDate(), // Usar fecha local por defecto
        descripcion: formData.descripcion,
        categoria_id: formData.categoria_id ? parseInt(formData.categoria_id) : undefined,
        tipo_ingreso: formData.tipo_ingreso,
        recurrente: formData.recurrente || false,
        frecuencia: formData.frecuencia,
        fecha_fin: formData.fecha_fin
      };

      const result = await createIngreso(ingresoData);
      
      if (result.offline) {
        // Mostrar mensaje de que se guardó offline
        alert('Ingreso guardado offline. Se sincronizará cuando haya conexión.');
      } else {
        // Mostrar mensaje de éxito normal
        alert('Ingreso guardado exitosamente.');
      }
      
      // Limpiar formulario o redirigir
      console.log('Ingreso creado:', result);
      
    } catch (error) {
      console.error('Error al crear ingreso:', error);
      alert('Error al crear el ingreso.');
    }
  };

  return {
    handleSubmitIngreso,
    isOnline,
    statusMessage: isOnline ? 'Conectado' : 'Modo Offline',
    defaultDate: getTodayLocalDate() 
  };
};

