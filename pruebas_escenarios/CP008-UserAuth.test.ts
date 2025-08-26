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

// Simulación de usuarios válidos
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
    email: 'unverified@test.com',
    password: 'testpass789',
    user: {
      id: 'clerk_789',
      email: 'unverified@test.com',
      emailVerified: false
    }
  }
];

// Contador de intentos fallidos por email
const failedAttempts = new Map<string, number>();

// Función de autenticación simulada
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

  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(credentials.email)) {
    return {
      success: false,
      message: 'Formato de email inválido'
    };
  }

  // Obtener contador de intentos
  const attempts = failedAttempts.get(credentials.email) || 0;
  
  // Verificar si requiere CAPTCHA
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

  // Autenticación exitosa
  failedAttempts.delete(credentials.email);

  return {
    success: true,
    user: validUser.user,
    message: 'Autenticación exitosa',
    sessionToken: `session_${Date.now()}_${validUser.user.id}`
  };
};

// Función para limpiar intentos fallidos
export const clearFailedAttempts = () => {
  failedAttempts.clear();
};

describe('CP008 – UserAuth', () => {
  
  beforeEach(() => {
    clearFailedAttempts();
  });

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
    expect(result.message).toBe('Autenticación exitosa');
    expect(result.sessionToken).toBeDefined();
  });

  test('debe rechazar credenciales incorrectas', () => {
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
    expect(result.user).toBeUndefined();
    expect(result.attemptCount).toBe(1);
  });

  test('debe implementar CAPTCHA después de múltiples intentos fallidos', () => {
    // Arrange
    const credentials: AuthCredentials = {
      email: 'test@example.com',
      password: 'wrongpassword'
    };

    // Act - Realizar 3 intentos fallidos
    authenticateUser(credentials);
    authenticateUser(credentials);
    authenticateUser(credentials);
    
    const cuartoIntento = authenticateUser(credentials);

    // Assert
    expect(cuartoIntento.success).toBe(false);
    expect(cuartoIntento.requiresCaptcha).toBe(true);
    expect(cuartoIntento.message).toContain('CAPTCHA');
  });

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