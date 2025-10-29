/**
 * BDD World - Contexto compartido entre steps
 * 
 * Este archivo define el World object que mantiene el estado
 * compartido entre diferentes steps de un escenario BDD.
 * 
 * Principios aplicados:
 * - Estado aislado por escenario (FIRST: Independent)
 * - Cleanup automático entre escenarios
 * - Integración con mocks existentes
 */

import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { APIClient } from './api-client';
import { MockManager } from './mock-manager';
import { TestDataBuilder } from './test-data-builder';

// Interfaces para tipado fuerte
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
  [key: string]: any; // Para propiedades dinámicas
}

/**
 * BDD World Class
 * 
 * Mantiene el estado compartido durante la ejecución de un escenario.
 * Se resetea automáticamente entre escenarios para mantener independencia.
 */
export class BDDWorld extends World {
  // Estado del usuario actual
  public currentUser: MockUser | null = null;
  
  // Última respuesta de API recibida
  public lastResponse: APIResponse | null = null;
  
  // Almacén de datos de prueba
  public testData: TestDataStore = {
    gastos: [],
    ingresos: [],
    categorias: [],
    usuarios: [],
    lastCreatedId: undefined
  };
  
  // Errores de validación capturados
  public errors: ValidationError[] = [];
  
  // Utilidades y clientes
  public apiClient: APIClient;
  public mockManager: MockManager;
  public dataBuilder: TestDataBuilder;
  
  // Configuración del mundo
  public config: {
    apiBaseUrl: string;
    timeout: number;
    retries: number;
  };

  constructor(options: IWorldOptions) {
    super(options);
    
    // Configuración desde parámetros del mundo
    this.config = {
      apiBaseUrl: options.parameters?.apiBaseUrl || 'http://localhost:3000/api',
      timeout: options.parameters?.timeout || 10000,
      retries: options.parameters?.retries || 1
    };
    
    // Inicializar utilidades
    this.apiClient = new APIClient(this);
    this.mockManager = new MockManager(this);
    this.dataBuilder = new TestDataBuilder();
    
    // Log de inicialización
    console.log('🌍 BDD World inicializado para nuevo escenario');
  }
  
  /**
   * Resetea el estado del mundo
   * Llamado automáticamente entre escenarios
   */
  public reset(): void {
    console.log('🔄 Reseteando BDD World...');
    
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
    
    // Resetear mocks
    this.mockManager.resetAllMocks();
  }
  
  /**
   * Configura un usuario autenticado para el escenario
   */
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
    
    // Configurar mocks para este usuario
    this.mockManager.setupAuthenticatedUser(this.currentUser);
    
    console.log('👤 Usuario autenticado configurado:', this.currentUser.email);
  }
  
  /**
   * Configura un usuario no autenticado
   */
  public setUnauthenticatedUser(): void {
    this.currentUser = null;
    this.mockManager.setupUnauthenticatedUser();
    
    console.log('🚫 Usuario no autenticado configurado');
  }
  
  /**
   * Almacena la última respuesta de API
   */
  public setLastResponse(response: APIResponse): void {
    this.lastResponse = response;
    
    // Si hay errores, extraerlos
    if (response.error) {
      this.errors.push({
        field: 'general',
        message: response.error,
        code: response.status.toString()
      });
    }
  }
  
  /**
   * Verifica si el último request fue exitoso
   */
  public wasLastRequestSuccessful(): boolean {
    if (!this.lastResponse) return false;
    return this.lastResponse.status >= 200 && this.lastResponse.status < 300;
  }
  
  /**
   * Obtiene el último error capturado
   */
  public getLastError(): string | undefined {
    return this.lastResponse?.error || this.errors[this.errors.length - 1]?.message;
  }
  
  /**
   * Almacena datos de prueba creados
   */
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
    
    // Almacenar último ID creado si existe
    if (data.id) {
      this.testData.lastCreatedId = data.id;
    }
  }
  
  /**
   * Obtiene datos de prueba por tipo
   */
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
  
  /**
   * Logging helper para debugging
   */
  public logMessage(message: string, data?: any): void {
    console.log(`🧪 [BDD] ${message}`, data ? JSON.stringify(data, null, 2) : '');
  }
  
  // Alias para compatibilidad
  public log = this.logMessage;
}

// Configurar Cucumber para usar nuestro World
setWorldConstructor(BDDWorld);