import { Ability, Actor, UsesAbilities } from '@serenity-js/core';
export interface APIResponse {
  status: number;
  data: any;
  error?: string;
}
export class ManageTrackMyMoneyData implements Ability {
  private currentUser: any = null;
  private lastResponse: APIResponse | null = null;
  private testData: any = {
    gastos: [],
    ingresos: [],
    categorias: []
  };
  static usingMockAPI(): ManageTrackMyMoneyData {
    return new ManageTrackMyMoneyData();
  }
  authenticateUser(userData?: any): void {
    this.currentUser = {
      id: 'serenity_actor_123',
      email: 'actor@trackmymoney.com',
      firstName: 'Serenity Actor',
      ...userData
    };
  }
  unauthenticateUser(): void {
    this.currentUser = null;
  }
  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }
  async createGasto(monto: string, categoria: string): Promise<APIResponse> {
    if (!this.isAuthenticated()) {
      this.lastResponse = { status: 401, data: null, error: 'No autenticado' };
      return this.lastResponse;
    }
    const gasto = { id: Date.now(), monto, categoria, fecha: new Date().toISOString() };
    this.testData.gastos.push(gasto);
    this.lastResponse = { status: 200, data: gasto };
    return this.lastResponse;
  }
  async getGastos(): Promise<APIResponse> {
    if (!this.isAuthenticated()) {
      this.lastResponse = { status: 401, data: null, error: 'No autenticado' };
      return this.lastResponse;
    }
    this.lastResponse = { status: 200, data: this.testData.gastos };
    return this.lastResponse;
  }
  async createIngreso(monto: string, tipo: string): Promise<APIResponse> {
    if (!this.isAuthenticated()) {
      this.lastResponse = { status: 401, data: null, error: 'No autenticado' };
      return this.lastResponse;
    }
    const ingreso = { id: Date.now(), monto, tipo, fecha: new Date().toISOString() };
    this.testData.ingresos.push(ingreso);
    this.lastResponse = { status: 200, data: ingreso };
    return this.lastResponse;
  }
  async getIngresos(): Promise<APIResponse> {
    if (!this.isAuthenticated()) {
      this.lastResponse = { status: 401, data: null, error: 'No autenticado' };
      return this.lastResponse;
    }
    this.lastResponse = { status: 200, data: this.testData.ingresos };
    return this.lastResponse;
  }
  async createCategoria(nombre: string): Promise<APIResponse> {
    if (!this.isAuthenticated()) {
      this.lastResponse = { status: 401, data: null, error: 'No autenticado' };
      return this.lastResponse;
    }
    const categoria = { id: Date.now(), nombre };
    this.testData.categorias.push(categoria);
    this.lastResponse = { status: 200, data: categoria };
    return this.lastResponse;
  }
  async getCategorias(): Promise<APIResponse> {
    if (!this.isAuthenticated()) {
      this.lastResponse = { status: 401, data: null, error: 'No autenticado' };
      return this.lastResponse;
    }
    this.lastResponse = { status: 200, data: this.testData.categorias };
    return this.lastResponse;
  }
  getLastResponse(): APIResponse | null {
    return this.lastResponse;
  }
  wasLastRequestSuccessful(): boolean {
    return this.lastResponse?.status === 200;
  }
  getCurrentUser(): any {
    return this.currentUser;
  }
  getTestData(): any {
    return this.testData;
  }
  reset(): void {
    this.currentUser = null;
    this.lastResponse = null;
    this.testData = {
      gastos: [],
      ingresos: [],
      categorias: []
    };
  }
}
export const ManageTrackMyMoneyDataAbility = {
  as: (actor: Actor & UsesAbilities): ManageTrackMyMoneyData => 
    actor.abilityTo(ManageTrackMyMoneyData)
};
