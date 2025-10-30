import { Given, When, Then, Before, After } from '@cucumber/cucumber';
import { SimpleBDDWorld } from '../support/simple-world';
Before(function (this: SimpleBDDWorld) {
    this.log('Iniciando escenario');
    this.reset();
});
After(function (this: SimpleBDDWorld) {
    this.log('Finalizando escenario');
});
Given('que soy un usuario autenticado', function (this: SimpleBDDWorld) {
    this.log('Usuario autenticado');
    this.setAuthenticatedUser();
});
Given('que no estoy autenticado', function (this: SimpleBDDWorld) {
    this.log('Usuario no autenticado');
    this.setUnauthenticatedUser();
});
When('registro un gasto de {string} en {string}', function (this: SimpleBDDWorld, monto: string, categoria: string) {
    this.log('Registrando gasto', { monto, categoria });
    if (!this.currentUser) {
        this.lastResponse = {
            status: 401,
            data: null,
            error: 'Unauthorized'
        };
        return;
    }
    const gasto = {
        id: Math.floor(Math.random() * 1000),
        monto: parseFloat(monto),
        categoria,
        fecha: new Date().toISOString(),
        usuario_id: this.currentUser.id
    };
    this.testData.gastos = this.testData.gastos || [];
    this.testData.gastos.push(gasto);
    this.lastResponse = {
        status: 201,
        data: gasto
    };
});
When('consulto mis gastos', function (this: SimpleBDDWorld) {
    this.log('Consultando gastos');
    if (!this.currentUser) {
        this.lastResponse = {
            status: 401,
            data: null,
            error: 'Unauthorized'
        };
        return;
    }
    const gastos = this.testData.gastos || [];
    this.lastResponse = {
        status: 200,
        data: gastos
    };
});
When('registro un ingreso de {string} como {string}', function (this: SimpleBDDWorld, monto: string, tipo: string) {
    this.log('Registrando ingreso', { monto, tipo });
    if (!this.currentUser) {
        this.lastResponse = {
            status: 401,
            data: null,
            error: 'Unauthorized'
        };
        return;
    }
    const ingreso = {
        id: Math.floor(Math.random() * 1000),
        monto: parseFloat(monto),
        tipo,
        fecha: new Date().toISOString(),
        usuario_id: this.currentUser.id
    };
    this.testData.ingresos = this.testData.ingresos || [];
    this.testData.ingresos.push(ingreso);
    this.lastResponse = {
        status: 201,
        data: ingreso
    };
});
When('consulto mis ingresos', function (this: SimpleBDDWorld) {
    this.log('Consultando ingresos');
    if (!this.currentUser) {
        this.lastResponse = {
            status: 401,
            data: null,
            error: 'Unauthorized'
        };
        return;
    }
    const ingresos = this.testData.ingresos || [];
    this.lastResponse = {
        status: 200,
        data: ingresos
    };
});
When('creo una categoría {string}', function (this: SimpleBDDWorld, nombre: string) {
    this.log('Creando categoría', { nombre });
    if (!this.currentUser) {
        this.lastResponse = {
            status: 401,
            data: null,
            error: 'Unauthorized'
        };
        return;
    }
    const categoria = {
        id: Math.floor(Math.random() * 1000),
        nombre,
        usuario_id: this.currentUser.id,
        activa: true
    };
    this.testData.categorias = this.testData.categorias || [];
    this.testData.categorias.push(categoria);
    this.lastResponse = {
        status: 201,
        data: categoria
    };
});
When('consulto mis categorías', function (this: SimpleBDDWorld) {
    this.log('Consultando categorías');
    if (!this.currentUser) {
        this.lastResponse = {
            status: 401,
            data: null,
            error: 'Unauthorized'
        };
        return;
    }
    const categorias = this.testData.categorias || [];
    this.lastResponse = {
        status: 200,
        data: categorias
    };
});
Then('el registro debe ser exitoso', function (this: SimpleBDDWorld) {
    this.log('Verificando éxito');
    if (!this.lastResponse || this.lastResponse.status < 200 || this.lastResponse.status >= 300) {
        throw new Error(`Esperaba éxito pero obtuve: ${this.lastResponse?.status}`);
    }
});
Then('debo recibir un error de autenticación', function (this: SimpleBDDWorld) {
    this.log('Verificando error de autenticación');
    if (!this.lastResponse || this.lastResponse.status !== 401) {
        throw new Error(`Esperaba 401 pero obtuve: ${this.lastResponse?.status}`);
    }
});
Then('debo ver {int} elemento(s)', function (this: SimpleBDDWorld, cantidad: number) {
    this.log('Verificando cantidad', { esperada: cantidad });
    if (!this.lastResponse || !Array.isArray(this.lastResponse.data)) {
        throw new Error('No hay datos de lista en la respuesta');
    }
    if (this.lastResponse.data.length !== cantidad) {
        throw new Error(`Esperaba ${cantidad} elementos pero obtuve ${this.lastResponse.data.length}`);
    }
});
Then('debo ver una lista vacía', function (this: SimpleBDDWorld) {
    this.log('Verificando lista vacía');
    if (!this.lastResponse || !Array.isArray(this.lastResponse.data)) {
        throw new Error('No hay datos de lista en la respuesta');
    }
    if (this.lastResponse.data.length !== 0) {
        throw new Error(`Esperaba lista vacía pero obtuve ${this.lastResponse.data.length} elementos`);
    }
});
Then('el elemento debe tener monto {string}', function (this: SimpleBDDWorld, montoEsperado: string) {
    this.log('Verificando monto', { esperado: montoEsperado });
    if (!this.lastResponse || !this.lastResponse.data) {
        throw new Error('No hay datos en la respuesta');
    }
    const monto = this.lastResponse.data.monto;
    if (monto !== parseFloat(montoEsperado)) {
        throw new Error(`Esperaba monto ${montoEsperado} pero obtuve ${monto}`);
    }
});
Then('el elemento debe tener nombre {string}', function (this: SimpleBDDWorld, nombreEsperado: string) {
    this.log('Verificando nombre', { esperado: nombreEsperado });
    if (!this.lastResponse || !this.lastResponse.data) {
        throw new Error('No hay datos en la respuesta');
    }
    const nombre = this.lastResponse.data.nombre;
    if (nombre !== nombreEsperado) {
        throw new Error(`Esperaba nombre "${nombreEsperado}" pero obtuve "${nombre}"`);
    }
});
