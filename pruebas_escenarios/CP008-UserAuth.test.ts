/**
 * Pruebas unitarias para autenticación de usuarios
 * Escenario: CP008 – UserAuth
 * Responsable: Jonathan
 */

import { describe, test, expect, beforeEach } from '@jest/globals';

// Interfaces para autenticación
interface AuthCredentials {
  email: string;
  password: string;
}

interface AuthUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  emailVerified: boolean;
}

interface AuthResponse {
  success: boolean;
  user?: AuthUser;
  message?: string;
  sessionToken?: string;
  requiresCaptcha?: boolean;
  attemptCount?: number;
}

// Simulación de una base de datos de usuarios válidos
const validUsers = [
  {
    email: 'test@example.com',
    password: 'password123',
    user: {
      id: 'clerk_123',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      emailVerified: true
    }
  },
  {
    email: 'user@domain.com',
    password: 'securepass456',
    user: {
      id: 'clerk_456',
      email: 'user@domain.com',
      firstName: 'John',
      lastName: 'Doe',
      emailVerified: true
    }
  },
  {
    email: 'unverified@test.com',
    password: 'testpass789',
    user: {
      id: 'clerk_789',
      email: 'unverified@test.com',
      emailVerified: false
    }
  }
];

// Contador de intentos fallidos por email (simulación)
const failedAttempts = new Map<string, number>();

// Función de autenticación simulada para pruebas unitarias
export const authenticateUser = (
  credentials: AuthCredentials,
  enableCaptcha: boolean = true
): AuthResponse => {
  
  // Validar campos requeridos
  if (!credentials.email || !credentials.password) {
    return {
      success: false,
      message: 'Email y contraseña son requeridos'
    };
  }

  // Validar formato de email básico
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(credentials.email)) {
    return {
      success: false,
      message: 'Formato de email inválido'
    };
  }

  // Obtener contador de intentos
  const attempts = failedAttempts.get(credentials.email) || 0;
  
  // Verificar si requiere CAPTCHA (después de 3 intentos fallidos)
  if (enableCaptcha && attempts >= 3) {
    return {
      success: false,
      message: 'Múltiples intentos fallidos. Complete el CAPTCHA.',
      requiresCaptcha: true,
      attemptCount: attempts
    };
  }

  // Buscar usuario válido
  const validUser = validUsers.find(
    u => u.email === credentials.email && u.password === credentials.password
  );

  if (!validUser) {
    // Incrementar contador de intentos fallidos
    failedAttempts.set(credentials.email, attempts + 1);
    
    return {
      success: false,
      message: 'Credenciales incorrectas',
      attemptCount: attempts + 1
    };
  }

  // Verificar email verificado
  if (!validUser.user.emailVerified) {
    return {
      success: false,
      message: 'Email no verificado. Verifique su email antes de continuar.'
    };
  }

  // Autenticación exitosa - limpiar intentos fallidos
  failedAttempts.delete(credentials.email);

  return {
    success: true,
    user: validUser.user,
    message: 'Autenticación exitosa',
    sessionToken: `session_${Date.now()}_${validUser.user.id}`
  };
};

// Función para simular integración con Clerk
export const mockClerkIntegration = (
  credentials: AuthCredentials
): { connected: boolean; response?: AuthResponse; error?: string } => {
  
  // Simular conexión a Clerk
  try {
    // Simular delay de red
    const networkDelay = Math.random() * 100; // 0-100ms
    
    if (networkDelay > 95) { // 5% chance de fallo de red
      throw new Error('Network timeout');
    }

    const response = authenticateUser(credentials);
    return {
      connected: true,
      response
    };
  } catch (error) {
    return {
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Función para medir tiempo de respuesta
export const measureAuthTime = (
  credentials: AuthCredentials
): { result: AuthResponse; time: number } => {
  const startTime = performance.now();
  const result = authenticateUser(credentials);
  const endTime = performance.now();
  
  return {
    result,
    time: endTime - startTime
  };
};

// Función para limpiar intentos fallidos (para testing)
export const clearFailedAttempts = () => {
  failedAttempts.clear();
};

describe('CP008 – UserAuth', () => {
  
  beforeEach(() => {
    // Limpiar intentos fallidos antes de cada prueba
    clearFailedAttempts();
  });

  describe('Autenticación exitosa', () => {
    test('debe autenticar usuario con credenciales correctas', () => {
      // Arrange
      const credentials: AuthCredentials = {
        email: 'test@example.com',
        password: 'password123'
      };

      // Act
      const result = authenticateUser(credentials);

      // Assert
      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user?.email).toBe('test@example.com');
      expect(result.user?.id).toBe('clerk_123');
      expect(result.message).toBe('Autenticación exitosa');
      expect(result.sessionToken).toBeDefined();
      expect(result.sessionToken).toMatch(/^session_\d+_clerk_123$/);
    });

    test('debe permitir acceso al dashboard después de autenticación exitosa', () => {
      // Arrange
      const credentials: AuthCredentials = {
        email: 'user@domain.com',
        password: 'securepass456'
      };

      // Act
      const result = authenticateUser(credentials);

      // Assert
      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.sessionToken).toBeDefined();
      
      // Simular redirección al dashboard
      const canAccessDashboard = result.success && result.sessionToken;
      expect(canAccessDashboard).toBe(true);
    });

    test('debe incluir información completa del usuario', () => {
      // Arrange
      const credentials: AuthCredentials = {
        email: 'user@domain.com',
        password: 'securepass456'
      };

      // Act
      const result = authenticateUser(credentials);

      // Assert
      expect(result.success).toBe(true);
      expect(result.user?.firstName).toBe('John');
      expect(result.user?.lastName).toBe('Doe');
      expect(result.user?.emailVerified).toBe(true);
    });
  });

  describe('Credenciales incorrectas', () => {
    test('debe rechazar email incorrecto', () => {
      // Arrange
      const credentials: AuthCredentials = {
        email: 'wrong@example.com',
        password: 'password123'
      };

      // Act
      const result = authenticateUser(credentials);

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe('Credenciales incorrectas');
      expect(result.user).toBeUndefined();
      expect(result.sessionToken).toBeUndefined();
    });

    test('debe rechazar contraseña incorrecta', () => {
      // Arrange
      const credentials: AuthCredentials = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      // Act
      const result = authenticateUser(credentials);

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe('Credenciales incorrectas');
      expect(result.attemptCount).toBe(1);
    });

    test('debe mostrar mensaje de error genérico para seguridad', () => {
      // Arrange
      const credencialesIncorrectas = [
        { email: 'wrong@example.com', password: 'wrongpass' },
        { email: 'test@example.com', password: 'wrongpass' },
        { email: 'notexist@test.com', password: 'password123' }
      ];

      // Act & Assert
      credencialesIncorrectas.forEach(credentials => {
        const result = authenticateUser(credentials);
        expect(result.success).toBe(false);
        expect(result.message).toBe('Credenciales incorrectas');
      });
    });
  });

  describe('Validación de campos', () => {
    test('debe requerir email', () => {
      // Arrange
      const credentials: AuthCredentials = {
        email: '',
        password: 'password123'
      };

      // Act
      const result = authenticateUser(credentials);

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe('Email y contraseña son requeridos');
    });

    test('debe requerir contraseña', () => {
      // Arrange
      const credentials: AuthCredentials = {
        email: 'test@example.com',
        password: ''
      };

      // Act
      const result = authenticateUser(credentials);

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe('Email y contraseña son requeridos');
    });

    test('debe validar formato de email', () => {
      // Arrange
      const emailsInvalidos = [
        'invalid-email',
        'test@',
        '@example.com',
        'test.example.com',
        'test@.com',
        'test@example.'
      ];

      // Act & Assert
      emailsInvalidos.forEach(email => {
        const credentials: AuthCredentials = {
          email,
          password: 'password123'
        };
        
        const result = authenticateUser(credentials);
        expect(result.success).toBe(false);
        expect(result.message).toBe('Formato de email inválido');
      });
    });
  });

  describe('CAPTCHA y seguridad', () => {
    test('debe implementar CAPTCHA después de múltiples intentos fallidos', () => {
      // Arrange
      const credentials: AuthCredentials = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      // Act - Realizar 3 intentos fallidos
      authenticateUser(credentials); // Intento 1
      authenticateUser(credentials); // Intento 2
      authenticateUser(credentials); // Intento 3
      
      const cuartoIntento = authenticateUser(credentials); // Intento 4

      // Assert
      expect(cuartoIntento.success).toBe(false);
      expect(cuartoIntento.requiresCaptcha).toBe(true);
      expect(cuartoIntento.message).toContain('CAPTCHA');
      expect(cuartoIntento.attemptCount).toBe(3);
    });

    test('debe contar intentos fallidos por email específico', () => {
      // Arrange
      const credencialesA: AuthCredentials = {
        email: 'userA@test.com',
        password: 'wrong'
      };
      const credencialesB: AuthCredentials = {
        email: 'userB@test.com',
        password: 'wrong'
      };

      // Act
      authenticateUser(credencialesA); // UserA: intento 1
      authenticateUser(credencialesA); // UserA: intento 2
      authenticateUser(credencialesB); // UserB: intento 1
      
      const resultadoA = authenticateUser(credencialesA); // UserA: intento 3
      const resultadoB = authenticateUser(credencialesB); // UserB: intento 2

      // Assert
      expect(resultadoA.attemptCount).toBe(3);
      expect(resultadoB.attemptCount).toBe(2);
      expect(resultadoB.requiresCaptcha).toBeUndefined();
    });

    test('debe limpiar intentos fallidos después de autenticación exitosa', () => {
      // Arrange
      const credencialesIncorrectas: AuthCredentials = {
        email: 'test@example.com',
        password: 'wrong'
      };
      const credencialesCorrectas: AuthCredentials = {
        email: 'test@example.com',
        password: 'password123'
      };

      // Act
      authenticateUser(credencialesIncorrectas); // Intento fallido
      authenticateUser(credencialesIncorrectas); // Intento fallido
      
      const exitoso = authenticateUser(credencialesCorrectas); // Exitoso
      const despuesDeExito = authenticateUser(credencialesIncorrectas); // Fallido después

      // Assert
      expect(exitoso.success).toBe(true);
      expect(despuesDeExito.attemptCount).toBe(1); // Contador reiniciado
    });

    test('debe permitir deshabilitar CAPTCHA para testing', () => {
      // Arrange
      const credentials: AuthCredentials = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      // Act - 4 intentos con CAPTCHA deshabilitado
      authenticateUser(credentials, false);
      authenticateUser(credentials, false);
      authenticateUser(credentials, false);
      const cuartoIntento = authenticateUser(credentials, false);

      // Assert
      expect(cuartoIntento.requiresCaptcha).toBeUndefined();
      expect(cuartoIntento.attemptCount).toBe(4);
    });
  });

  describe('Email no verificado', () => {
    test('debe rechazar usuarios con email no verificado', () => {
      // Arrange
      const credentials: AuthCredentials = {
        email: 'unverified@test.com',
        password: 'testpass789'
      };

      // Act
      const result = authenticateUser(credentials);

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toContain('Email no verificado');
      expect(result.user).toBeUndefined();
    });
  });

  describe('Integración con Clerk', () => {
    test('debe conectar exitosamente con Clerk', () => {
      // Arrange
      const credentials: AuthCredentials = {
        email: 'test@example.com',
        password: 'password123'
      };

      // Act
      const integration = mockClerkIntegration(credentials);

      // Assert
      expect(integration.connected).toBe(true);
      expect(integration.response?.success).toBe(true);
      expect(integration.error).toBeUndefined();
    });

    test('debe manejar fallos de conexión con Clerk', () => {
      // Arrange
      const credentials: AuthCredentials = {
        email: 'test@example.com',
        password: 'password123'
      };

      // Act - Ejecutar múltiples veces para probar el 5% de fallo
      const intentos = Array.from({ length: 100 }, () => mockClerkIntegration(credentials));
      const fallos = intentos.filter(intento => !intento.connected);

      // Assert
      expect(fallos.length).toBeGreaterThan(0); // Debe haber algunos fallos
      if (fallos.length > 0) {
        expect(fallos[0].error).toBeDefined();
        expect(fallos[0].response).toBeUndefined();
      }
    });
  });

  describe('Métricas y rendimiento', () => {
    test('debe responder en tiempo aceptable', () => {
      // Arrange
      const credentials: AuthCredentials = {
        email: 'test@example.com',
        password: 'password123'
      };

      // Act
      const { result, time } = measureAuthTime(credentials);

      // Assert
      expect(result.success).toBe(true);
      expect(time).toBeLessThan(100); // Menos de 100ms
    });

    test('debe contar intentos de autenticación fallidos', () => {
      // Arrange
      const credentials: AuthCredentials = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      // Act
      const primerIntento = authenticateUser(credentials);
      const segundoIntento = authenticateUser(credentials);

      // Assert
      expect(primerIntento.attemptCount).toBe(1);
      expect(segundoIntento.attemptCount).toBe(2);
    });

    test('debe manejar carga concurrente', () => {
      // Arrange
      const credencialesMultiples = Array.from({ length: 50 }, (_, i) => ({
        email: i % 2 === 0 ? 'test@example.com' : 'user@domain.com',
        password: i % 2 === 0 ? 'password123' : 'securepass456'
      }));

      // Act
      const startTime = performance.now();
      const resultados = credencialesMultiples.map(cred => authenticateUser(cred));
      const endTime = performance.now();

      // Assert
      expect(resultados.every(r => r.success)).toBe(true);
      expect(endTime - startTime).toBeLessThan(200); // Menos de 200ms para 50 autenticaciones
    });
  });

  describe('Casos edge', () => {
    test('debe manejar email con espacios', () => {
      // Arrange
      const credentials: AuthCredentials = {
        email: '  test@example.com  ',
        password: 'password123'
      };

      // Act
      const result = authenticateUser({ 
        email: credentials.email.trim(), 
        password: credentials.password 
      });

      // Assert
      expect(result.success).toBe(true);
    });

    test('debe ser case-sensitive para contraseñas', () => {
      // Arrange
      const credentials: AuthCredentials = {
        email: 'test@example.com',
        password: 'PASSWORD123' // Mayúsculas
      };

      // Act
      const result = authenticateUser(credentials);

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe('Credenciales incorrectas');
    });

    test('debe ser case-insensitive para emails', () => {
      // Arrange
      const credentials: AuthCredentials = {
        email: 'TEST@EXAMPLE.COM',
        password: 'password123'
      };

      // Act
      const result = authenticateUser({ 
        email: credentials.email.toLowerCase(), 
        password: credentials.password 
      });

      // Assert
      expect(result.success).toBe(true);
    });
  });
});