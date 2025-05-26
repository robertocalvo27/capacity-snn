# Sistema de Registro de Producción - Smith & Nephew

## Contexto del Cliente

### Perfil de la Empresa
Smith & Nephew es una empresa global de tecnología médica dedicada a la reparación, regeneración y reemplazo de tejidos blandos y duros. Con más de 160 años de historia, opera en más de 100 países y cuenta con aproximadamente 18,000 empleados a nivel mundial.

### Operaciones en Costa Rica
La compañía mantiene una planta de producción estratégica en:
- **Ubicación**: Zona Franca Coyol, Alajuela
- **Enfoque**: Producción de dispositivos ortopédicos para medicina deportiva
- **Impacto**: Generación de cientos de empleos en la región

### Objetivos del Sistema
1. Digitalización de procesos de producción
2. Control en tiempo real de métricas operativas
3. Optimización de recursos y eficiencia
4. Trazabilidad completa de la producción

# Sistema de Registro de Producción - Documentación Técnica

## Estructura de Datos Principal

### 1. Registro de Producción (ProductionEntry)
```typescript
interface ProductionEntry {
  id: string;                    // Formato: "{hora}-{timestamp}"
  hour: string;                  // Formato: "HH:mm a.m./p.m."
  realHeadCount: number;         // HC presente en línea
  additionalHC?: number;         // HC adicional/soporte
  programmedStop: string | null; // Referencia a PROGRAMMED_STOPS
  workOrder: string;            
  partNumber: string;           // Referencia a PART_NUMBERS
  hourlyTarget: number;         // Meta calculada por hora
  hourlyTargetFC?: number;      // Meta a capacidad completa
  dailyProduction: number;      // Producción real
  delta: number;                // Diferencia producción vs meta
  downtime?: number;            // Tiempo muerto en minutos
  causes: CauseEntry[];         // Causas de desviación
  registeredAt: Date;           // Timestamp del registro
  isOvertime?: boolean;         // Indicador de hora extra
}
```

### 2. Ajustes y Factores de Corrección
```typescript
interface TargetAdjustment {
  id: string;
  factorType: CorrectionFactorType;
  percentage: number;
  description: string;
  appliedBy: string;
  appliedAt: Date;
}

interface SupportAdjustment {
  id: string;
  shift: number | string;
  positions: {
    type: string;
    value: number;
  }[];
  appliedBy: string;
  appliedAt: Date;
}
```

## Funcionalidades Core

### 1. Cálculo de Metas
```typescript
Meta = Run Rate * (Tiempo Disponible/60) * Yield * (HC Real/HC Teórico)

donde:
- Run Rate: Velocidad estándar del part number
- Tiempo Disponible: 60 - duración de paros programados
- Yield: Factor de eficiencia por semana/turno
- HC Real: Personal presente
- HC Teórico: Personal estándar requerido
```

### 2. Sistema de Validaciones
- Orden secuencial de registro
- Ventanas de tiempo para registro
- Validación de HC vs capacidad
- Coherencia de causas vs delta
- Integridad de datos relacionados

### 3. Gestión de Ajustes
- Ajustes por hora o turno completo
- Factores de corrección predefinidos
- Personal de soporte configurable
- Historial de modificaciones

## Entidades y Relaciones

### 1. Catálogos Principales
```typescript
PART_NUMBERS: {
  code: string;
  description: string;
  runRates: {
    T1: number;
    T2: number;
    T3: number;
  };
}[]

PROGRAMMED_STOPS: {
  id: string;
  name: string;
  duration: number;
  weekday: boolean;
  saturday: boolean;
}[]

CAUSES: {
  id: string;
  name: string;
  subcauses: string[];
  requiresAction?: boolean;
}[]
```

### 2. Configuraciones por Turno
```typescript
interface Shift {
  id: number;
  startTime: string;    // "HH:mm"
  endTime: string;      // "HH:mm"
  theoreticalHC: number;
  standardYield: number;
  breaks: {
    start: string;
    duration: number;
    type: string;
  }[];
}
```

## Permisos y Roles

### 1. Niveles de Acceso
- Operador: Registro básico
- Líder: Gestión de turno
- Supervisor: Ajustes y aprobaciones
- Administrador: Configuración global

### 2. Capacidades por Rol
```typescript
interface Permissions {
  canEditProduction: boolean;
  canAdjustTargets: boolean;
  canManageSupport: boolean;
  canCloseShift: boolean;
  canViewReports: boolean;
  canEditSettings: boolean;
}
```

## Estructura de Base de Datos

### 1. Tablas Principales
```sql
CREATE TABLE production_entries (
  id VARCHAR PRIMARY KEY,
  hour VARCHAR NOT NULL,
  real_head_count INTEGER NOT NULL,
  additional_hc INTEGER,
  programmed_stop_id VARCHAR REFERENCES programmed_stops(id),
  work_order VARCHAR NOT NULL,
  part_number VARCHAR NOT NULL REFERENCES part_numbers(code),
  hourly_target INTEGER NOT NULL,
  hourly_target_fc INTEGER,
  daily_production INTEGER NOT NULL,
  delta INTEGER NOT NULL,
  downtime INTEGER,
  registered_at TIMESTAMP NOT NULL,
  is_overtime BOOLEAN DEFAULT FALSE,
  shift_id INTEGER NOT NULL REFERENCES shifts(id),
  created_by VARCHAR NOT NULL REFERENCES users(id),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE target_adjustments (
  id VARCHAR PRIMARY KEY,
  factor_type VARCHAR NOT NULL,
  percentage DECIMAL(5,2) NOT NULL,
  description TEXT NOT NULL,
  applies_to VARCHAR NOT NULL, -- 'shift' or 'single'
  hour VARCHAR,
  shift_id INTEGER NOT NULL REFERENCES shifts(id),
  applied_by VARCHAR NOT NULL REFERENCES users(id),
  applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE causes (
  id VARCHAR PRIMARY KEY,
  production_entry_id VARCHAR NOT NULL REFERENCES production_entries(id),
  type_cause VARCHAR NOT NULL,
  general_cause VARCHAR NOT NULL,
  specific_cause VARCHAR NOT NULL,
  units INTEGER NOT NULL,
  created_by VARCHAR NOT NULL REFERENCES users(id),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Tablas de Soporte
```sql
CREATE TABLE support_adjustments (
  id VARCHAR PRIMARY KEY,
  shift_id INTEGER NOT NULL REFERENCES shifts(id),
  position_type VARCHAR NOT NULL,
  value INTEGER NOT NULL,
  applied_by VARCHAR NOT NULL REFERENCES users(id),
  applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE programmed_stops (
  id VARCHAR PRIMARY KEY,
  name VARCHAR NOT NULL UNIQUE,
  duration INTEGER NOT NULL,
  weekday BOOLEAN NOT NULL DEFAULT TRUE,
  saturday BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE part_numbers (
  code VARCHAR PRIMARY KEY,
  description TEXT NOT NULL,
  run_rate_t1 INTEGER NOT NULL,
  run_rate_t2 INTEGER NOT NULL,
  run_rate_t3 INTEGER NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

## Estructura de Base de Datos Implementada

### 1. Tablas de Producción y Ajustes
```sql
-- Tabla para los tipos de paros programados
CREATE TABLE programmed_stops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL UNIQUE,
    duration INTEGER NOT NULL CHECK (duration > 0 AND duration <= 60),
    weekday BOOLEAN NOT NULL DEFAULT true,
    saturday BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla pivote para relacionar paros con entradas de producción
CREATE TABLE production_programmed_stops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    production_entry_id TEXT REFERENCES production_entries(id),
    programmed_stop_id UUID REFERENCES programmed_stops(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(production_entry_id, programmed_stop_id)
);

-- Tabla para factores de corrección
CREATE TABLE correction_factors (
    id VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para ajustes de meta
CREATE TABLE target_adjustments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entry_date DATE NOT NULL,
    shift INTEGER NOT NULL,
    line_id TEXT REFERENCES production_lines(id),
    correction_factor_id VARCHAR REFERENCES correction_factors(id),
    description TEXT NOT NULL,
    adjustment_percentage DECIMAL NOT NULL,
    apply_to_full_shift BOOLEAN DEFAULT true,
    start_hour TIME,
    end_hour TIME,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    CONSTRAINT valid_percentage CHECK (adjustment_percentage BETWEEN -100 AND 100),
    CONSTRAINT valid_hours CHECK (
        (apply_to_full_shift = true) OR 
        (start_hour IS NOT NULL AND end_hour IS NOT NULL AND start_hour < end_hour)
    )
);

-- Campos adicionales en production_entries
ALTER TABLE production_entries
ADD COLUMN available_minutes INTEGER,
ADD COLUMN target_adjustment_percentage DECIMAL,
ADD CONSTRAINT valid_available_minutes 
    CHECK (available_minutes >= 0 AND available_minutes <= 60),
ADD CONSTRAINT valid_adjustment_percentage 
    CHECK (target_adjustment_percentage >= -100 AND target_adjustment_percentage <= 100);
```

### 2. Servicios Implementados

#### Target Calculation Service
```typescript
interface TargetCalculationService {
  calculateEffectiveTarget(
    baseTarget: number,
    entryDate: string,
    shift: number,
    lineId: string,
    hour: string
  ): Promise<{
    effectiveTarget: number;
    availableMinutes: number;
    adjustmentPercentage: number;
  }>;
}
```

#### Target Adjustment Service
```typescript
interface TargetAdjustmentService {
  calculateAdjustedTarget(
    hourlyTarget: number,
    entryDate: string,
    shift: number,
    lineId: string,
    hour: string
  ): Promise<number>;
}
```

### 3. Sistema de Cálculo de Meta Efectiva

El sistema ahora implementa un cálculo de meta en dos niveles:

1. **Ajuste por Tiempo Disponible**
```typescript
tiempoDisponible = 60 - sumaDuracionParosProgramados;
metaAjustadaTiempo = metaBase * (tiempoDisponible / 60);
```

2. **Ajuste por Factores de Corrección**
```typescript
metaFinal = metaAjustadaTiempo * (1 - porcentajeAjuste/100);
```

Donde:
- `metaBase`: Meta original calculada por HC
- `tiempoDisponible`: Minutos disponibles después de paros programados
- `porcentajeAjuste`: Suma de ajustes aplicables por factores de corrección

## Consideraciones Técnicas

### 1. Índices Recomendados
```sql
CREATE INDEX idx_production_entries_hour ON production_entries(hour);
CREATE INDEX idx_production_entries_shift ON production_entries(shift_id);
CREATE INDEX idx_production_entries_part_number ON production_entries(part_number);
CREATE INDEX idx_causes_production_entry ON causes(production_entry_id);
CREATE INDEX idx_target_adjustments_shift ON target_adjustments(shift_id);
```

### 2. Constraints Importantes
```sql
-- Validación de porcentajes
ALTER TABLE target_adjustments 
ADD CONSTRAINT valid_percentage 
CHECK (percentage BETWEEN -100 AND 100);

-- Validación de HC
ALTER TABLE production_entries
ADD CONSTRAINT valid_headcount
CHECK (real_head_count >= 0);

-- Validación de horas
ALTER TABLE production_entries
ADD CONSTRAINT valid_hour_format
CHECK (hour ~* '^([0-1]?[0-9]|2[0-3]):[0-5][0-9] (a\.m\.|p\.m\.)$');
```

### 3. Triggers Necesarios
- Actualización automática de timestamps
- Validación de orden secuencial
- Cálculo automático de deltas
- Registro de auditoría de cambios

## Integración Frontend-Backend

### 1. Endpoints Principales
```typescript
// Producción
POST /api/production-entries
PUT /api/production-entries/:id
GET /api/production-entries?shift=:shiftId&date=:date

// Ajustes
POST /api/target-adjustments
POST /api/support-adjustments
GET /api/adjustments/active?shift=:shiftId

// Configuración
GET /api/part-numbers
GET /api/programmed-stops
GET /api/causes
```

### 2. Websockets
- Notificaciones de nuevos registros
- Actualización en tiempo real de ajustes
- Alertas de desviaciones significativas

### 3. Caché
- Catálogos (part numbers, paros, causas)
- Configuraciones de turno
- Ajustes activos

## Funcionalidades Principales

### 1. Registro por Hora
- Permite el registro de datos de producción en franjas horarias
- Cada franja tiene campos para HC Real, HC Adicional, Work Order, Part Number, etc.
- Sistema de validación para asegurar registro secuencial
- Coloración automática según tiempo de registro

### 2. Validaciones de Tiempo
```typescript
// Códigos de color según tiempo de registro:
- Verde: ≤ 15 minutos después del fin de la hora
- Amarillo: Entre 15-30 minutos después
- Rojo: > 30 minutos después
```

### 3. Registro de Horas Extra
- Funcionalidad para agregar horas extra después del horario normal
- Se mantiene la secuencia horaria correcta
- Identificación visual clara de horas extra (fondo azul)
- Validación para evitar duplicados

### 4. Reglas de Negocio

#### Registro Secuencial
```typescript
// Validación de orden de registro:
1. No se permite saltar horas sin completar las anteriores
2. Cada franja debe tener al menos:
   - HC Real
   - Work Order
   - Part Number
   - Producción del día
```

#### Tiempo de Registro
```typescript
// Ventanas de tiempo para registro:
1. Registro inmediato: primeros 15 minutos (verde)
2. Registro tardío: 15-30 minutos (amarillo)
3. Registro crítico: >30 minutos (rojo)
```

## Componentes Principales

### ProductionTable
```typescript
// Componente principal que maneja:
1. Registro de datos por hora
2. Validaciones de tiempo y secuencia
3. Gestión de horas extra
4. Cálculos automáticos
```

### Funciones Utilitarias

#### generateNextHour
```typescript
// Genera la siguiente hora en formato 12 horas
// Ejemplo: "02:00 p.m. - 03:00 p.m." -> "03:00 p.m. - 04:00 p.m."
```

#### getRowBackgroundColor
```typescript
// Determina el color de fondo según:
1. Tiempo de registro
2. Si es hora extra
3. Estado de validación
```

## Guía de Implementación

### Agregar Hora Extra
1. Usar el botón "Agregar Hora Extra"
2. Se genera automáticamente la siguiente hora
3. Se marca visualmente como hora extra
4. Mantiene todas las funcionalidades de registro normal

### Validaciones
1. Verificar completitud de datos anteriores
2. Validar tiempo de registro
3. Evitar duplicados de horas extra
4. Mantener integridad de datos

### Consideraciones Técnicas
- Manejar correctamente formatos de 12/24 horas
- Considerar cambios de día en turnos nocturnos
- Mantener consistencia en cálculos de metas
- Preservar funcionalidad de copiar valores

## Políticas y Directrices

### 1. Gestión de Datos
- **Integridad de Datos**
  - Todos los registros deben tener trazabilidad (quién y cuándo)
  - No se permite eliminación física de registros, solo desactivación
  - Validación obligatoria de datos antes de guardar
  - Backups automáticos diarios

- **Modificación de Datos**
  - Ventana de edición de 24 horas para registros de producción
  - Cambios posteriores requieren aprobación de supervisor
  - Toda modificación debe registrar motivo del cambio
  - Mantener historial de cambios completo

### 2. Seguridad
- **Control de Acceso**
  - Autenticación obligatoria para todas las operaciones
  - Roles estrictamente definidos por área y función
  - Sesiones expiran después de 8 horas de inactividad
  - 2FA requerido para roles administrativos

- **Permisos por Rol**
  - Operadores: Solo vista y entrada de datos
  - Líderes: Gestión de datos de su línea/turno
  - Supervisores: Aprobaciones y configuraciones
  - Administradores: Configuración del sistema

### 3. Cálculos y Validaciones
- **Metas de Producción**
  - Cálculo automático basado en:
    ```
    Meta = Run Rate * (Tiempo Disponible/60) * Yield * (HC Real/HC Teórico)
    ```
  - Redondeo sin decimales
  - Validación contra capacidad máxima
  - Alertas automáticas por desviaciones

- **Tiempos y Paros**
  - Tiempo disponible máximo: 60 minutos por hora
  - Paros programados deben registrarse antes del turno
  - Tiempo muerto calculado automáticamente
  - No permitir solapamiento de paros

### 4. Interfaz de Usuario
- **Entrada de Datos**
  - Campos obligatorios claramente marcados
  - Validación en tiempo real
  - Autocompletado para campos comunes
  - Confirmación para acciones críticas

- **Visualización**
  - Código de colores consistente para estados
  - Formato de números estandarizado
  - Responsivo para todos los dispositivos
  - Modo oscuro disponible

### 5. Rendimiento
- **Optimización**
  - Tiempo de carga máximo: 3 segundos
  - Paginación para listas largas
  - Caché de datos estáticos
  - Compresión de respuestas

- **Disponibilidad**
  - Uptime objetivo: 99.9%
  - Mantenimientos programados fuera de horario
  - Failover automático
  - Monitoreo continuo

### 6. Auditoría y Cumplimiento
- **Registro de Actividad**
  - Logging de todas las operaciones críticas
  - Registro de intentos de acceso fallidos
  - Monitoreo de patrones inusuales
  - Retención de logs por 1 año

- **Reportes**
  - Exportación en formatos estándar (Excel, PDF)
  - Programación de reportes automáticos
  - Firma digital en reportes oficiales
  - Archivado automático

# Sistema de Gestión de Producción - Instrucciones

## Ajustes y Configuraciones

### Ajustes de Meta de Producción
El sistema permite realizar ajustes a las metas de producción para adaptarse a diferentes situaciones:

1. **Acceso a Ajustes**
   - Hacer clic en el botón "Ajustar Metas" en la parte superior derecha
   - Se abrirá un modal con dos pestañas: "Ajuste a Meta de Producción" y "Personal de Soporte"

2. **Ajuste de Metas**
   - **Alcance del Ajuste**: 
     - Todo el turno
     - Hora específica (cuando aplique)
   - **Factores de Corrección**:
     - Operador Nuevo (curva de aprendizaje)
     - Cambio de Proceso
     - Variación de Material
     - Condición de Equipo
     - Factores Ambientales
   - **Campos Requeridos**:
     - Tipo de Factor
     - Descripción del ajuste
     - Porcentaje de ajuste (0-100%)

3. **Configuración de Personal de Soporte**
   - Permite configurar el personal de soporte por turno
   - Posiciones disponibles:
     - Líder (valor estándar: 2)
     - DHR (valor estándar: 0.5)
     - Equipment (valor estándar: 0.5)
     - Trainer (valor estándar: 0.5)
     - Back up (valor estándar: 0)
     - Tira etiquetas (valor estándar: 0)
   - Los valores se pueden ajustar en incrementos de 0.5

### Visualización de Ajustes Activos

1. **Panel de Ajustes Activos**
   - Ubicado en la parte superior de la tabla
   - Muestra dos secciones:
     - Ajustes de Meta Activos
     - Personal de Soporte Configurado

2. **Ajustes de Meta**
   - Muestra el tipo de ajuste
   - Porcentaje aplicado
   - Alcance (turno completo u hora específica)
   - Descripción del ajuste

3. **Personal de Soporte**
   - Muestra la configuración actual por turno
   - Lista todas las posiciones con sus valores asignados
   - Indica quién realizó el último ajuste y cuándo

### Consideraciones Importantes

1. **Permisos y Accesos**
   - Los ajustes pueden realizarse al inicio del turno
   - No es necesario tener datos ingresados para configurar ajustes
   - Los ajustes afectarán a las entradas existentes y futuras

2. **Impacto en Cálculos**
   - Los ajustes de meta modifican el objetivo de producción
   - Se indica con un asterisco (*) cuando una meta ha sido ajustada
   - El delta se recalcula automáticamente considerando los ajustes

3. **Persistencia**
   - Los ajustes se mantienen durante todo el turno
   - La configuración de personal de soporte es por turno
   - Se mantiene un historial de quién realizó los ajustes

## Otras Funcionalidades Existentes

## Flujo Principal del Negocio

### 1. Inicio de Turno
1. **Configuración Inicial**
   - El líder establece el HC Real para todo el turno
   - Se configuran los paros programados predefinidos
   - Se define Work Order y Part Number

2. **Cálculo Automático de Metas**
   ```typescript
   Meta por Hora = Run Rate * (Tiempo Disponible/60) * Yield * (HC Real/HC Teórico)
   ```
   Donde:
   - Run Rate: Velocidad estándar del part number
   - Tiempo Disponible: 60 minutos - tiempo de paro programado
   - HC Real: Personal presente en la línea
   - HC Teórico: Personal estándar requerido para la línea

### 2. Registro de Producción

#### Secuencia de Registro
1. **Datos Base Requeridos**
   - HC Real (obligatorio)
   - Work Order (obligatorio)
   - Part Number (obligatorio)
   - Paros Programados (opcional)

2. **Registro por Hora**
   - Producción del día (unidades producidas)
   - Delta (calculado automáticamente)
   - Causas (obligatorio si delta es negativo)

#### Validaciones de Registro
1. **Orden Secuencial**
   - No se puede registrar producción en hora N+1 sin completar hora N
   - Si hay delta negativo en hora N, requiere causas antes de hora N+1

2. **Distribución de Causas**
   - Las unidades distribuidas en causas deben igualar el delta negativo
   - Múltiples causas pueden registrarse para un mismo delta

## Endpoints Necesarios

### 1. Configuración
```typescript
// GET /api/configuration
interface Configuration {
  programmedStops: {
    id: string;
    name: string;
    timeReduction: number; // minutos
  }[];
  presets: {
    id: string;
    name: string;
    lineId: string;
    shiftNumber: number;
    programmedStops: {
      hour: string;
      stopName: string;
    }[];
  }[];
}
```

### 2. Producción
```typescript
// GET /api/production/{shiftId}
interface ProductionEntry {
  id: string;
  hour: string;
  realHeadCount: number | null;
  additionalHC: number | null;
  programmedStop: string;
  availableTime: number; // minutos
  workOrder: string;
  partNumber: string;
  hourlyTarget: number;
  dailyProduction: number | null;
  delta: number;
  downtime: number;
  causes: CauseEntry[];
  registeredAt: Date;
}

// POST /api/production/{shiftId}/entry
interface ProductionEntryInput {
  hour: string;
  realHeadCount?: number;
  additionalHC?: number;
  programmedStop?: string;
  workOrder?: string;
  partNumber?: string;
  dailyProduction?: number;
}

// POST /api/production/{shiftId}/entry/{entryId}/causes
interface CauseEntry {
  typeCause: string;
  generalCause?: string;
  specificCause?: string;
  units: number;
  downtime?: number;
}
```

### 3. Validaciones
```typescript
// GET /api/validation/can-edit-production
interface ValidationRequest {
  shiftId: string;
  hour: string;
  currentTime: Date;
}

interface ValidationResponse {
  canEdit: boolean;
  message?: string;
  timeStatus: 'onTime' | 'late' | 'critical';
}
```

## Reglas de Negocio Críticas

### 1. Cálculos
- Meta por hora se calcula al tener HC Real y Part Number
- Delta = Producción Real - Meta por Hora
- Tiempo Muerto = Delta negativo / (Meta por Hora / 60)

### 2. Validaciones
- No permitir registro futuro
- Validar orden secuencial de registro
- Requerir causas para delta negativo
- Validar distribución completa de unidades en causas

### 3. Persistencia
- Mantener historial de cambios
- Registrar usuario y timestamp en cada operación
- No permitir eliminación, solo desactivación

## Consideraciones Técnicas

### 1. Performance
- Implementar caché para datos estáticos (configuraciones, presets)
- Paginación para históricos
- Batch updates para cambios masivos (HC Real)

### 2. Seguridad
- Validación de roles y permisos por endpoint
- Rate limiting para prevenir sobrecarga
- Sanitización de inputs

### 3. Monitoreo
- Logging de operaciones críticas
- Métricas de performance
- Alertas por desviaciones significativas

## Integración Frontend-Backend

### 1. Sincronización
- Polling cada 5 minutos para actualizaciones
- WebSocket para notificaciones en tiempo real
- Manejo de conflictos de edición concurrente

### 2. Manejo de Errores
- Códigos de error específicos por validación
- Mensajes de error amigables para usuario
- Retry automático para operaciones fallidas

### 3. Formato de Datos
- Timestamps en UTC
- Números con 2 decimales máximo
- Strings sanitizados

## Dashboard de Líder

### Estructura de KPIs

#### 1. KPIs Principales
- **Meta del Turno**
  - Muestra la meta específica del turno actual
  - Producción actual vs meta
  - Indicador visual de delta (positivo/negativo)

- **Eficiencia de Tiempo**
  ```typescript
  Eficiencia T = (Horas ganadas/horas pagadas) * 100
  donde:
  - Horas ganadas = Meta de franja horaria * Labor Standard
  - Horas pagadas = HC Real * 1 hora
  ```

- **Eficiencia de Mix**
  ```typescript
  // Por franja horaria:
  Eficiencia M = (Volumen Real * Labor Standard) / (HC Real * 1h)
  
  // Para turno completo:
  Eficiencia M = (Volumen Real * Labor Standard) / (HC Real * 8h)
  ```

- **Head Count**
  - HC Real vs Requerido
  - Indicador de faltante
  - Porcentaje de cumplimiento

#### 2. KPIs Acumulados
- **Producción Acumulada**
  - Meta acumulada vs Producción real acumulada
  - Barra de progreso visual
  - Porcentaje de cumplimiento

- **Delta Acumulado**
  - Diferencia acumulada entre producción real y meta
  - Indicador visual positivo/negativo
  - Tendencia de producción

- **Tiempo Perdido Acumulado**
  ```typescript
  Tiempo Muerto = Delta negativo / (Meta por Hora / 60)
  ```
  - Visualización en minutos y horas
  - Acumulación por turno

- **Eficiencia Acumulada**
  - Eficiencia global del turno hasta el momento
  - Barra de progreso vs meta (95%)
  - Tendencia de eficiencia

### Visualización de Datos

1. **Código de Colores**
   - Verde: Cumplimiento de meta/eficiencia
   - Amarillo: Atención requerida
   - Rojo: Estado crítico

2. **Actualizaciones**
   - Los KPIs se actualizan con cada registro en ProductionSheet
   - Cálculos en tiempo real
   - Indicadores visuales de cambios

3. **Interactividad**
   - Tooltips con información detallada
   - Enlaces rápidos a secciones relevantes
   - Filtros por turno/línea cuando aplique

### Integración con Otros Módulos

1. **ProductionSheet**
   - Sincronización automática de datos
   - Actualización de KPIs en tiempo real
   - Preservación de históricos

2. **Alertas y Acciones**
   - Generación automática basada en KPIs
   - Priorización visual
   - Seguimiento de acciones correctivas

## Estructura de Componentes UI

### Componentes de Autenticación
#### LoginForm
- Maneja la autenticación de usuarios
- Campos: email y contraseña
- Estado de carga durante autenticación
- Manejo de errores de credenciales
- Opción "Recordar sesión"
- Recuperación de contraseña

### Componentes de Layout
#### Layout Principal
```typescript
// Estructura jerárquica de componentes:
Layout
├── Sidebar
│   └── UserMenu
└── Footer
```

#### Header
- Barra superior fija
- Título del sistema
- Notificaciones (badge con contador)
- Menú de usuario
- Integración con sistema de autenticación

#### Footer
- Enlaces a documentación legal
- Enlaces de ayuda
- Copyright
- Información de la empresa

#### Sidebar
- Menú de navegación principal
- Secciones colapsables
- Iconografía consistente
- Soporte para submenús
- Toggle para colapsar/expandir
- Indicador visual de ruta activa

#### UserMenu
- Perfil del usuario actual
- Información básica del usuario
- Acceso rápido a configuraciones
- Toggle modo oscuro/claro
- Opción de cierre de sesión
- Menú desplegable con opciones

### Componentes de Usuario
#### AddUserModal
- Formulario de creación de usuarios
- Campos:
  - Nombre completo
  - Email
  - Rol
  - Área
  - Línea
  - Turno
  - Contraseña
- Validaciones en tiempo real
- Selección de roles predefinidos
- Gestión de áreas y turnos

#### AddRoleModal
- Gestión de roles y permisos
- Agrupación de permisos por módulo
- Interfaz de selección múltiple
- Descripción detallada de permisos
- Validaciones de permisos requeridos

### Componentes Utilitarios
#### Tabs
- Sistema de pestañas reutilizable
- Contexto para gestión de estado
- Soporte para contenido dinámico
- Estilizado consistente
- API flexible para implementación

### Consideraciones de Diseño
1. **Consistencia Visual**
   - Paleta de colores corporativa
   - Iconografía coherente (Lucide Icons)
   - Espaciado y tipografía estandarizados

2. **Responsividad**
   - Adaptación a diferentes tamaños de pantalla
   - Sidebar colapsable en móviles
   - Menús adaptables

3. **Accesibilidad**
   - Labels semánticos
   - Soporte para navegación por teclado
   - Mensajes de error claros
   - Estados de foco visibles

4. **Estado y Gestión de Datos**
   - Manejo consistente de formularios
   - Validaciones en tiempo real
   - Feedback visual de acciones
   - Persistencia de preferencias de usuario

5. **Seguridad**
   - Protección de rutas
   - Validación de permisos
   - Timeouts de sesión
   - Sanitización de inputs

### Integración con Backend
1. **Endpoints Requeridos**
```typescript
// Autenticación
POST /api/auth/login
POST /api/auth/logout
GET /api/auth/me

// Usuarios
GET /api/users
POST /api/users
PUT /api/users/:id
DELETE /api/users/:id

// Roles
GET /api/roles
POST /api/roles
PUT /api/roles/:id
DELETE /api/roles/:id
```

2. **Manejo de Estado**
- Contexto global para autenticación
- Estado local para formularios
- Caché de datos frecuentes
- Revalidación periódica

3. **Seguridad**
- Tokens JWT
- Refresh tokens
- CSRF protection
- Validación de permisos por ruta
```

## Estructura de la Interfaz de Usuario

### 1. Organización de Páginas

#### Módulo de Acciones
- **ActionPlansHistory**: Vista histórica de planes de acción
  - Filtros por área y estado
  - Vista de Pareto
  - Seguimiento de acciones
- **NewActionPlan**: Creación de nuevos planes
  - Proceso en 3 pasos: Info general, Pareto, Plan
  - Análisis de causas
  - Formulario de acciones

#### Módulo de Dashboards
- **LeaderDashboard**: Panel para líderes
  - KPIs principales
  - Estadísticas acumuladas
  - Alertas y acciones requeridas
- **ProductionDashboard**: Panel de producción
  - Metas vs real
  - Headcount
  - Estado del sistema
- **SupervisorDashboard**: Panel para supervisores
  - Vista general de líneas
  - Eficiencia promedio
  - Estado de líneas

#### Módulo de Ayuda
- **HelpPage**: Centro de soporte
  - Chat en vivo
  - Sistema de tickets
  - Información de contacto
- **KnowledgeBasePage**: Base de conocimiento
  - Tutoriales
  - FAQs
  - Artículos de ayuda

#### Módulo Legal
- **PrivacyPolicy**: Política de privacidad
  - Datos recopilados
  - Derechos de usuarios
  - Contacto de privacidad
- **TermsOfService**: Términos de uso
  - Acceso al sistema
  - Propiedad intelectual
  - Modificaciones de términos

### 2. Estructura de Navegación
```typescript
interface RouteStructure {
  actions: {
    history: '/actions/history',
    new: '/actions/new'
  },
  dashboards: {
    leader: '/dashboards/leader',
    supervisor: '/dashboards/supervisor',
    production: '/dashboards/production'
  },
  help: {
    main: '/help',
    knowledgeBase: '/help/knowledge-base'
  },
  legal: {
    privacy: '/legal/privacy',
    terms: '/legal/terms'
  }
}
```

### 3. Componentes Compartidos
- **Filtros**: Componentes reutilizables para filtrado
- **Tablas**: Visualización de datos tabulares
- **Gráficos**: Componentes de visualización estadística
- **Formularios**: Elementos de entrada estandarizados
- **Alertas**: Sistema unificado de notificaciones

### 4. Temas y Estilos
- Uso consistente de Tailwind CSS
- Sistema de colores corporativo
- Componentes responsivos
- Accesibilidad incorporada

## Estado Actual del Proyecto

### Base de Datos (Supabase)

#### 1. Tablas Implementadas
```sql
-- Value Streams
CREATE TABLE value_streams (
  id VARCHAR PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true
);

-- Production Lines
CREATE TABLE production_lines (
  id VARCHAR PRIMARY KEY,
  name VARCHAR NOT NULL,
  value_stream_id VARCHAR REFERENCES value_streams(id),
  is_active BOOLEAN DEFAULT true
);

-- Part Numbers
CREATE TABLE part_numbers (
  code VARCHAR PRIMARY KEY,
  description TEXT NOT NULL,
  value_stream_id VARCHAR REFERENCES value_streams(id),
  labor_std DECIMAL(10,3) NOT NULL,
  total_hc INTEGER NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Run Rates
CREATE TABLE run_rates (
  id SERIAL PRIMARY KEY,
  part_number_code VARCHAR REFERENCES part_numbers(code),
  rate INTEGER NOT NULL,
  head_count INTEGER NOT NULL,
  shift VARCHAR,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

#### 2. Scripts de Inicialización
```typescript
src/
└── scripts/
    ├── initValueStreams.js     # Carga value streams iniciales
    ├── initProductionLines.js  # Carga líneas de producción
    ├── initPartNumbers.js      # Carga números de parte
    ├── initRunRates.js        # Carga run rates y head counts
    └── runInit.ts             # Script principal de inicialización
```

#### 3. Datos Maestros Cargados

##### Value Streams
- SPORT (Sports Medicine)
- ENT (Endoscopy)
- RECON (Reconstruction)

##### Production Lines
Ejemplo para SPORT:
- L03
- L04
- L05
[etc...]

##### Part Numbers
Ejemplo para L03:
- 29508 (Rate: 88, HC: 20)
- 88000 (Rate: 101, HC: 20)
- 29375 (Rate: 108, HC: 20)
[etc...]

### Cálculo de Objetivos

El sistema ahora implementa el cálculo de objetivos basado en:
```typescript
Meta = Run Rate * (HC Real / HC Teórico)

donde:
- Run Rate: Velocidad máxima del part number
- HC Real: Personal presente en línea
- HC Teórico: Personal necesario para Run Rate máximo (20 personas)
```

## Estructura de Base de Datos Implementada (Primera Fase)

### 1. Tablas de Producción y Ajustes
```sql
-- Tabla para los tipos de paros programados
CREATE TABLE programmed_stops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL UNIQUE,
    duration INTEGER NOT NULL CHECK (duration > 0 AND duration <= 60),
    weekday BOOLEAN NOT NULL DEFAULT true,
    saturday BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla pivote para relacionar paros con entradas de producción
CREATE TABLE production_programmed_stops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    production_entry_id TEXT REFERENCES production_entries(id),
    programmed_stop_id UUID REFERENCES programmed_stops(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(production_entry_id, programmed_stop_id)
);

-- Tabla para factores de corrección
CREATE TABLE correction_factors (
    id VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para ajustes de meta
CREATE TABLE target_adjustments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entry_date DATE NOT NULL,
    shift INTEGER NOT NULL,
    line_id TEXT REFERENCES production_lines(id),
    correction_factor_id VARCHAR REFERENCES correction_factors(id),
    description TEXT NOT NULL,
    adjustment_percentage DECIMAL NOT NULL,
    apply_to_full_shift BOOLEAN DEFAULT true,
    start_hour TIME,
    end_hour TIME,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    CONSTRAINT valid_percentage CHECK (adjustment_percentage BETWEEN -100 AND 100),
    CONSTRAINT valid_hours CHECK (
        (apply_to_full_shift = true) OR 
        (start_hour IS NOT NULL AND end_hour IS NOT NULL AND start_hour < end_hour)
    )
);

-- Campos adicionales en production_entries
ALTER TABLE production_entries
ADD COLUMN available_minutes INTEGER,
ADD COLUMN target_adjustment_percentage DECIMAL,
ADD CONSTRAINT valid_available_minutes 
    CHECK (available_minutes >= 0 AND available_minutes <= 60),
ADD CONSTRAINT valid_adjustment_percentage 
    CHECK (target_adjustment_percentage >= -100 AND target_adjustment_percentage <= 100);
```

### 2. Servicios Implementados

#### Target Calculation Service
```typescript
interface TargetCalculationService {
  calculateEffectiveTarget(
    baseTarget: number,
    entryDate: string,
    shift: number,
    lineId: string,
    hour: string
  ): Promise<{
    effectiveTarget: number;
    availableMinutes: number;
    adjustmentPercentage: number;
  }>;
}
```

#### Target Adjustment Service
```typescript
interface TargetAdjustmentService {
  calculateAdjustedTarget(
    hourlyTarget: number,
    entryDate: string,
    shift: number,
    lineId: string,
    hour: string
  ): Promise<number>;
}
```

### 3. Sistema de Cálculo de Meta Efectiva

El sistema ahora implementa un cálculo de meta en dos niveles:

1. **Ajuste por Tiempo Disponible**
```typescript
tiempoDisponible = 60 - sumaDuracionParosProgramados;
metaAjustadaTiempo = metaBase * (tiempoDisponible / 60);
```

2. **Ajuste por Factores de Corrección**
```typescript
metaFinal = metaAjustadaTiempo * (1 - porcentajeAjuste/100);
```

Donde:
- `metaBase`: Meta original calculada por HC
- `tiempoDisponible`: Minutos disponibles después de paros programados
- `porcentajeAjuste`: Suma de ajustes aplicables por factores de corrección

## Integración con Backend

### 1. Endpoints Requeridos
```typescript
// Autenticación
POST /api/auth/login
POST /api/auth/logout
GET /api/auth/me

// Usuarios
GET /api/users
POST /api/users
PUT /api/users/:id
DELETE /api/users/:id

// Roles
GET /api/roles
POST /api/roles
PUT /api/roles/:id
DELETE /api/roles/:id
```

### 2. Manejo de Estado
- Contexto global para autenticación
- Estado local para formularios
- Caché de datos frecuentes
- Revalidación periódica

### 3. Seguridad
- Tokens JWT
- Refresh tokens
- CSRF protection
- Validación de permisos por ruta
```

## Servicios Implementados

### Shift Service
```typescript
interface Shift {
  id: string;
  name: string;
  start_time: string;    // Formato: "HH:mm"
  end_time: string;      // Formato: "HH:mm"
  created_at: string;
  updated_at: string;
}

// Servicio para gestión de turnos
interface ShiftService {
  getAll(): Promise<Shift[]>;
}
```

### Componentes de Debug Implementados

#### ShiftTest
- Vista de debug para turnos
- Muestra información detallada de cada turno
- Formatea horas para mejor legibilidad
- Incluye timestamps de creación/actualización

### Estructura de Rutas de Debug
```typescript
interface DebugRoutes {
  'value-stream-test': ValueStreamDebugPage;
  'shift-test': ShiftDebugPage;
  'production-line-test': ProductionLineTest;
  'part-number-test': PartNumberTest;
  'programmed-stop-test': ProgrammedStopTest;
  'cause-test': CauseTest;
  'cause-type-test': CauseTypeTest;
}
```

### Servicios Completados
- [x] Value Stream Service
- [x] Production Line Service
- [x] Part Number Service
- [x] Programmed Stop Service
- [x] Cause Service
- [x] Cause Type Service
- [x] Shift Service

### Próximos Servicios a Implementar
- [ ] Production Entries Service
- [ ] Target Adjustments Service
- [ ] Support Adjustments Service

## APIs Implementados

### Work Orders API
```typescript
interface WorkOrderService {
  // Obtiene todos los work orders con sus franjas horarias
  getAll(): Promise<WorkOrder[]>;
  
  // Obtiene un work order específico por ID
  getById(id: string): Promise<WorkOrder>;
  
  // Crea una nueva entrada de work order
  create(data: CreateWorkOrderData): Promise<WorkOrder>;
  
  // Actualiza una entrada específica de work order
  update(entryId: string, data: Partial<CreateWorkOrderData>): Promise<WorkOrder>;
  
  // Elimina una entrada específica de work order
  delete(entryId: string): Promise<boolean>;
}

interface WorkOrder {
  id: string;
  part_number_code: string;
  time_slots: TimeSlot[];
}

interface TimeSlot {
  entry_id: string;
  hour: string;
  entry_date: string;
}

interface CreateWorkOrderData {
  work_order: string;
  part_number_code: string;
  entry_date: string;
  hour: string;
}
```

### Páginas de Debug Implementadas

#### WorkOrderDebugPage
- Vista de prueba para work orders
- Muestra lista de work orders agrupados
- Visualiza franjas horarias por work order
- Permite ver detalles de cada work order