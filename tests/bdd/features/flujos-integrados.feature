# language: es
Característica: Flujos Completos de Transacciones
  Como usuario
  Quiero realizar flujos completos de gestión financiera
  Para validar la integración entre todos los módulos del sistema

  Antecedentes:
    Dado que soy un usuario autenticado

  Escenario: Flujo completo - Categoría → Gasto → Consulta
    Cuando creo una categoría "Transporte"
    Y registro un gasto de "45.00" en la categoría "Transporte"
    Y consulto mis gastos
    Entonces debo ver el gasto con la categoría "Transporte" correcta
    Y el total de gastos debe reflejar "45.00"

  Escenario: Flujo completo - Categoría → Ingreso → Consulta
    Cuando creo una categoría "Trabajo"
    Y registro un ingreso de "2500.00" como "Salario" en la categoría "Trabajo"
    Y consulto mis ingresos
    Entonces debo ver el ingreso con la categoría "Trabajo" correcta
    Y el total de ingresos debe reflejar "2500.00"

  Escenario: Flujo completo - Múltiples categorías y transacciones
    Cuando creo las siguientes categorías:
      | nombre         |
      | Alimentación   |
      | Transporte     |
      | Entretenimiento|
    Y registro los siguientes gastos:
      | monto | descripcion | categoria       |
      | 50.00 | Supermercado| Alimentación    |
      | 25.00 | Taxi        | Transporte      |
      | 30.00 | Cine        | Entretenimiento |
    Y registro los siguientes ingresos:
      | monto   | tipo_ingreso | categoria |
      | 2500.00 | Salario      | Trabajo   |
      | 500.00  | Freelance    | Trabajo   |
    Entonces debo tener 3 categorías creadas
    Y debo tener 3 gastos registrados
    Y debo tener 2 ingresos registrados
    Y todas las transacciones deben tener sus categorías correctas

  Escenario: Flujo de validación - Categoría inexistente en gasto
    Cuando intento registrar un gasto de "100.00" en una categoría inexistente
    Entonces debo recibir un error de validación
    Y el gasto no debe guardarse
    Y el mensaje debe indicar que la categoría no es válida

  Escenario: Flujo de validación - Categoría inexistente en ingreso
    Cuando intento registrar un ingreso de "1000.00" como "Freelance" en una categoría inexistente
    Entonces debo recibir un error de validación
    Y el ingreso no debe guardarse
    Y el mensaje debe indicar que la categoría no es válida

  Escenario: Flujo de consistencia - Crear y usar categoría inmediatamente
    Cuando creo una categoría "Salud"
    Y inmediatamente registro un gasto de "150.00" para "Consulta médica" en la categoría "Salud"
    Entonces ambas operaciones deben ser exitosas
    Y el gasto debe estar correctamente asociado con la categoría "Salud"

  Escenario: Flujo de integridad - Múltiples transacciones en misma categoría
    Dado que tengo una categoría "Alimentación"
    Cuando registro múltiples transacciones en la categoría "Alimentación":
      | tipo    | monto  | descripcion    |
      | gasto   | 25.00  | Desayuno       |
      | gasto   | 45.00  | Almuerzo       |
      | gasto   | 30.00  | Cena           |
      | ingreso | 100.00 | Reembolso comida|
    Entonces todas las transacciones deben guardarse correctamente
    Y todas deben estar asociadas con la categoría "Alimentación"
    Y debo tener 3 gastos y 1 ingreso en esa categoría

  Escenario: Flujo de ordenamiento - Transacciones por fecha
    Cuando registro transacciones en diferentes fechas:
      | tipo    | monto  | fecha      | descripcion |
      | gasto   | 100.00 | 2024-01-15 | Gasto 1     |
      | gasto   | 200.00 | 2024-01-10 | Gasto 2     |
      | gasto   | 150.00 | 2024-01-20 | Gasto 3     |
      | ingreso | 500.00 | 2024-01-12 | Ingreso 1   |
      | ingreso | 300.00 | 2024-01-18 | Ingreso 2   |
    Y consulto mis transacciones
    Entonces los gastos deben estar ordenados por fecha descendente
    Y los ingresos deben estar ordenados por fecha descendente

  Escenario: Flujo de resiliencia - Operaciones secuenciales con fallos
    Cuando creo una categoría "Hogar"
    Y registro un gasto exitoso de "200.00" en "Hogar"
    Y intento registrar un gasto inválido sin monto en "Hogar"
    Y registro otro gasto exitoso de "150.00" en "Hogar"
    Entonces debo tener 1 categoría creada
    Y debo tener 2 gastos exitosos registrados
    Y el gasto inválido no debe afectar los demás

  Escenario: Flujo de estado - Verificar consistencia después de múltiples operaciones
    Cuando realizo las siguientes operaciones en secuencia:
      | operacion | tipo      | datos                                    |
      | crear     | categoria | nombre: "Educación"                      |
      | crear     | categoria | nombre: "Tecnología"                     |
      | registrar | gasto     | monto: 500, categoria: "Educación"      |
      | registrar | ingreso   | monto: 1000, categoria: "Tecnología"    |
      | listar    | categorias| -                                        |
      | listar    | gastos    | -                                        |
      | listar    | ingresos  | -                                        |
    Entonces todas las operaciones deben ser exitosas
    Y el estado final debe ser consistente
    Y debo tener 2 categorías, 1 gasto y 1 ingreso

  Escenario: Flujo de usuario - Sesión completa de gestión financiera
    Cuando inicio una sesión completa de gestión financiera:
      | paso | accion                                           |
      | 1    | Crear categorías básicas (Hogar, Trabajo, Ocio) |
      | 2    | Registrar ingresos mensuales                     |
      | 3    | Registrar gastos diarios                         |
      | 4    | Consultar resumen de transacciones               |
    Entonces toda la sesión debe completarse exitosamente
    Y debo tener un panorama completo de mis finanzas
    Y todas las relaciones entre entidades deben mantenerse

  Escenario: Flujo de validación cruzada - Integridad referencial
    Dado que tengo una categoría "Viajes" con transacciones asociadas
    Cuando consulto las transacciones de la categoría "Viajes"
    Entonces todas las transacciones deben referenciar correctamente la categoría
    Y no debe haber referencias rotas o inconsistentes

  Escenario: Flujo de rendimiento - Múltiples operaciones concurrentes
    Cuando ejecuto múltiples operaciones de forma secuencial:
      | cantidad | operacion |
      | 5        | categorías|
      | 10       | gastos    |
      | 8        | ingresos  |
    Entonces todas las operaciones deben completarse exitosamente
    Y el tiempo de respuesta debe ser aceptable
    Y no debe haber conflictos de datos