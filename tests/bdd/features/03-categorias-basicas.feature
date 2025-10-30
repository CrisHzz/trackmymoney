Feature: Gestión básica de categorías
  Como usuario de TrackMyMoney
  Quiero crear y consultar categorías
  Para organizar mis gastos e ingresos

  Scenario: Crear una categoría exitosamente
    Given que soy un usuario autenticado
    When creo una categoría "Transporte"
    Then el registro debe ser exitoso
    And el elemento debe tener nombre "Transporte"

  Scenario: Consultar categorías cuando no hay registros
    Given que soy un usuario autenticado
    When consulto mis categorías
    Then el registro debe ser exitoso
    And debo ver una lista vacía