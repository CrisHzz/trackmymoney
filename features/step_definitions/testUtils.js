// Funciones de utilidad para las pruebas de Cucumber
// Estas son versiones simplificadas de las funciones de dateUtils.ts

export const formatDateForInput = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

export const formatDisplayDate = (dateString) => {
  try {
    let date;
    
    if (dateString.includes('T')) {
      date = new Date(dateString);
    } else if (dateString.includes('-') && dateString.length === 10) {
      const [year, month, day] = dateString.split('-').map(Number);
      date = new Date(year, month - 1, day);
    } else {
      date = new Date(dateString);
    }
    
    if (isNaN(date.getTime())) {
      console.error('Fecha inválida:', dateString);
      return dateString;
    }
    
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formateando fecha:', dateString, error);
    return dateString;
  }
};

export const parseLocalDate = (dateString) => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
};
