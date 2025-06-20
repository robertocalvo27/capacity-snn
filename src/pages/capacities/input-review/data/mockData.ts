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
  downtimes: { complete: false, date: null },
  calendarDays: { complete: false, date: null },
  trainingCurves: { complete: false, date: null },
  summary: { complete: false, date: null }
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

// Tipos de posiciones/puestos disponibles
export const headcountPositions = [
  { code: 'OPER', name: 'Operario Fijo' },
  { code: 'TMP', name: 'Operario Temporal' },
  { code: 'LL', name: 'Line Leader' },
  { code: 'BU', name: 'Back Up' },
  { code: 'EQC', name: 'Equipment Clerk' },
  { code: 'DHR', name: 'DHR Clerk' },
  { code: 'QC', name: 'Quality Control' },
  { code: 'MH', name: 'Material Handler' },
  { code: 'TRG', name: 'Trainer' }
];

// Turnos disponibles
export const shifts = [
  { id: 1, name: 'Shift 1' },
  { id: 2, name: 'Shift 2' },
  { id: 3, name: 'Shift 3' }
];

// Estructura jerárquica para headcount
export const headcountData = [
  {
    id: 'sportsMedicine',
    name: 'Sports Medicine',
    expanded: false,
    lines: [
      {
        id: 1,
        name: 'Total',
        expanded: false,
        shifts: [
          {
            id: 1,
            name: 'Shift 1',
            positions: {
              'OPER': 140,
              'TMP': 0,
              'LL': 0,
              'BU': 0,
              'EQC': 0,
              'DHR': 0,
              'QC': 0,
              'MH': 0,
              'TRG': 0
            },
            total: 140
          },
          {
            id: 2,
            name: 'Shift 2',
            positions: {
              'OPER': 136,
              'TMP': 0,
              'LL': 0,
              'BU': 0,
              'EQC': 0,
              'DHR': 0,
              'QC': 0,
              'MH': 0,
              'TRG': 0
            },
            total: 136
          },
          {
            id: 3,
            name: 'Shift 3',
            positions: {
              'OPER': 0,
              'TMP': 0,
              'LL': 0,
              'BU': 0,
              'EQC': 0,
              'DHR': 0,
              'QC': 0,
              'MH': 0,
              'TRG': 0
            },
            total: 0
          }
        ],
        total: 276
      }
    ],
    shifts: [
      {
        id: 1,
        name: 'Shift 1',
        positions: {
          'OPER': 140,
          'TMP': 0,
          'LL': 0,
          'BU': 0,
          'EQC': 0,
          'DHR': 0,
          'QC': 0,
          'MH': 0,
          'TRG': 0
        },
        total: 140
      },
      {
        id: 2,
        name: 'Shift 2',
        positions: {
          'OPER': 136,
          'TMP': 0,
          'LL': 0,
          'BU': 0,
          'EQC': 0,
          'DHR': 0,
          'QC': 0,
          'MH': 0,
          'TRG': 0
        },
        total: 136
      },
      {
        id: 3,
        name: 'Shift 3',
        positions: {
          'OPER': 0,
          'TMP': 0,
          'LL': 0,
          'BU': 0,
          'EQC': 0,
          'DHR': 0,
          'QC': 0,
          'MH': 0,
          'TRG': 0
        },
        total: 0
      }
    ],
    total: 276
  },
  {
    id: 'ent',
    name: 'ENT',
    expanded: true,
    lines: [
      {
        id: 1,
        name: '6',
        expanded: false,
        shifts: [
          {
            id: 1,
            name: 'Shift 1',
            positions: {
              'OPER': 42,
              'TMP': 0,
              'LL': 0,
              'BU': 0,
              'EQC': 0,
              'DHR': 0,
              'QC': 0,
              'MH': 0,
              'TRG': 0
            },
            total: 42
          },
          {
            id: 2,
            name: 'Shift 2',
            positions: {
              'OPER': 35,
              'TMP': 0,
              'LL': 0,
              'BU': 0,
              'EQC': 0,
              'DHR': 0,
              'QC': 0,
              'MH': 0,
              'TRG': 0
            },
            total: 35
          },
          {
            id: 3,
            name: 'Shift 3',
            positions: {
              'OPER': 0,
              'TMP': 0,
              'LL': 0,
              'BU': 0,
              'EQC': 0,
              'DHR': 0,
              'QC': 0,
              'MH': 0,
              'TRG': 0
            },
            total: 0
          }
        ],
        total: 77
      },
      {
        id: 2,
        name: '7',
        expanded: false,
        shifts: [
          {
            id: 1,
            name: 'Shift 1',
            positions: {
              'OPER': 41,
              'TMP': 0,
              'LL': 0,
              'BU': 0,
              'EQC': 0,
              'DHR': 0,
              'QC': 0,
              'MH': 0,
              'TRG': 0
            },
            total: 41
          },
          {
            id: 2,
            name: 'Shift 2',
            positions: {
              'OPER': 38,
              'TMP': 0,
              'LL': 0,
              'BU': 0,
              'EQC': 0,
              'DHR': 0,
              'QC': 0,
              'MH': 0,
              'TRG': 0
            },
            total: 38
          },
          {
            id: 3,
            name: 'Shift 3',
            positions: {
              'OPER': 0,
              'TMP': 0,
              'LL': 0,
              'BU': 0,
              'EQC': 0,
              'DHR': 0,
              'QC': 0,
              'MH': 0,
              'TRG': 0
            },
            total: 0
          }
        ],
        total: 79
      },
      {
        id: 3,
        name: '10,11',
        expanded: false,
        shifts: [
          {
            id: 1,
            name: 'Shift 1',
            positions: {
              'OPER': 19,
              'TMP': 0,
              'LL': 0,
              'BU': 0,
              'EQC': 0,
              'DHR': 0,
              'QC': 0,
              'MH': 0,
              'TRG': 0
            },
            total: 19
          },
          {
            id: 2,
            name: 'Shift 2',
            positions: {
              'OPER': 25,
              'TMP': 0,
              'LL': 0,
              'BU': 0,
              'EQC': 0,
              'DHR': 0,
              'QC': 0,
              'MH': 0,
              'TRG': 0
            },
            total: 25
          },
          {
            id: 3,
            name: 'Shift 3',
            positions: {
              'OPER': 0,
              'TMP': 0,
              'LL': 0,
              'BU': 0,
              'EQC': 0,
              'DHR': 0,
              'QC': 0,
              'MH': 0,
              'TRG': 0
            },
            total: 0
          }
        ],
        total: 44
      },
      {
        id: 4,
        name: 'Total',
        expanded: false,
        shifts: [
          {
            id: 1,
            name: 'Shift 1',
            positions: {
              'OPER': 102,
              'TMP': 0,
              'LL': 0,
              'BU': 0,
              'EQC': 0,
              'DHR': 0,
              'QC': 0,
              'MH': 0,
              'TRG': 0
            },
            total: 102
          },
          {
            id: 2,
            name: 'Shift 2',
            positions: {
              'OPER': 98,
              'TMP': 0,
              'LL': 0,
              'BU': 0,
              'EQC': 0,
              'DHR': 0,
              'QC': 0,
              'MH': 0,
              'TRG': 0
            },
            total: 98
          },
          {
            id: 3,
            name: 'Shift 3',
            positions: {
              'OPER': 0,
              'TMP': 0,
              'LL': 0,
              'BU': 0,
              'EQC': 0,
              'DHR': 0,
              'QC': 0,
              'MH': 0,
              'TRG': 0
            },
            total: 0
          }
        ],
        total: 200
      }
    ],
    shifts: [
      {
        id: 1,
        name: 'Shift 1',
        positions: {
          'OPER': 102,
          'TMP': 0,
          'LL': 0,
          'BU': 0,
          'EQC': 0,
          'DHR': 0,
          'QC': 0,
          'MH': 0,
          'TRG': 0
        },
        total: 102
      },
      {
        id: 2,
        name: 'Shift 2',
        positions: {
          'OPER': 98,
          'TMP': 0,
          'LL': 0,
          'BU': 0,
          'EQC': 0,
          'DHR': 0,
          'QC': 0,
          'MH': 0,
          'TRG': 0
        },
        total: 98
      },
      {
        id: 3,
        name: 'Shift 3',
        positions: {
          'OPER': 0,
          'TMP': 0,
          'LL': 0,
          'BU': 0,
          'EQC': 0,
          'DHR': 0,
          'QC': 0,
          'MH': 0,
          'TRG': 0
        },
        total: 0
      }
    ],
    total: 200
  },
  {
    id: 'jointRepair',
    name: 'Joint Repair',
    expanded: false,
    lines: [
      {
        id: 1,
        name: 'Total',
        expanded: false,
        shifts: [
          {
            id: 1,
            name: 'Shift 1',
            positions: {
              'OPER': 51,
              'TMP': 0,
              'LL': 0,
              'BU': 0,
              'EQC': 0,
              'DHR': 0,
              'QC': 0,
              'MH': 0,
              'TRG': 0
            },
            total: 51
          },
          {
            id: 2,
            name: 'Shift 2',
            positions: {
              'OPER': 51,
              'TMP': 0,
              'LL': 0,
              'BU': 0,
              'EQC': 0,
              'DHR': 0,
              'QC': 0,
              'MH': 0,
              'TRG': 0
            },
            total: 51
          },
          {
            id: 3,
            name: 'Shift 3',
            positions: {
              'OPER': 0,
              'TMP': 0,
              'LL': 0,
              'BU': 0,
              'EQC': 0,
              'DHR': 0,
              'QC': 0,
              'MH': 0,
              'TRG': 0
            },
            total: 0
          }
        ],
        total: 102
      }
    ],
    shifts: [
      {
        id: 1,
        name: 'Shift 1',
        positions: {
          'OPER': 51,
          'TMP': 0,
          'LL': 0,
          'BU': 0,
          'EQC': 0,
          'DHR': 0,
          'QC': 0,
          'MH': 0,
          'TRG': 0
        },
        total: 51
      },
      {
        id: 2,
        name: 'Shift 2',
        positions: {
          'OPER': 51,
          'TMP': 0,
          'LL': 0,
          'BU': 0,
          'EQC': 0,
          'DHR': 0,
          'QC': 0,
          'MH': 0,
          'TRG': 0
        },
        total: 51
      },
      {
        id: 3,
        name: 'Shift 3',
        positions: {
          'OPER': 0,
          'TMP': 0,
          'LL': 0,
          'BU': 0,
          'EQC': 0,
          'DHR': 0,
          'QC': 0,
          'MH': 0,
          'TRG': 0
        },
        total: 0
      }
    ],
    total: 102
  },
  {
    id: 'regenetenFS',
    name: 'Regeneten & FS',
    expanded: false,
    lines: [
      {
        id: 1,
        name: 'Total',
        expanded: false,
        shifts: [
          {
            id: 1,
            name: 'Shift 1',
            positions: {
              'OPER': 87,
              'TMP': 0,
              'LL': 0,
              'BU': 0,
              'EQC': 0,
              'DHR': 0,
              'QC': 0,
              'MH': 0,
              'TRG': 0
            },
            total: 87
          },
          {
            id: 2,
            name: 'Shift 2',
            positions: {
              'OPER': 49,
              'TMP': 0,
              'LL': 0,
              'BU': 0,
              'EQC': 0,
              'DHR': 0,
              'QC': 0,
              'MH': 0,
              'TRG': 0
            },
            total: 49
          },
          {
            id: 3,
            name: 'Shift 3',
            positions: {
              'OPER': 0,
              'TMP': 0,
              'LL': 0,
              'BU': 0,
              'EQC': 0,
              'DHR': 0,
              'QC': 0,
              'MH': 0,
              'TRG': 0
            },
            total: 0
          }
        ],
        total: 136
      }
    ],
    shifts: [
      {
        id: 1,
        name: 'Shift 1',
        positions: {
          'OPER': 87,
          'TMP': 0,
          'LL': 0,
          'BU': 0,
          'EQC': 0,
          'DHR': 0,
          'QC': 0,
          'MH': 0,
          'TRG': 0
        },
        total: 87
      },
      {
        id: 2,
        name: 'Shift 2',
        positions: {
          'OPER': 49,
          'TMP': 0,
          'LL': 0,
          'BU': 0,
          'EQC': 0,
          'DHR': 0,
          'QC': 0,
          'MH': 0,
          'TRG': 0
        },
        total: 49
      },
      {
        id: 3,
        name: 'Shift 3',
        positions: {
          'OPER': 0,
          'TMP': 0,
          'LL': 0,
          'BU': 0,
          'EQC': 0,
          'DHR': 0,
          'QC': 0,
          'MH': 0,
          'TRG': 0
        },
        total: 0
      }
    ],
    total: 136
  },
  {
    id: 'externalAreas',
    name: 'External Areas',
    expanded: false,
    lines: [
      {
        id: 1,
        name: 'Total',
        expanded: false,
        shifts: [
          {
            id: 1,
            name: 'Shift 1',
            positions: {
              'OPER': 108,
              'TMP': 0,
              'LL': 0,
              'BU': 0,
              'EQC': 0,
              'DHR': 0,
              'QC': 0,
              'MH': 0,
              'TRG': 0
            },
            total: 108
          },
          {
            id: 2,
            name: 'Shift 2',
            positions: {
              'OPER': 62,
              'TMP': 0,
              'LL': 0,
              'BU': 0,
              'EQC': 0,
              'DHR': 0,
              'QC': 0,
              'MH': 0,
              'TRG': 0
            },
            total: 62
          },
          {
            id: 3,
            name: 'Shift 3',
            positions: {
              'OPER': 0,
              'TMP': 0,
              'LL': 0,
              'BU': 0,
              'EQC': 0,
              'DHR': 0,
              'QC': 0,
              'MH': 0,
              'TRG': 0
            },
            total: 0
          }
        ],
        total: 170
      }
    ],
    shifts: [
      {
        id: 1,
        name: 'Shift 1',
        positions: {
          'OPER': 108,
          'TMP': 0,
          'LL': 0,
          'BU': 0,
          'EQC': 0,
          'DHR': 0,
          'QC': 0,
          'MH': 0,
          'TRG': 0
        },
        total: 108
      },
      {
        id: 2,
        name: 'Shift 2',
        positions: {
          'OPER': 62,
          'TMP': 0,
          'LL': 0,
          'BU': 0,
          'EQC': 0,
          'DHR': 0,
          'QC': 0,
          'MH': 0,
          'TRG': 0
        },
        total: 62
      },
      {
        id: 3,
        name: 'Shift 3',
        positions: {
          'OPER': 0,
          'TMP': 0,
          'LL': 0,
          'BU': 0,
          'EQC': 0,
          'DHR': 0,
          'QC': 0,
          'MH': 0,
          'TRG': 0
        },
        total: 0
      }
    ],
    total: 170
  },
  {
    id: 'wound',
    name: 'Wound',
    expanded: false,
    lines: [
      {
        id: 1,
        name: 'Total',
        expanded: false,
        shifts: [
          {
            id: 1,
            name: 'Shift 1',
            positions: {
              'OPER': 30,
              'TMP': 0,
              'LL': 0,
              'BU': 0,
              'EQC': 0,
              'DHR': 0,
              'QC': 0,
              'MH': 0,
              'TRG': 0
            },
            total: 30
          },
          {
            id: 2,
            name: 'Shift 2',
            positions: {
              'OPER': 10,
              'TMP': 0,
              'LL': 0,
              'BU': 0,
              'EQC': 0,
              'DHR': 0,
              'QC': 0,
              'MH': 0,
              'TRG': 0
            },
            total: 10
          },
          {
            id: 3,
            name: 'Shift 3',
            positions: {
              'OPER': 0,
              'TMP': 0,
              'LL': 0,
              'BU': 0,
              'EQC': 0,
              'DHR': 0,
              'QC': 0,
              'MH': 0,
              'TRG': 0
            },
            total: 0
          }
        ],
        total: 40
      }
    ],
    shifts: [
      {
        id: 1,
        name: 'Shift 1',
        positions: {
          'OPER': 30,
          'TMP': 0,
          'LL': 0,
          'BU': 0,
          'EQC': 0,
          'DHR': 0,
          'QC': 0,
          'MH': 0,
          'TRG': 0
        },
        total: 30
      },
      {
        id: 2,
        name: 'Shift 2',
        positions: {
          'OPER': 10,
          'TMP': 0,
          'LL': 0,
          'BU': 0,
          'EQC': 0,
          'DHR': 0,
          'QC': 0,
          'MH': 0,
          'TRG': 0
        },
        total: 10
      },
      {
        id: 3,
        name: 'Shift 3',
        positions: {
          'OPER': 0,
          'TMP': 0,
          'LL': 0,
          'BU': 0,
          'EQC': 0,
          'DHR': 0,
          'QC': 0,
          'MH': 0,
          'TRG': 0
        },
        total: 0
      }
    ],
    total: 40
  },
  {
    id: 'apollo',
    name: 'Apollo',
    expanded: false,
    lines: [
      {
        id: 1,
        name: 'Total',
        expanded: false,
        shifts: [
          {
            id: 1,
            name: 'Shift 1',
            positions: {
              'OPER': 7,
              'TMP': 0,
              'LL': 0,
              'BU': 0,
              'EQC': 0,
              'DHR': 0,
              'QC': 0,
              'MH': 0,
              'TRG': 0
            },
            total: 7
          },
          {
            id: 2,
            name: 'Shift 2',
            positions: {
              'OPER': 7,
              'TMP': 0,
              'LL': 0,
              'BU': 0,
              'EQC': 0,
              'DHR': 0,
              'QC': 0,
              'MH': 0,
              'TRG': 0
            },
            total: 7
          },
          {
            id: 3,
            name: 'Shift 3',
            positions: {
              'OPER': 6,
              'TMP': 0,
              'LL': 0,
              'BU': 0,
              'EQC': 0,
              'DHR': 0,
              'QC': 0,
              'MH': 0,
              'TRG': 0
            },
            total: 6
          }
        ],
        total: 20
      }
    ],
    shifts: [
      {
        id: 1,
        name: 'Shift 1',
        positions: {
          'OPER': 7,
          'TMP': 0,
          'LL': 0,
          'BU': 0,
          'EQC': 0,
          'DHR': 0,
          'QC': 0,
          'MH': 0,
          'TRG': 0
        },
        total: 7
      },
      {
        id: 2,
        name: 'Shift 2',
        positions: {
          'OPER': 7,
          'TMP': 0,
          'LL': 0,
          'BU': 0,
          'EQC': 0,
          'DHR': 0,
          'QC': 0,
          'MH': 0,
          'TRG': 0
        },
        total: 7
      },
      {
        id: 3,
        name: 'Shift 3',
        positions: {
          'OPER': 6,
          'TMP': 0,
          'LL': 0,
          'BU': 0,
          'EQC': 0,
          'DHR': 0,
          'QC': 0,
          'MH': 0,
          'TRG': 0
        },
        total: 6
      }
    ],
    total: 20
  },
  {
    id: 'totalSite',
    name: 'Total Site Operators',
    expanded: false,
    lines: [],
    shifts: [
      {
        id: 1,
        name: 'Shift 1',
        positions: {
          'OPER': 525,
          'TMP': 0,
          'LL': 0,
          'BU': 0,
          'EQC': 0,
          'DHR': 0,
          'QC': 0,
          'MH': 0,
          'TRG': 0
        },
        total: 525
      },
      {
        id: 2,
        name: 'Shift 2',
        positions: {
          'OPER': 413,
          'TMP': 0,
          'LL': 0,
          'BU': 0,
          'EQC': 0,
          'DHR': 0,
          'QC': 0,
          'MH': 0,
          'TRG': 0
        },
        total: 413
      },
      {
        id: 3,
        name: 'Shift 3',
        positions: {
          'OPER': 6,
          'TMP': 0,
          'LL': 0,
          'BU': 0,
          'EQC': 0,
          'DHR': 0,
          'QC': 0,
          'MH': 0,
          'TRG': 0
        },
        total: 6
      }
    ],
    total: 944
  }
]; 