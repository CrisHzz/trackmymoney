Feature: Gestión de Transacciones Financieras
  Como usuario de TrackMyMoney
  Quiero poder gestionar mis transacciones financieras
  Para tener un control preciso de mis ingresos y gastos

  Background:
    Given que tengo una aplicación de gestión financiera funcionando
    And que tengo acceso a las utilidades de fecha y cálculo

  Scenario: Calcular el balance mensual correctamente
    Given que tengo ingresos por valor de "1500" euros
    And que tengo gastos por valor de "800" euros
    When calculo el balance mensual
    Then el resultado debe ser "700" euros
    And el balance debe ser positivo

  Scenario: Formatear fecha correctamente para mostrar
    Given que tengo una fecha en formato "2024-01-15"
    When formateo la fecha para mostrar
    Then la fecha debe mostrarse como "15 de enero de 2024"

  Scenario: Validar formato de fecha para entrada
    Given que tengo una fecha actual
    When obtengo el formato de fecha para entrada
    Then la fecha debe estar en formato "YYYY-MM-DD"
    And debe ser una fecha válida

  Scenario: Calcular estadísticas de transacciones
    Given que tengo las siguientes transacciones:
      | tipo    | monto | categoria    |
      | ingreso | 2000  | salario      |
      | gasto   | 500   | alimentación |
      | gasto   | 200   | transporte   |
      | ingreso | 300   | freelance    |
    When calculo las estadísticas totales
    Then el total de ingresos debe ser "2300" euros
    And el total de gastos debe ser "700" euros
    And el balance neto debe ser "1600" euros
