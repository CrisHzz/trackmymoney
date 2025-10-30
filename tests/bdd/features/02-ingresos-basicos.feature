Feature: Gestión básica de ingresos
  Como usuario de TrackMyMoney
  Quiero registrar y consultar mis ingresos
  Para llevar control de mis finanzas

  Scenario: Registrar un ingreso exitosamente
    Given que soy un usuario autenticado
    When registro un ingreso de "1000.00" como "Salario"
    Then el registro debe ser exitoso
    And el elemento debe tener monto "1000.00"

  Scenario: Consultar ingresos cuando no hay registros
    Given que soy un usuario autenticado
    When consulto mis ingresos
    Then el registro debe ser exitoso
    And debo ver una lista vacía