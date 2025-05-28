import React, { useState, useEffect } from 'react';
import { Search, Filter, Upload, Save, FileInput, Check, ChevronDown, ChevronRight, Edit, Info } from 'lucide-react';
import Pagination from '../common/Pagination';
import HeadcountApprovalLog from './HeadcountApprovalLog';
import HeadcountApprovalModal from './HeadcountApprovalModal';
import HeadcountForm from './HeadcountForm';
import { valueStreams, headcountData, headcountPositions, shifts } from '../../data/mockData';

// Interfaces para los datos de headcount
interface HeadcountPosition {
  [key: string]: number;
}

interface HeadcountShift {
  id: number;
  name: string;
  positions: HeadcountPosition;
  total: number;
}

interface HeadcountLine {
  id: number;
  name: string;
  expanded: boolean;
  shifts: HeadcountShift[];
  total: number;
}

interface HeadcountValueStream {
  id: string;
  name: string;
  expanded: boolean;
  lines: HeadcountLine[];
  shifts: HeadcountShift[];
  total: number;
}

// Propiedades para el historial de aprobaciones
interface HeadcountLog {
  id: number;
  valueStream: string;
  line: string;
  operators: number;
  supervisors: number;
  month: string;
  approvedBy: string;
  approvedAt: string;
}

// Propiedades para el componente
interface HeadcountTabProps {
  onSave: () => void;
}

const HeadcountTab: React.FC<HeadcountTabProps> = ({ onSave }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedValueStream, setSelectedValueStream] = useState<string>('all');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [selectAllHeadcounts, setSelectAllHeadcounts] = useState<boolean>(false);
  const [showApprovalConfirm, setShowApprovalConfirm] = useState<boolean>(false);
  const [showApprovalLogs, setShowApprovalLogs] = useState<boolean>(false);
  const [showHeadcountForm, setShowHeadcountForm] = useState<boolean>(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedVST, setSelectedVST] = useState<string | null>(null);
  const [filterValueStream, setFilterValueStream] = useState<string>('');
  const [showPositionDetails, setShowPositionDetails] = useState<Record<string, boolean>>({});
  const [activeDetailLevel, setActiveDetailLevel] = useState<'shift' | 'position'>('shift');
  const [data, setData] = useState<HeadcountValueStream[]>(headcountData);
  const [localApprovalLogs, setLocalApprovalLogs] = useState<HeadcountLog[]>([
    {
      id: 1,
      valueStream: 'ENT',
      line: 'Línea 6',
      operators: 42,
      supervisors: 2,
      month: 'Enero 2024',
      approvedBy: 'Juan Pérez',
      approvedAt: '2024-01-16 10:30'
    },
    {
      id: 2,
      valueStream: 'ENT',
      line: 'Línea 7',
      operators: 41,
      supervisors: 2,
      month: 'Enero 2024',
      approvedBy: 'Juan Pérez',
      approvedAt: '2024-01-16 10:35'
    }
  ]);
  
  // Estados para el selector de período y vista
  const [selectedPeriod, setSelectedPeriod] = useState<string>('202504'); // Abril 2025 como ejemplo
  const [viewType, setViewType] = useState<'table' | 'chart'>('table');
  // Using string literal to avoid TypeScript narrow type comparison errors
  const [chartType, setChartType] = useState<string>('bar');
  const [selectedVSTForChart, setSelectedVSTForChart] = useState<string | null>(null);

  // Interfaces para datos históricos
  interface HistoricalDataPoint {
    month: string;
    total: number;
  }

  interface ValueStreamHistoricalData {
    name: string;
    id: string;
    color: string;
    data: HistoricalDataPoint[];
  }

  interface HistoricalDataSet {
    months: string[];
    series: ValueStreamHistoricalData[];
  }

  // Generar lista de períodos para el selector (últimos 12 meses)
  const generatePeriods = () => {
    const periods = [];
    const currentDate = new Date();
    
    // Incluir el periodo actual y 11 meses anteriores
    for (let i = 0; i < 12; i++) {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1 - i;
      
      // Ajustar año y mes para meses anteriores
      const adjustedYear = month <= 0 ? year - 1 : year;
      const adjustedMonth = month <= 0 ? month + 12 : month;
      
      const periodValue = `${adjustedYear}${adjustedMonth.toString().padStart(2, '0')}`;
      const periodLabel = `${getMonthName(adjustedMonth)} ${adjustedYear}`;
      
      periods.push({ value: periodValue, label: periodLabel });
    }
    
    return periods;
  };
  
  // Función auxiliar para obtener el nombre del mes
  const getMonthName = (month: number) => {
    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return monthNames[month - 1];
  };
  
  // Lista de períodos
  const periods = generatePeriods();

  // Función para seleccionar/deseleccionar todos los headcounts
  const handleSelectAllHeadcounts = (checked: boolean) => {
    setSelectAllHeadcounts(checked);
    setData(prevData => 
      prevData.map(item => ({
        ...item,
        expanded: checked
      }))
    );
  };

  // Función para seleccionar/deseleccionar un headcount específico
  const handleSelectHeadcount = (id: string, checked: boolean) => {
    setData(prevData => 
      prevData.map(item => 
        item.id === id ? { ...item, expanded: checked } : item
      )
    );
    
    // Verificar si todos están seleccionados para actualizar el estado del "select all"
    const allSelected = data.every(item => item.id === id ? checked : item.expanded);
    setSelectAllHeadcounts(allSelected);
  };

  // Función para aprobar los headcounts seleccionados
  const handleApproveHeadcounts = () => {
    const selectedItems = data.filter(item => item.expanded);
    if (selectedItems.length === 0) return;
    
    setShowApprovalConfirm(true);
  };

  // Función para confirmar la aprobación
  const confirmApproval = () => {
    const now = new Date();
    const user = "Juan Pérez"; // En un caso real, vendría del contexto de autenticación
    
    // Crear registros de aprobación
    const newLogs = data
      .filter(item => item.expanded)
      .map(item => ({
        id: Date.now() + item.id.charCodeAt(0),
        valueStream: item.id,
        line: item.name,
        operators: item.shifts.reduce((sum, shift) => sum + shift.total, 0),
        supervisors: 0, // Assuming no supervisors for this example
        month: item.shifts[0].name, // Assuming the first shift's name as the month
        approvedBy: user,
        approvedAt: now.toISOString()
      }));
    
    // Actualizar los datos de headcount
    setData(prevData => 
      prevData.map(item => 
        item.expanded ? { 
          ...item, 
          expanded: false
        } : item
      )
    );
    
    // Guardar los logs
    setLocalApprovalLogs(prev => [...prev, ...newLogs]);
    
    // Cerrar el modal y mostrar notificación
    setShowApprovalConfirm(false);
    setSelectAllHeadcounts(false);
    
    // Llamar a la función de guardar
    onSave();
  };

  // Función para manejar la creación de un nuevo headcount
  const handleAddHeadcount = (headcount: Omit<HeadcountValueStream, 'id' | 'expanded'>) => {
    const newHeadcount = {
      ...headcount,
      id: Date.now().toString(),
      expanded: false
    };
    
    setData(prev => [newHeadcount, ...prev]);
    setShowHeadcountForm(false);
    onSave();
  };

  // Filtrado de datos
  const filteredData = data.filter(item => {
    // Filtrar por término de búsqueda (línea)
    const matchesSearch = searchTerm === '' || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtrar por Value Stream (si aplica)
    const matchesValueStream = selectedValueStream === 'all' || 
      (item.id && item.id.toLowerCase() === selectedValueStream.toLowerCase());
    
    return matchesSearch && matchesValueStream;
  });

  // Paginación
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // Función para alternar la expansión de un value stream
  const toggleExpand = (id: string) => {
    setData(data.map(item => 
      item.id === id ? { ...item, expanded: !item.expanded } : item
    ));
  };

  // Función para alternar la expansión de una línea
  const toggleExpandLine = (vstId: string, lineId: number) => {
    setData(data.map(vst => {
      if (vst.id === vstId) {
        const updatedLines = vst.lines.map(line => 
          line.id === lineId ? { ...line, expanded: !line.expanded } : line
        );
        return { ...vst, lines: updatedLines };
      }
      return vst;
    }));
  };

  // Función para alternar la visualización de detalles de posición
  const togglePositionDetails = (id: string) => {
    setShowPositionDetails({
      ...showPositionDetails,
      [id]: !showPositionDetails[id]
    });
  };

  // Filtrar los datos según el valor stream seleccionado
  const filteredDataStream = filterValueStream 
    ? data.filter(vst => vst.id === filterValueStream)
    : data;

  // Función para calcular el estilo de la fila según el nivel
  const getRowStyle = (level: number) => {
    const baseClasses = "hover:bg-gray-50 border-b";
    
    switch(level) {
      case 0: // Value stream
        return `${baseClasses} font-semibold bg-gray-100`;
      case 1: // Línea
        return `${baseClasses} pl-6`;
      case 2: // Detalle de turno/posición
        return `${baseClasses} pl-12 text-sm`;
      default:
        return baseClasses;
    }
  };

  // Calcular totales
  const totalOperators = data.reduce((sum, vst) => sum + vst.shifts.reduce((sum, shift) => sum + shift.total, 0), 0);
  
  // Manejar aprobación de datos
  const handleApprove = () => {
    setShowApprovalModal(true);
    setSelectedVST('ent');
  };

  const handleApprovalConfirm = () => {
    setShowApprovalModal(false);
    onSave();
  };

  // Modificar la inicialización de datos para incluir las líneas actualizadas del archivo VST y Lineas.csv
  useEffect(() => {
    // Actualizar las líneas para cada Value Stream, excepto External Areas y Joint Repair
    const updatedData = data.map(valueStream => {
      if (valueStream.id === 'sportsMedicine') {
        const totalShift1 = valueStream.shifts[0].total;
        const totalShift2 = valueStream.shifts[1].total;
        const totalShift3 = valueStream.shifts[2].total;
        const lineCount = 5; // Sin contar "Total"
        
        // Distribuir los operadores uniformemente entre las líneas
        const perLineShift1 = Math.floor(totalShift1 / lineCount);
        const perLineShift2 = Math.floor(totalShift2 / lineCount);
        const perLineShift3 = Math.floor(totalShift3 / lineCount);
        
        // Residuos para asignar a la primera línea
        const remainderShift1 = totalShift1 % lineCount;
        const remainderShift2 = totalShift2 % lineCount;
        const remainderShift3 = totalShift3 % lineCount;
        
        const lines = [
          {
            id: 1, 
            name: 'L02', 
            expanded: false, 
            shifts: [
              {...valueStream.shifts[0], total: perLineShift1 + remainderShift1},
              {...valueStream.shifts[1], total: perLineShift2 + remainderShift2},
              {...valueStream.shifts[2], total: perLineShift3 + remainderShift3}
            ],
            total: perLineShift1 + remainderShift1 + perLineShift2 + remainderShift2 + perLineShift3 + remainderShift3
          },
          {
            id: 2, 
            name: 'L03', 
            expanded: false, 
            shifts: [
              {...valueStream.shifts[0], total: perLineShift1},
              {...valueStream.shifts[1], total: perLineShift2},
              {...valueStream.shifts[2], total: perLineShift3}
            ],
            total: perLineShift1 + perLineShift2 + perLineShift3
          },
          {
            id: 3, 
            name: 'L04', 
            expanded: false, 
            shifts: [
              {...valueStream.shifts[0], total: perLineShift1},
              {...valueStream.shifts[1], total: perLineShift2},
              {...valueStream.shifts[2], total: perLineShift3}
            ],
            total: perLineShift1 + perLineShift2 + perLineShift3
          },
          {
            id: 4, 
            name: 'L05', 
            expanded: false, 
            shifts: [
              {...valueStream.shifts[0], total: perLineShift1},
              {...valueStream.shifts[1], total: perLineShift2},
              {...valueStream.shifts[2], total: perLineShift3}
            ],
            total: perLineShift1 + perLineShift2 + perLineShift3
          },
          {
            id: 5, 
            name: 'L09', 
            expanded: false, 
            shifts: [
              {...valueStream.shifts[0], total: perLineShift1},
              {...valueStream.shifts[1], total: perLineShift2},
              {...valueStream.shifts[2], total: perLineShift3}
            ],
            total: perLineShift1 + perLineShift2 + perLineShift3
          },
          {
            id: 6, 
            name: 'Total', 
            expanded: false, 
            shifts: [...valueStream.shifts],
            total: valueStream.total
          }
        ];
        
        return {
          ...valueStream,
          lines
        };
      } else if (valueStream.id === 'ent') {
        const totalShift1 = valueStream.shifts[0].total;
        const totalShift2 = valueStream.shifts[1].total;
        const totalShift3 = valueStream.shifts[2].total;
        const lineCount = 5; // Sin contar "Total"
        
        // Distribuir los operadores uniformemente entre las líneas
        const perLineShift1 = Math.floor(totalShift1 / lineCount);
        const perLineShift2 = Math.floor(totalShift2 / lineCount);
        const perLineShift3 = Math.floor(totalShift3 / lineCount);
        
        // Residuos para asignar a la primera línea
        const remainderShift1 = totalShift1 % lineCount;
        const remainderShift2 = totalShift2 % lineCount;
        const remainderShift3 = totalShift3 % lineCount;
        
        const lines = [
          {
            id: 1, 
            name: 'L06', 
            expanded: false, 
            shifts: [
              {...valueStream.shifts[0], total: perLineShift1 + remainderShift1},
              {...valueStream.shifts[1], total: perLineShift2 + remainderShift2},
              {...valueStream.shifts[2], total: perLineShift3 + remainderShift3}
            ],
            total: perLineShift1 + remainderShift1 + perLineShift2 + remainderShift2 + perLineShift3 + remainderShift3
          },
          {
            id: 2, 
            name: 'L07', 
            expanded: false, 
            shifts: [
              {...valueStream.shifts[0], total: perLineShift1},
              {...valueStream.shifts[1], total: perLineShift2},
              {...valueStream.shifts[2], total: perLineShift3}
            ],
            total: perLineShift1 + perLineShift2 + perLineShift3
          },
          {
            id: 3, 
            name: 'L10', 
            expanded: false, 
            shifts: [
              {...valueStream.shifts[0], total: perLineShift1},
              {...valueStream.shifts[1], total: perLineShift2},
              {...valueStream.shifts[2], total: perLineShift3}
            ],
            total: perLineShift1 + perLineShift2 + perLineShift3
          },
          {
            id: 4, 
            name: 'L11', 
            expanded: false, 
            shifts: [
              {...valueStream.shifts[0], total: perLineShift1},
              {...valueStream.shifts[1], total: perLineShift2},
              {...valueStream.shifts[2], total: perLineShift3}
            ],
            total: perLineShift1 + perLineShift2 + perLineShift3
          },
          {
            id: 5, 
            name: 'L08 Rapid Rhino', 
            expanded: false, 
            shifts: [
              {...valueStream.shifts[0], total: perLineShift1},
              {...valueStream.shifts[1], total: perLineShift2},
              {...valueStream.shifts[2], total: perLineShift3}
            ],
            total: perLineShift1 + perLineShift2 + perLineShift3
          },
          {
            id: 6, 
            name: 'Total', 
            expanded: false, 
            shifts: [...valueStream.shifts],
            total: valueStream.total
          }
        ];
        
        return {
          ...valueStream,
          lines
        };
      } else if (valueStream.id === 'wound') {
        const totalShift1 = valueStream.shifts[0].total;
        const totalShift2 = valueStream.shifts[1].total;
        const totalShift3 = valueStream.shifts[2].total;
        const lineCount = 2; // Sin contar "Total"
        
        // Distribuir los operadores uniformemente entre las líneas
        const perLineShift1 = Math.floor(totalShift1 / lineCount);
        const perLineShift2 = Math.floor(totalShift2 / lineCount);
        const perLineShift3 = Math.floor(totalShift3 / lineCount);
        
        // Residuos para asignar a la primera línea
        const remainderShift1 = totalShift1 % lineCount;
        const remainderShift2 = totalShift2 % lineCount;
        const remainderShift3 = totalShift3 % lineCount;
        
        const lines = [
          {
            id: 1, 
            name: 'Pico', 
            expanded: false, 
            shifts: [
              {...valueStream.shifts[0], total: perLineShift1 + remainderShift1},
              {...valueStream.shifts[1], total: perLineShift2 + remainderShift2},
              {...valueStream.shifts[2], total: perLineShift3 + remainderShift3}
            ],
            total: perLineShift1 + remainderShift1 + perLineShift2 + remainderShift2 + perLineShift3 + remainderShift3
          },
          {
            id: 2, 
            name: 'Gal', 
            expanded: false, 
            shifts: [
              {...valueStream.shifts[0], total: perLineShift1},
              {...valueStream.shifts[1], total: perLineShift2},
              {...valueStream.shifts[2], total: perLineShift3}
            ],
            total: perLineShift1 + perLineShift2 + perLineShift3
          },
          {
            id: 3, 
            name: 'Total', 
            expanded: false, 
            shifts: [...valueStream.shifts],
            total: valueStream.total
          }
        ];
        
        return {
          ...valueStream,
          lines
        };
      } else if (valueStream.id === 'regenetenFS') {
        // Este es Fixation según el archivo
        const totalShift1 = valueStream.shifts[0].total;
        const totalShift2 = valueStream.shifts[1].total;
        const totalShift3 = valueStream.shifts[2].total;
        const lineCount = 7; // Sin contar "Total"
        
        // Distribuir los operadores uniformemente entre las líneas
        const perLineShift1 = Math.floor(totalShift1 / lineCount);
        const perLineShift2 = Math.floor(totalShift2 / lineCount);
        const perLineShift3 = Math.floor(totalShift3 / lineCount);
        
        // Residuos para asignar a la primera línea
        const remainderShift1 = totalShift1 % lineCount;
        const remainderShift2 = totalShift2 % lineCount;
        const remainderShift3 = totalShift3 % lineCount;
        
        const lines = [
          {
            id: 1, 
            name: 'L12', 
            expanded: false, 
            shifts: [
              {...valueStream.shifts[0], total: perLineShift1 + remainderShift1},
              {...valueStream.shifts[1], total: perLineShift2 + remainderShift2},
              {...valueStream.shifts[2], total: perLineShift3 + remainderShift3}
            ],
            total: perLineShift1 + remainderShift1 + perLineShift2 + remainderShift2 + perLineShift3 + remainderShift3
          },
          {
            id: 2, 
            name: 'L13', 
            expanded: false, 
            shifts: [
              {...valueStream.shifts[0], total: perLineShift1},
              {...valueStream.shifts[1], total: perLineShift2},
              {...valueStream.shifts[2], total: perLineShift3}
            ],
            total: perLineShift1 + perLineShift2 + perLineShift3
          },
          {
            id: 3, 
            name: 'L14', 
            expanded: false, 
            shifts: [
              {...valueStream.shifts[0], total: perLineShift1},
              {...valueStream.shifts[1], total: perLineShift2},
              {...valueStream.shifts[2], total: perLineShift3}
            ],
            total: perLineShift1 + perLineShift2 + perLineShift3
          },
          {
            id: 4, 
            name: 'L14.5', 
            expanded: false, 
            shifts: [
              {...valueStream.shifts[0], total: perLineShift1},
              {...valueStream.shifts[1], total: perLineShift2},
              {...valueStream.shifts[2], total: perLineShift3}
            ],
            total: perLineShift1 + perLineShift2 + perLineShift3
          },
          {
            id: 5, 
            name: 'L15', 
            expanded: false, 
            shifts: [
              {...valueStream.shifts[0], total: perLineShift1},
              {...valueStream.shifts[1], total: perLineShift2},
              {...valueStream.shifts[2], total: perLineShift3}
            ],
            total: perLineShift1 + perLineShift2 + perLineShift3
          },
          {
            id: 6, 
            name: 'L17', 
            expanded: false, 
            shifts: [
              {...valueStream.shifts[0], total: perLineShift1},
              {...valueStream.shifts[1], total: perLineShift2},
              {...valueStream.shifts[2], total: perLineShift3}
            ],
            total: perLineShift1 + perLineShift2 + perLineShift3
          },
          {
            id: 7, 
            name: 'Cer 3', 
            expanded: false, 
            shifts: [
              {...valueStream.shifts[0], total: perLineShift1},
              {...valueStream.shifts[1], total: perLineShift2},
              {...valueStream.shifts[2], total: perLineShift3}
            ],
            total: perLineShift1 + perLineShift2 + perLineShift3
          },
          {
            id: 8, 
            name: 'Total', 
            expanded: false, 
            shifts: [...valueStream.shifts],
            total: valueStream.total
          }
        ];
        
        return {
          ...valueStream,
          name: 'Fixation',
          lines
        };
      } else {
        // Mantener las líneas como están para External Areas y Joint Repair
        return valueStream;
      }
    });

    setData(updatedData);
  }, []);

  // Generar datos históricos simulados para el gráfico
  const generateHistoricalData = (): HistoricalDataSet => {
    // Generar 6 meses de datos históricos para cada Value Stream
    const historicalMonths = 6;
    const result: ValueStreamHistoricalData[] = [];
    
    // Obtener los últimos 6 meses
    const months: string[] = [];
    const currentDate = new Date();
    
    for (let i = 0; i < historicalMonths; i++) {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() - i;
      
      // Ajustar año y mes para meses anteriores
      const adjustedYear = month < 0 ? year - 1 : year;
      const adjustedMonth = month < 0 ? month + 12 : month;
      
      months.unshift(`${getMonthName(adjustedMonth + 1).substring(0, 3)} ${adjustedYear}`);
    }
    
    // Para cada Value Stream, generar datos históricos
    const valueStreamColors: Record<string, string> = {
      'sportsMedicine': '#4f46e5', // Indigo
      'ent': '#0ea5e9', // Sky
      'jointRepair': '#10b981', // Emerald
      'regenetenFS': '#f59e0b', // Amber
      'wound': '#ef4444', // Red
      'apollo': '#8b5cf6', // Violet
      'externalAreas': '#64748b' // Slate
    };
    
    data.forEach(vst => {
      if (vst.id === 'totalSite') return; // Omitir el total del sitio
      
      const baseValue = vst.total;
      const vstData: ValueStreamHistoricalData = {
        name: vst.name,
        id: vst.id,
        color: valueStreamColors[vst.id] || '#6b7280',
        data: []
      };
      
      // Generar variaciones para los meses anteriores
      for (let i = 0; i < historicalMonths; i++) {
        // Variación aleatoria entre -10% y +15% para simular cambios de personal
        const variation = baseValue * (Math.random() * 0.25 - 0.1);
        const total = Math.round(baseValue + variation);
        
        vstData.data.push({
          month: months[i],
          total: total > 0 ? total : baseValue
        });
      }
      
      result.push(vstData);

      // Si es el VST seleccionado, también generar datos para sus líneas
      if (selectedVSTForChart === vst.id && vst.lines && vst.lines.length > 0) {
        // Excluir la línea "Total"
        const lines = vst.lines.filter(line => line.name !== 'Total');
        
        // Distribuir colores para las líneas usando variaciones del color del VST
        const baseColor = vstData.color;
        const lineColors = generateLineColors(baseColor, lines.length);
        
        lines.forEach((line, lineIndex) => {
          const lineBaseValue = line.total;
          const lineData: ValueStreamHistoricalData = {
            name: `${vst.name} - Línea ${line.name}`,
            id: `${vst.id}-line-${line.id}`,
            color: lineColors[lineIndex],
            data: []
          };
          
          // Generar variaciones para los meses anteriores
          for (let i = 0; i < historicalMonths; i++) {
            // Variación aleatoria entre -15% y +20% para simular cambios de personal
            const variation = lineBaseValue * (Math.random() * 0.35 - 0.15);
            const total = Math.round(lineBaseValue + variation);
            
            lineData.data.push({
              month: months[i],
              total: total > 0 ? total : lineBaseValue
            });
          }
          
          result.push(lineData);
        });
      }
    });
    
    return { months, series: result };
  };
  
  // Función para generar colores para las líneas
  const generateLineColors = (baseColor: string, count: number): string[] => {
    const colors: string[] = [];
    
    // Convertir el color base hexadecimal a HSL para manipularlo
    let r = parseInt(baseColor.substring(1, 3), 16) / 255;
    let g = parseInt(baseColor.substring(3, 5), 16) / 255;
    let b = parseInt(baseColor.substring(5, 7), 16) / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    let l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
      else if (max === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      
      h /= 6;
    }
    
    // Generar variaciones del color ajustando la luminosidad y saturación
    for (let i = 0; i < count; i++) {
      const newL = Math.min(0.8, l + (i * 0.1));
      const newS = Math.max(0.3, s - (i * 0.05));
      
      // Convertir de nuevo a RGB y luego a hex
      const a = newS * Math.min(newL, 1 - newL);
      const f = (n: number) => {
        const k = (n + h * 12) % 12;
        return newL - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
      };
      
      const newR = Math.round(f(0) * 255);
      const newG = Math.round(f(8) * 255);
      const newB = Math.round(f(4) * 255);
      
      colors.push(`#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`);
    }
    
    return colors;
  };
  
  // Datos históricos simulados
  const historicalData = generateHistoricalData();

  // Manejar clic en un VST
  const handleVSTClick = (vstId: string) => {
    if (selectedVSTForChart === vstId) {
      // Si ya está seleccionado, deseleccionarlo
      setSelectedVSTForChart(null);
    } else {
      // Seleccionar el nuevo VST
      setSelectedVSTForChart(vstId);
    }
  };

  // Vista de gráfico mejorada
  const renderChart = () => {
    const { months, series } = historicalData;
    
    // Título del gráfico
    const chartTitle = selectedVSTForChart 
      ? `Histórico de Headcount: ${data.find(vst => vst.id === selectedVSTForChart)?.name || ''}`
      : 'Histórico de Headcount por Value Stream';
    
    // Subtítulo del gráfico
    const chartSubtitle = selectedVSTForChart
      ? `Mostrando desglose por líneas de producción`
      : `Mostrando datos históricos de personal de los últimos 6 meses`;
    
    // Renderizar el gráfico de barras
    if (chartType === 'bar') {
      const maxValue = Math.max(...series.flatMap(s => s.data.map(d => d.total)));
      const barWidth = 100 / (series.length * months.length);
      
      return (
        <div className="bg-white p-6 rounded-lg border">
          <div className="text-center mb-4">
            <h4 className="text-lg font-medium text-gray-700">{chartTitle}</h4>
            <p className="text-sm text-gray-500">{chartSubtitle}</p>
          </div>
          
          {/* Selector de tipo de gráfico */}
          <div className="flex justify-center mb-4">
            <div className="flex border rounded-md overflow-hidden">
              <button
                onClick={() => setChartType('bar')}
                className={`px-3 py-1 text-sm ${chartType === 'bar' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                Barras
              </button>
              <button
                onClick={() => setChartType('line')}
                className={`px-3 py-1 text-sm ${chartType === 'line' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                Líneas
              </button>
            </div>
          </div>
          
          {/* Área del gráfico */}
          <div className="h-80 relative mt-10">
            {/* Eje Y - Etiquetas */}
            <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between">
              {[0, 1, 2, 3, 4].map(i => (
                <div key={i} className="text-xs text-gray-500 -translate-y-2">
                  {Math.round(maxValue * (4 - i) / 4)}
                </div>
              ))}
            </div>
            
            {/* Eje Y - Líneas de cuadrícula */}
            <div className="absolute left-12 right-0 top-0 bottom-0">
              {[0, 1, 2, 3, 4].map(i => (
                <div 
                  key={i} 
                  className="border-t border-gray-200 absolute left-0 right-0" 
                  style={{ top: `${i * 25}%` }}
                />
              ))}
            </div>
            
            {/* Barras */}
            <div className="absolute left-12 right-0 top-0 bottom-0 flex">
              {months.map((month, monthIndex) => (
                <div key={month} className="flex-1 flex flex-col">
                  <div className="flex-1 flex">
                    {series.map(vs => {
                      const dataPoint = vs.data[monthIndex];
                      const height = dataPoint ? (dataPoint.total / maxValue) * 100 : 0;
                      
                      return (
                        <div 
                          key={vs.id} 
                          className="h-full flex items-end" 
                          style={{ width: `${barWidth}%`, marginLeft: '1%', marginRight: '1%' }}
                        >
                          <div 
                            className="w-full rounded-t-sm hover:opacity-80 cursor-pointer" 
                            style={{ 
                              height: `${height}%`, 
                              backgroundColor: vs.color,
                              transition: 'height 0.5s ease'
                            }}
                            title={`${vs.name}: ${dataPoint?.total || 0} operadores`}
                            onClick={() => !vs.id.includes('-line-') && handleVSTClick(vs.id)}
                          />
                        </div>
                      );
                    })}
                  </div>
                  <div className="h-6 flex items-center justify-center">
                    <span className="text-xs text-gray-500">{month}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Leyenda */}
          <div className="mt-6 flex flex-wrap gap-4 justify-center">
            {series.map(vs => (
              <div 
                key={vs.id} 
                className="flex items-center cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
                onClick={() => !vs.id.includes('-line-') && handleVSTClick(vs.id)}
              >
                <div 
                  className="w-4 h-4 mr-2 rounded-sm" 
                  style={{ backgroundColor: vs.color }}
                />
                <span className="text-sm text-gray-700">{vs.name}</span>
              </div>
            ))}
          </div>
        </div>
      );
    } else {
      // Renderizar el gráfico de líneas
      const maxValue = Math.max(...series.flatMap(s => s.data.map(d => d.total)));
      
      return (
        <div className="bg-white p-6 rounded-lg border">
          <div className="text-center mb-4">
            <h4 className="text-lg font-medium text-gray-700">{chartTitle}</h4>
            <p className="text-sm text-gray-500">{chartSubtitle}</p>
          </div>
          
          {/* Selector de tipo de gráfico */}
          <div className="flex justify-center mb-4">
            <div className="flex border rounded-md overflow-hidden">
              <button
                onClick={() => setChartType('bar')}
                className={`px-3 py-1 text-sm ${chartType === 'bar' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                Barras
              </button>
              <button
                onClick={() => setChartType('line')}
                className={`px-3 py-1 text-sm ${chartType === 'line' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                Líneas
              </button>
            </div>
          </div>
          
          {/* Área del gráfico */}
          <div className="h-80 relative mt-10">
            {/* Eje Y - Etiquetas */}
            <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between">
              {[0, 1, 2, 3, 4].map(i => (
                <div key={i} className="text-xs text-gray-500 -translate-y-2">
                  {Math.round(maxValue * (4 - i) / 4)}
                </div>
              ))}
            </div>
            
            {/* Eje Y - Líneas de cuadrícula */}
            <div className="absolute left-12 right-0 top-0 bottom-0">
              {[0, 1, 2, 3, 4].map(i => (
                <div 
                  key={i} 
                  className="border-t border-gray-200 absolute left-0 right-0" 
                  style={{ top: `${i * 25}%` }}
                />
              ))}
            </div>
            
            {/* Área del gráfico de líneas */}
            <div className="absolute left-12 right-0 top-0 bottom-6 flex flex-col">
              <svg className="w-full h-full" viewBox={`0 0 ${months.length * 100} 100`} preserveAspectRatio="none">
                {/* Líneas para cada serie */}
                {series.map(vs => {
                  // Calcular puntos para la línea
                  const points = vs.data.map((d, i) => {
                    const x = (i / (months.length - 1)) * 100 * (months.length - 1);
                    const y = 100 - ((d.total / maxValue) * 100);
                    return `${x},${y}`;
                  }).join(' ');
                  
                  return (
                    <g key={vs.id} onClick={() => !vs.id.includes('-line-') && handleVSTClick(vs.id)}>
                      {/* Línea */}
                      <polyline
                        points={points}
                        fill="none"
                        stroke={vs.color}
                        strokeWidth="2"
                        className="transition-all duration-500 cursor-pointer hover:stroke-[3px]"
                      />
                      
                      {/* Puntos */}
                      {vs.data.map((d, i) => {
                        const x = (i / (months.length - 1)) * 100 * (months.length - 1);
                        const y = 100 - ((d.total / maxValue) * 100);
                        
                        return (
                          <circle
                            key={i}
                            cx={x}
                            cy={y}
                            r="3"
                            fill={vs.color}
                            className="cursor-pointer hover:r-4"
                            onMouseOver={(e) => {
                              const target = e.target as SVGCircleElement;
                              target.setAttribute('r', '4');
                            }}
                            onMouseOut={(e) => {
                              const target = e.target as SVGCircleElement;
                              target.setAttribute('r', '3');
                            }}
                            data-tooltip={`${vs.name}: ${d.total} operadores`}
                          />
                        );
                      })}
                    </g>
                  );
                })}
              </svg>
              
              {/* Etiquetas del eje X */}
              <div className="flex h-6 w-full absolute bottom-0 left-0">
                {months.map((month, i) => (
                  <div key={month} className="flex-1 text-center">
                    <span className="text-xs text-gray-500">{month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Leyenda */}
          <div className="mt-6 flex flex-wrap gap-4 justify-center">
            {series.map(vs => (
              <div 
                key={vs.id} 
                className="flex items-center cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
                onClick={() => !vs.id.includes('-line-') && handleVSTClick(vs.id)}
              >
                <div 
                  className="w-4 h-4 mr-2 rounded-sm" 
                  style={{ backgroundColor: vs.color }}
                />
                <span className="text-sm text-gray-700">{vs.name}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">
          Headcount - Personal por Línea
        </h3>
        
        {/* Selector de período y botones de vista */}
        <div className="flex space-x-4">
          <div className="relative">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {periods.map(period => (
                <option key={period.value} value={period.value}>
                  {period.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex border rounded-md overflow-hidden">
            <button
              onClick={() => setViewType('table')}
              className={`px-3 py-1 text-sm ${viewType === 'table' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              Tabla
            </button>
            <button
              onClick={() => setViewType('chart')}
              className={`px-3 py-1 text-sm ${viewType === 'chart' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              Gráfico
            </button>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          {/* Buscador */}
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Buscar por línea..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
            />
          </div>

          {/* Botón para mostrar/ocultar filtros avanzados */}
          <button
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="mr-2 h-5 w-5 text-gray-400" />
            Filtros avanzados
          </button>

          {/* Items por página */}
          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-2">Mostrar:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1); // Reset to first page when changing items per page
              }}
              className="border border-gray-300 rounded-md text-sm py-1 pl-2 pr-8 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>

          {/* Botón para aprobar los headcounts seleccionados */}
          <button
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none disabled:bg-gray-300 disabled:cursor-not-allowed"
            onClick={handleApproveHeadcounts}
            disabled={!data.some(item => item.expanded)}
          >
            <Check className="mr-2 h-5 w-5" />
            Aprobar seleccionados
          </button>

          {/* Botón para registrar un nuevo headcount */}
          <button 
            className="flex items-center px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={() => setShowHeadcountForm(true)}
          >
            <FileInput className="w-4 h-4 mr-2" /> Registrar Headcount
          </button>
        </div>

        {/* Filtros avanzados (expandibles) */}
        {showFilters && (
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Filtros avanzados</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Value Stream</label>
                <select
                  value={selectedValueStream}
                  onChange={(e) => {
                    setSelectedValueStream(e.target.value);
                    setCurrentPage(1); // Reset to first page on filter change
                  }}
                  className="block w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Todos</option>
                  {valueStreams.map(vs => (
                    <option key={vs.id} value={vs.id}>{vs.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Log de aprobaciones (expandible) */}
        {showApprovalLogs && (
          <HeadcountApprovalLog 
            logs={localApprovalLogs} 
            onClose={() => setShowApprovalLogs(false)} 
          />
        )}
      </div>

      {/* Selector de nivel de detalle */}
      <div className="mb-4 border-b pb-2">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveDetailLevel('shift')}
            className={`px-3 py-1 text-sm rounded-md ${activeDetailLevel === 'shift' ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Ver por turno
          </button>
          <button
            onClick={() => setActiveDetailLevel('position')}
            className={`px-3 py-1 text-sm rounded-md ${activeDetailLevel === 'position' ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Ver por puesto
          </button>
        </div>
      </div>
      
      {/* Vista de gráfico o tabla según selección */}
      {viewType === 'table' ? (
        // Vista de tabla (código existente)
        <>
          {/* Historial de aprobaciones */}
          {showApprovalLogs && (
            <HeadcountApprovalLog logs={localApprovalLogs} onClose={() => setShowApprovalLogs(false)} />
          )}

          {/* Tabla de datos */}
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 text-left w-1/4">Value Stream / Línea</th>
                  {activeDetailLevel === 'shift' ? (
                    <>
                      {shifts.map(shift => (
                        <th key={shift.id} className="px-4 py-3 text-center">{shift.name}</th>
                      ))}
                      <th className="px-4 py-3 text-center font-bold">Total</th>
                    </>
                  ) : (
                    <>
                      {headcountPositions.slice(0, 5).map(position => (
                        <th key={position.code} className="px-4 py-3 text-center" title={position.name}>
                          {position.code}
                        </th>
                      ))}
                      <th className="px-4 py-3 text-center font-bold">Total</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDataStream.map(vst => (
                  <React.Fragment key={vst.id}>
                    {/* Fila del Value Stream */}
                    <tr className={getRowStyle(0)}>
                      <td className="px-4 py-3 flex items-center">
                        <button onClick={() => toggleExpand(vst.id)} className="mr-2">
                          {vst.expanded ? 
                            <ChevronDown className="h-4 w-4" /> : 
                            <ChevronRight className="h-4 w-4" />
                          }
                        </button>
                        {vst.name}
                      </td>
                      
                      {activeDetailLevel === 'shift' ? (
                        <>
                          {vst.shifts.map(shift => (
                            <td key={shift.id} className="px-4 py-3 text-center">
                              {shift.total}
                            </td>
                          ))}
                          <td className="px-4 py-3 text-center font-bold">{vst.shifts.reduce((sum, shift) => sum + shift.total, 0)}</td>
                        </>
                      ) : (
                        <>
                          {headcountPositions.slice(0, 5).map(position => (
                            <td key={position.code} className="px-4 py-3 text-center">
                              {vst.shifts.reduce((sum, shift) => sum + (shift.positions[position.code] || 0), 0)}
                            </td>
                          ))}
                          <td className="px-4 py-3 text-center font-bold">{vst.shifts.reduce((sum, shift) => sum + shift.total, 0)}</td>
                        </>
                      )}
                    </tr>
                    
                    {/* Líneas del Value Stream (si está expandido) */}
                    {vst.expanded && vst.lines.map(line => (
                      <tr key={`${vst.id}-${line.id}`} className={getRowStyle(1)}>
                        <td className="px-4 py-3 flex items-center">
                          <span className="ml-6">Línea {line.name}</span>
                        </td>
                        
                        {activeDetailLevel === 'shift' ? (
                          <>
                            {line.shifts.map(shift => (
                              <td key={shift.id} className="px-4 py-3 text-center">
                                {shift.total}
                              </td>
                            ))}
                            <td className="px-4 py-3 text-center font-bold">{line.total}</td>
                          </>
                        ) : (
                          <>
                            {headcountPositions.slice(0, 5).map(position => (
                              <td key={position.code} className="px-4 py-3 text-center">
                                {line.shifts.reduce((sum, shift) => sum + (shift.positions[position.code] || 0), 0)}
                              </td>
                            ))}
                            <td className="px-4 py-3 text-center font-bold">{line.total}</td>
                          </>
                        )}
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
                
                {/* Fila de totales */}
                <tr className="bg-gray-100 font-bold">
                  <td className="px-4 py-3">Total</td>
                  {activeDetailLevel === 'shift' ? (
                    <>
                      {shifts.map(shift => {
                        const total = data.reduce((sum, vst) => {
                          const shiftData = vst.shifts.find(s => s.id === shift.id);
                          return sum + (shiftData?.total || 0);
                        }, 0);
                        
                        return (
                          <td key={shift.id} className="px-4 py-3 text-center">{total}</td>
                        );
                      })}
                      <td className="px-4 py-3 text-center">{totalOperators}</td>
                    </>
                  ) : (
                    <>
                      {headcountPositions.slice(0, 5).map(position => {
                        const total = data.reduce((sum, vst) => {
                          return sum + vst.shifts.reduce((shiftSum, shift) => {
                            return shiftSum + (shift.positions[position.code] || 0);
                          }, 0);
                        }, 0);
                        
                        return (
                          <td key={position.code} className="px-4 py-3 text-center">{total}</td>
                        );
                      })}
                      <td className="px-4 py-3 text-center">{totalOperators}</td>
                    </>
                  )}
                </tr>
              </tbody>
            </table>
          </div>
        </>
      ) : (
        // Vista de gráfico mejorada
        renderChart()
      )}
      
      {/* Modal de confirmación de aprobación */}
      {showApprovalConfirm && (
        <HeadcountApprovalModal
          selectedItems={data.filter(item => item.expanded)}
          onConfirm={confirmApproval}
          onCancel={() => setShowApprovalConfirm(false)}
        />
      )}

      {/* Formulario de headcount */}
      {showHeadcountForm && (
        <HeadcountForm
          onSubmit={handleAddHeadcount}
          onCancel={() => setShowHeadcountForm(false)}
        />
      )}
      
      {/* Modal de aprobación */}
      {showApprovalModal && (
        <HeadcountApprovalModal
          selectedItems={[
            { id: 1, line: 'Línea 6', operators: 42, supervisors: 2, month: 'Enero 2024', valueStream: 'ENT' },
            { id: 2, line: 'Línea 7', operators: 41, supervisors: 2, month: 'Enero 2024', valueStream: 'ENT' }
          ]}
          onConfirm={handleApprovalConfirm}
          onCancel={() => setShowApprovalModal(false)}
        />
      )}
    </>
  );
};

export default HeadcountTab; 