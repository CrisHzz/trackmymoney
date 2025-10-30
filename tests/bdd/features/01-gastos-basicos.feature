Feature: Gestión básica de gastos
  Como usuario de TrackMyMoney
  Quiero registrar y consultar mis gastos
  Para llevar control de mis finanzas

  Scenario: Registrar un gasto exitosamente
    Given que soy un usuario autenticado
    When registro un gasto de "50.00" en "Comida"
    Then el registro debe ser exitoso
    And el elemento debe tener monto "50.00"

  Scenario: Consultar gastos cuando no hay registros
    Given que soy un usuario autenticado
    When consulto mis gastos
    Then el registro debe ser exitoso
    And debo ver una lista vacía