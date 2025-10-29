# language: es
Característica: Gestión de Ingresos
  Como usuario autenticado
  Quiero registrar mis ingresos
  Para tener un panorama completo de mis finanzas

  Antecedentes:
    Dado que soy un usuario autenticado

  Escenario: Registrar ingreso básico
    Cuando registro un ingreso con monto "2500.00" y tipo "Salario"
    Entonces el ingreso debe guardarse correctamente
    Y debe aparecer en mi lista de ingresos

  Escenario: Registrar ingreso recurrente mensual
    Cuando registro un ingreso de "2500.00" como "Salario" con frecuencia "Mensual"
    Entonces el ingreso debe marcarse como recurrente
    Y la frecuencia debe ser "Mensual"
    Y debe aparecer en mi lista de ingresos

  Escenario: Registrar ingreso recurrente con fecha de fin
    Cuando registro un ingreso con los siguientes datos:
      | monto        | 1500.00    |
      | tipo_ingreso | Freelance  |
      | recurrente   | true       |
      | frecuencia   | Quincenal  |
      | fecha_fin    | 2024-12-31 |
    Entonces el ingreso debe guardarse correctamente
    Y debe ser recurrente hasta "2024-12-31"

  Escenario: Validar campos obligatorios - monto faltante
    Cuando intento registrar un ingreso sin monto
    Entonces debo recibir un error de validación
    Y el mensaje debe indicar "Monto, fecha y tipo de ingreso son requeridos"
    Y el ingreso no debe guardarse

  Escenario: Validar campos obligatorios - fecha faltante
    Cuando intento registrar un ingreso sin fecha
    Entonces debo recibir un error de validación
    Y el mensaje debe indicar "Monto, fecha y tipo de ingreso son requeridos"
    Y el ingreso no debe guardarse

  Escenario: Validar campos obligatorios - tipo de ingreso faltante
    Cuando intento registrar un ingreso sin tipo de ingreso
    Entonces debo recibir un error de validación
    Y el mensaje debe indicar "Monto, fecha y tipo de ingreso son requeridos"
    Y el ingreso no debe guardarse

  Escenario: Registrar ingreso con categoría válida
    Dado que existe una categoría "Trabajo" con ID "1"
    Cuando registro un ingreso con monto "3000.00", tipo "Salario" y categoría ID "1"
    Entonces el ingreso debe guardarse correctamente
    Y debe estar asociado con la categoría "Trabajo"

  Escenario: Registrar ingreso con categoría inexistente
    Cuando intento registrar un ingreso con monto "2000.00", tipo "Salario" y categoría ID "999"
    Entonces debo recibir un error de validación
    Y el mensaje debe indicar "Categoría no válida"
    Y el ingreso no debe guardarse

  Escenario: Listar ingresos de usuario autenticado
    Dado que tengo los siguientes ingresos registrados:
      | monto   | tipo_ingreso | fecha      | recurrente |
      | 2500.00 | Salario      | 2024-01-01 | true       |
      | 800.00  | Freelance    | 2024-01-15 | false      |
      | 200.00  | Inversiones  | 2024-01-20 | false      |
    Cuando consulto mi lista de ingresos
    Entonces debo ver 3 ingresos
    Y deben estar ordenados por fecha descendente

  Escenario: Listar ingresos sin registros
    Dado que no tengo ingresos registrados
    Cuando consulto mi lista de ingresos
    Entonces debo ver una lista vacía
    Y la respuesta debe ser exitosa

  Escenario: Usuario no autenticado intenta registrar ingreso
    Dado que no estoy autenticado
    Cuando intento registrar un ingreso con monto "2500.00" y tipo "Salario"
    Entonces debo recibir un error de autenticación
    Y el código de estado debe ser 401
    Y el mensaje debe indicar "Unauthorized"

  Escenario: Usuario no autenticado intenta listar ingresos
    Dado que no estoy autenticado
    Cuando intento consultar mi lista de ingresos
    Entonces debo recibir un error de autenticación
    Y el código de estado debe ser 401
    Y el mensaje debe indicar "Unauthorized"

  Escenario: Registrar ingreso con monto negativo
    Cuando registro un ingreso con monto "-100.00" y tipo "Ajuste"
    Entonces el ingreso debe guardarse correctamente
    Y el monto debe ser "-100.00"

  Escenario: Registrar ingreso no recurrente sin frecuencia
    Cuando registro un ingreso con monto "500.00", tipo "Bonificación" y recurrente "false"
    Entonces el ingreso debe guardarse correctamente
    Y no debe tener frecuencia definida
    Y no debe ser recurrente

  Escenario: Validar tipos de ingreso comunes
    Cuando registro ingresos con los siguientes tipos:
      | tipo_ingreso |
      | Salario      |
      | Freelance    |
      | Inversiones  |
      | Bonificación |
      | Otros        |
    Entonces todos los ingresos deben guardarse correctamente
    Y debo tener 5 ingresos en mi lista

  Escenario: Registrar ingreso con descripción detallada
    Cuando registro un ingreso con monto "1200.00", tipo "Freelance" y descripción "Proyecto web para cliente ABC"
    Entonces el ingreso debe guardarse correctamente
    Y la descripción debe ser "Proyecto web para cliente ABC"

  Escenario: Registrar múltiples ingresos recurrentes
    Cuando registro un ingreso recurrente de "2500.00" como "Salario" mensual
    Y registro un ingreso recurrente de "800.00" como "Freelance" quincenal
    Y registro un ingreso recurrente de "300.00" como "Inversiones" anual
    Entonces todos los ingresos deben guardarse correctamente
    Y debo tener 3 ingresos recurrentes en mi lista