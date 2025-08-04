/**
 * Pruebas unitarias para validaciones de datos y seguridad
 * Enfoque de caja blanca para verificar validaciones internas
 */

// Funciones de validación extraídas de las APIs
export const validarMonto = (monto: any): { valido: boolean; error?: string } => {
  if (!monto && monto !== 0) {
    return { valido: false, error: 'Monto es requerido' };
  }
  
  const montoNum = parseFloat(monto);
  if (isNaN(montoNum)) {
    return { valido: false, error: 'Monto debe ser un número válido' };
  }
  
  if (montoNum < 0) {
    return { valido: false, error: 'Monto no puede ser negativo' };
  }
  
  return { valido: true };
};

export const validarFecha = (fecha: any): { valido: boolean; error?: string } => {
  if (!fecha) {
    return { valido: false, error: 'Fecha es requerida' };
  }
  
  if (typeof fecha !== 'string') {
    return { valido: false, error: 'Fecha debe ser una cadena de texto' };
  }
  
  const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!fechaRegex.test(fecha)) {
    return { valido: false, error: 'Fecha debe tener formato YYYY-MM-DD' };
  }
  
  const fechaDate = new Date(fecha);
  if (isNaN(fechaDate.getTime())) {
    return { valido: false, error: 'Fecha no es válida' };
  }
  
  const fechaActual = new Date();
  fechaActual.setHours(23, 59, 59, 999); // Final del día actual
  
  if (fechaDate > fechaActual) {
    return { valido: false, error: 'Fecha no puede ser futura' };
  }
  
  return { valido: true };
};

export const validarEmail = (email: any): { valido: boolean; error?: string } => {
  if (!email) {
    return { valido: false, error: 'Email es requerido' };
  }
  
  if (typeof email !== 'string') {
    return { valido: false, error: 'Email debe ser una cadena de texto' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valido: false, error: 'Email no tiene formato válido' };
  }
  
  if (email.length > 254) {
    return { valido: false, error: 'Email es demasiado largo' };
  }
  
  return { valido: true };
};

export const validarTipoIngreso = (tipo: any): { valido: boolean; error?: string } => {
  if (!tipo) {
    return { valido: false, error: 'Tipo de ingreso es requerido' };
  }
  
  const tiposValidos = ['Salario', 'Freelance', 'Inversiones', 'Bonificación', 'Otros'];
  
  if (!tiposValidos.includes(tipo)) {
    return { valido: false, error: 'Tipo de ingreso no válido' };
  }
  
  return { valido: true };
};

export const validarCategoria = (categoria_id: any): { valido: boolean; error?: string } => {
  if (!categoria_id) {
    return { valido: true }; // Categoría es opcional
  }
  
  const id = parseInt(categoria_id);
  if (isNaN(id)) {
    return { valido: false, error: 'ID de categoría debe ser un número' };
  }
  
  if (id <= 0) {
    return { valido: false, error: 'ID de categoría debe ser positivo' };
  }
  
  return { valido: true };
};

export const sanitizarTexto = (texto: any, maxLength: number = 255): string => {
  if (!texto) return '';
  
  const textoStr = String(texto);
  
  // Remover caracteres potencialmente peligrosos
  const sanitizado = textoStr
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Scripts
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // iframes
    .replace(/javascript:/gi, '') // URLs javascript
    .replace(/on\w+\s*=/gi, '') // Event handlers
    .trim();
  
  return sanitizado.substring(0, maxLength);
};

export const validarAccesoUsuario = (usuarioSolicitante: number, propietarioRecurso: number): { valido: boolean; error?: string } => {
  if (!usuarioSolicitante || !propietarioRecurso) {
    return { valido: false, error: 'IDs de usuario requeridos' };
  }
  
  if (usuarioSolicitante !== propietarioRecurso) {
    return { valido: false, error: 'Acceso denegado: recurso no pertenece al usuario' };
  }
  
  return { valido: true };
};

describe('Validaciones de Datos - Pruebas de Caja Blanca', () => {
  
  describe('validarMonto', () => {
    // Casos positivos
    test('debe validar montos válidos', () => {
      expect(validarMonto(100.50)).toEqual({ valido: true });
      expect(validarMonto('250.75')).toEqual({ valido: true });
      expect(validarMonto(0)).toEqual({ valido: true });
      expect(validarMonto('0')).toEqual({ valido: true });
    });

    // Casos negativos
    test('debe rechazar montos vacíos o nulos', () => {
      expect(validarMonto(null)).toEqual({ valido: false, error: 'Monto es requerido' });
      expect(validarMonto(undefined)).toEqual({ valido: false, error: 'Monto es requerido' });
      expect(validarMonto('')).toEqual({ valido: false, error: 'Monto es requerido' });
    });

    test('debe rechazar montos no numéricos', () => {
      expect(validarMonto('abc')).toEqual({ valido: false, error: 'Monto debe ser un número válido' });
      expect(validarMonto('12.34.56')).toEqual({ valido: false, error: 'Monto debe ser un número válido' });
      expect(validarMonto({})).toEqual({ valido: false, error: 'Monto debe ser un número válido' });
    });

    test('debe rechazar montos negativos', () => {
      expect(validarMonto(-100)).toEqual({ valido: false, error: 'Monto no puede ser negativo' });
      expect(validarMonto('-50.25')).toEqual({ valido: false, error: 'Monto no puede ser negativo' });
    });

    // Casos límite
    test('debe manejar casos límite', () => {
      expect(validarMonto(Number.MAX_SAFE_INTEGER)).toEqual({ valido: true });
      expect(validarMonto(0.01)).toEqual({ valido: true });
      expect(validarMonto('999999.99')).toEqual({ valido: true });
    });
  });

  describe('validarFecha', () => {
    // Casos positivos
    test('debe validar fechas válidas', () => {
      expect(validarFecha('2024-01-15')).toEqual({ valido: true });
      expect(validarFecha('2023-12-31')).toEqual({ valido: true });
      expect(validarFecha('2020-02-29')).toEqual({ valido: true }); // Año bisiesto
    });

    // Casos negativos
    test('debe rechazar fechas vacías o nulas', () => {
      expect(validarFecha(null)).toEqual({ valido: false, error: 'Fecha es requerida' });
      expect(validarFecha(undefined)).toEqual({ valido: false, error: 'Fecha es requerida' });
      expect(validarFecha('')).toEqual({ valido: false, error: 'Fecha es requerida' });
    });

    test('debe rechazar formatos incorrectos', () => {
      expect(validarFecha('15/01/2024')).toEqual({ valido: false, error: 'Fecha debe tener formato YYYY-MM-DD' });
      expect(validarFecha('2024-1-15')).toEqual({ valido: false, error: 'Fecha debe tener formato YYYY-MM-DD' });
      expect(validarFecha('24-01-15')).toEqual({ valido: false, error: 'Fecha debe tener formato YYYY-MM-DD' });
    });

    test('debe rechazar fechas inválidas', () => {
      expect(validarFecha('2024-02-30')).toEqual({ valido: false, error: 'Fecha no es válida' });
      expect(validarFecha('2024-13-01')).toEqual({ valido: false, error: 'Fecha no es válida' });
      expect(validarFecha('2021-02-29')).toEqual({ valido: false, error: 'Fecha no es válida' }); // No bisiesto
    });

    test('debe rechazar fechas futuras', () => {
      const fechaFutura = new Date();
      fechaFutura.setDate(fechaFutura.getDate() + 1);
      const fechaStr = fechaFutura.toISOString().split('T')[0];
      
      expect(validarFecha(fechaStr)).toEqual({ valido: false, error: 'Fecha no puede ser futura' });
    });

    test('debe aceptar fecha de hoy', () => {
      const hoy = new Date().toISOString().split('T')[0];
      expect(validarFecha(hoy)).toEqual({ valido: true });
    });
  });

  describe('validarEmail', () => {
    // Casos positivos
    test('debe validar emails válidos', () => {
      expect(validarEmail('test@example.com')).toEqual({ valido: true });
      expect(validarEmail('user.name@domain.co.uk')).toEqual({ valido: true });
      expect(validarEmail('test+label@gmail.com')).toEqual({ valido: true });
    });

    // Casos negativos
    test('debe rechazar emails vacíos', () => {
      expect(validarEmail(null)).toEqual({ valido: false, error: 'Email es requerido' });
      expect(validarEmail('')).toEqual({ valido: false, error: 'Email es requerido' });
    });

    test('debe rechazar formatos incorrectos', () => {
      expect(validarEmail('invalid-email')).toEqual({ valido: false, error: 'Email no tiene formato válido' });
      expect(validarEmail('@domain.com')).toEqual({ valido: false, error: 'Email no tiene formato válido' });
      expect(validarEmail('user@')).toEqual({ valido: false, error: 'Email no tiene formato válido' });
      expect(validarEmail('user@domain')).toEqual({ valido: false, error: 'Email no tiene formato válido' });
    });

    test('debe rechazar emails muy largos', () => {
      const emailLargo = 'a'.repeat(250) + '@example.com';
      expect(validarEmail(emailLargo)).toEqual({ valido: false, error: 'Email es demasiado largo' });
    });
  });

  describe('validarTipoIngreso', () => {
    // Casos positivos
    test('debe validar tipos de ingreso válidos', () => {
      const tiposValidos = ['Salario', 'Freelance', 'Inversiones', 'Bonificación', 'Otros'];
      
      tiposValidos.forEach(tipo => {
        expect(validarTipoIngreso(tipo)).toEqual({ valido: true });
      });
    });

    // Casos negativos
    test('debe rechazar tipos vacíos', () => {
      expect(validarTipoIngreso(null)).toEqual({ valido: false, error: 'Tipo de ingreso es requerido' });
      expect(validarTipoIngreso('')).toEqual({ valido: false, error: 'Tipo de ingreso es requerido' });
    });

    test('debe rechazar tipos no válidos', () => {
      expect(validarTipoIngreso('TipoInvalido')).toEqual({ valido: false, error: 'Tipo de ingreso no válido' });
      expect(validarTipoIngreso('salario')).toEqual({ valido: false, error: 'Tipo de ingreso no válido' }); // Case sensitive
      expect(validarTipoIngreso('SALARIO')).toEqual({ valido: false, error: 'Tipo de ingreso no válido' });
    });
  });

  describe('validarCategoria', () => {
    // Casos positivos
    test('debe validar categorías válidas', () => {
      expect(validarCategoria(1)).toEqual({ valido: true });
      expect(validarCategoria('5')).toEqual({ valido: true });
      expect(validarCategoria(999)).toEqual({ valido: true });
    });

    test('debe permitir categoría vacía (opcional)', () => {
      expect(validarCategoria(null)).toEqual({ valido: true });
      expect(validarCategoria(undefined)).toEqual({ valido: true });
      expect(validarCategoria('')).toEqual({ valido: true });
    });

    // Casos negativos
    test('debe rechazar IDs inválidos', () => {
      expect(validarCategoria('abc')).toEqual({ valido: false, error: 'ID de categoría debe ser un número' });
      expect(validarCategoria({})).toEqual({ valido: false, error: 'ID de categoría debe ser un número' });
      expect(validarCategoria('12.5')).toEqual({ valido: false, error: 'ID de categoría debe ser un número' });
    });

    test('debe rechazar IDs no positivos', () => {
      expect(validarCategoria(0)).toEqual({ valido: false, error: 'ID de categoría debe ser positivo' });
      expect(validarCategoria(-1)).toEqual({ valido: false, error: 'ID de categoría debe ser positivo' });
      expect(validarCategoria('-5')).toEqual({ valido: false, error: 'ID de categoría debe ser positivo' });
    });
  });

  describe('sanitizarTexto', () => {
    test('debe remover scripts maliciosos', () => {
      const textoMalicioso = 'Texto normal <script>alert("hack")</script> más texto';
      const resultado = sanitizarTexto(textoMalicioso);
      expect(resultado).toBe('Texto normal  más texto');
      expect(resultado).not.toContain('<script>');
    });

    test('debe remover iframes', () => {
      const textoConIframe = 'Contenido <iframe src="malicious.com"></iframe> seguro';
      const resultado = sanitizarTexto(textoConIframe);
      expect(resultado).toBe('Contenido  seguro');
    });

    test('debe remover URLs javascript', () => {
      const textoConJS = 'Click aquí: javascript:alert("hack")';
      const resultado = sanitizarTexto(textoConJS);
      expect(resultado).toBe('Click aquí: alert("hack")');
    });

    test('debe remover event handlers', () => {
      const textoConEventos = 'Imagen onclick="malicious()" onload="hack()"';
      const resultado = sanitizarTexto(textoConEventos);
      expect(resultado).toBe('Imagen');
    });

    test('debe limitar la longitud del texto', () => {
      const textoLargo = 'A'.repeat(1000);
      const resultado = sanitizarTexto(textoLargo, 10);
      expect(resultado).toHaveLength(10);
      expect(resultado).toBe('AAAAAAAAAA');
    });

    test('debe manejar entrada vacía o null', () => {
      expect(sanitizarTexto(null)).toBe('');
      expect(sanitizarTexto(undefined)).toBe('');
      expect(sanitizarTexto('')).toBe('');
    });

    test('debe convertir tipos no string', () => {
      expect(sanitizarTexto(123)).toBe('123');
      expect(sanitizarTexto(true)).toBe('true');
    });

    test('debe preservar texto normal', () => {
      const textoNormal = 'Este es un texto normal con números 123 y símbolos @#$%';
      const resultado = sanitizarTexto(textoNormal);
      expect(resultado).toBe(textoNormal);
    });
  });

  describe('validarAccesoUsuario', () => {
    test('debe permitir acceso cuando usuario coincide', () => {
      expect(validarAccesoUsuario(123, 123)).toEqual({ valido: true });
      expect(validarAccesoUsuario(456, 456)).toEqual({ valido: true });
    });

    test('debe denegar acceso cuando usuario no coincide', () => {
      expect(validarAccesoUsuario(123, 456)).toEqual({
        valido: false,
        error: 'Acceso denegado: recurso no pertenece al usuario'
      });
    });

    test('debe rechazar IDs faltantes', () => {
      expect(validarAccesoUsuario(null, 123)).toEqual({
        valido: false,
        error: 'IDs de usuario requeridos'
      });
      expect(validarAccesoUsuario(123, null)).toEqual({
        valido: false,
        error: 'IDs de usuario requeridos'
      });
    });

    test('debe rechazar IDs cero', () => {
      expect(validarAccesoUsuario(0, 123)).toEqual({
        valido: false,
        error: 'IDs de usuario requeridos'
      });
    });
  });

  describe('Casos de seguridad específicos', () => {
    test('debe prevenir inyección SQL en descripciones', () => {
      const descripcionMaliciosa = "'; DROP TABLE gastos; --";
      const sanitizada = sanitizarTexto(descripcionMaliciosa);
      expect(sanitizada).toBe("'; DROP TABLE gastos; --"); // SQL injection no es HTML, debe preservarse pero validarse en BD
    });

    test('debe prevenir XSS en nombres de categorías', () => {
      const nombreMalicioso = '<img src="x" onerror="alert(1)">';
      const sanitizado = sanitizarTexto(nombreMalicioso);
      expect(sanitizado).toBe('<img src="x" >');
      expect(sanitizado).not.toContain('onerror');
    });

    test('debe validar longitudes máximas para prevenir DoS', () => {
      const descripcionExtremaLarga = 'A'.repeat(10000);
      const sanitizada = sanitizarTexto(descripcionExtremaLarga, 1000);
      expect(sanitizada).toHaveLength(1000);
    });

    test('debe validar rangos de fechas para prevenir overflow', () => {
      expect(validarFecha('9999-12-31')).toEqual({ valido: false, error: 'Fecha no puede ser futura' });
      expect(validarFecha('0001-01-01')).toEqual({ valido: true }); // Fecha muy antigua pero válida
    });

    test('debe validar montos máximos para prevenir overflow', () => {
      expect(validarMonto(Number.MAX_VALUE)).toEqual({ valido: true });
      expect(validarMonto(Infinity)).toEqual({ valido: false, error: 'Monto debe ser un número válido' });
    });
  });

  describe('Validaciones de integridad de datos', () => {
    test('debe validar consistencia entre fechas de inicio y fin', () => {
      const validarRangoFechas = (inicio: string, fin: string): { valido: boolean; error?: string } => {
        const validacionInicio = validarFecha(inicio);
        const validacionFin = validarFecha(fin);
        
        if (!validacionInicio.valido) return validacionInicio;
        if (!validacionFin.valido) return validacionFin;
        
        if (new Date(inicio) > new Date(fin)) {
          return { valido: false, error: 'Fecha de inicio no puede ser posterior a fecha fin' };
        }
        
        return { valido: true };
      };

      expect(validarRangoFechas('2024-01-01', '2024-12-31')).toEqual({ valido: true });
      expect(validarRangoFechas('2024-12-31', '2024-01-01')).toEqual({
        valido: false,
        error: 'Fecha de inicio no puede ser posterior a fecha fin'
      });
    });

    test('debe validar coherencia de ingresos recurrentes', () => {
      const validarIngresoRecurrente = (recurrente: boolean, frecuencia?: string): { valido: boolean; error?: string } => {
        if (recurrente && !frecuencia) {
          return { valido: false, error: 'Frecuencia requerida para ingresos recurrentes' };
        }
        
        if (!recurrente && frecuencia) {
          return { valido: false, error: 'Frecuencia no debe especificarse para ingresos no recurrentes' };
        }
        
        if (frecuencia && !['Semanal', 'Quincenal', 'Mensual', 'Trimestral', 'Anual'].includes(frecuencia)) {
          return { valido: false, error: 'Frecuencia no válida' };
        }
        
        return { valido: true };
      };

      expect(validarIngresoRecurrente(true, 'Mensual')).toEqual({ valido: true });
      expect(validarIngresoRecurrente(false)).toEqual({ valido: true });
      expect(validarIngresoRecurrente(true)).toEqual({
        valido: false,
        error: 'Frecuencia requerida para ingresos recurrentes'
      });
    });
  });
}); 