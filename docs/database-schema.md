# Esquema de Base de Datos - Sistema de Gestión de Producción

## Tablas Principales

### value_streams
```sql
CREATE TABLE value_streams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code varchar(10) NOT NULL UNIQUE,
  name varchar(100) NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### production_lines
```sql
CREATE TABLE production_lines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  value_stream_id uuid REFERENCES value_streams(id),
  code varchar(10) NOT NULL,
  name varchar(100) NOT NULL,
  description text,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(value_stream_id, code)
);
```

### shifts
```sql
CREATE TABLE shifts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(50) NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  duration integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### part_numbers
```sql
CREATE TABLE part_numbers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code varchar(50) NOT NULL UNIQUE,
  description text,
  run_rate_t1 integer NOT NULL,
  run_rate_t2 integer NOT NULL,
  run_rate_t3 integer NOT NULL,
  labor_std decimal(10,3) NOT NULL,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### programmed_stops
```sql
CREATE TABLE programmed_stops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(100) NOT NULL,
  duration integer NOT NULL,
  weekday boolean DEFAULT true,
  saturday boolean DEFAULT true,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### theoretical_capacity
```sql
CREATE TABLE theoretical_capacity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  line_id uuid REFERENCES production_lines(id),
  shift_id uuid REFERENCES shifts(id),
  theoretical_hc integer NOT NULL,
  effective_date date NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(line_id, shift_id, effective_date)
);
```

### yield_factors
```sql
CREATE TABLE yield_factors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  value_stream_id uuid REFERENCES value_streams(id),
  week_number integer NOT NULL,
  year integer NOT NULL,
  yield_t1 decimal(5,4) NOT NULL,
  yield_t2 decimal(5,4) NOT NULL,
  yield_t3 decimal(5,4) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(value_stream_id, week_number, year)
);
```

### production_entries
```sql
CREATE TABLE production_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  line_id uuid REFERENCES production_lines(id),
  shift_id uuid REFERENCES shifts(id),
  entry_date date NOT NULL,
  hour_start time NOT NULL,
  hour_end time NOT NULL,
  real_head_count integer,
  programmed_stop_id uuid REFERENCES programmed_stops(id),
  available_time integer NOT NULL,
  work_order varchar(50),
  part_number_id uuid REFERENCES part_numbers(id),
  hourly_target integer NOT NULL,
  daily_production integer NOT NULL,
  delta integer NOT NULL,
  downtime integer NOT NULL,
  registered_by uuid REFERENCES auth.users(id),
  registered_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### causes
```sql
CREATE TABLE causes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(100) NOT NULL UNIQUE,
  description text,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### subcauses
```sql
CREATE TABLE subcauses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cause_id uuid REFERENCES causes(id),
  name varchar(100) NOT NULL,
  description text,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(cause_id, name)
);
```

### production_causes
```sql
CREATE TABLE production_causes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  production_entry_id uuid REFERENCES production_entries(id),
  cause_id uuid REFERENCES causes(id),
  subcause_id uuid REFERENCES subcauses(id),
  comments text,
  registered_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### action_plans
```sql
CREATE TABLE action_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title varchar(200) NOT NULL,
  description text,
  area varchar(50) NOT NULL,
  metric varchar(50) NOT NULL,
  responsible uuid REFERENCES auth.users(id),
  due_date date NOT NULL,
  status varchar(20) NOT NULL,
  progress integer DEFAULT 0,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### action_plan_items
```sql
CREATE TABLE action_plan_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action_plan_id uuid REFERENCES action_plans(id),
  description text NOT NULL,
  responsible uuid REFERENCES auth.users(id),
  due_date date NOT NULL,
  status varchar(20) NOT NULL,
  comments text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

## Políticas de Seguridad (RLS)

```sql
-- Ejemplo de política para production_entries
ALTER TABLE production_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view entries from their assigned lines"
  ON production_entries
  FOR SELECT
  USING (
    line_id IN (
      SELECT line_id 
      FROM user_line_assignments 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert entries for their assigned lines"
  ON production_entries
  FOR INSERT
  WITH CHECK (
    line_id IN (
      SELECT line_id 
      FROM user_line_assignments 
      WHERE user_id = auth.uid()
    )
  );
```

## Índices Recomendados

```sql
-- Índices para búsquedas frecuentes
CREATE INDEX idx_production_entries_date_line ON production_entries(entry_date, line_id);
CREATE INDEX idx_production_entries_shift ON production_entries(shift_id);
CREATE INDEX idx_production_causes_entry ON production_causes(production_entry_id);
CREATE INDEX idx_action_plans_status ON action_plans(status);
CREATE INDEX idx_action_plan_items_due_date ON action_plan_items(due_date);
```

## Notas de Implementación

1. Usar Supabase para:
   - Autenticación de usuarios
   - Almacenamiento de datos
   - Políticas de seguridad (RLS)
   - Tiempo real con suscripciones

2. Consideraciones:
   - Implementar triggers para updated_at
   - Usar tipos UUID para IDs
   - Mantener auditoría de cambios
   - Implementar soft delete donde sea necesario

3. Próximos pasos:
   - Crear migraciones iniciales
   - Configurar políticas RLS
   - Implementar funciones de utilidad
   - Configurar backups automáticos