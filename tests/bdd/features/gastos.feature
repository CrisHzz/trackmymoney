# language: es
Característica: Gestión de Gastos
  Como usuario autenticado
  Quiero gestionar mis gastos
  Para llevar control de mis finanzas personales

  Antecedentes:
    Dado que soy un usuario autenticado

  Escenario: Crear un gasto básico exitosamente
    Cuando creo un gasto con monto "150.50" y descripción "Supermercado"
    Entonces el gasto debe guardarse correctamente
    Y debe aparecer en mi lista de gastos

  Escenario: Crear gasto con todos los campos opcionales
    Cuando creo un gasto con los siguientes datos:
      | monto       | 75.25    |
      | fecha       | 2024-01-15 |
      | descripcion | Gasolina   |
      | factura     | true       |
      | metodo_pago | tarjeta    |
    Entonces el gasto debe guardarse correctamente
    Y debe contener todos los campos especificados

  Escenario: Validar campos obligatorios - monto faltante
    Cuando intento crear un gasto sin monto
    Entonces debo recibir un error de validación
    Y el mensaje debe indicar "Monto y fecha son requeridos"
    Y el gasto no debe guardarse

  Escenario: Validar campos obligatorios - fecha faltante
    Cuando intento crear un gasto sin fecha
    Entonces debo recibir un error de validación
    Y el mensaje debe indicar "Monto y fecha son requeridos"
    Y el gasto no debe guardarse

  Escenario: Validar monto negativo
    Cuando intento crear un gasto con monto "-50.00"
    Entonces el gasto debe guardarse correctamente
    Y el monto debe ser "-50.00"

  Escenario: Crear gasto con categoría válida
    Dado que existe una categoría "Alimentación" con ID "1"
    Cuando creo un gasto con monto "25.50" y categoría ID "1"
    Entonces el gasto debe guardarse correctamente
    Y debe estar asociado con la categoría "Alimentación"

  Escenario: Crear gasto con categoría inexistente
    Cuando intento crear un gasto con monto "25.50" y categoría ID "999"
    Entonces debo recibir un error de validación
    Y el mensaje debe indicar "Categoría no válida"
    Y el gasto no debe guardarse

  Escenario: Listar gastos de usuario autenticado
    Dado que tengo los siguientes gastos registrados:
      | monto | descripcion | fecha      |
      | 100.00| Supermercado| 2024-01-15 |
      | 50.25 | Gasolina    | 2024-01-14 |
      | 25.75 | Café        | 2024-01-13 |
    Cuando consulto mi lista de gastos
    Entonces debo ver 3 gastos
    Y deben estar ordenados por fecha descendente

  Escenario: Listar gastos sin registros
    Dado que no tengo gastos registrados
    Cuando consulto mi lista de gastos
    Entonces debo ver una lista vacía
    Y la respuesta debe ser exitosa

  Escenario: Usuario no autenticado intenta crear gasto
    Dado que no estoy autenticado
    Cuando intento crear un gasto con monto "100.00"
    Entonces debo recibir un error de autenticación
    Y el código de estado debe ser 401
    Y el mensaje debe indicar "Unauthorized"

  Escenario: Usuario no autenticado intenta listar gastos
    Dado que no estoy autenticado
    Cuando intento consultar mi lista de gastos
    Entonces debo recibir un error de autenticación
    Y el código de estado debe ser 401
    Y el mensaje debe indicar "Unauthorized"

  Escenario: Crear gasto con fecha futura
    Cuando creo un gasto con monto "200.00" y fecha "2025-12-31"
    Entonces el gasto debe guardarse correctamente
    Y la fecha debe ser "2025-12-31"

  Escenario: Crear gasto sin descripción
    Cuando creo un gasto con monto "30.00" sin descripción
    Entonces el gasto debe guardarse correctamente
    Y la descripción debe ser nula

  Escenario: Crear múltiples gastos en secuencia
    Cuando creo un gasto con monto "100.00" y descripción "Gasto 1"
    Y creo un gasto con monto "200.00" y descripción "Gasto 2"
    Y creo un gasto con monto "300.00" y descripción "Gasto 3"
    Entonces todos los gastos deben guardarse correctamente
    Y debo tener 3 gastos en mi lista