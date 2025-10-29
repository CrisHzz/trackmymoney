# language: es
Característica: Gestión de Categorías
  Como usuario autenticado
  Quiero organizar mis transacciones por categorías
  Para mejor análisis de mis gastos e ingresos

  Antecedentes:
    Dado que soy un usuario autenticado

  Escenario: Crear nueva categoría exitosamente
    Cuando creo una categoría llamada "Entretenimiento"
    Entonces la categoría debe guardarse correctamente
    Y debe estar disponible para mis transacciones
    Y debe aparecer en la lista de categorías

  Escenario: Crear categoría con nombre con espacios
    Cuando creo una categoría llamada "  Salud y Bienestar  "
    Entonces la categoría debe guardarse correctamente
    Y el nombre debe ser "Salud y Bienestar" sin espacios extra

  Escenario: Prevenir categorías duplicadas
    Dado que tengo una categoría llamada "Alimentación"
    Cuando intento crear otra categoría con el nombre "Alimentación"
    Entonces debo recibir un error de duplicación
    Y el mensaje debe indicar "Ya existe una categoría con este nombre"
    Y la categoría no debe crearse

  Escenario: Prevenir categorías duplicadas insensible a mayúsculas
    Dado que tengo una categoría llamada "Alimentación"
    Cuando intento crear otra categoría con el nombre "ALIMENTACIÓN"
    Entonces debo recibir un error de duplicación
    Y el mensaje debe indicar "Ya existe una categoría con este nombre"
    Y la categoría no debe crearse

  Escenario: Validar nombre obligatorio
    Cuando intento crear una categoría sin nombre
    Entonces debo recibir un error de validación
    Y el mensaje debe indicar "El nombre de la categoría es obligatorio"
    Y la categoría no debe crearse

  Escenario: Validar nombre vacío
    Cuando intento crear una categoría con nombre vacío ""
    Entonces debo recibir un error de validación
    Y el mensaje debe indicar "El nombre de la categoría es obligatorio"
    Y la categoría no debe crearse

  Escenario: Validar nombre solo con espacios
    Cuando intento crear una categoría con nombre "   "
    Entonces debo recibir un error de validación
    Y el mensaje debe indicar "El nombre de la categoría es obligatorio"
    Y la categoría no debe crearse

  Escenario: Validar longitud máxima del nombre
    Cuando intento crear una categoría con un nombre de 51 caracteres
    Entonces debo recibir un error de validación
    Y el mensaje debe indicar "El nombre de la categoría no puede exceder 50 caracteres"
    Y la categoría no debe crearse

  Escenario: Crear categoría con nombre de longitud límite válida
    Cuando creo una categoría con un nombre de exactamente 50 caracteres
    Entonces la categoría debe guardarse correctamente
    Y debe aparecer en la lista de categorías

  Escenario: Listar categorías del usuario
    Dado que tengo las siguientes categorías:
      | nombre         |
      | Transporte     |
      | Alimentación   |
      | Entretenimiento|
    Cuando consulto mi lista de categorías
    Entonces debo ver 3 categorías
    Y deben estar ordenadas alfabéticamente

  Escenario: Listar categorías sin registros
    Dado que no tengo categorías registradas
    Cuando consulto mi lista de categorías
    Entonces debo ver una lista vacía
    Y la respuesta debe ser exitosa

  Escenario: Crear múltiples categorías diferentes
    Cuando creo las siguientes categorías:
      | nombre         |
      | Hogar          |
      | Educación      |
      | Salud          |
      | Trabajo        |
    Entonces todas las categorías deben guardarse correctamente
    Y debo tener 4 categorías en mi lista
    Y deben estar ordenadas alfabéticamente

  Escenario: Buscar categoría por ID existente
    Dado que tengo una categoría "Transporte" con ID "1"
    Cuando busco la categoría con ID "1"
    Entonces debo encontrar la categoría "Transporte"
    Y la respuesta debe ser exitosa

  Escenario: Buscar categoría por ID inexistente
    Cuando busco la categoría con ID "999"
    Entonces debo recibir un error de no encontrado
    Y el mensaje debe indicar "Categoría no encontrada"
    Y el código de estado debe ser 404

  Escenario: Crear categorías con nombres similares pero diferentes
    Cuando creo una categoría llamada "Alimentación"
    Y creo una categoría llamada "Alimentación Saludable"
    Y creo una categoría llamada "Alimentación Rápida"
    Entonces todas las categorías deben guardarse correctamente
    Y debo tener 3 categorías en mi lista

  Escenario: Validar caracteres especiales en nombres
    Cuando creo las siguientes categorías:
      | nombre           |
      | Café & Té        |
      | Ropa (Invierno)  |
      | Auto - Seguro    |
      | Salud/Medicina   |
    Entonces todas las categorías deben guardarse correctamente
    Y debo tener 4 categorías en mi lista

  Escenario: Crear categoría y verificar disponibilidad para transacciones
    Cuando creo una categoría llamada "Viajes"
    Entonces la categoría debe guardarse correctamente
    Y debe estar disponible para asociar con gastos
    Y debe estar disponible para asociar con ingresos