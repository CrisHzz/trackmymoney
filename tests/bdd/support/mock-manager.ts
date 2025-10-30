import { MockUser } from './world';
export class MockManager {
  private world: any;
  constructor(world: any) {
    this.world = world;
  }
  public setupAuthenticatedUser(userData?: MockUser): void {
  }
  public setupUnauthenticatedUser(): void {
  }
  public resetAllMocks(): void {
  }
  public configurePrismaMocks(config: any): void {
  }
  public setupExistingCategories(categorias: any[]): void {
  }
  public setupExistingGastos(gastos: any[]): void {
  }
  public setupExistingIngresos(ingresos: any[]): void {
  }
}
