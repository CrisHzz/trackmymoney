/**
 * MockManager - Versión simplificada para pruebas BDD básicas
 */

import { MockUser } from './world';

/**
 * MockManager Class - Versión simplificada
 */
export class MockManager {
  private world: any;
  
  constructor(world: any) {
    this.world = world;
  }
  
  public setupAuthenticatedUser(userData?: MockUser): void {
    this.world.log('👤 Configurando usuario autenticado (mock)');
    // Mock simplificado para pruebas básicas
  }
  
  public setupUnauthenticatedUser(): void {
    this.world.log('🚫 Configurando usuario no autenticado (mock)');
    // Mock simplificado para pruebas básicas
  }
  
  public resetAllMocks(): void {
    this.world.log('🔄 Reseteando mocks (mock)');
    // Mock simplificado para pruebas básicas
  }
  
  public configurePrismaMocks(config: any): void {
    this.world.log('⚙️ Configurando mocks de Prisma (mock)');
    // Mock simplificado para pruebas básicas
  }
  
  public setupExistingCategories(categorias: any[]): void {
    this.world.log('📝 Configurando categorías existentes (mock):', categorias.length);
    // Mock simplificado para pruebas básicas
  }
  
  public setupExistingGastos(gastos: any[]): void {
    this.world.log('📝 Configurando gastos existentes (mock):', gastos.length);
    // Mock simplificado para pruebas básicas
  }
  
  public setupExistingIngresos(ingresos: any[]): void {
    this.world.log('📝 Configurando ingresos existentes (mock):', ingresos.length);
    // Mock simplificado para pruebas básicas
  }
}