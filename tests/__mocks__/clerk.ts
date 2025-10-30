import { jest } from '@jest/globals';
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
export const currentUser = jest.fn<() => Promise<ClerkUser | null>>();
export const mockAuthenticatedUser = () => {
  (currentUser as any).mockResolvedValue(mockClerkUser);
};
export const mockUnauthenticatedUser = () => {
  (currentUser as any).mockResolvedValue(null);
};
export const mockUnverifiedUser = () => {
  (currentUser as any).mockResolvedValue(mockUnverifiedClerkUser);
};
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
