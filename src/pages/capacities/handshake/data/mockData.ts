import type { 
  HandShakeSession, 
  VST_HandShakeData, 
  HandShakeStatusItem, 
  HandShakeApproval, 
  HandShakeConcern, 
  HandShakeAgreement 
} from '../../../../types/capacity';

// Status inicial del HandShake
export const handShakeStatus: HandShakeStatusItem = {
  vstReviewed: false,
  agreementsReached: false,
  concernsAddressed: false,
  approvalsReceived: false,
  finalSignoffComplete: false
};

// Datos mock de VSTs para HandShake
const mockVSTData: VST_HandShakeData[] = [
  {
    id: 'roadster',
    name: 'Roadster',
    demandHours: 8640,
    capacityHours: 9120,
    utilizationPercentage: 94.7,
    efficiency: 117.68,
    status: 'pending',
    approvals: [],
    concerns: [
      {
        id: 'concern_1',
        type: 'capacity',
        description: 'La utilización está muy cerca del límite máximo. Necesitamos considerar contingencias.',
        severity: 'medium',
        raisedBy: 'production_director',
        raisedAt: '2024-01-15T10:30:00Z',
        status: 'open'
      }
    ],
    agreements: [],
    lastUpdated: '2024-01-15T08:00:00Z'
  },
  {
    id: 'sports-medicine',
    name: 'Sports Medicine',
    demandHours: 7920,
    capacityHours: 8640,
    utilizationPercentage: 91.7,
    efficiency: 121.39,
    status: 'pending',
    approvals: [],
    concerns: [],
    agreements: [
      {
        id: 'agreement_sm_1',
        description: 'Mantener inventario de seguridad adicional durante Q1',
        type: 'commitment',
        agreedBy: ['production_director'],
        agreedAt: '2024-01-15T09:15:00Z',
        active: true
      }
    ],
    lastUpdated: '2024-01-15T09:15:00Z'
  },
  {
    id: 'wound',
    name: 'Wound',
    demandHours: 6480,
    capacityHours: 7200,
    utilizationPercentage: 90.0,
    efficiency: 106.98,
    status: 'pending',
    approvals: [],
    concerns: [],
    agreements: [],
    lastUpdated: '2024-01-15T08:00:00Z'
  },
  {
    id: 'ent',
    name: 'ENT',
    demandHours: 5760,
    capacityHours: 6480,
    utilizationPercentage: 88.9,
    efficiency: 103.75,
    status: 'pending',
    approvals: [],
    concerns: [
      {
        id: 'concern_ent_1',
        type: 'resource',
        description: 'Posible falta de técnicos especializados en periodo vacacional',
        severity: 'high',
        raisedBy: 'planning_director',
        raisedAt: '2024-01-15T11:00:00Z',
        status: 'open'
      }
    ],
    agreements: [],
    lastUpdated: '2024-01-15T11:00:00Z'
  },
  {
    id: 'fixation',
    name: 'Fixation',
    demandHours: 5040,
    capacityHours: 5760,
    utilizationPercentage: 87.5,
    efficiency: 105.42,
    status: 'pending',
    approvals: [],
    concerns: [],
    agreements: [],
    lastUpdated: '2024-01-15T08:00:00Z'
  },
  {
    id: 'venus',
    name: 'Venus',
    demandHours: 4320,
    capacityHours: 5040,
    utilizationPercentage: 85.7,
    efficiency: 102.85,
    status: 'pending',
    approvals: [],
    concerns: [],
    agreements: [],
    lastUpdated: '2024-01-15T08:00:00Z'
  }
];

// Acuerdos globales iniciales
const globalAgreements: HandShakeAgreement[] = [
  {
    id: 'global_agreement_1',
    description: 'Revisión semanal de utilización durante las primeras 4 semanas del mes',
    type: 'commitment',
    agreedBy: ['production_director', 'planning_director'],
    agreedAt: '2024-01-15T08:30:00Z',
    active: true
  },
  {
    id: 'global_agreement_2',
    description: 'Escalación inmediata si cualquier VST supera 95% de utilización',
    type: 'condition',
    agreedBy: ['production_director'],
    agreedAt: '2024-01-15T09:00:00Z',
    active: true
  }
];

// Datos principales del HandShake
export const handShakeData: HandShakeSession = {
  id: 'handshake_24_01',
  cbpId: '24-01',
  status: 'in_review',
  createdAt: '2024-01-15T08:00:00Z',
  startedAt: '2024-01-15T08:00:00Z',
  vstData: mockVSTData,
  globalAgreements: globalAgreements,
  meetingNotes: 'Sesión inicial de Hand Shake para CBP Enero 2024. Ambos directores presentes.',
  nextSteps: [
    'Revisar concerns de capacidad en Roadster',
    'Validar disponibilidad de técnicos especializados para ENT',
    'Confirmar acuerdos de escalación'
  ]
};

// Tipos de concerns disponibles
export const concernTypes = [
  { id: 'capacity', name: 'Capacidad', color: 'bg-red-100 text-red-800' },
  { id: 'resource', name: 'Recursos', color: 'bg-blue-100 text-blue-800' },
  { id: 'timeline', name: 'Cronograma', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'quality', name: 'Calidad', color: 'bg-purple-100 text-purple-800' },
  { id: 'other', name: 'Otro', color: 'bg-gray-100 text-gray-800' }
];

// Tipos de severidad
export const severityTypes = [
  { id: 'low', name: 'Baja', color: 'bg-green-100 text-green-800' },
  { id: 'medium', name: 'Media', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'high', name: 'Alta', color: 'bg-orange-100 text-orange-800' },
  { id: 'critical', name: 'Crítica', color: 'bg-red-100 text-red-800' }
];

// Tipos de acuerdos
export const agreementTypes = [
  { id: 'commitment', name: 'Compromiso', description: 'Obligación de hacer algo específico' },
  { id: 'condition', name: 'Condición', description: 'Requisito que debe cumplirse' },
  { id: 'assumption', name: 'Supuesto', description: 'Suposición sobre la que se basa el plan' },
  { id: 'constraint', name: 'Restricción', description: 'Limitación que debe respetarse' }
];

export type { HandShakeStatusItem };