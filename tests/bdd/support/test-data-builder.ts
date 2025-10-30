import { GastoInput, IngresoInput, CategoriaInput } from './api-client';
export class TestDataBuilder {
  public buildValidGasto(overrides?: Partial<GastoInput>): GastoInput {
    const defaultGasto: GastoInput = {
      monto: 150.50,
      fecha: '2024-01-15',
      descripcion: 'Supermercado',
      categoria_id: 1,
      factura: true,
      metodo_pago: 'tarjeta'
    };
    return { ...defaultGasto, ...overrides };
  }
  public buildValidIngreso(overrides?: Partial<IngresoInput>): IngresoInput {
    const defaultIngreso: IngresoInput = {
      monto: 2500.00,
      fecha: '2024-01-01',
      descripcion: 'Salario mensual',
      categoria_id: 1,
      tipo_ingreso: 'Salario',
      recurrente: true,
      frecuencia: 'Mensual'
    };
    return { ...defaultIngreso, ...overrides };
  }
  public buildValidCategoria(overrides?: Partial<CategoriaInput>): CategoriaInput {
    const defaultCategoria: CategoriaInput = {
      nombre: 'Entretenimiento',
      usuario_id: 1
    };
    return { ...defaultCategoria, ...overrides };
  }
  public buildInvalidData(type: 'gasto' | 'ingreso' | 'categoria', errorType: string): any {
    switch (type) {
      case 'gasto':
        return this.buildInvalidGasto(errorType);
      case 'ingreso':
        return this.buildInvalidIngreso(errorType);
      case 'categoria':
        return this.buildInvalidCategoria(errorType);
      default:
        throw new Error(`Tipo de datos no soportado: ${type}`);
    }
  }
  private buildInvalidGasto(errorType: string): Partial<GastoInput> {
    const baseGasto = this.buildValidGasto();
    switch (errorType) {
      case 'sin_monto':
        return { ...baseGasto, monto: undefined as any };
      case 'sin_fecha':
        return { ...baseGasto, fecha: undefined as any };
      case 'monto_negativo':
        return { ...baseGasto, monto: -50.00 };
      case 'monto_cero':
        return { ...baseGasto, monto: 0 };
      case 'fecha_invalida':
        return { ...baseGasto, fecha: 'fecha-invalida' };
      case 'descripcion_muy_larga':
        return { ...baseGasto, descripcion: 'A'.repeat(256) };
      case 'categoria_inexistente':
        return { ...baseGasto, categoria_id: 99999 };
      case 'campos_vacios':
        return {};
      default:
        throw new Error(`Tipo de error no soportado para gasto: ${errorType}`);
    }
  }
  private buildInvalidIngreso(errorType: string): Partial<IngresoInput> {
    const baseIngreso = this.buildValidIngreso();
    switch (errorType) {
      case 'sin_monto':
        return { ...baseIngreso, monto: undefined as any };
      case 'sin_fecha':
        return { ...baseIngreso, fecha: undefined as any };
      case 'sin_tipo_ingreso':
        return { ...baseIngreso, tipo_ingreso: undefined as any };
      case 'monto_negativo':
        return { ...baseIngreso, monto: -1000.00 };
      case 'fecha_fin_anterior':
        return { 
          ...baseIngreso, 
          recurrente: true,
          fecha: '2024-06-01',
          fecha_fin: '2024-01-01'
        };
      case 'frecuencia_sin_recurrente':
        return { 
          ...baseIngreso, 
          recurrente: false,
          frecuencia: 'Mensual'
        };
      case 'campos_vacios':
        return {};
      default:
        throw new Error(`Tipo de error no soportado para ingreso: ${errorType}`);
    }
  }
  private buildInvalidCategoria(errorType: string): Partial<CategoriaInput> {
    const baseCategoria = this.buildValidCategoria();
    switch (errorType) {
      case 'sin_nombre':
        return { ...baseCategoria, nombre: undefined as any };
      case 'nombre_vacio':
        return { ...baseCategoria, nombre: '' };
      case 'nombre_solo_espacios':
        return { ...baseCategoria, nombre: '   ' };
      case 'nombre_muy_largo':
        return { ...baseCategoria, nombre: 'A'.repeat(51) };
      case 'sin_usuario_id':
        return { ...baseCategoria, usuario_id: undefined as any };
      case 'usuario_id_invalido':
        return { ...baseCategoria, usuario_id: -1 };
      case 'campos_vacios':
        return {};
      default:
        throw new Error(`Tipo de error no soportado para categoría: ${errorType}`);
    }
  }
  public buildMultipleGastos(count: number, baseData?: Partial<GastoInput>): GastoInput[] {
    const gastos: GastoInput[] = [];
    for (let i = 0; i < count; i++) {
      gastos.push(this.buildValidGasto({
        ...baseData,
        monto: 100 + (i * 50),
        descripcion: `Gasto ${i + 1}`,
        fecha: `2024-01-${String(i + 1).padStart(2, '0')}`
      }));
    }
    return gastos;
  }
  public buildMultipleIngresos(count: number, baseData?: Partial<IngresoInput>): IngresoInput[] {
    const ingresos: IngresoInput[] = [];
    const tiposIngreso = ['Salario', 'Freelance', 'Inversiones', 'Bonificación'];
    for (let i = 0; i < count; i++) {
      ingresos.push(this.buildValidIngreso({
        ...baseData,
        monto: 1000 + (i * 500),
        descripcion: `Ingreso ${i + 1}`,
        fecha: `2024-01-${String(i + 1).padStart(2, '0')}`,
        tipo_ingreso: tiposIngreso[i % tiposIngreso.length]
      }));
    }
    return ingresos;
  }
  public buildMultipleCategorias(count: number, baseData?: Partial<CategoriaInput>): CategoriaInput[] {
    const categorias: CategoriaInput[] = [];
    const nombres = ['Alimentación', 'Transporte', 'Entretenimiento', 'Salud', 'Educación', 'Hogar'];
    for (let i = 0; i < count; i++) {
      categorias.push(this.buildValidCategoria({
        ...baseData,
        nombre: nombres[i % nombres.length] + (i >= nombres.length ? ` ${Math.floor(i / nombres.length) + 1}` : '')
      }));
    }
    return categorias;
  }
  public buildCompleteFlowData(): {
    categoria: CategoriaInput;
    gasto: GastoInput;
  } {
    const categoria = this.buildValidCategoria({
      nombre: 'Transporte'
    });
    const gasto = this.buildValidGasto({
      monto: 45.00,
      descripcion: 'Taxi al trabajo',
      categoria_id: 1
    });
    return { categoria, gasto };
  }
  public buildMontoTestCases(): {
    valid: GastoInput[];
    invalid: Partial<GastoInput>[];
  } {
    return {
      valid: [
        this.buildValidGasto({ monto: 0.01 }),
        this.buildValidGasto({ monto: 999999.99 }),
        this.buildValidGasto({ monto: 100.50 })
      ],
      invalid: [
        this.buildInvalidGasto('monto_negativo'),
        this.buildInvalidGasto('monto_cero'),
        this.buildInvalidGasto('sin_monto')
      ]
    };
  }
  public buildFechaTestCases(): {
    valid: GastoInput[];
    invalid: Partial<GastoInput>[];
  } {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return {
      valid: [
        this.buildValidGasto({ fecha: yesterday.toISOString().split('T')[0] }),
        this.buildValidGasto({ fecha: today.toISOString().split('T')[0] }),
        this.buildValidGasto({ fecha: tomorrow.toISOString().split('T')[0] })
      ],
      invalid: [
        this.buildInvalidGasto('fecha_invalida'),
        this.buildInvalidGasto('sin_fecha')
      ]
    };
  }
  public buildRecurrentIncomeTestCases(): IngresoInput[] {
    return [
      this.buildValidIngreso({
        tipo_ingreso: 'Salario',
        recurrente: true,
        frecuencia: 'Mensual'
      }),
      this.buildValidIngreso({
        tipo_ingreso: 'Freelance',
        recurrente: true,
        frecuencia: 'Quincenal',
        fecha_fin: '2024-12-31'
      }),
      this.buildValidIngreso({
        tipo_ingreso: 'Bonificación',
        recurrente: false
      })
    ];
  }
}
