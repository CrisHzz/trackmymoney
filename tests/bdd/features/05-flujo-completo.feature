Feature: Flujo completo de usuario
  Como usuario de TrackMyMoney
  Quiero realizar un flujo completo de operaciones
  Para validar que el sistema funciona integralmente

  Scenario: Flujo completo: categoría, gasto e ingreso
    Given que soy un usuario autenticado
    When creo una categoría "Alimentación"
    And registro un gasto de "30.00" en "Alimentación"
    And registro un ingreso de "500.00" como "Freelance"
    Then el registro debe ser exitoso

  Scenario: Consultar datos después del flujo completo
    Given que soy un usuario autenticado
    When creo una categoría "Entretenimiento"
    And registro un gasto de "75.00" en "Entretenimiento"
    And consulto mis gastos
    Then el registro debe ser exitoso
    And debo ver 1 elemento