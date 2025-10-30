/**
 * Simple BDD World para pruebas básicas
 */

import { setWorldConstructor } from '@cucumber/cucumber';

export interface APIResponse {
  status: number;
  data: any;
  error?: string;
  details?: string;
}

export class SimpleBDDWorld {
  public testData: any = {};
  public lastResponse: APIResponse | null = null;
  public currentUser: any = null;
  
  constructor() {
    console.log('Simple BDD World inicializado');
  }
  
  public log(message: string, data?: any): void {
    console.log(`[BDD] ${message}`, data ? JSON.stringify(data, null, 2) : '');
  }
  
  public reset(): void {
    this.testData = {};
    this.lastResponse = null;
    this.currentUser = null;
  }
  
  public setAuthenticatedUser(): void {
    this.currentUser = {
      id: 'test-user-123',
      email: 'test@example.com',
      name: 'Test User'
    };
  }
  
  public setUnauthenticatedUser(): void {
    this.currentUser = null;
  }
}

setWorldConstructor(SimpleBDDWorld);