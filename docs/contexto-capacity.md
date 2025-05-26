# Contexto del Proyecto: Capacity SNN

## ¿Qué es Capacity?
Capacity es una herramienta desarrollada para la planta de producción de Smith & Nephew en Costa Rica, cuyo objetivo principal es facilitar el proceso mensual de planificación y compromiso de producción hacia el corporativo en Estados Unidos. El sistema permite a los planners y gerentes de planeamiento organizar, calcular y consolidar la capacidad productiva de la planta, asegurando que los compromisos enviados sean realistas y alineados con los recursos disponibles.

## Proceso Mensual de Capacity

1. **Recepción de Demanda (Build Plan)**
   - Cada 22 del mes, el corporativo envía un archivo con la demanda de producción para los diferentes productos (Part Numbers).
   - Los productos están agrupados en Value Streams (VST): Sports Medicine, Wound, Regenet, etc.
   - El archivo recibido se denomina Build Plan (BP), donde se especifican las necesidades por producto y semana.

2. **Planeación y Cálculo de Capacidad**
   - El Planner es el usuario clave en este proceso.
   - Para armar el compromiso de producción, el planner requiere varios inputs:
     - **Calendar Days**: Días calendario del mes.
     - **Special Downtimes**: Días festivos o paros especiales.
     - **Net Available Time**: Tiempo neto disponible para producción.
     - **Run Rates**: Velocidad de producción por producto/línea.
     - **Yield**: Porcentaje de rendimiento esperado.
     - **Direct Labor (DL) Head Count**: Disponibilidad de personal directo.
     - **Otros**: Validaciones, cambios de modelo, etc.
   - Con estos datos, el planner completa el modelo de capacity para su VST, asegurando que la utilización de la capacidad sea al menos del 93%.

3. **Programación Semanal y Consolidación**
   - El planner programa la cantidad de unidades a fabricar por semana para cada producto.
   - Se revisa y ajusta la programación para cumplir con los objetivos de utilización y demanda.
   - Cada VST genera su propio capacity mensual (ejemplo: Capacity Sports Medicine Mayo 2025).
   - Finalmente, todos los capacities de los VST se consolidan en un MEGA CAPACITY para la planta.

## Actores Involucrados
- **Planner**: Responsable de armar y ajustar el capacity de cada VST.
- **Gerente de Planeamiento**: Supervisa y consolida los capacities de todos los VST.
- **Producción**: Provee información sobre disponibilidad y restricciones operativas.
- **Corporativo (EEUU)**: Define la demanda y recibe el compromiso de producción.

## Componentes Clave del Modelo Capacity
- **Inputs**:
  - Calendar Days (Available Time)
  - Build Plan (BP)
  - Run Rates
  - Special Downtimes
  - Yield
  - Direct Labor HC
  - Validaciones y cambios de modelo
- **Loading**:
  - Usage (Capacity Loading)
  - CBP Starts (con Yield%)
  - CBP Outs
- **Resultados**:
  - Product Fill Rate
  - Summary
- **Gestión de Nuevos Productos**:
  - Agregar nuevos part numbers al modelo

## Visión de la Herramienta
- Permitir a los planners cargar y ajustar los inputs de capacity para cada VST.
- Automatizar cálculos de utilización, yield y headcount.
- Visualizar la programación semanal y el cumplimiento de metas.
- Consolidar los capacities de todos los VST para la visión del gerente de planeamiento.
- Facilitar la trazabilidad y el histórico de compromisos enviados al corporativo.

---

Este documento servirá como base para el desarrollo de los componentes clave del sistema y para la documentación técnica y funcional del proyecto Capacity SNN. 