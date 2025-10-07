/**
 * Mock centralizado para Clerk Authentication
 * Simula usuarios autenticados para pruebas
 * 
 * Principios aplicados:
 * - Test Doubles: Usa stubs para simular autenticación
 * - FIRST: Repeatable - Siempre retorna los mismos datos de prueba
 */

import { jest } from '@jest/globals';

// Tipo para el usuario de Clerk
type ClerkUser = {
  id: string;
  firstName: string;
  lastName: string;
  emailAddresses: Array<{
    id: string;
    emailAddress: string;
    verification: {
      status: string;
    };
  }>;
  primaryEmailAddressId: string;
  username: string;
  imageUrl: string;
  createdAt: number;
  updatedAt: number;
};

// Usuario mock para pruebas
export const mockClerkUser: ClerkUser = {
  id: 'clerk_test_user_123',
  firstName: 'Test',
  lastName: 'User',
  emailAddresses: [
    {
      id: 'email_123',
      emailAddress: 'test@example.com',
      verification: {
        status: 'verified'
      }
    }
  ],
  primaryEmailAddressId: 'email_123',
  username: 'testuser',
  imageUrl: 'https://example.com/avatar.jpg',
  createdAt: new Date('2024-01-01').getTime(),
  updatedAt: new Date('2024-01-01').getTime()
};

// Usuario sin verificar para pruebas
export const mockUnverifiedClerkUser: ClerkUser = {
  ...mockClerkUser,
  id: 'clerk_unverified_user_456',
  emailAddresses: [
    {
      id: 'email_456',
      emailAddress: 'unverified@example.com',
      verification: {
        status: 'unverified'
      }
    }
  ]
};

// Mock de la función currentUser
export const currentUser = jest.fn<() => Promise<ClerkUser | null>>();

// Helper para configurar usuario autenticado en tests
export const mockAuthenticatedUser = () => {
  (currentUser as any).mockResolvedValue(mockClerkUser);
};

// Helper para configurar usuario no autenticado
export const mockUnauthenticatedUser = () => {
  (currentUser as any).mockResolvedValue(null);
};

// Helper para configurar usuario sin verificar
export const mockUnverifiedUser = () => {
  (currentUser as any).mockResolvedValue(mockUnverifiedClerkUser);
};

// Helper para resetear el mock
export const resetClerkMock = () => {
  (currentUser as any).mockReset();
};

export default {
  currentUser,
  mockAuthenticatedUser,
  mockUnauthenticatedUser,
  mockUnverifiedUser,
  resetClerkMock
};

