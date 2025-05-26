# Sistema de Balance de Línea - Smith & Nephew

![Estado del Proyecto](https://img.shields.io/badge/estado-en%20desarrollo-green)
![Versión](https://img.shields.io/badge/versión-1.0.0-blue)
![Licencia](https://img.shields.io/badge/licencia-Privada-red)

Sistema web para el cálculo y optimización de balances de línea en la planta de Smith & Nephew en Costa Rica, enfocado en la asignación óptima de personal para maximizar la eficiencia y el rendimiento de producción.

## 🚀 Características

- ✅ Gestión de Part Numbers por Value Stream y Línea
- 📊 Definición de procesos con tiempos de ciclo y estaciones
- 👥 Cálculo de balances de línea con distribución de personal
- 🏭 Identificación automática de cuellos de botella
- 📈 Configuraciones de Head Count - Run Rate
- 📊 Visualización gráfica de balances operativos
- 💾 Histórico de configuraciones
- 📱 Diseño responsive

## 🛠️ Tecnologías

- **Frontend**: 
  - React + TypeScript
  - Tailwind CSS
  - Lucide Icons
  - Recharts para visualizaciones
  - React Hook Form

- **Backend**:
  - PostgreSQL
  - Supabase

## 📋 Prerrequisitos

```bash
node >= 18.0.0
npm >= 8.0.0
```

## 🚀 Instalación

1. Clonar el repositorio
```bash
git clone https://github.com/robertocalvo27/balance-run-rate-SNN.git
cd balance-run-rate-SNN
```

2. Instalar dependencias
```bash
npm install
```

3. Configurar variables de entorno
```bash
cp .env.example .env
```

4. Iniciar en desarrollo
```bash
npm run dev
```

## 📦 Estructura del Proyecto

```
src/
├── components/     # Componentes React
│   ├── auth/       # Componentes de autenticación
│   ├── layout/     # Componentes de estructura
│   ├── production/ # Componentes de producción
│   └── ui/         # Componentes de interfaz
├── contexts/       # Contextos de React
├── hooks/          # Custom hooks
├── pages/          # Páginas principales
├── types/          # Tipos TypeScript
├── lib/            # Utilidades y configuraciones
└── engineering/    # Componentes de ingeniería
```

## 🗃️ Modelos de Datos

### Entidades Principales
- PartNumber: Representa productos manufacturados
- Process: Pasos del proceso productivo
- ProcessBalance: Balance de proceso con personal asignado
- BalanceConfig: Configuración completa de balance
- HCRunRateConfig: Configuraciones de Head Count - Run Rate

## 📊 Módulos Principales

1. **Gestión de Part Numbers**
   - Catálogo de productos por Value Stream
   - Filtrado por línea de producción
   - Datos de Run Rate y Labor Standard

2. **Gestión de Procesos**
   - Definición de pasos de manufactura
   - Tiempos de ciclo y estaciones
   - Vinculación con Part Numbers

3. **Cálculo de Balances**
   - Distribución de personal
   - Identificación de cuellos de botella
   - Cálculo de Run Rate para diferentes configuraciones

4. **Visualización de Balances**
   - Gráficos de tiempo manual vs. flow time
   - Indicadores visuales de cuellos de botella
   - Distribución de personal por proceso

## 🧮 Algoritmos de Cálculo

- **calculateManualTime**: Calcula el tiempo manual por proceso
- **calculateUnitsPerHour**: Determina la capacidad productiva
- **calculateFlowTime**: Calcula el tiempo de flujo
- **findBottleneck**: Identifica el cuello de botella
- **distributePersonnel**: Distribuye el personal entre procesos

## 🗺️ Roadmap

- [ ] Optimización automática de balances
- [ ] Integración con datos reales de producción
- [ ] Simulación de escenarios de balance
- [ ] Exportación de reportes a Excel
- [ ] Módulo de comparación de configuraciones

## 👥 Equipo

- **Desarrollo**: Roberto Calvo
- **Product Owner**: [Nombre]
- **Usuario Final**: Ingeniería de Manufactura - Smith & Nephew

## 📞 Soporte

Para soporte, contactar a:
- Email: [email_soporte]
- Teams: [canal_teams]

---
⌨️ Desarrollado para Smith & Nephew Costa Rica