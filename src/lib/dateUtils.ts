// Utilidades para manejo correcto de fechas sin problemas de zona horaria

export const getTodayLocalDate = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

export const formatDateForInput = (date: Date = new Date()): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

export const getCurrentDateTime = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

export const parseLocalDate = (dateString: string): Date => {
  // Asegura que la fecha se interprete en la zona horaria local
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
};

// Nueva función para convertir fecha string a Date para la base de datos
export const stringToDateForDB = (dateString: string): Date => {
  // Esta función evita problemas de zona horaria al crear objetos Date para la BD
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  
  // Asegurar que la fecha se mantenga en el día correcto
  // agregando hora del mediodía para evitar cambios por zona horaria
  date.setHours(12, 0, 0, 0);
  
  return date;
};

export const formatDisplayDate = (dateString: string): string => {
  try {
    // Manejar diferentes formatos de fecha
    let date: Date;
    
    if (dateString.includes('T')) {
      // Es una fecha ISO completa (viene de la BD)
      date = new Date(dateString);
    } else if (dateString.includes('-') && dateString.length === 10) {
      // Es una fecha simple YYYY-MM-DD
      date = parseLocalDate(dateString);
    } else {
      // Fallback para otros formatos
      date = new Date(dateString);
    }
    
    // Verificar si la fecha es válida
    if (isNaN(date.getTime())) {
      console.error('Fecha inválida:', dateString);
      return dateString; // Devolver el string original si no se puede parsear
    }
    
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formateando fecha:', dateString, error);
    return dateString; // Devolver el string original en caso de error
  }
}; 