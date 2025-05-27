# Contexto del Proyecto: Capacity SNN

## ¿Qué es Capacity?
Capacity es una herramienta desarrollada para la planta de producción de Smith & Nephew en Costa Rica, cuyo objetivo principal es facilitar el proceso mensual de planificación y compromiso de producción hacia el corporativo en Estados Unidos. El sistema permite a los planners y gerentes de planeamiento organizar, calcular y consolidar la capacidad productiva de la planta, asegurando que los compromisos enviados sean realistas y alineados con los recursos disponibles.

---

## Resumen Funcional y Técnico (Versión 1)

- **Objetivo:** Automatizar y digitalizar el proceso de planificación de capacidad, integrando inputs clave, cálculos automáticos y visualización de resultados para planners y managers.
- **Proceso:**
  1. Recepción de la demanda mensual (Build Plan) desde USA, agrupada por Value Streams (VST).
  2. El planner calcula la capacidad considerando días calendario, downtimes, holidays, horas disponibles, run rates, yield, headcount, etc.
  3. Programación semanal por producto y línea, buscando una utilización mínima del 93%.
  4. Consolidación de los capacities de todos los VST en un "MEGA CAPACITY" para la planta.
- **Actores:** Planner, Gerente de Planeamiento, Producción, Corporativo.
- **Componentes clave:** Inputs (calendario, downtimes, run rates, yield, headcount), loading, resultados (fill rate, summary), gestión de nuevos productos.
- **Visión:** Automatización de cálculos, visualización clara, trazabilidad y consolidación.

---

## Estructura Técnica y de UI

- **Módulos principales:** Inputs, Loading, Resultados, Gestión de nuevos productos, Consola de capacities y vista de manager.
- **Flujo UI:**
  - Navegación: Capacity Model > CBP mensual > VST > Calendario y detalle semanal.
  - Filtros avanzados por VST, línea, fechas.
  - Visualización de KPIs y tablas semanales con observaciones.
  - Modal de observaciones con tabs para downtimes y holidays.
- **Priorización:**
  1. Navegación y layout base
  2. Inputs
  3. Loading
  4. Resultados
  5. Gestión de productos
  6. Consola de capacities

---

## Modelo de Datos y Lógica de Negocio

- **Tablas principales:** value_streams, production_lines, shifts, part_numbers, programmed_stops, theoretical_capacity, yield_factors, production_entries, causes, subcauses, production_causes, action_plans, action_plan_items.
- **Relaciones:**
  - Cada línea pertenece a un value stream.
  - Entradas de producción referencian líneas, turnos, paros, part numbers, causas, usuarios.
  - Yield y capacidad teórica se parametrizan por semana, línea y turno.
- **Políticas de seguridad:** Uso de RLS en Supabase para restringir acceso por usuario y línea.
- **Cálculos clave:**
  - Meta = Run Rate × (Tiempo Disponible/60) × Yield × (HC Real/HC Teórico)
  - Ajustes por paros programados y factores de corrección.
- **Endpoints y servicios:** CRUD de entradas de producción, ajustes, catálogos, con integración en tiempo real y validaciones.

---

## Implementación Frontend (Capacities)

- **index.tsx:** Página principal, muestra el listado mensual de CBP (Capacity Business Plan) con estado y fecha. Permite navegar al detalle mensual.
- **MonthDetail.tsx:** Detalle de un CBP mensual, tarjetas por VST, eficiencia, producción vs meta, y acceso al calendario de cada VST.
- **VSTDetail.tsx:** Detalle semanal para un VST específico. Incluye filtros, KPIs, cards resumen por línea, tabla semanal editable, modal de observaciones y paginado.
- **Roadster.tsx:** Listado mensual de capacities para el VST Roadster, con filtros y tabla de estados.
- **UI:** Moderna, responsiva, orientada a la experiencia del planner y manager, con componentes reutilizables y navegación clara.

---

## Módulo de Capacity Usage (Nuevo)

- **Propósito:** Permite a los planners visualizar y gestionar la distribución semanal de producción por producto, analizar estadísticas históricas y proyectar semanas de inventario.
- **Características clave:**
  1. **Gestión multi-escenario:**
     - Creación, duplicación y eliminación de escenarios de distribución
     - Cada escenario permite simular diferentes distribuciones de producción
     - Personalización del nombre y descripción de cada escenario
  
  2. **Panel de utilización expandible:**
     - Vista de resumen con porcentajes de utilización por semana
     - Panel detallado que muestra la utilización por línea de producción
     - Toggle para alternar entre vista de eficiencia (%) y unidades de producción
     - Cálculo automático de totales y visualización de alertas cuando se excede la capacidad
  
  3. **Tabla interactiva de programación semanal:**
     - Edición en línea de cantidades semanales por producto
     - Ajuste del WOI (Weeks of Inventory) objetivo
     - Información detallada de cada producto con desglose de BP y CBP
  
  4. **Estadísticas contextuales de producción:**
     - Panel de estadísticas históricas accesible desde cada número de parte
     - Visualización de tendencias de eficiencia y producción mediante gráficos interactivos
     - Selección de diferentes períodos de tiempo (diario, semanal, bisemanal, mensual)
     - Métricas clave con indicadores visuales: producción vs meta, eficiencia y tiempo muerto
  
  5. **Proyección de semanas de inventario:**
     - Tabla expandible que muestra la proyección de inventario para futuras semanas
     - Codificación por colores para identificar niveles críticos de inventario
     - Cálculo automático basado en la distribución de producción del escenario activo
  
- **Valor para el negocio:**
  - Facilita decisiones informadas al mostrar datos históricos junto a la planificación
  - Reduce el riesgo de desabastecimiento mediante proyecciones de inventario
  - Optimiza la utilización de líneas de producción con visualización clara de cargas
  - Permite comparar diferentes estrategias de distribución mediante escenarios

---

## Visión de la Herramienta
- Permitir a los planners cargar y ajustar los inputs de capacity para cada VST.
- Automatizar cálculos de utilización, yield y headcount.
- Visualizar la programación semanal y el cumplimiento de metas.
- Consolidar los capacities de todos los VST para la visión del gerente de planeamiento.
- Facilitar la trazabilidad y el histórico de compromisos enviados al corporativo.
- Proporcionar herramientas de análisis y simulación para optimizar la distribución de producción.

---

Este documento se actualiza para reflejar el avance, la estructura lograda en la versión 1 del Capacity Model y la integración técnica/funcional del sistema, incluyendo las nuevas características del módulo de Capacity Usage. 