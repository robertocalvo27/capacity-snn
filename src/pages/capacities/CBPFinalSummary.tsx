import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronDown, 
  ChevronUp, 
  Download, 
  Filter, 
  BarChart3, 
  Table, 
  TrendingUp, 
  DollarSign, 
  Percent, 
  Package,
  Calendar,
  ChevronLeft,
  Eye,
  EyeOff,
  Maximize2,
  Search,
  ClipboardList,
  Target,
  Activity,
  BarChart2
} from 'lucide-react';

// Tipos para la estructura de datos expandida
interface ProductionData {
  [month: string]: number;
}

interface PlanData {
  bp: ProductionData;      // Business Plan (Plan inicial del corporativo)
  cbp: ProductionData;     // Committed Business Plan (Plan revisado internamente)
  actuals: ProductionData; // Cantidades reales de producción
}

interface SummaryData {
  unconstrained: ProductionData;    // Del BP
  constrained: ProductionData;      // Del CBP
  forecast: ProductionData;         // Actuals + CBP
  capacityUtilization: ProductionData; // Actuals/CBP en %
  actuals: ProductionData;          // Valores reales para comparación
}

interface ProductDetail {
  lineNumber: string;
  lineName: string;
  catalogNumber: string;
  fa: string;
  description: string;
  production: PlanData;
  efficiency: PlanData;
  absorption: PlanData;
}

interface VST {
  id: string;
  name: string;
  production: PlanData;
  efficiency: PlanData;
  absorption: PlanData;
  summary: SummaryData;
  products: ProductDetail[];
  isTotal?: boolean;
}

// Datos mock basados en el excel expandidos
const mockMonths = ['Jan-2024', 'Feb-2024', 'Mar-2024', 'Apr-2024', 'May-2024', 'Jun-2024', 'Jul-2024'];

const mockWeeks = [
  'W01-2024', 'W02-2024', 'W03-2024', 'W04-2024', 'W05-2024', 'W06-2024', 'W07-2024', 'W08-2024',
  'W09-2024', 'W10-2024', 'W11-2024', 'W12-2024', 'W13-2024', 'W14-2024', 'W15-2024', 'W16-2024',
  'W17-2024', 'W18-2024', 'W19-2024', 'W20-2024', 'W21-2024', 'W22-2024', 'W23-2024', 'W24-2024',
  'W25-2024', 'W26-2024', 'W27-2024', 'W28-2024'
];

const mockQuarters = ['Q1-2024', 'Q2-2024', 'Q3-2024', 'Q4-2024'];

const mockCBPData: VST[] = [
  {
    id: 'ent',
    name: 'ENT',
    production: {
      bp: {
        'Jan-2024': 68981,
        'Feb-2024': 59757,
        'Mar-2024': 49018,
        'Apr-2024': 69878,
        'May-2024': 70851,
        'Jun-2024': 51031,
        'Jul-2024': 45255
      },
      cbp: {
        'Jan-2024': 60850,
        'Feb-2024': 70422,
        'Mar-2024': 29725,
        'Apr-2024': 86733,
        'May-2024': 64906,
        'Jun-2024': 85648,
        'Jul-2024': 75000
      },
      actuals: {
        'Jan-2024': 60850,
        'Feb-2024': 70422,
        'Mar-2024': 29725,
        'Apr-2024': 86733,
        'May-2024': 64906,
        'Jun-2024': 0, // Meses futuros sin datos reales
        'Jul-2024': 0
      }
    },
    efficiency: {
      bp: {
        'Jan-2024': 89.0,
        'Feb-2024': 92.0,
        'Mar-2024': 85.0,
        'Apr-2024': 93.0,
        'May-2024': 97.0,
        'Jun-2024': 91.0,
        'Jul-2024': 94.0
      },
      cbp: {
        'Jan-2024': 94.2,
        'Feb-2024': 98.5,
        'Mar-2024': 87.3,
        'Apr-2024': 101.2,
        'May-2024': 95.8,
        'Jun-2024': 99.1,
        'Jul-2024': 96.5
      },
      actuals: {
        'Jan-2024': 89.0,
        'Feb-2024': 92.0,
        'Mar-2024': 85.0,
        'Apr-2024': 93.0,
        'May-2024': 97.0,
        'Jun-2024': 0,
        'Jul-2024': 0
      }
    },
    absorption: {
      bp: {
        'Jan-2024': 1724525,
        'Feb-2024': 1493925,
        'Mar-2024': 1225450,
        'Apr-2024': 1746950,
        'May-2024': 1771275,
        'Jun-2024': 1275775,
        'Jul-2024': 1131375
      },
      cbp: {
        'Jan-2024': 1521250,
        'Feb-2024': 1760550,
        'Mar-2024': 743125,
        'Apr-2024': 2168325,
        'May-2024': 1622650,
        'Jun-2024': 2141200,
        'Jul-2024': 1875000
      },
      actuals: {
        'Jan-2024': 1521250,
        'Feb-2024': 1760550,
        'Mar-2024': 743125,
        'Apr-2024': 2168325,
        'May-2024': 1622650,
        'Jun-2024': 0,
        'Jul-2024': 0
      }
    },
    summary: {
      unconstrained: {
        'Jan-2024': 68981,
        'Feb-2024': 59757,
        'Mar-2024': 49018,
        'Apr-2024': 69878,
        'May-2024': 70851,
        'Jun-2024': 51031,
        'Jul-2024': 45255
      },
      constrained: {
        'Jan-2024': 60850,
        'Feb-2024': 70422,
        'Mar-2024': 29725,
        'Apr-2024': 86733,
        'May-2024': 64906,
        'Jun-2024': 85648,
        'Jul-2024': 75000
      },
      forecast: {
        'Jan-2024': 60850,
        'Feb-2024': 70422,
        'Mar-2024': 29725,
        'Apr-2024': 86733,
        'May-2024': 64906,
        'Jun-2024': 85648,
        'Jul-2024': 75000
      },
      capacityUtilization: {
        'Jan-2024': 100.0,
        'Feb-2024': 100.0,
        'Mar-2024': 100.0,
        'Apr-2024': 100.0,
        'May-2024': 100.0,
        'Jun-2024': 0.0,
        'Jul-2024': 0.0
      },
      actuals: {
        'Jan-2024': 60850,
        'Feb-2024': 70422,
        'Mar-2024': 29725,
        'Apr-2024': 86733,
        'May-2024': 64906,
        'Jun-2024': 0,
        'Jul-2024': 0
      }
    },
    products: []
  },
  {
    id: 'fixation',
    name: 'Fixation',
    production: {
      bp: {
        'Jan-2024': 62892,
        'Feb-2024': 60634,
        'Mar-2024': 60382,
        'Apr-2024': 72664,
        'May-2024': 76610,
        'Jun-2024': 38510,
        'Jul-2024': 48035
      },
      cbp: {
        'Jan-2024': 21634,
        'Feb-2024': 71126,
        'Mar-2024': 33428,
        'Apr-2024': 62161,
        'May-2024': 67540,
        'Jun-2024': 71258,
        'Jul-2024': 65000
      },
      actuals: {
        'Jan-2024': 21634,
        'Feb-2024': 71126,
        'Mar-2024': 33428,
        'Apr-2024': 62161,
        'May-2024': 67540,
        'Jun-2024': 0,
        'Jul-2024': 0
      }
    },
    efficiency: {
      bp: {
        'Jan-2024': 90.1,
        'Feb-2024': 94.2,
        'Mar-2024': 88.7,
        'Apr-2024': 95.8,
        'May-2024': 98.3,
        'Jun-2024': 92.1,
        'Jul-2024': 96.5
      },
      cbp: {
        'Jan-2024': 92.1,
        'Feb-2024': 105.2,
        'Mar-2024': 89.7,
        'Apr-2024': 97.8,
        'May-2024': 102.3,
        'Jun-2024': 108.1,
        'Jul-2024': 99.5
      },
      actuals: {
        'Jan-2024': 90.1,
        'Feb-2024': 94.2,
        'Mar-2024': 88.7,
        'Apr-2024': 95.8,
        'May-2024': 98.3,
        'Jun-2024': 0,
        'Jul-2024': 0
      }
    },
    absorption: {
      bp: {
        'Jan-2024': 1572300,
        'Feb-2024': 1515850,
        'Mar-2024': 1509550,
        'Apr-2024': 1816600,
        'May-2024': 1915250,
        'Jun-2024': 962750,
        'Jul-2024': 1200875
      },
      cbp: {
        'Jan-2024': 540850,
        'Feb-2024': 1778150,
        'Mar-2024': 835700,
        'Apr-2024': 1554025,
        'May-2024': 1688500,
        'Jun-2024': 1781450,
        'Jul-2024': 1625000
      },
      actuals: {
        'Jan-2024': 540850,
        'Feb-2024': 1778150,
        'Mar-2024': 835700,
        'Apr-2024': 1554025,
        'May-2024': 1688500,
        'Jun-2024': 0,
        'Jul-2024': 0
      }
    },
    summary: {
      unconstrained: {
        'Jan-2024': 62892,
        'Feb-2024': 60634,
        'Mar-2024': 60382,
        'Apr-2024': 72664,
        'May-2024': 76610,
        'Jun-2024': 38510,
        'Jul-2024': 48035
      },
      constrained: {
        'Jan-2024': 21634,
        'Feb-2024': 71126,
        'Mar-2024': 33428,
        'Apr-2024': 62161,
        'May-2024': 67540,
        'Jun-2024': 71258,
        'Jul-2024': 65000
      },
      forecast: {
        'Jan-2024': 21634,
        'Feb-2024': 71126,
        'Mar-2024': 33428,
        'Apr-2024': 62161,
        'May-2024': 67540,
        'Jun-2024': 71258,
        'Jul-2024': 65000
      },
      capacityUtilization: {
        'Jan-2024': 100.0,
        'Feb-2024': 100.0,
        'Mar-2024': 100.0,
        'Apr-2024': 100.0,
        'May-2024': 100.0,
        'Jun-2024': 0.0,
        'Jul-2024': 0.0
      },
      actuals: {
        'Jan-2024': 21634,
        'Feb-2024': 71126,
        'Mar-2024': 33428,
        'Apr-2024': 62161,
        'May-2024': 67540,
        'Jun-2024': 0,
        'Jul-2024': 0
      }
    },
    products: []
  },
  {
    id: 'sports-medicine',
    name: 'Sports Medicine',
    production: {
      bp: {
        'Jan-2024': 84021,
        'Feb-2024': 80727,
        'Mar-2024': 81427,
        'Apr-2024': 80205,
        'May-2024': 75127,
        'Jun-2024': 53833,
        'Jul-2024': 62717
      },
      cbp: {
        'Jan-2024': 40715,
        'Feb-2024': 104884,
        'Mar-2024': 44353,
        'Apr-2024': 66037,
        'May-2024': 47198,
        'Jun-2024': 71414,
        'Jul-2024': 68000
      },
      actuals: {
        'Jan-2024': 40715,
        'Feb-2024': 104884,
        'Mar-2024': 44353,
        'Apr-2024': 66037,
        'May-2024': 47198,
        'Jun-2024': 0,
        'Jul-2024': 0
      }
    },
    efficiency: {
      bp: {
        'Jan-2024': 93.8,
        'Feb-2024': 96.4,
        'Mar-2024': 91.2,
        'Apr-2024': 94.9,
        'May-2024': 97.3,
        'Jun-2024': 92.7,
        'Jul-2024': 95.2
      },
      cbp: {
        'Jan-2024': 95.8,
        'Feb-2024': 112.4,
        'Mar-2024': 91.2,
        'Apr-2024': 98.9,
        'May-2024': 94.3,
        'Jun-2024': 106.7,
        'Jul-2024': 101.2
      },
      actuals: {
        'Jan-2024': 93.8,
        'Feb-2024': 96.4,
        'Mar-2024': 91.2,
        'Apr-2024': 94.9,
        'May-2024': 97.3,
        'Jun-2024': 0,
        'Jul-2024': 0
      }
    },
    absorption: {
      bp: {
        'Jan-2024': 2100525,
        'Feb-2024': 2018175,
        'Mar-2024': 2035675,
        'Apr-2024': 2005125,
        'May-2024': 1878175,
        'Jun-2024': 1345825,
        'Jul-2024': 1567925
      },
      cbp: {
        'Jan-2024': 1017875,
        'Feb-2024': 2622100,
        'Mar-2024': 1108825,
        'Apr-2024': 1650925,
        'May-2024': 1179950,
        'Jun-2024': 1785350,
        'Jul-2024': 1700000
      },
      actuals: {
        'Jan-2024': 1017875,
        'Feb-2024': 2622100,
        'Mar-2024': 1108825,
        'Apr-2024': 1650925,
        'May-2024': 1179950,
        'Jun-2024': 0,
        'Jul-2024': 0
      }
    },
    summary: {
      unconstrained: {
        'Jan-2024': 84021,
        'Feb-2024': 80727,
        'Mar-2024': 81427,
        'Apr-2024': 80205,
        'May-2024': 75127,
        'Jun-2024': 53833,
        'Jul-2024': 62717
      },
      constrained: {
        'Jan-2024': 40715,
        'Feb-2024': 104884,
        'Mar-2024': 44353,
        'Apr-2024': 66037,
        'May-2024': 47198,
        'Jun-2024': 71414,
        'Jul-2024': 68000
      },
      forecast: {
        'Jan-2024': 40715,
        'Feb-2024': 104884,
        'Mar-2024': 44353,
        'Apr-2024': 66037,
        'May-2024': 47198,
        'Jun-2024': 71414,
        'Jul-2024': 68000
      },
      capacityUtilization: {
        'Jan-2024': 100.0,
        'Feb-2024': 100.0,
        'Mar-2024': 100.0,
        'Apr-2024': 100.0,
        'May-2024': 100.0,
        'Jun-2024': 0.0,
        'Jul-2024': 0.0
      },
      actuals: {
        'Jan-2024': 40715,
        'Feb-2024': 104884,
        'Mar-2024': 44353,
        'Apr-2024': 66037,
        'May-2024': 47198,
        'Jun-2024': 0,
        'Jul-2024': 0
      }
    },
    products: [
      {
        lineNumber: 'L2',
        lineName: 'STV',
        catalogNumber: 'ASC4250-01',
        fa: '24984',
        description: 'Super Turbovac',
        production: {
          bp: {
            'Jan-2024': 35810,
            'Feb-2024': 22713,
            'Mar-2024': 28609,
            'Apr-2024': 16833,
            'May-2024': 16778,
            'Jun-2024': 9921,
            'Jul-2024': 12000
          },
          cbp: {
            'Jan-2024': 10500,
            'Feb-2024': 32949,
            'Mar-2024': 5000,
            'Apr-2024': 6000,
            'May-2024': 10000,
            'Jun-2024': 21000,
            'Jul-2024': 18000
          },
          actuals: {
            'Jan-2024': 10500,
            'Feb-2024': 32949,
            'Mar-2024': 5000,
            'Apr-2024': 6000,
            'May-2024': 10000,
            'Jun-2024': 0,
            'Jul-2024': 0
          }
        },
        efficiency: {
          bp: {
            'Jan-2024': 91.2,
            'Feb-2024': 95.5,
            'Mar-2024': 88.9,
            'Apr-2024': 92.1,
            'May-2024': 95.6,
            'Jun-2024': 98.2,
            'Jul-2024': 94.8
          },
          cbp: {
            'Jan-2024': 94.2,
            'Feb-2024': 101.5,
            'Mar-2024': 88.9,
            'Apr-2024': 92.1,
            'May-2024': 95.6,
            'Jun-2024': 108.2,
            'Jul-2024': 99.8
          },
          actuals: {
            'Jan-2024': 91.2,
            'Feb-2024': 95.5,
            'Mar-2024': 88.9,
            'Apr-2024': 92.1,
            'May-2024': 95.6,
            'Jun-2024': 0,
            'Jul-2024': 0
          }
        },
        absorption: {
          bp: {
            'Jan-2024': 895250,
            'Feb-2024': 567825,
            'Mar-2024': 715225,
            'Apr-2024': 420825,
            'May-2024': 419450,
            'Jun-2024': 248025,
            'Jul-2024': 300000
          },
          cbp: {
            'Jan-2024': 262500,
            'Feb-2024': 823725,
            'Mar-2024': 125000,
            'Apr-2024': 150000,
            'May-2024': 250000,
            'Jun-2024': 525000,
            'Jul-2024': 450000
          },
          actuals: {
            'Jan-2024': 262500,
            'Feb-2024': 823725,
            'Mar-2024': 125000,
            'Apr-2024': 150000,
            'May-2024': 250000,
            'Jun-2024': 0,
            'Jul-2024': 0
          }
        }
      },
      {
        lineNumber: 'L2',
        lineName: 'STV',
        catalogNumber: 'ASH4250-01',
        fa: '25048',
        description: 'Super Turbovac W/FS',
        production: {
          bp: {
            'Jan-2024': 13800,
            'Feb-2024': 3925,
            'Mar-2024': 10881,
            'Apr-2024': 5839,
            'May-2024': 5899,
            'Jun-2024': 2965,
            'Jul-2024': 4500
          },
          cbp: {
            'Jan-2024': 6000,
            'Feb-2024': 12000,
            'Mar-2024': 4000,
            'Apr-2024': 7000,
            'May-2024': 5000,
            'Jun-2024': 3000,
            'Jul-2024': 5500
          },
          actuals: {
            'Jan-2024': 6000,
            'Feb-2024': 12000,
            'Mar-2024': 4000,
            'Apr-2024': 7000,
            'May-2024': 5000,
            'Jun-2024': 0,
            'Jul-2024': 0
          }
        },
        efficiency: {
          bp: {
            'Jan-2024': 94.1,
            'Feb-2024': 98.2,
            'Mar-2024': 85.7,
            'Apr-2024': 96.4,
            'May-2024': 89.8,
            'Jun-2024': 87.2,
            'Jul-2024': 92.5
          },
          cbp: {
            'Jan-2024': 96.1,
            'Feb-2024': 103.2,
            'Mar-2024': 85.7,
            'Apr-2024': 98.4,
            'May-2024': 91.8,
            'Jun-2024': 89.2,
            'Jul-2024': 94.5
          },
          actuals: {
            'Jan-2024': 94.1,
            'Feb-2024': 98.2,
            'Mar-2024': 85.7,
            'Apr-2024': 96.4,
            'May-2024': 89.8,
            'Jun-2024': 0,
            'Jul-2024': 0
          }
        },
        absorption: {
          bp: {
            'Jan-2024': 345000,
            'Feb-2024': 98125,
            'Mar-2024': 272025,
            'Apr-2024': 145975,
            'May-2024': 147475,
            'Jun-2024': 74125,
            'Jul-2024': 112500
          },
          cbp: {
            'Jan-2024': 150000,
            'Feb-2024': 300000,
            'Mar-2024': 100000,
            'Apr-2024': 175000,
            'May-2024': 125000,
            'Jun-2024': 75000,
            'Jul-2024': 137500
          },
          actuals: {
            'Jan-2024': 150000,
            'Feb-2024': 300000,
            'Mar-2024': 100000,
            'Apr-2024': 175000,
            'May-2024': 125000,
            'Jun-2024': 0,
            'Jul-2024': 0
          }
        }
      },
      {
        lineNumber: 'L4',
        lineName: 'SMX1',
        catalogNumber: 'ASC4830-01',
        fa: '13379',
        description: 'Super Multivac',
        production: {
          bp: {
            'Jan-2024': 6020,
            'Feb-2024': 2039,
            'Mar-2024': 1034,
            'Apr-2024': 4056,
            'May-2024': 10935,
            'Jun-2024': 2007,
            'Jul-2024': 3500
          },
          cbp: {
            'Jan-2024': 5040,
            'Feb-2024': 3040,
            'Mar-2024': 1000,
            'Apr-2024': 8000,
            'May-2024': 7000,
            'Jun-2024': 3000,
            'Jul-2024': 4200
          },
          actuals: {
            'Jan-2024': 5040,
            'Feb-2024': 3040,
            'Mar-2024': 1000,
            'Apr-2024': 8000,
            'May-2024': 7000,
            'Jun-2024': 0,
            'Jul-2024': 0
          }
        },
        efficiency: {
          bp: {
            'Jan-2024': 95.5,
            'Feb-2024': 84.3,
            'Mar-2024': 76.2,
            'Apr-2024': 109.5,
            'May-2024': 102.8,
            'Jun-2024': 88.4,
            'Jul-2024': 93.8
          },
          cbp: {
            'Jan-2024': 98.5,
            'Feb-2024': 87.3,
            'Mar-2024': 76.2,
            'Apr-2024': 112.5,
            'May-2024': 105.8,
            'Jun-2024': 91.4,
            'Jul-2024': 96.8
          },
          actuals: {
            'Jan-2024': 95.5,
            'Feb-2024': 84.3,
            'Mar-2024': 76.2,
            'Apr-2024': 109.5,
            'May-2024': 102.8,
            'Jun-2024': 0,
            'Jul-2024': 0
          }
        },
        absorption: {
          bp: {
            'Jan-2024': 150500,
            'Feb-2024': 50975,
            'Mar-2024': 25850,
            'Apr-2024': 101400,
            'May-2024': 273375,
            'Jun-2024': 50175,
            'Jul-2024': 87500
          },
          cbp: {
            'Jan-2024': 126000,
            'Feb-2024': 76000,
            'Mar-2024': 25000,
            'Apr-2024': 200000,
            'May-2024': 175000,
            'Jun-2024': 75000,
            'Jul-2024': 105000
          },
          actuals: {
            'Jan-2024': 126000,
            'Feb-2024': 76000,
            'Mar-2024': 25000,
            'Apr-2024': 200000,
            'May-2024': 175000,
            'Jun-2024': 0,
            'Jul-2024': 0
          }
        }
      }
    ]
  },
  {
    id: 'werewolf',
    name: 'Werewolf',
    production: {
      bp: {
        'Jan-2024': 24988,
        'Feb-2024': 30069,
        'Mar-2024': 28971,
        'Apr-2024': 41597,
        'May-2024': 25757,
        'Jun-2024': 27845,
        'Jul-2024': 30000
      },
      cbp: {
        'Jan-2024': 20124,
        'Feb-2024': 39079,
        'Mar-2024': 21118,
        'Apr-2024': 23761,
        'May-2024': 20000,
        'Jun-2024': 55118,
        'Jul-2024': 32000
      },
      actuals: {
        'Jan-2024': 20124,
        'Feb-2024': 39079,
        'Mar-2024': 21118,
        'Apr-2024': 23761,
        'May-2024': 20000,
        'Jun-2024': 0,
        'Jul-2024': 0
      }
    },
    efficiency: {
      bp: {
        'Jan-2024': 87.5,
        'Feb-2024': 94.8,
        'Mar-2024': 89.3,
        'Apr-2024': 92.2,
        'May-2024': 86.9,
        'Jun-2024': 99.5,
        'Jul-2024': 93.1
      },
      cbp: {
        'Jan-2024': 89.5,
        'Feb-2024': 96.8,
        'Mar-2024': 91.3,
        'Apr-2024': 94.2,
        'May-2024': 88.9,
        'Jun-2024': 102.5,
        'Jul-2024': 95.1
      },
      actuals: {
        'Jan-2024': 87.5,
        'Feb-2024': 94.8,
        'Mar-2024': 89.3,
        'Apr-2024': 92.2,
        'May-2024': 86.9,
        'Jun-2024': 0,
        'Jul-2024': 0
      }
    },
    absorption: {
      bp: {
        'Jan-2024': 624700,
        'Feb-2024': 751725,
        'Mar-2024': 724275,
        'Apr-2024': 1039925,
        'May-2024': 643925,
        'Jun-2024': 696125,
        'Jul-2024': 750000
      },
      cbp: {
        'Jan-2024': 503100,
        'Feb-2024': 976975,
        'Mar-2024': 527950,
        'Apr-2024': 594025,
        'May-2024': 500000,
        'Jun-2024': 1377950,
        'Jul-2024': 800000
      },
      actuals: {
        'Jan-2024': 503100,
        'Feb-2024': 976975,
        'Mar-2024': 527950,
        'Apr-2024': 594025,
        'May-2024': 500000,
        'Jun-2024': 0,
        'Jul-2024': 0
      }
    },
    summary: {
      unconstrained: {
        'Jan-2024': 24988,
        'Feb-2024': 30069,
        'Mar-2024': 28971,
        'Apr-2024': 41597,
        'May-2024': 25757,
        'Jun-2024': 27845,
        'Jul-2024': 30000
      },
      constrained: {
        'Jan-2024': 20124,
        'Feb-2024': 39079,
        'Mar-2024': 21118,
        'Apr-2024': 23761,
        'May-2024': 20000,
        'Jun-2024': 55118,
        'Jul-2024': 32000
      },
      forecast: {
        'Jan-2024': 20124,
        'Feb-2024': 39079,
        'Mar-2024': 21118,
        'Apr-2024': 23761,
        'May-2024': 20000,
        'Jun-2024': 55118,
        'Jul-2024': 32000
      },
      capacityUtilization: {
        'Jan-2024': 100.0,
        'Feb-2024': 100.0,
        'Mar-2024': 100.0,
        'Apr-2024': 100.0,
        'May-2024': 100.0,
        'Jun-2024': 0.0,
        'Jul-2024': 0.0
      },
      actuals: {
        'Jan-2024': 20124,
        'Feb-2024': 39079,
        'Mar-2024': 21118,
        'Apr-2024': 23761,
        'May-2024': 20000,
        'Jun-2024': 0,
        'Jul-2024': 0
      }
    },
    products: []
  },
  {
    id: 'total-base-business',
    name: 'Total BaseBusiness',
    production: {
      bp: {
        'Jan-2024': 243987,
        'Feb-2024': 235729,
        'Mar-2024': 224188,
        'Apr-2024': 270157,
        'May-2024': 254647,
        'Jun-2024': 176054,
        'Jul-2024': 190507
      },
      cbp: {
        'Jan-2024': 144938,
        'Feb-2024': 291223,
        'Mar-2024': 132875,
        'Apr-2024': 245174,
        'May-2024': 206378,
        'Jun-2024': 287075,
        'Jul-2024': 265000
      },
      actuals: {
        'Jan-2024': 144938,
        'Feb-2024': 291223,
        'Mar-2024': 132875,
        'Apr-2024': 245174,
        'May-2024': 206378,
        'Jun-2024': 0,
        'Jul-2024': 0
      }
    },
    efficiency: {
      bp: {
        'Jan-2024': 91.8,
        'Feb-2024': 96.1,
        'Mar-2024': 88.7,
        'Apr-2024': 94.9,
        'May-2024': 96.2,
        'Jun-2024': 93.2,
        'Jul-2024': 95.5
      },
      cbp: {
        'Jan-2024': 93.8,
        'Feb-2024': 102.1,
        'Mar-2024': 89.7,
        'Apr-2024': 97.9,
        'May-2024': 95.2,
        'Jun-2024': 104.2,
        'Jul-2024': 98.5
      },
      actuals: {
        'Jan-2024': 91.8,
        'Feb-2024': 96.1,
        'Mar-2024': 88.7,
        'Apr-2024': 94.9,
        'May-2024': 96.2,
        'Jun-2024': 0,
        'Jul-2024': 0
      }
    },
    absorption: {
      bp: {
        'Jan-2024': 6099675,
        'Feb-2024': 5893225,
        'Mar-2024': 5604700,
        'Apr-2024': 6753925,
        'May-2024': 6366175,
        'Jun-2024': 4401350,
        'Jul-2024': 4762675
      },
      cbp: {
        'Jan-2024': 3623450,
        'Feb-2024': 7280575,
        'Mar-2024': 3321875,
        'Apr-2024': 6129350,
        'May-2024': 5159450,
        'Jun-2024': 7176875,
        'Jul-2024': 6625000
      },
      actuals: {
        'Jan-2024': 3623450,
        'Feb-2024': 7280575,
        'Mar-2024': 3321875,
        'Apr-2024': 6129350,
        'May-2024': 5159450,
        'Jun-2024': 0,
        'Jul-2024': 0
      }
    },
    summary: {
      unconstrained: {
        'Jan-2024': 243987,
        'Feb-2024': 235729,
        'Mar-2024': 224188,
        'Apr-2024': 270157,
        'May-2024': 254647,
        'Jun-2024': 176054,
        'Jul-2024': 190507
      },
      constrained: {
        'Jan-2024': 144938,
        'Feb-2024': 291223,
        'Mar-2024': 132875,
        'Apr-2024': 245174,
        'May-2024': 206378,
        'Jun-2024': 287075,
        'Jul-2024': 265000
      },
      forecast: {
        'Jan-2024': 144938,
        'Feb-2024': 291223,
        'Mar-2024': 132875,
        'Apr-2024': 245174,
        'May-2024': 206378,
        'Jun-2024': 287075,
        'Jul-2024': 265000
      },
      capacityUtilization: {
        'Jan-2024': 100.0,
        'Feb-2024': 100.0,
        'Mar-2024': 100.0,
        'Apr-2024': 100.0,
        'May-2024': 100.0,
        'Jun-2024': 0.0,
        'Jul-2024': 0.0
      },
      actuals: {
        'Jan-2024': 144938,
        'Feb-2024': 291223,
        'Mar-2024': 132875,
        'Apr-2024': 245174,
        'May-2024': 206378,
        'Jun-2024': 0,
        'Jul-2024': 0
      }
    },
    products: [],
    isTotal: true
  },
  {
    id: 'total-plant',
    name: 'Total Plant',
    production: {
      bp: {
        'Jan-2024': 513590,
        'Feb-2024': 543542,
        'Mar-2024': 547054,
        'Apr-2024': 605840,
        'May-2024': 500217,
        'Jun-2024': 323780,
        'Jul-2024': 380000
      },
      cbp: {
        'Jan-2024': 328057,
        'Feb-2024': 643127,
        'Mar-2024': 352480,
        'Apr-2024': 624767,
        'May-2024': 487347,
        'Jun-2024': 555813,
        'Jul-2024': 580000
      },
      actuals: {
        'Jan-2024': 328057,
        'Feb-2024': 643127,
        'Mar-2024': 352480,
        'Apr-2024': 624767,
        'May-2024': 487347,
        'Jun-2024': 0,
        'Jul-2024': 0
      }
    },
    efficiency: {
      bp: {
        'Jan-2024': 92.5,
        'Feb-2024': 98.8,
        'Mar-2024': 89.2,
        'Apr-2024': 96.1,
        'May-2024': 94.7,
        'Jun-2024': 95.8,
        'Jul-2024': 97.9
      },
      cbp: {
        'Jan-2024': 94.5,
        'Feb-2024': 105.8,
        'Mar-2024': 90.2,
        'Apr-2024': 99.1,
        'May-2024': 96.7,
        'Jun-2024': 102.8,
        'Jul-2024': 99.9
      },
      actuals: {
        'Jan-2024': 92.5,
        'Feb-2024': 98.8,
        'Mar-2024': 89.2,
        'Apr-2024': 96.1,
        'May-2024': 94.7,
        'Jun-2024': 0,
        'Jul-2024': 0
      }
    },
    absorption: {
      bp: {
        'Jan-2024': 12839750,
        'Feb-2024': 13588550,
        'Mar-2024': 13676350,
        'Apr-2024': 15146000,
        'May-2024': 12505425,
        'Jun-2024': 8094500,
        'Jul-2024': 9500000
      },
      cbp: {
        'Jan-2024': 8201425,
        'Feb-2024': 16078175,
        'Mar-2024': 8812000,
        'Apr-2024': 15619175,
        'May-2024': 12183675,
        'Jun-2024': 13895325,
        'Jul-2024': 14500000
      },
      actuals: {
        'Jan-2024': 8201425,
        'Feb-2024': 16078175,
        'Mar-2024': 8812000,
        'Apr-2024': 15619175,
        'May-2024': 12183675,
        'Jun-2024': 0,
        'Jul-2024': 0
      }
    },
    summary: {
      unconstrained: {
        'Jan-2024': 513590,
        'Feb-2024': 543542,
        'Mar-2024': 547054,
        'Apr-2024': 605840,
        'May-2024': 500217,
        'Jun-2024': 323780,
        'Jul-2024': 380000
      },
      constrained: {
        'Jan-2024': 328057,
        'Feb-2024': 643127,
        'Mar-2024': 352480,
        'Apr-2024': 624767,
        'May-2024': 487347,
        'Jun-2024': 555813,
        'Jul-2024': 580000
      },
      forecast: {
        'Jan-2024': 328057,
        'Feb-2024': 643127,
        'Mar-2024': 352480,
        'Apr-2024': 624767,
        'May-2024': 487347,
        'Jun-2024': 555813,
        'Jul-2024': 580000
      },
      capacityUtilization: {
        'Jan-2024': 100.0,
        'Feb-2024': 100.0,
        'Mar-2024': 100.0,
        'Apr-2024': 100.0,
        'May-2024': 100.0,
        'Jun-2024': 0.0,
        'Jul-2024': 0.0
      },
      actuals: {
        'Jan-2024': 328057,
        'Feb-2024': 643127,
        'Mar-2024': 352480,
        'Apr-2024': 624767,
        'May-2024': 487347,
        'Jun-2024': 0,
        'Jul-2024': 0
      }
    },
    products: [],
    isTotal: true
  }
];

type ViewMode = 'production' | 'efficiency' | 'absorption';
type DisplayView = 'summary' | 'detailed' | 'analytics';
type PlanType = 'bp' | 'cbp' | 'actuals' | 'summary';
type SummaryMode = 'constrained-vs-unconstrained' | 'actuals-vs-cbp' | 'capacity-utilization' | 'forecast';
type PeriodType = 'months' | 'weeks' | 'quarters';

export default function CBPFinalSummary() {
  const { cbpId } = useParams();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>('production');
  const [displayView, setDisplayView] = useState<DisplayView>('summary');
  const [planType, setPlanType] = useState<PlanType>('cbp');
  const [summaryMode, setSummaryMode] = useState<SummaryMode>('constrained-vs-unconstrained');
  const [periodType, setPeriodType] = useState<PeriodType>('months');
  const [expandedVST, setExpandedVST] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [hiddenVSTs, setHiddenVSTs] = useState<Set<string>>(new Set());
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: mockMonths[0],
    end: mockMonths[mockMonths.length - 1]
  });

  // Obtener períodos según el tipo seleccionado
  const getCurrentPeriods = () => {
    switch (periodType) {
      case 'weeks':
        return mockWeeks;
      case 'quarters':
        return mockQuarters;
      default:
        return mockMonths;
    }
  };

  // Filtrar períodos según el rango seleccionado
  const filteredPeriods = useMemo(() => {
    const periods = getCurrentPeriods();
    if (periodType === 'months') {
      const startIndex = periods.indexOf(dateRange.start);
      const endIndex = periods.indexOf(dateRange.end);
      return periods.slice(startIndex, endIndex + 1);
    }
    // Para weeks y quarters, mostrar todos por ahora
    return periods;
  }, [dateRange, periodType]);

  // Filtrar VSTs basado en la búsqueda
  const filteredVSTs = useMemo(() => {
    return mockCBPData.filter(vst => 
      vst.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      vst.id.toLowerCase().includes(searchFilter.toLowerCase())
    );
  }, [searchFilter]);

  // Obtener datos según el modo y tipo de plan seleccionado
  const getDataByMode = (vst: VST): ProductionData => {
    if (planType === 'summary') {
      const summaryData = calculateSummaryData(vst);
      let baseData: ProductionData;
      
      switch (summaryMode) {
        case 'constrained-vs-unconstrained':
          baseData = summaryData.constrained;
          break;
        case 'actuals-vs-cbp':
          baseData = summaryData.actuals;
          break;
        case 'capacity-utilization':
          baseData = summaryData.capacityUtilization;
          break;
        case 'forecast':
          baseData = summaryData.forecast;
          break;
        default:
          baseData = summaryData.constrained;
          break;
      }
      
      return generatePeriodData(baseData, periodType);
    }

    const planData = (() => {
      switch (viewMode) {
        case 'efficiency':
          return vst.efficiency;
        case 'absorption':
          return vst.absorption;
        default:
          return vst.production;
      }
    })();

    return getPeriodData(planData, planType);
  };

  // Calcular datos de Summary dinámicamente
  const calculateSummaryData = (vst: VST): SummaryData => {
    const modeData = (() => {
      switch (viewMode) {
        case 'efficiency':
          return vst.efficiency;
        case 'absorption':
          return vst.absorption;
        default:
          return vst.production;
      }
    })();

    // Generar datos para el período seleccionado
    const unconstrainedData = generatePeriodData(modeData.bp, periodType);
    const constrainedData = generatePeriodData(modeData.cbp, periodType);
    const actualsData = generatePeriodData(modeData.actuals, periodType);

    const unconstrained: ProductionData = {};
    const constrained: ProductionData = {};
    const forecast: ProductionData = {};
    const capacityUtilization: ProductionData = {};
    const actuals: ProductionData = {};

    filteredPeriods.forEach(period => {
      unconstrained[period] = unconstrainedData[period] || 0;
      constrained[period] = constrainedData[period] || 0;
      actuals[period] = actualsData[period] || 0;
      
      // Forecast: Si hay actuals, usar actuals; si no, usar CBP
      const actualValue = actualsData[period] || 0;
      const cbpValue = constrainedData[period] || 0;
      forecast[period] = actualValue > 0 ? actualValue : cbpValue;
      
      // Capacity Utilization: (Actuals / CBP) * 100
      if (cbpValue > 0 && actualValue > 0) {
        capacityUtilization[period] = (actualValue / cbpValue) * 100;
      } else {
        capacityUtilization[period] = 0;
      }
    });

    return {
      unconstrained,
      constrained,
      forecast,
      capacityUtilization,
      actuals
    };
  };

  // Formatear valores según el modo
  const formatValue = (value: number): string => {
    if (viewMode === 'efficiency' || (planType === 'summary' && viewMode === 'production')) {
      return `${value.toFixed(1)}%`;
    } else if (viewMode === 'absorption') {
      return `$${value.toLocaleString()}`;
    } else {
      return value.toLocaleString();
    }
  };

  // Obtener icono según el tipo de plan
  const getPlanTypeIcon = () => {
    switch (planType) {
      case 'bp':
        return <ClipboardList className="w-4 h-4" />;
      case 'actuals':
        return <Activity className="w-4 h-4" />;
      case 'summary':
        return <BarChart2 className="w-4 h-4" />;
      default:
        return <Target className="w-4 h-4" />;
    }
  };

  // Obtener icono según el modo
  const getModeIcon = () => {
    switch (viewMode) {
      case 'efficiency':
        return <Percent className="w-4 h-4" />;
      case 'absorption':
        return <DollarSign className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  // Obtener color según el valor y modo
  const getValueColor = (value: number, mode: ViewMode): string => {
    if (mode === 'efficiency' || (planType === 'summary' && mode === 'production')) {
      return value >= 100 ? 'text-green-600' : value >= 95 ? 'text-yellow-600' : 'text-red-600';
    } else if (mode === 'absorption') {
      return 'text-blue-600';
    } else {
      return 'text-gray-900';
    }
  };

  // Toggle visibility de VST
  const toggleVSTVisibility = (vstId: string) => {
    const newHidden = new Set(hiddenVSTs);
    if (newHidden.has(vstId)) {
      newHidden.delete(vstId);
    } else {
      newHidden.add(vstId);
    }
    setHiddenVSTs(newHidden);
  };

  // Función para exportar datos
  const exportData = () => {
    const csvData = [
      ['VST', ...filteredPeriods, 'Total'],
      ...filteredVSTs
        .filter(vst => !hiddenVSTs.has(vst.id))
        .map(vst => {
          const data = getDataByMode(vst);
          const total = filteredPeriods.reduce((sum, month) => sum + (data[month] || 0), 0);
          return [
            vst.name,
            ...filteredPeriods.map(month => formatValue(data[month] || 0)),
            formatValue(total)
          ];
        })
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `cbp-summary-${cbpId}-${viewMode}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Generar datos simulados para diferentes períodos
  const generatePeriodData = (monthlyData: ProductionData, targetPeriod: PeriodType): ProductionData => {
    if (targetPeriod === 'months') {
      return monthlyData;
    }

    const result: ProductionData = {};

    if (targetPeriod === 'weeks') {
      // Simular datos semanales dividiendo los datos mensuales
      const monthKeys = Object.keys(monthlyData);
      monthKeys.forEach((month, monthIndex) => {
        const monthValue = monthlyData[month] || 0;
        const weeksInMonth = 4; // Aproximadamente 4 semanas por mes
        const weeklyValue = monthValue / weeksInMonth;
        
        // Generar 4 semanas por mes
        for (let week = 1; week <= weeksInMonth; week++) {
          const weekIndex = monthIndex * weeksInMonth + week;
          const weekKey = `W${weekIndex.toString().padStart(2, '0')}-2024`;
          if (weekIndex <= mockWeeks.length) {
            result[weekKey] = weeklyValue;
          }
        }
      });
    } else if (targetPeriod === 'quarters') {
      // Simular datos trimestrales sumando 3 meses
      const monthKeys = Object.keys(monthlyData);
      for (let quarter = 1; quarter <= 4; quarter++) {
        const quarterKey = `Q${quarter}-2024`;
        let quarterValue = 0;
        
        // Sumar 3 meses para cada trimestre
        for (let month = 0; month < 3; month++) {
          const monthIndex = (quarter - 1) * 3 + month;
          if (monthIndex < monthKeys.length) {
            quarterValue += monthlyData[monthKeys[monthIndex]] || 0;
          }
        }
        result[quarterKey] = quarterValue;
      }
    }

    return result;
  };

  // Obtener datos convertidos según el período seleccionado
  const getPeriodData = (planData: PlanData, planTypeSelected: string): ProductionData => {
    let baseData: ProductionData;
    
    switch (planTypeSelected) {
      case 'bp':
        baseData = planData.bp;
        break;
      case 'actuals':
        baseData = planData.actuals;
        break;
      default:
        baseData = planData.cbp;
        break;
    }

    return generatePeriodData(baseData, periodType);
  };

  return (
    <div className="space-y-6 p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <button
              onClick={() => navigate(`/capacities/${cbpId}`)}
              className="mr-4 p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <BarChart3 className="w-7 h-7 text-blue-600 mr-2" />
                CBP Final Summary
              </h1>
              <p className="text-gray-500">Resumen ejecutivo del CBP mensual ({cbpId})</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <select
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {mockMonths.map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
              <span className="text-gray-500">-</span>
              <select
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {mockMonths.map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
            </div>
            <button 
              onClick={exportData}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar {planType.toUpperCase()} - {viewMode === 'production' ? 'Producción' : viewMode === 'efficiency' ? 'Eficiencia' : 'Absorción'}
            </button>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col space-y-4">
          {/* Primera fila: Plan Type + Period Type */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
            {/* Plan Type */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Plan:</span>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setPlanType('bp')}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    planType === 'bp'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <ClipboardList className="w-4 h-4 mr-1" />
                  BP
                </button>
                <button
                  onClick={() => setPlanType('cbp')}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    planType === 'cbp'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Target className="w-4 h-4 mr-1" />
                  CBP
                </button>
                <button
                  onClick={() => setPlanType('actuals')}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    planType === 'actuals'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Activity className="w-4 h-4 mr-1" />
                  Actuals
                </button>
                <button
                  onClick={() => setPlanType('summary')}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    planType === 'summary'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <BarChart2 className="w-4 h-4 mr-1" />
                  Summary
                </button>
              </div>
            </div>

            {/* Period Type + Search */}
            <div className="flex items-center space-x-4">
              {/* Period Toggle */}
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Período:</span>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setPeriodType('months')}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                      periodType === 'months'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Calendar className="w-4 h-4 mr-1" />
                    Months
                  </button>
                  <button
                    onClick={() => setPeriodType('weeks')}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                      periodType === 'weeks'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Calendar className="w-4 h-4 mr-1" />
                    Weeks
                  </button>
                  <button
                    onClick={() => setPeriodType('quarters')}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                      periodType === 'quarters'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Calendar className="w-4 h-4 mr-1" />
                    Quarters
                  </button>
                </div>
              </div>

              {/* Search */}
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Buscar VST..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Segunda fila: Vista + Display */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
            {/* Mode/Summary Toggle */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Vista:</span>
              {planType === 'summary' ? (
                <div className="flex bg-gray-100 rounded-lg p-1 overflow-x-auto">
                  <button
                    onClick={() => setSummaryMode('constrained-vs-unconstrained')}
                    className={`flex items-center px-2 py-2 rounded-md text-xs font-medium whitespace-nowrap ${
                      summaryMode === 'constrained-vs-unconstrained'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Package className="w-3 h-3 mr-1" />
                    CSP vs USP
                  </button>
                  <button
                    onClick={() => setSummaryMode('actuals-vs-cbp')}
                    className={`flex items-center px-2 py-2 rounded-md text-xs font-medium whitespace-nowrap ${
                      summaryMode === 'actuals-vs-cbp'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Activity className="w-3 h-3 mr-1" />
                    Actuals vs CBP
                  </button>
                  <button
                    onClick={() => setSummaryMode('capacity-utilization')}
                    className={`flex items-center px-2 py-2 rounded-md text-xs font-medium whitespace-nowrap ${
                      summaryMode === 'capacity-utilization'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Percent className="w-3 h-3 mr-1" />
                    Capacity %
                  </button>
                  <button
                    onClick={() => setSummaryMode('forecast')}
                    className={`flex items-center px-2 py-2 rounded-md text-xs font-medium whitespace-nowrap ${
                      summaryMode === 'forecast'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <DollarSign className="w-3 h-3 mr-1" />
                    Forecast
                  </button>
                </div>
              ) : (
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('production')}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                      viewMode === 'production'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Package className="w-4 h-4 mr-1" />
                    Producción
                  </button>
                  <button
                    onClick={() => setViewMode('efficiency')}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                      viewMode === 'efficiency'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Percent className="w-4 h-4 mr-1" />
                    Eficiencia
                  </button>
                  <button
                    onClick={() => setViewMode('absorption')}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                      viewMode === 'absorption'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <DollarSign className="w-4 h-4 mr-1" />
                    Absorción
                  </button>
                </div>
              )}
            </div>

            {/* Display Toggle */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Mostrar:</span>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setDisplayView('summary')}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    displayView === 'summary'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Table className="w-4 h-4 mr-1" />
                  Resumen
                </button>
                <button
                  onClick={() => setDisplayView('detailed')}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    displayView === 'detailed'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Maximize2 className="w-4 h-4 mr-1" />
                  Detallado
                </button>
                <button
                  onClick={() => setDisplayView('analytics')}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    displayView === 'analytics'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <TrendingUp className="w-4 h-4 mr-1" />
                  Analytics
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {displayView === 'summary' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-orange-500 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium">
                    <div className="flex items-center">
                      {getPlanTypeIcon()}
                      <span className="ml-2">VST / Area</span>
                      {planType === 'summary' && (
                        <span className="ml-2 text-xs bg-white bg-opacity-20 px-2 py-1 rounded">
                          {summaryMode === 'constrained-vs-unconstrained' ? 'Constrained vs Unconstrained' :
                           summaryMode === 'actuals-vs-cbp' ? 'Actuals vs CBP' :
                           summaryMode === 'capacity-utilization' ? 'Capacity Utilization' : 'Forecast'}
                        </span>
                      )}
                      {planType !== 'summary' && (
                        <span className="ml-2 text-xs bg-white bg-opacity-20 px-2 py-1 rounded">
                          {planType.toUpperCase()} - {viewMode === 'production' ? 'Producción' : 
                           viewMode === 'efficiency' ? 'Eficiencia' : 'Absorción'}
                        </span>
                      )}
                    </div>
                  </th>
                  {filteredPeriods.map(month => (
                    <th key={month} className="px-6 py-4 text-center text-sm font-medium">
                      {month}
                    </th>
                  ))}
                  <th className="px-6 py-4 text-center text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVSTs
                  .filter(vst => !hiddenVSTs.has(vst.id))
                  .map((vst, index) => (
                    <tr 
                      key={vst.id} 
                      className={`hover:bg-gray-50 ${vst.isTotal ? 'bg-gray-100 font-semibold border-t-2 border-gray-300' : ''}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <div className="flex items-center">
                          {vst.isTotal && <span className="text-gray-500 mr-2">∑</span>}
                          {vst.name}
                        </div>
                      </td>
                      {filteredPeriods.map(month => {
                        const data = getDataByMode(vst);
                        const value = data[month] || 0;
                        
                        // Para Summary con comparaciones específicas
                        if (planType === 'summary') {
                          const summaryData = calculateSummaryData(vst);
                          
                          if (summaryMode === 'constrained-vs-unconstrained') {
                            const unconstrainedValue = summaryData.unconstrained[month] || 0;
                            const constrainedValue = summaryData.constrained[month] || 0;
                            
                            return (
                              <td key={month} className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                <div className="space-y-1">
                                  <div className="text-gray-600 text-xs">USP:</div>
                                  <div className="font-medium text-blue-600">
                                    {formatValue(unconstrainedValue)}
                                  </div>
                                  <div className="text-gray-600 text-xs">CSP:</div>
                                  <div className="font-medium text-green-600">
                                    {formatValue(constrainedValue)}
                                  </div>
                                </div>
                              </td>
                            );
                          }
                          
                          if (summaryMode === 'actuals-vs-cbp') {
                            const actualsValue = summaryData.actuals[month] || 0;
                            const cbpValue = summaryData.constrained[month] || 0;
                            
                            return (
                              <td key={month} className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                <div className="space-y-1">
                                  <div className="text-gray-600 text-xs">Actuals:</div>
                                  <div className="font-medium text-purple-600">
                                    {formatValue(actualsValue)}
                                  </div>
                                  <div className="text-gray-600 text-xs">CBP:</div>
                                  <div className="font-medium text-green-600">
                                    {formatValue(cbpValue)}
                                  </div>
                                </div>
                              </td>
                            );
                          }
                        }
                        
                        return (
                          <td key={month} className="px-6 py-4 whitespace-nowrap text-sm text-center">
                            <span className={getValueColor(value, viewMode)}>
                              {formatValue(value)}
                            </span>
                          </td>
                        );
                      })}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => toggleVSTVisibility(vst.id)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <EyeOff className="w-4 h-4" />
                          </button>
                          {vst.products.length > 0 && (
                            <button
                              onClick={() => setExpandedVST(expandedVST === vst.id ? null : vst.id)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              {expandedVST === vst.id ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {displayView === 'detailed' && (
          <div className="p-6">
            {!expandedVST ? (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Selecciona un VST para ver el detalle
                  {planType === 'summary' && (
                    <span className="ml-2 text-sm font-normal text-gray-600">
                      (Mostrando datos de {viewMode === 'production' ? 'Constrained vs Unconstrained' : 
                                          viewMode === 'efficiency' ? 'Capacity Utilization' : 'Forecast'})
                    </span>
                  )}
                  {planType !== 'summary' && (
                    <span className="ml-2 text-sm font-normal text-gray-600">
                      (Mostrando {planType.toUpperCase()} - {viewMode === 'production' ? 'Producción' : 
                                                           viewMode === 'efficiency' ? 'Eficiencia' : 'Absorción'})
                    </span>
                  )}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredVSTs
                    .filter(vst => !hiddenVSTs.has(vst.id) && vst.products.length > 0)
                    .map((vst) => (
                      <div
                        key={vst.id}
                        className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-lg cursor-pointer transition-all"
                        onClick={() => setExpandedVST(vst.id)}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-gray-900">{vst.name}</h4>
                          <span className="text-sm text-gray-500">
                            {vst.products.length} productos
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-gray-500">Total {filteredPeriods[filteredPeriods.length - 1]}:</span>
                            <div className={`font-medium ${getValueColor(
                              getDataByMode(vst)[filteredPeriods[filteredPeriods.length - 1]] || 0, 
                              viewMode
                            )}`}>
                              {formatValue(getDataByMode(vst)[filteredPeriods[filteredPeriods.length - 1]] || 0)}
                            </div>
                          </div>
                          <div>
                                                          <span className="text-gray-500">Promedio:</span>
                              <div className={`font-medium ${getValueColor(
                                filteredPeriods.reduce((sum, month) => sum + (getDataByMode(vst)[month] || 0), 0) / filteredPeriods.length,
                                viewMode
                              )}`}>
                                {formatValue(filteredPeriods.reduce((sum, month) => sum + (getDataByMode(vst)[month] || 0), 0) / filteredPeriods.length)}
                              </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
                {filteredVSTs.filter(vst => !hiddenVSTs.has(vst.id) && vst.products.length > 0).length === 0 && (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No hay VSTs con detalle disponible</h3>
                    <p className="text-gray-500">Los VSTs seleccionados no tienen productos detallados para mostrar.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">
                    Detalle de {filteredVSTs.find(vst => vst.id === expandedVST)?.name}
                  </h3>
                  <button
                    onClick={() => setExpandedVST(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-orange-500 text-white">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium">Line #</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Line Name</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Catalog #</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">FA</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Description</th>
                                            {filteredPeriods.map(period => (
                      <th key={period} className="px-4 py-3 text-center text-sm font-medium">
                        {period}
                      </th>
                    ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredVSTs
                        .find(vst => vst.id === expandedVST)
                        ?.products.map((product, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                              {product.lineNumber}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                              {product.lineName}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                              {product.catalogNumber}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                              {product.fa}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                              {product.description}
                            </td>
                                                    {filteredPeriods.map(period => {
                          const planData = viewMode === 'efficiency' ? product.efficiency : 
                                          viewMode === 'absorption' ? product.absorption : product.production;
                          
                          // Para Summary con comparaciones específicas en productos
                          if (planType === 'summary') {
                            if (summaryMode === 'constrained-vs-unconstrained') {
                              const unconstrainedData = generatePeriodData(planData.bp, periodType);
                              const constrainedData = generatePeriodData(planData.cbp, periodType);
                              const unconstrainedValue = unconstrainedData[period] || 0;
                              const constrainedValue = constrainedData[period] || 0;
                              
                              return (
                                <td key={period} className="px-4 py-3 whitespace-nowrap text-sm text-center">
                                  <div className="space-y-1">
                                    <div className="text-gray-600 text-xs">USP:</div>
                                    <div className="font-medium text-blue-600 text-xs">
                                      {unconstrainedValue.toLocaleString()}
                                    </div>
                                    <div className="text-gray-600 text-xs">CSP:</div>
                                    <div className="font-medium text-green-600 text-xs">
                                      {constrainedValue.toLocaleString()}
                                    </div>
                                  </div>
                                </td>
                              );
                            }
                            
                            if (summaryMode === 'actuals-vs-cbp') {
                              const actualsData = generatePeriodData(planData.actuals, periodType);
                              const cbpData = generatePeriodData(planData.cbp, periodType);
                              const actualsValue = actualsData[period] || 0;
                              const cbpValue = cbpData[period] || 0;
                              
                              return (
                                <td key={period} className="px-4 py-3 whitespace-nowrap text-sm text-center">
                                  <div className="space-y-1">
                                    <div className="text-gray-600 text-xs">Actuals:</div>
                                    <div className="font-medium text-purple-600 text-xs">
                                      {actualsValue.toLocaleString()}
                                    </div>
                                    <div className="text-gray-600 text-xs">CBP:</div>
                                    <div className="font-medium text-green-600 text-xs">
                                      {cbpValue.toLocaleString()}
                                    </div>
                                  </div>
                                </td>
                              );
                            }
                          }
                          
                          // Para otros casos, usar getPeriodData
                          const data = getPeriodData(planData, planType);
                          let value = data[period] || 0;
                          
                          // Para casos especiales de Summary
                          if (planType === 'summary') {
                            if (summaryMode === 'capacity-utilization') {
                              const actualsData = generatePeriodData(planData.actuals, periodType);
                              const cbpData = generatePeriodData(planData.cbp, periodType);
                              const actualValue = actualsData[period] || 0;
                              const cbpValue = cbpData[period] || 0;
                              value = cbpValue > 0 && actualValue > 0 ? (actualValue / cbpValue) * 100 : 0;
                            } else if (summaryMode === 'forecast') {
                              const actualsData = generatePeriodData(planData.actuals, periodType);
                              const cbpData = generatePeriodData(planData.cbp, periodType);
                              const actualValue = actualsData[period] || 0;
                              const cbpValue = cbpData[period] || 0;
                              value = actualValue > 0 ? actualValue : cbpValue;
                            }
                          }
                          
                          return (
                            <td key={period} className="px-4 py-3 whitespace-nowrap text-sm text-center">
                              <span className={getValueColor(value, viewMode)}>
                                {formatValue(value)}
                              </span>
                            </td>
                          );
                        })}
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {displayView === 'analytics' && (
          <div className="p-6 space-y-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Analytics Dashboard</h3>
            
            {/* KPIs Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {mockCBPData
                .filter(vst => !vst.isTotal && !hiddenVSTs.has(vst.id))
                .map((vst) => {
                                     const data = getDataByMode(vst);
                   const total = filteredPeriods.reduce((sum, month) => sum + (data[month] || 0), 0);
                   const average = total / filteredPeriods.length;
                   const lastMonth = data[filteredPeriods[filteredPeriods.length - 1]] || 0;
                   const prevMonth = data[filteredPeriods[filteredPeriods.length - 2]] || 0;
                  const growth = prevMonth > 0 ? ((lastMonth - prevMonth) / prevMonth) * 100 : 0;
                  
                  return (
                    <div key={vst.id} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900 text-sm">{vst.name}</h4>
                        <span className={`text-xs px-2 py-1 rounded ${
                          growth >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {growth >= 0 ? '+' : ''}{growth.toFixed(1)}%
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-gray-500">Total</div>
                        <div className={`font-bold ${getValueColor(total, viewMode)}`}>
                          {formatValue(total)}
                        </div>
                        <div className="text-xs text-gray-400">
                          Promedio: {formatValue(average)}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Trend Analysis */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="font-medium text-gray-900 mb-4">Análisis de Tendencias</h4>
              <div className="space-y-4">
                                 {filteredPeriods.map((month, index) => {
                   const monthTotal = mockCBPData
                     .filter(vst => !vst.isTotal && !hiddenVSTs.has(vst.id))
                     .reduce((sum, vst) => sum + (getDataByMode(vst)[month] || 0), 0);
                   
                   const maxTotal = Math.max(...filteredPeriods.map(m => 
                     mockCBPData
                       .filter(vst => !vst.isTotal && !hiddenVSTs.has(vst.id))
                       .reduce((sum, vst) => sum + (getDataByMode(vst)[m] || 0), 0)
                   ));
                  
                  const percentage = (monthTotal / maxTotal) * 100;
                  
                  return (
                    <div key={month} className="flex items-center space-x-4">
                      <div className="w-20 text-sm font-medium text-gray-600">
                        {month}
                      </div>
                      <div className="flex-1 bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="w-24 text-sm text-right font-medium text-gray-900">
                        {formatValue(monthTotal)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top Performers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-medium text-gray-900 mb-4">Top Performers</h4>
                <div className="space-y-3">
                  {mockCBPData
                    .filter(vst => !vst.isTotal && !hiddenVSTs.has(vst.id))
                                         .sort((a, b) => {
                       const aTotal = filteredPeriods.reduce((sum, month) => sum + (getDataByMode(a)[month] || 0), 0);
                       const bTotal = filteredPeriods.reduce((sum, month) => sum + (getDataByMode(b)[month] || 0), 0);
                       return bTotal - aTotal;
                     })
                     .slice(0, 5)
                     .map((vst, index) => {
                       const total = filteredPeriods.reduce((sum, month) => sum + (getDataByMode(vst)[month] || 0), 0);
                      return (
                        <div key={vst.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                              index === 0 ? 'bg-yellow-100 text-yellow-800' :
                              index === 1 ? 'bg-gray-100 text-gray-600' :
                              index === 2 ? 'bg-orange-100 text-orange-600' :
                              'bg-blue-100 text-blue-600'
                            }`}>
                              {index + 1}
                            </div>
                            <span className="font-medium text-gray-900">{vst.name}</span>
                          </div>
                          <span className={`font-bold ${getValueColor(total, viewMode)}`}>
                            {formatValue(total)}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-medium text-gray-900 mb-4">Distribución por VST</h4>
                <div className="space-y-3">
                  {mockCBPData
                    .filter(vst => !vst.isTotal && !hiddenVSTs.has(vst.id))
                                         .map((vst) => {
                       const vstTotal = filteredPeriods.reduce((sum, month) => sum + (getDataByMode(vst)[month] || 0), 0);
                       const grandTotal = mockCBPData
                         .filter(v => !v.isTotal && !hiddenVSTs.has(v.id))
                         .reduce((sum, v) => sum + filteredPeriods.reduce((s, month) => s + (getDataByMode(v)[month] || 0), 0), 0);
                      const percentage = (vstTotal / grandTotal) * 100;
                      
                      return (
                        <div key={vst.id} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600">{vst.name}</span>
                            <span className="text-sm font-medium text-gray-900">{percentage.toFixed(1)}%</span>
                          </div>
                          <div className="bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hidden VSTs Panel */}
      {hiddenVSTs.size > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">VSTs Ocultos</h4>
          <div className="flex flex-wrap gap-2">
            {Array.from(hiddenVSTs).map(vstId => {
              const vst = mockCBPData.find(v => v.id === vstId);
              return (
                <button
                  key={vstId}
                  onClick={() => toggleVSTVisibility(vstId)}
                  className="flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
                >
                  <Eye className="w-3 h-3 mr-1" />
                  {vst?.name}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
} 