Feature: Control de autenticación
  Como sistema de TrackMyMoney
  Quiero validar que solo usuarios autenticados accedan
  Para mantener la seguridad de los datos

  Scenario: Usuario no autenticado intenta registrar gasto
    Given que no estoy autenticado
    When registro un gasto de "25.00" en "Café"
    Then debo recibir un error de autenticación

  Scenario: Usuario no autenticado intenta consultar gastos
    Given que no estoy autenticado
    When consulto mis gastos
    Then debo recibir un error de autenticación