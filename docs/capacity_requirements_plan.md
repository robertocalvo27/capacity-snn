# Capacity MVP - Requerimientos y Plan de Implementación

## Resumen Ejecutivo

Basado en la reunión del fragmento **43:34 - 54:44**, se identificaron mejoras críticas para el módulo de Input Review del sistema de Capacity Planning. Este documento detalla los requerimientos y establece un plan de implementación secuencial.

---

## **Requerimientos Principales Identificados**

### 1. **Días Calendario (CRÍTICO - 46:14-46:45)**
```
Requerimiento: Módulo de Días Calendario
- Input principal para definir días laborables vs no laborables
- Ownership: Planning (define) + Producción (aprueba)
- Casos de uso: Evitar errores como programar el 1 de mayo (día feriado)
- Interface: Tab/sección dedicada en el input review
```

### 2. **Curvas de Entrenamiento (47:03-47:27)**
```
Requerimiento: Validación de Training Curves
- Input complementario al headcount actual
- Función: Validar qué curvas de entrenamiento están activas
- Integración: Debe conectarse con el headcount para ajustar capacidad real
```

### 3. **Módulo de Changeovers/Cambios de Lote (49:48-51:19)**
```
Requerimiento: Cálculo de Lot Changes
- Variables: Demanda + Lot Size = Número de cambios
- Ejemplo: 1000 unidades / lotes de 200 = 5 cambios de lote
- Impacto: Cada cambio consume tiempo (15 min c/u)
- Owner: Planning debe definir lot sizing strategy
```

### 4. **Net Available Time - Recálculo (47:52-48:10)**
```
Mejora: Clarificar que es OUTPUT, no INPUT
- Fórmula: Calendar + Special Downtimes + Standard Delays
- Componentes: Tier, Setup, Ergonómicos, Training curves
```

### 5. **Tipos de Downtime Expandidos (45:43-48:15)**
```
Requerimiento: Categorización de Downtimes
- Standard: Tier, setup, ergonómicos (conocidos)
- Especiales: Validaciones, nuevas materias primas
- Validaciones: Pueden requerir semanas completas de producción
```

### 6. **Trazabilidad de Archivos (52:48-54:14)**
```
Requerimiento: Audit Trail para Imports
- Registrar: Archivo usado, fecha, usuario que importó
- Propósito: Poder rastrear fuente de problemas en build plan
- Interface: Log visible de importaciones
```

---

## **Estructura de Input Review Actualizada**

```
INPUT REVIEW COMPONENTS:
├── Build Plan (Demanda proyectada) ✅
├── Headcount (Personal disponible) ✅  
├── Run Rates (Velocidad por producto/línea) ✅
├── Training Curves (NUEVO - Curvas de entrenamiento)
├── Calendar Days (NUEVO - Días laborables)
├── Standard Downtimes ✅
├── Special Downtimes (Validaciones, mat. prima nueva)
├── Lot Change Analysis (NUEVO - Cambios de lote)
└── Net Available Time (CALCULADO - no input)
```

---

## **Plan de Implementación Secuencial**

### **FASE 1: Fundamentos Críticos (Semana 1-2)**
**Objetivo**: Implementar las funcionalidades más críticas identificadas

#### **1.1 Módulo de Días Calendario**
- [ ] **Backend**: Crear modelo `CalendarDay`
  ```typescript
  interface CalendarDay {
    date: Date;
    isWorkingDay: boolean;
    description?: string;
    valueStream?: string;
    approvedBy?: string;
    status: 'pending' | 'approved' | 'rejected';
  }
  ```
- [ ] **Frontend**: Componente calendar picker con estados
- [ ] **API**: Endpoints para CRUD de días calendario
- [ ] **Validación**: Integrar con cálculo de Net Available Time

#### **1.2 Audit Trail para Importaciones**
- [ ] **Backend**: Modelo `ImportLog`
  ```typescript
  interface ImportLog {
    id: string;
    fileName: string;
    uploadedBy: string;
    uploadDate: Date;
    fileType: 'buildplan' | 'headcount' | 'runrates';
    status: 'success' | 'error';
    recordsProcessed: number;
  }
  ```
- [ ] **Frontend**: Tabla de historial de importaciones
- [ ] **Storage**: Guardar archivos importados para referencia

#### **1.3 Categorización de Downtimes**
- [ ] **Backend**: Expandir modelo Downtime
  ```typescript
  interface Downtime {
    id: string;
    type: 'standard' | 'special';
    category: 'tier' | 'setup' | 'ergonomic' | 'validation' | 'material_change';
    duration: number;
    description: string;
    requiresApproval: boolean;
  }
  ```

### **FASE 2: Cálculos Avanzados (Semana 3-4)**
**Objetivo**: Implementar lógica de cálculos complejos

#### **2.1 Módulo de Changeovers/Lot Changes**
- [ ] **Backend**: Lógica de cálculo de cambios de lote
  ```typescript
  interface LotChangeCalculation {
    demand: number;
    lotSize: number;
    changesRequired: number;
    timePerChange: number; // minutos
    totalLostTime: number;
    impactOnCapacity: number;
  }
  ```
- [ ] **Frontend**: Interface para configurar lot sizes
- [ ] **Integration**: Conectar con planning data

#### **2.2 Training Curves Integration**
- [ ] **Backend**: Modelo `TrainingCurve`
  ```typescript
  interface TrainingCurve {
    employeeId: string;
    operation: string;
    efficiencyPercentage: number;
    startDate: Date;
    expectedCompletionDate: Date;
    status: 'active' | 'completed' | 'pending';
  }
  ```
- [ ] **Cálculo**: Ajustar headcount efectivo basado en curvas

#### **2.3 Net Available Time Calculator**
- [ ] **Backend**: Función consolidada de cálculo
- [ ] **Frontend**: Display de breakdown de tiempo disponible
- [ ] **Validación**: Asegurar que es output, no input

### **FASE 3: Optimizaciones y UX (Semana 5-6)**
**Objetivo**: Mejorar experiencia de usuario y performance

#### **3.1 Dashboard Mejorado**
- [ ] **Frontend**: Resumen visual de inputs completados
- [ ] **Indicadores**: Status de aprobaciones pendientes
- [ ] **Alertas**: Validaciones fallidas o datos inconsistentes

#### **3.2 Workflow de Aprobaciones**
- [ ] **Backend**: Sistema de aprobaciones por rol
- [ ] **Frontend**: Interface para aprobar/rechazar inputs
- [ ] **Notificaciones**: Alertas para aprobadores

#### **3.3 Validaciones Cruzadas**
- [ ] **Backend**: Validar consistencia entre módulos
- [ ] **Reportes**: Identificar discrepancias automáticamente

---

## **Estructura de Archivos Propuesta**

```
src/
├── components/
│   ├── inputs/
│   │   ├── CalendarDays/
│   │   │   ├── CalendarDaysManager.tsx
│   │   │   ├── CalendarPicker.tsx
│   │   │   └── ApprovalStatus.tsx
│   │   ├── LotChanges/
│   │   │   ├── LotChangeCalculator.tsx
│   │   │   └── ChangeoverImpact.tsx
│   │   ├── TrainingCurves/
│   │   │   ├── CurveManager.tsx
│   │   │   └── EfficiencyAdjuster.tsx
│   │   └── ImportHistory/
│   │       ├── ImportLog.tsx
│   │       └── AuditTrail.tsx
├── models/
│   ├── CalendarDay.ts
│   ├── ImportLog.ts
│   ├── LotChange.ts
│   ├── TrainingCurve.ts
│   └── EnhancedDowntime.ts
├── services/
│   ├── calendarService.ts
│   ├── lotChangeService.ts
│   ├── trainingCurveService.ts
│   └── netTimeCalculator.ts
└── utils/
    ├── validators.ts
    └── calculators.ts
```

---

## **Criterios de Aceptación por Fase**

### **Fase 1 - Criterios**
- [ ] Usuario puede definir días no laborables por mes
- [ ] Sistema registra todos los archivos importados
- [ ] Downtimes categorizados correctamente
- [ ] Aprobaciones funcionando para elementos críticos

### **Fase 2 - Criterios**
- [ ] Cálculo automático de changeovers basado en lot size
- [ ] Training curves ajustan headcount efectivo
- [ ] Net Available Time se calcula automáticamente
- [ ] Validaciones cruzadas entre módulos funcionando

### **Fase 3 - Criterios**
- [ ] Dashboard muestra status completo de inputs
- [ ] Workflow de aprobaciones intuitivo
- [ ] Performance optimizada para datasets grandes
- [ ] Reportes de inconsistencias automáticos

---

## **Comandos para Cursor AI**

### **Para iniciar Fase 1:**
```bash
# Comando para Cursor AI
"Implementar Fase 1 del plan de Capacity MVP: 
1. Crear modelo CalendarDay con interface TypeScript
2. Implementar componente CalendarDaysManager 
3. Crear endpoints API para días calendario
4. Agregar modelo ImportLog para audit trail
Seguir estructura de archivos propuesta en el documento."
```

### **Para continuar con Fase 2:**
```bash
# Comando para Cursor AI  
"Implementar Fase 2 del plan de Capacity MVP:
1. Crear LotChangeCalculator con lógica de changeovers
2. Implementar TrainingCurve model y ajustes de headcount
3. Desarrollar NetTimeCalculator consolidado
Integrar con componentes existentes de Fase 1."
```

---

## **Notas para el Desarrollo**

1. **Prioridad Alta**: Días calendario y audit trail son críticos según transcripción
2. **Integración**: Cada nuevo módulo debe integrarse con Input Review existente
3. **Validación**: Implementar validaciones robustas en cada fase
4. **Testing**: Crear tests unitarios para cada calculadora/servicio
5. **Documentación**: Mantener documentación actualizada para cada componente

---

## **Contacto y Seguimiento**

- **Revisión semanal**: Evaluar progreso de cada fase
- **Feedback**: Incorporar feedback de usuarios (Aldo, Walter, Sofía)
- **Ajustes**: Modificar plan según necesidades emergentes

---

*Documento creado el: [Fecha actual]*  
*Última actualización: [Fecha de modificación]*