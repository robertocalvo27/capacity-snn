// Valores stream disponibles
export const valueStreams = [
  { id: 'roadster', name: 'Roadster' },
  { id: 'sportsMedicine', name: 'Sports Medicine' },
  { id: 'ent', name: 'ENT' },
  { id: 'wound', name: 'Wound' }
];

// Estado de revisión de los inputs (mock - debería venir de una API en producción)
export interface StatusItem {
  complete: boolean;
  date: string | null;
}

export const inputReviewStatus: Record<string, StatusItem> = {
  buildPlan: { complete: true, date: '2024-01-15' },
  headcount: { complete: true, date: '2024-01-16' },
  runRates: { complete: false, date: null },
  yield: { complete: true, date: '2024-01-16' },
  downtimes: { complete: false, date: null }
};

// Mock de datos para cada tab
export const tabData = {
  buildPlan: [
    { id: 1, catalog: 'R_126_329990', pn: '4391', description: 'BEATH PIN 2.4MM', quantity: 1250, month: 'Enero', week: '1', status: 'approved', valueStream: 'Roadster' },
    { id: 2, catalog: 'R_126_329991', pn: '4230', description: 'BEATH PIN 2.4MM', quantity: 980, month: 'Enero', week: '1', status: 'approved', valueStream: 'Sports Medicine' },
    { id: 3, catalog: 'R_126_329992', pn: '4403', description: 'BEATH PIN 2.4MM', quantity: 2450, month: 'Enero', week: '1', status: 'approved', valueStream: 'Wound' },
    { id: 4, catalog: 'R_126_329993', pn: '2503-S', description: 'BEATH PIN 2.4MM', quantity: 1120, month: 'Enero', week: '1', status: 'approved', valueStream: 'Roadster' },
    { id: 5, catalog: 'R_126_329994', pn: '4565D', description: 'BEATH PIN 2.4MM', quantity: 750, month: 'Enero', week: '1', status: 'approved', valueStream: 'Sports Medicine' },
  ],
  headcount: [
    { id: 1, line: 'FA', operators: 12, supervisors: 1, month: 'Enero', status: 'approved' },
    { id: 2, line: 'Next', operators: 15, supervisors: 1, month: 'Enero', status: 'approved' },
    { id: 3, line: 'CER3', operators: 10, supervisors: 1, month: 'Enero', status: 'approved' },
  ],
  runRates: [
    { id: 1, pn: '4391', line: 'FA', rate: 150, uom: 'pcs/hr', month: 'Enero', status: 'pending' },
    { id: 2, pn: '4230', line: 'Next', rate: 130, uom: 'pcs/hr', month: 'Enero', status: 'pending' },
    { id: 3, pn: '4403', line: 'CER3', rate: 200, uom: 'pcs/hr', month: 'Enero', status: 'pending' },
  ],
  yield: [
    { id: 1, catalog: 'R_126_329990', pn: '4391', description: 'BEATH PIN 2.4MM', oct2023: 92, nov2023: 94, dec2023: 93, yield: 93, month: 'Enero', status: 'approved', valueStream: 'Roadster', selected: false, approvedBy: 'Juan Pérez', approvedAt: '2024-01-16T14:25:30.000Z' },
    { id: 2, catalog: 'R_126_329991', pn: '4230', description: 'BEATH PIN 2.4MM', oct2023: 88, nov2023: 89, dec2023: 90, yield: 89, month: 'Enero', status: 'approved', valueStream: 'Sports Medicine', selected: false, approvedBy: 'Juan Pérez', approvedAt: '2024-01-16T14:25:30.000Z' },
    { id: 3, catalog: 'R_126_329992', pn: '4403', description: 'BEATH PIN 2.4MM', oct2023: 95, nov2023: 94, dec2023: 96, yield: 95, month: 'Enero', status: 'approved', valueStream: 'Wound', selected: false, approvedBy: 'Juan Pérez', approvedAt: '2024-01-16T14:25:30.000Z' },
    { id: 4, catalog: 'R_126_329993', pn: '2503-S', description: 'BEATH PIN 2.4MM', oct2023: 90, nov2023: 92, dec2023: 91, yield: 91, month: 'Enero', status: 'pending', valueStream: 'Roadster', selected: false, approvedBy: null, approvedAt: null },
    { id: 5, catalog: 'R_126_329994', pn: '4565D', description: 'BEATH PIN 2.4MM', oct2023: 87, nov2023: 89, dec2023: 88, yield: 88, month: 'Enero', status: 'pending', valueStream: 'Sports Medicine', selected: false, approvedBy: null, approvedAt: null },
    { id: 6, catalog: 'E_126_329995', pn: '9902', description: 'CANNULATED DRILL BIT', oct2023: 91, nov2023: 90, dec2023: 92, yield: 91, month: 'Enero', status: 'pending', valueStream: 'ENT', selected: false, approvedBy: null, approvedAt: null },
    { id: 7, catalog: 'W_126_329996', pn: '7230', description: 'TITANIUM MESH', oct2023: 94, nov2023: 93, dec2023: 95, yield: 94, month: 'Enero', status: 'pending', valueStream: 'Wound', selected: false, approvedBy: null, approvedAt: null },
    { id: 8, catalog: 'R_126_329997', pn: '1350-S', description: 'BONE GRAFT', oct2023: 89, nov2023: 90, dec2023: 88, yield: 89, month: 'Enero', status: 'pending', valueStream: 'Roadster', selected: false, approvedBy: null, approvedAt: null },
    { id: 9, catalog: 'S_126_329998', pn: '6720', description: 'SUTURE ANCHOR', oct2023: 96, nov2023: 95, dec2023: 97, yield: 96, month: 'Enero', status: 'pending', valueStream: 'Sports Medicine', selected: false, approvedBy: null, approvedAt: null },
    { id: 10, catalog: 'E_126_329999', pn: '8841', description: 'CANNULA', oct2023: 93, nov2023: 94, dec2023: 92, yield: 93, month: 'Enero', status: 'pending', valueStream: 'ENT', selected: false, approvedBy: null, approvedAt: null },
  ],
  downtimes: [
    { id: 1, type: 'general', date: '2024-01-01', hours: 24, reason: 'Año Nuevo', description: 'Festivo nacional', area: 'RRHH', status: 'approved', selected: false, approvedBy: 'María González', approvedAt: '2024-01-16T14:30:00.000Z' },
    { id: 2, type: 'general', date: '2024-04-18', hours: 24, reason: 'Jueves Santo', description: 'Festivo Semana Santa', area: 'RRHH', status: 'approved', selected: false, approvedBy: 'María González', approvedAt: '2024-01-16T14:30:00.000Z' },
    { id: 3, type: 'general', date: '2024-04-19', hours: 24, reason: 'Viernes Santo', description: 'Festivo Semana Santa', area: 'RRHH', status: 'pending', selected: false, approvedBy: null, approvedAt: null },
    { id: 4, type: 'valueStream', date: '2024-01-15', hours: 8, reason: 'Capacitación', description: 'Entrenamiento en nuevos procesos', valueStream: 'Roadster', area: 'Operaciones', status: 'pending', selected: false, approvedBy: null, approvedAt: null },
    { id: 5, type: 'line', date: '2024-01-20', hours: 4, reason: 'Mantenimiento preventivo', description: 'Mantenimiento preventivo de equipos', valueStream: 'Sports Medicine', line: 'FA', area: 'Mantenimiento', status: 'pending', selected: false, approvedBy: null, approvedAt: null },
    { id: 6, type: 'general', date: '2024-05-01', hours: 24, reason: 'Día del Trabajo', description: 'Festivo nacional', area: 'RRHH', status: 'pending', selected: false, approvedBy: null, approvedAt: null },
    { id: 7, type: 'valueStream', date: '2024-02-10', hours: 8, reason: 'Inventario', description: 'Conteo de inventario físico', valueStream: 'ENT', area: 'Supply Chain', status: 'pending', selected: false, approvedBy: null, approvedAt: null },
    { id: 8, type: 'line', date: '2024-01-25', hours: 6, reason: 'Cambio de herramienta', description: 'Cambio de moldes y calibración', valueStream: 'Wound', line: 'Next', area: 'Producción', status: 'pending', selected: false, approvedBy: null, approvedAt: null },
  ]
};

// Logs de aprobaciones (historial)
export const approvalLogs = {
  yield: [
    { id: 1001, pn: '4391', description: 'BEATH PIN 2.4MM', yieldValue: 93, approvedBy: 'Juan Pérez', approvedAt: '2024-01-16T14:25:30.000Z', month: 'Enero' },
    { id: 1002, pn: '4230', description: 'BEATH PIN 2.4MM', yieldValue: 89, approvedBy: 'Juan Pérez', approvedAt: '2024-01-16T14:25:30.000Z', month: 'Enero' },
    { id: 1003, pn: '4403', description: 'BEATH PIN 2.4MM', yieldValue: 95, approvedBy: 'Juan Pérez', approvedAt: '2024-01-16T14:25:30.000Z', month: 'Enero' },
  ],
  downtimes: [
    { id: 2001, type: 'general', date: '2024-01-01', hours: 24, reason: 'Año Nuevo', description: 'Festivo nacional', valueStream: 'N/A', line: 'N/A', approvedBy: 'María González', approvedAt: '2024-01-16T14:30:00.000Z', area: 'RRHH' },
    { id: 2002, type: 'general', date: '2024-04-18', hours: 24, reason: 'Jueves Santo', description: 'Festivo Semana Santa', valueStream: 'N/A', line: 'N/A', approvedBy: 'María González', approvedAt: '2024-01-16T14:30:00.000Z', area: 'RRHH' },
  ]
}; 