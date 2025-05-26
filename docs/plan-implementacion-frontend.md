# Plan de Implementación Frontend

## Objetivo
Desarrollar la interfaz y lógica de usuario para el sistema Capacity, permitiendo a planners y managers gestionar el proceso mensual de compromiso de producción, desde la carga de inputs hasta la consolidación y visualización de resultados.

---

## 1. Estructura Inicial y Navegación
- Definir la estructura de rutas y navegación principal (Dashboard, Inputs, Loading, Resultados, Administración de Capacities).
- Crear layout base y menú lateral con acceso a los módulos clave.

## 2. Módulos Principales

### 2.1. Módulo de Inputs
- **Componentes:**
  - Carga y edición de Calendar Days, Special Downtimes, Net Available Time, Run Rates, Yield, Direct Labor HC.
  - Importación del Build Plan (BP) desde archivo.
- **Funcionalidad:**
  - Formularios dinámicos y validaciones.
  - Visualización de inputs cargados.

### 2.2. Módulo de Loading (Capacity Loading)
- **Componentes:**
  - Visualización y edición de Usage, CBP Starts (con Yield%), CBP Outs.
- **Funcionalidad:**
  - Cálculo automático de loading según inputs.
  - Edición manual y ajustes por el planner.

### 2.3. Módulo de Resultados
- **Componentes:**
  - Visualización de Product Fill Rate y Summary.
  - Gráficas de utilización y cumplimiento de metas.
- **Funcionalidad:**
  - Resumen semanal y mensual por VST.
  - Alertas de bajo cumplimiento (<93%).

### 2.4. Gestión de Nuevos Productos
- **Componentes:**
  - Formulario para agregar nuevos part numbers al modelo.
- **Funcionalidad:**
  - Validación y registro de nuevos productos.

### 2.5. Consola de Capacities y Vista de Manager
- **Componentes:**
  - Vista consolidada de todos los capacities por VST.
  - Filtros por mes, VST y estado.
- **Funcionalidad:**
  - Acceso solo para managers.
  - Visualización de MEGA CAPACITY.

---

## 3. Integración y Experiencia de Usuario
- Implementar feedback visual (toasts, loaders, validaciones).
- Asegurar diseño responsive y accesibilidad.
- Pruebas de usabilidad con planners y managers.

---

## 4. Priorización y Roadmap
1. **Navegación y layout base**
2. **Módulo de Inputs**
3. **Módulo de Loading**
4. **Módulo de Resultados**
5. **Gestión de nuevos productos**
6. **Consola de capacities y vista de manager**
7. **Mejoras UX/UI y feedback de usuarios**

---

## 5. Entregables
- Componentes React modulares y reutilizables.
- Formularios y visualizaciones interactivas.
- Documentación técnica y de usuario.

---

Este plan servirá como guía para el desarrollo frontend del sistema Capacity, asegurando un avance ordenado y alineado con los objetivos del proyecto. 