import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { APIClient } from './api-client';
import { MockManager } from './mock-manager';
import { TestDataBuilder } from './test-data-builder';
export interface MockUser {
  id: string;
  email: string;
  firstName: string;
  clerk_id: string;
  dbUser?: {
    id: number;
    nombre: string;
    email: string;
    moneda_preferida: string;
  };
}
export interface APIResponse {
  status: number;
  data: any;
  error?: string;
  details?: string;
}
export interface ValidationError {
  field: string;
  message: string;
  code: string;
}
export interface TestDataStore {
  gastos: any[];
  ingresos: any[];
  categorias: any[];
  usuarios: MockUser[];
  lastCreatedId?: number;
  basicTestExecuted?: boolean;
  startTime?: number;
  performanceMetrics?: {
    startTime: number;
    operations: any[];
  };
  detailedLogging?: boolean;
  debugMode?: boolean;
  unhandledErrors?: string[];
  [key: string]: any;
}
export class BDDWorld extends World {
  public currentUser: MockUser | null = null;
  public lastResponse: APIResponse | null = null;
  public testData: TestDataStore = {
    gastos: [],
    ingresos: [],
    categorias: [],
    usuarios: [],
    lastCreatedId: undefined
  };
  public errors: ValidationError[] = [];
  public apiClient: APIClient;
  public mockManager: MockManager;
  public dataBuilder: TestDataBuilder;
  public config: {
    apiBaseUrl: string;
    timeout: number;
    retries: number;
  };
  constructor(options: IWorldOptions) {
    super(options);
    this.config = {
      apiBaseUrl: options.parameters?.apiBaseUrl || 'http://localhost:3000/api',
      timeout: options.parameters?.timeout || 10000,
      retries: options.parameters?.retries || 1
    };
    this.apiClient = new APIClient(this);
    this.mockManager = new MockManager(this);
    this.dataBuilder = new TestDataBuilder();
  }
  public reset(): void {
    this.currentUser = null;
    this.lastResponse = null;
    this.errors = [];
    this.testData = {
      gastos: [],
      ingresos: [],
      categorias: [],
      usuarios: [],
      lastCreatedId: undefined
    };
    this.mockManager.resetAllMocks();
  }
  public setAuthenticatedUser(userData?: Partial<MockUser>): void {
    this.currentUser = {
      id: 'clerk_test_123',
      email: 'test@example.com',
      firstName: 'Test User',
      clerk_id: 'clerk_test_123',
      dbUser: {
        id: 1,
        nombre: 'Test User',
        email: 'test@example.com',
        moneda_preferida: 'USD'
      },
      ...userData
    };
    this.mockManager.setupAuthenticatedUser(this.currentUser);
  }
  public setUnauthenticatedUser(): void {
    this.currentUser = null;
    this.mockManager.setupUnauthenticatedUser();
  }
  public setLastResponse(response: APIResponse): void {
    this.lastResponse = response;
    if (response.error) {
      this.errors.push({
        field: 'general',
        message: response.error,
        code: response.status.toString()
      });
    }
  }
  public wasLastRequestSuccessful(): boolean {
    if (!this.lastResponse) return false;
    return this.lastResponse.status >= 200 && this.lastResponse.status < 300;
  }
  public getLastError(): string | undefined {
    return this.lastResponse?.error || this.errors[this.errors.length - 1]?.message;
  }
  public storeTestData(type: 'gasto' | 'ingreso' | 'categoria', data: any): void {
    switch (type) {
      case 'gasto':
        this.testData.gastos.push(data);
        break;
      case 'ingreso':
        this.testData.ingresos.push(data);
        break;
      case 'categoria':
        this.testData.categorias.push(data);
        break;
    }
    if (data.id) {
      this.testData.lastCreatedId = data.id;
    }
  }
  public getTestData(type: 'gasto' | 'ingreso' | 'categoria'): any[] {
    switch (type) {
      case 'gasto':
        return this.testData.gastos;
      case 'ingreso':
        return this.testData.ingresos;
      case 'categoria':
        return this.testData.categorias;
      default:
        return [];
    }
  }
  public logMessage(message: string, data?: any): void {
    console.log(`[BDD] ${message}`, data ? JSON.stringify(data, null, 2) : '');
  }
  public log = this.logMessage;
}
setWorldConstructor(BDDWorld);
