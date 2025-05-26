import React, { useState, useEffect, useMemo } from 'react';
import type { 
  ProductionEntry, 
  Shift, 
  CauseEntry, 
  TargetAdjustment,
  CorrectionFactorType,
  SupportAdjustment
} from '../../../types/production';
import { Save, X, AlertCircle, Plus, Trash2, CopyIcon, Clock, Settings } from 'lucide-react';
import { PROGRAMMED_STOPS, CORRECTION_FACTORS } from '../../../types/production';
import { PART_NUMBERS } from '../../../types/part-numbers';
import { CAUSES } from '../../../types/causes';
import { getRowBackgroundColor, calculateHourlyTarget, calculateHourlyTargetFC, calculateAvailableTime, validateRegistrationOrder, validateRegistrationTime } from './utils';
import type { Column } from './types';
import { CauseEditor } from './CauseEditor';
import { TargetAdjustmentModal } from './TargetAdjustmentModal';
import { TableActions } from './TableActions';
import { ActiveAdjustments } from './ActiveAdjustments';

interface ProductionTableProps {
  hourRanges: string[];
  entries: ProductionEntry[];
  shift: string;
  columns: Column[];
  visibleColumns: Column[];
  onToggleColumn: (columnId: string) => void;
  onToggleAllColumns: (visible: boolean) => void;
  onUpdateEntries: (entries: ProductionEntry[]) => void;
  supervisorId?: string;
  onShiftClose?: (entries: ProductionEntry[]) => void;
}

// Agregar nuevo tipo para favoritos de paros programados
interface ShiftPresets {
  id: string;
  name: string;
  lineId: string;
  shiftNumber: number;
  programmedStops: {
    hour: string;
    stopName: string;
  }[];
}

// Ejemplo de presets (esto debería venir de la base de datos)
const SHIFT_PRESETS: ShiftPresets[] = [
  {
    id: 'L1-T1',
    name: 'Línea 1 - Turno 1',
    lineId: 'L1',
    shiftNumber: 1,
    programmedStops: [
      { hour: '06:00 a.m. - 07:00 a.m.', stopName: 'Limpieza de línea' },
      { hour: '08:00 a.m. - 09:00 a.m.', stopName: 'Desayuno / café' },
      { hour: '10:00 a.m. - 11:00 a.m.', stopName: 'Tier 1' }
      // ... más paros predefinidos
    ]
  }
  // ... más presets para otras líneas y turnos
];

const AlertMessage = ({ message, type }: { message: string; type: 'error' | 'warning' }) => (
  <div className={`flex items-center p-4 mb-4 rounded-lg ${
    type === 'error' ? 'bg-red-50 text-red-800' : 'bg-yellow-50 text-yellow-800'
  }`}>
    <AlertCircle className="h-5 w-5 mr-2" />
    <span>{message}</span>
  </div>
);

/**
 * Componente ProductionTable
 * Maneja la visualización y edición de registros de producción por hora
 * 
 * @param hourRanges - Array de franjas horarias del turno
 * @param entries - Registros de producción existentes
 * @param shift - Información del turno actual
 * @param columns - Columnas disponibles
 * @param visibleColumns - Columnas visibles en la tabla
 * @param onToggleColumn - Callback para alternar la visibilidad de una columna
 * @param onToggleAllColumns - Callback para alternar la visibilidad de todas las columnas
 * @param onUpdateEntries - Callback para actualizar registros
 */
export function ProductionTable({
  hourRanges,
  entries,
  shift,
  columns,
  visibleColumns,
  onToggleColumn,
  onToggleAllColumns,
  onUpdateEntries,
  supervisorId,
  onShiftClose
}: ProductionTableProps) {
  const [editingCell, setEditingCell] = React.useState<{
    hour: string;
    field: string;
    value: any;
    id: string;
  } | null>(null);

  const [editingCauses, setEditingCauses] = React.useState<{
    hour: string;
    entry: ProductionEntry;
  } | null>(null);

  const [alertMessage, setAlertMessage] = useState<{ message: string; type: 'error' | 'warning' } | null>(null);
  const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);
  const [adjustingEntry, setAdjustingEntry] = useState<ProductionEntry | null>(null);
  const [activeAdjustments, setActiveAdjustments] = useState<{
    type: 'shift' | 'single';
    hour?: string;
    adjustment: TargetAdjustment;
  }[]>([]);

  const [supportAdjustment, setSupportAdjustment] = useState<SupportAdjustment | undefined>(undefined);

  const [isClosingShift, setIsClosingShift] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    hour: string;
    fields: string[];
  }[]>([]);

  const [showColumnSelector, setShowColumnSelector] = useState(false);

  // Nuevo estado para el modal de HC masivo
  const [showBulkHCModal, setShowBulkHCModal] = useState(false);
  const [bulkHCValue, setBulkHCValue] = useState<string>('');
  const [showPresetsModal, setShowPresetsModal] = useState(false);

  // Memoizar el renderizado del selector de columnas
  const columnSelector = useMemo(() => (
    <div className="relative">
      <div className="flex items-center space-x-2">
        <button
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          onClick={() => setShowColumnSelector(prev => !prev)}
        >
          Columnas
        </button>
        {showColumnSelector && (
          <div className="absolute z-10 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
            <div className="py-1">
              {columns.map(column => (
                <div
                  key={column.id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                  onClick={() => onToggleColumn(column.id)}
                >
                  <input
                    type="checkbox"
                    checked={column.visible}
                    onChange={() => {}}
                    className="mr-2"
                  />
                  <span>{column.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  ), [columns, showColumnSelector, onToggleColumn]);

  // Agregar logs para debug
  useEffect(() => {
    console.log('ProductionTable mounted');
    console.log('CORRECTION_FACTORS:', CORRECTION_FACTORS);
    console.log('Current entries:', entries);
    console.log('Active adjustments:', activeAdjustments);
  }, []);

  // Mover la lógica de creación de entradas por defecto fuera del renderizado
  useEffect(() => {
    const missingEntries = hourRanges.filter(
      hour => !entries.some(entry => entry.hour === hour)
    ).map(hour => ({
      id: `${hour}-${Date.now()}`,
      hour,
      realHeadCount: null,
      additionalHC: null,
      programmedStop: 'Sin paro programado',
      availableTime: 60,
      workOrder: '',
      partNumber: '',
      hourlyTarget: 0,
      dailyProduction: 0,
      delta: 0,
      causes: [],
      registeredAt: new Date()
    }));

    if (missingEntries.length > 0) {
      onUpdateEntries([...entries, ...missingEntries]);
    }
  }, [hourRanges, entries, onUpdateEntries]);

  // Función para calcular la meta por hora
  const calculateInitialHourlyTarget = (entry: ProductionEntry): number => {
    if (!entry.partNumber || !entry.realHeadCount) return 0;
    
    return calculateHourlyTarget(
      entry.partNumber,
      shift,
      entry.availableTime,
      entry.realHeadCount
    );
  };

  // Modificar handleSave para manejar correctamente los cálculos
  const handleSave = () => {
    if (!editingCell) return;

    const { hour, field, value } = editingCell;
    const existingEntry = entries.find(e => e.id === editingCell.id);
    
    let parsedValue = value;
    if (field === 'dailyProduction') {
      parsedValue = value === '' ? null : parseInt(value);
      if (parsedValue !== null && isNaN(parsedValue)) {
        setEditingCell(null);
        return;
      }
    }

    let newEntry: ProductionEntry = {
      ...existingEntry,
      [field]: parsedValue
    };

    // Recalcular meta por hora si cambian los campos relevantes
    if (['realHeadCount', 'partNumber', 'programmedStop'].includes(field)) {
      newEntry.hourlyTarget = calculateInitialHourlyTarget(newEntry);
    }

    // Actualizar delta solo si hay producción registrada
    if (field === 'dailyProduction' || newEntry.hourlyTarget !== existingEntry.hourlyTarget) {
      if (parsedValue === null) {
        newEntry.delta = 0;
        newEntry.downtime = 0;
      } else {
        newEntry.delta = parsedValue - (newEntry.hourlyTarget || 0);
        newEntry.downtime = calculateDowntime(newEntry.delta, newEntry.hourlyTarget);
      }
    }

    const updatedEntries = entries.map(e => 
      e.id === editingCell.id ? newEntry : e
    );

    onUpdateEntries(updatedEntries);
    setEditingCell(null);
  };

  const copyFromPreviousRow = (hour: string, field: 'workOrder' | 'partNumber') => {
    const currentIndex = hourRanges.indexOf(hour);
    if (currentIndex <= 0) return; // No hay fila anterior para la primera fila
    
    const previousHour = hourRanges[currentIndex - 1];
    const previousEntry = entries.find(e => e.hour === previousHour);
    const existingEntry = entries.find(e => e.hour === hour);
    
    if (!previousEntry || !previousEntry[field]) return;

    let updatedEntry: ProductionEntry = existingEntry ? {
      ...existingEntry,
      [field]: previousEntry[field]
    } : {
      id: `${hour}-${Date.now()}`,
      hour,
      realHeadCount: null,
      additionalHC: null,
      programmedStop: 'Sin paro programado',
      availableTime: 60,
      workOrder: field === 'workOrder' ? previousEntry.workOrder : '',
      partNumber: field === 'partNumber' ? previousEntry.partNumber : '',
      hourlyTarget: 0,
      dailyProduction: 0,
      delta: 0,
      downtime: 0,
      causes: [],
      registeredAt: new Date()
    };

    // Recalcular meta por hora si tenemos los datos necesarios
    if (updatedEntry.realHeadCount && updatedEntry.partNumber) {
      updatedEntry.hourlyTarget = calculateHourlyTarget(
        updatedEntry.partNumber,
        shift,
        updatedEntry.availableTime,
        updatedEntry.realHeadCount
      );

      // Actualizar delta si ya hay producción registrada
      if (updatedEntry.dailyProduction !== undefined) {
        updatedEntry.delta = (updatedEntry.dailyProduction || 0) - updatedEntry.hourlyTarget;
        updatedEntry.downtime = calculateDowntime(updatedEntry.delta, updatedEntry.hourlyTarget);
      }
    }

    // Si estamos copiando el part number y ya existe un work order, o viceversa,
    // y tenemos HC Real, recalcular la meta
    if (
      (field === 'partNumber' && updatedEntry.workOrder) ||
      (field === 'workOrder' && updatedEntry.partNumber)
    ) {
      if (updatedEntry.realHeadCount) {
        updatedEntry.hourlyTarget = calculateHourlyTarget(
          updatedEntry.partNumber,
          shift,
          updatedEntry.availableTime,
          updatedEntry.realHeadCount
        );
        updatedEntry.delta = (updatedEntry.dailyProduction || 0) - updatedEntry.hourlyTarget;
        updatedEntry.downtime = calculateDowntime(updatedEntry.delta, updatedEntry.hourlyTarget);
      }
    }

    const updatedEntries = entries.map(e => 
      e.hour === hour ? updatedEntry : e
    );

    onUpdateEntries(updatedEntries);
  };

  const renderEditableCell = (hour: string, field: string, currentValue: any, entry: ProductionEntry, options?: {
    type?: string;
    choices?: any[];
    defaultText?: string;
    allowCopy?: boolean;
  }) => {
    const isEditing = editingCell?.hour === hour && 
                     editingCell.field === field && 
                     editingCell.id === entry.id;
    const showCopyButton = options?.allowCopy && hourRanges.indexOf(hour) > 0;

    if (isEditing) {
      return (
        <div className="flex items-center space-x-2">
          {options?.type === 'select' ? (
            <select
              value={editingCell.value}
              onChange={(e) => setEditingCell({
                ...editingCell,
                value: e.target.value
              })}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              autoFocus
            >
              <option value="">{options.defaultText || 'Seleccionar...'}</option>
              {options.choices?.map(choice => (
                <option key={typeof choice === 'string' ? choice : choice.code} 
                        value={typeof choice === 'string' ? choice : choice.code}>
                  {typeof choice === 'string' ? choice : choice.code}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={options?.type || 'text'}
              value={editingCell.value}
              onChange={(e) => setEditingCell({
                ...editingCell,
                value: e.target.value
              })}
              className="w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              autoFocus
            />
          )}
          <button 
            onClick={handleSave}
            className="text-green-600 hover:text-green-700"
          >
            <Save className="h-4 w-4" />
          </button>
          <button 
            onClick={() => setEditingCell(null)}
            className="text-red-600 hover:text-red-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      );
    }

    return (
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleStartEdit(hour, field, currentValue, entry.id)}
          className="flex-grow text-left px-2 py-1 hover:bg-gray-100 rounded"
        >
          {currentValue || options?.defaultText || '-'}
        </button>
        {showCopyButton && (
          <button
            onClick={() => copyFromPreviousRow(hour, field as 'workOrder' | 'partNumber')}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            title="Copiar de la fila anterior"
          >
            <CopyIcon className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  };

  const handleCausesClick = (hour: string, entry: ProductionEntry) => {
    setEditingCauses({ hour, entry });
  };

  const handleSaveCauses = (causes: CauseEntry[]) => {
    if (!editingCauses) return;

    const updatedEntries = entries.map(entry => {
      if (entry.id === editingCauses.entry.id) {
        return {
          ...entry,
          causes: causes.map(cause => ({
            typeCause: cause.typeCause,
            generalCause: cause.generalCause,
            specificCause: cause.specificCause,
            units: cause.units
          }))
        };
      }
      return entry;
    });

    onUpdateEntries(updatedEntries);
    setEditingCauses(null);
  };

  const renderCausesCell = (entry: ProductionEntry, affectedUnits: number) => {
    if (!entry.causes || entry.causes.length === 0) {
      // Si no hay causas registradas y hay delta negativo, mostrar botón para registrar
      return (
        <button
          onClick={() => handleEditCauses(entry)}
          className="text-blue-600 hover:text-blue-800 transition-colors"
        >
          Registrar causas ({affectedUnits} und)
        </button>
      );
    }

    // Si hay causas registradas, mostrar el listado
    return (
      <div className="space-y-1">
        {/* Lista de causas */}
        {entry.causes.map((cause, index) => (
          <div key={index} className="text-sm">
            <span className="font-medium">{cause.typeCause}</span>
            {cause.generalCause && (
              <>
                <span className="mx-1">→</span>
                <span>{cause.generalCause}</span>
              </>
            )}
            {cause.units && (
              <span className="text-gray-500 ml-2">
                ({cause.units} und)
              </span>
            )}
          </div>
        ))}

        {/* Botón de edición y contador de unidades faltantes */}
        <div className="flex items-center justify-between text-sm">
          <button
            onClick={() => handleEditCauses(entry)}
            className="text-blue-600 hover:text-blue-800"
          >
            Editar causas
          </button>
          {affectedUnits > entry.causes.reduce((sum, cause) => sum + (cause.units || 0), 0) && (
            <span className="text-red-600">
              Faltan {affectedUnits - entry.causes.reduce((sum, cause) => sum + (cause.units || 0), 0)} und
            </span>
          )}
        </div>
      </div>
    );
  };

  /**
   * Genera la siguiente hora en formato 12 horas
   * Maneja correctamente la conversión AM/PM y el cambio de día
   * 
   * @param lastHour - Última hora en formato "HH:MM a.m./p.m. - HH:MM a.m./p.m."
   * @returns Nueva franja horaria en el mismo formato
   */
  const generateNextHour = (lastHour: string): string => {
    const [startTime] = lastHour.split(' - ');
    
    // Parsear la hora en formato 12 horas
    const match = startTime.match(/(\d+):(\d+)\s*(a\.m\.|p\.m\.)/i);
    if (!match) return lastHour;
    
    let [_, hours, minutes, period] = match;
    let hour = parseInt(hours);
    
    // Convertir a formato 24 horas para los cálculos
    if (period.toLowerCase() === 'p.m.' && hour !== 12) {
      hour += 12;
    } else if (period.toLowerCase() === 'a.m.' && hour === 12) {
      hour = 0;
    }
    
    // Agregar una hora
    hour = (hour + 1) % 24;
    
    // Convertir de vuelta a formato 12 horas
    let nextPeriod = hour >= 12 ? 'p.m.' : 'a.m.';
    let nextHour = hour % 12;
    if (nextHour === 0) nextHour = 12;
    
    // Generar la hora siguiente
    const nextStartTime = `${String(nextHour).padStart(2, '0')}:${minutes} ${nextPeriod}`;
    
    // Calcular la hora final
    hour = (hour + 1) % 24;
    nextPeriod = hour >= 12 ? 'p.m.' : 'a.m.';
    nextHour = hour % 12;
    if (nextHour === 0) nextHour = 12;
    
    const endTime = `${String(nextHour).padStart(2, '0')}:${minutes} ${nextPeriod}`;
    
    return `${nextStartTime} - ${endTime}`;
  };

  /**
   * Maneja la adición de horas extra
   * Verifica duplicados y mantiene la secuencia horaria
   * Marca las entradas como horas extra para visualización especial
   */
  const handleAddOvertime = () => {
    const lastHour = hourRanges[hourRanges.length - 1];
    const nextHour = generateNextHour(lastHour);
    
    // Verificar si ya existe una entrada para esta hora extra
    if (entries.some(e => e.hour === nextHour)) {
      setAlertMessage({
        message: 'Ya existe un registro para esta hora extra',
        type: 'warning'
      });
      return;
    }

    const newEntry: ProductionEntry = {
      id: `overtime-${Date.now()}`,
      hour: nextHour,
      realHeadCount: null,
      additionalHC: null,
      programmedStop: 'Sin paro programado',
      availableTime: 60,
      workOrder: '',
      partNumber: '',
      hourlyTarget: 0,
      dailyProduction: 0,
      delta: 0,
      causes: [],
      registeredAt: new Date(),
      isOvertime: true
    };

    onUpdateEntries([...entries, newEntry]);
  };

  const handleOpenAdjustments = () => {
    // Remover la validación de entradas existentes
    setIsAdjustmentModalOpen(true);
  };

  const handleSaveAdjustments = (adjustment: TargetAdjustment, range: 'single' | 'shift') => {
    try {
      console.log('Saving adjustments:', { adjustment, range });

      if (!adjustment || typeof adjustment.percentage !== 'number') {
        throw new Error('Invalid adjustment data');
      }

      // Si hay entradas existentes, actualizarlas
      if (entries.length > 0) {
        const updatedEntries = entries.map(entry => {
          if (range === 'shift' || entry.hour === adjustingEntry?.hour) {
            const adjustedTarget = Math.round(
              entry.hourlyTarget * (1 - adjustment.percentage / 100)
            );
            return {
              ...entry,
              hourlyTarget: adjustedTarget,
              targetAdjustment: {
                ...adjustment,
                appliedAt: new Date()
              },
              delta: (entry.dailyProduction || 0) - adjustedTarget
            };
          }
          return entry;
        });
        onUpdateEntries(updatedEntries);
      }

      // Actualizar ajustes activos
      setActiveAdjustments(prev => {
        const newAdjustments = [
          ...prev,
          {
            type: range,
            hour: range === 'single' ? adjustingEntry?.hour : undefined,
            adjustment: {
              ...adjustment,
              appliedAt: new Date()
            }
          }
        ];
        return newAdjustments;
      });

      setAlertMessage({
        message: `Ajuste de ${adjustment.percentage}% aplicado ${
          range === 'shift' ? 'a todo el turno' : 'a la hora seleccionada'
        }`,
        type: 'warning'
      });
      
      setIsAdjustmentModalOpen(false);
      setAdjustingEntry(null);
    } catch (error) {
      console.error('Error al guardar ajustes:', error);
      setAlertMessage({
        message: 'Error al guardar los ajustes. Por favor intente nuevamente.',
        type: 'error'
      });
    }
  };

  // Agregar una función helper para validar los datos del ajuste
  const validateAdjustmentData = (adjustment: TargetAdjustment): boolean => {
    return (
      adjustment &&
      typeof adjustment.percentage === 'number' &&
      adjustment.factorType &&
      adjustment.description
    );
  };

  // Agregar una validación adicional al usar CORRECTION_FACTORS
  const getFactor = (factorId: string) => {
    const factor = CORRECTION_FACTORS.find(f => f.id === factorId);
    if (!factor) {
      console.warn(`Factor no encontrado: ${factorId}`);
      return { name: 'Factor no encontrado' };
    }
    return factor;
  };

  // Agregar la función de cálculo de tiempo muerto
  const calculateDowntime = (delta: number, hourlyTarget: number): number => {
    if (delta >= 0) return 0;
    
    // Si el target es 0, evitar división por 0
    if (hourlyTarget === 0) return 0;
    
    // Calcular minutos basado en la proporción de piezas no producidas
    const minutesPerPiece = 60 / hourlyTarget; // minutos por pieza
    return Math.round(Math.abs(delta) * minutesPerPiece);
  };

  /**
   * Renderiza una fila de la tabla
   * Maneja la visualización especial para horas extra
   * Incluye la lógica para múltiples registros por hora
   * 
   * @param hour - Hora actual
   * @param hourEntries - Registros para esta hora
   * @param rowClass - Clase CSS para el estilo de la fila
   */
  const renderHourRow = (hour: string, hourEntries: ProductionEntry[], rowClass: string) => {
    // Ahora solo renderizamos las entradas existentes
    return hourEntries.map((entry, index) => (
      <tr 
        key={`${hour}-${index}`} 
        className={`${rowClass} ${index > 0 ? 'border-t border-dashed' : ''} ${
          entry.isOvertime ? 'bg-blue-50' : ''
        }`}
      >
        {visibleColumns
          .filter(col => col.visible)
          .map(column => (
            <td key={column.id} className="px-4 py-3 whitespace-nowrap text-sm">
              {renderCell(column.id, hour, entry, index === 0)}
            </td>
          ))}
      </tr>
    ));
  };

  const renderCell = (columnId: string, hour: string, entry: ProductionEntry) => {
    switch (columnId) {
      case 'hour':
        return (
          <div className="flex items-center justify-between">
            <span>{hour}</span>
            <button
              onClick={() => handleAddEntry(hour)}
              className="p-1 text-blue-500 hover:text-blue-700"
              title="Agregar registro"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        );
      case 'realHeadCount':
        return renderEditableCell(hour, 'realHeadCount', entry.realHeadCount, entry, {
          type: 'number'
        });
      case 'additionalHC':
        return renderEditableCell(hour, 'additionalHC', entry.additionalHC, entry, {
          type: 'number'
        });
      case 'programmedStop':
        return renderEditableCell(hour, 'programmedStop', entry.programmedStop, entry, {
          type: 'select',
          choices: PROGRAMMED_STOPS.map(stop => stop.name),
          defaultText: 'Sin paro programado'
        });
      case 'availableTime':
        return entry.availableTime || 60;
      case 'workOrder':
        return renderEditableCell(hour, 'workOrder', entry.workOrder, entry, {
          defaultText: 'Nueva WO...',
          allowCopy: true
        });
      case 'partNumber':
        return renderEditableCell(hour, 'partNumber', entry.partNumber, entry, {
          type: 'select',
          choices: PART_NUMBERS,
          defaultText: 'Seleccionar PN',
          allowCopy: true
        });
      case 'hourlyTarget':
        return entry.hourlyTarget || 0;
      case 'hourlyTargetFC':
        return entry ? calculateHourlyTargetFC(entry.partNumber, shift) : 0;
      case 'dailyProduction':
        const canEdit = canEditProduction(hour);
        if (!canEdit) {
          const previousEntry = entries.find(e => e.hour === hourRanges[hourRanges.indexOf(hour) - 1]);
          const needsCauses = previousEntry && 
            previousEntry.dailyProduction !== null && 
            previousEntry.dailyProduction - (previousEntry.hourlyTarget || 0) < 0 && 
            (!previousEntry.causes || previousEntry.causes.length === 0);

          return (
            <div className="text-gray-400 italic">
              {needsCauses ? 'Registre causas en hora anterior' : 'Complete registro anterior'}
            </div>
          );
        }
        return renderEditableCell(hour, 'dailyProduction', entry.dailyProduction, entry, {
          type: 'number',
          min: 0,
          placeholder: '-'
        });
      case 'delta':
        if (entry.dailyProduction === null || entry.dailyProduction === undefined) {
          return '-';
        }
        const delta = entry.dailyProduction - (entry.hourlyTarget || 0);
        return (
          <span className={delta < 0 ? 'text-red-600' : 'text-green-600'}>
            {delta}
          </span>
        );
      case 'downtime':
        const downtimeMinutes = calculateDowntime(entry.delta, entry.hourlyTarget);
        return downtimeMinutes > 0 ? (
          <span className="text-red-600">
            {downtimeMinutes} min
          </span>
        ) : (
          <span className="text-gray-500">-</span>
        );
      case 'causes':
        if (entry.dailyProduction === null || entry.dailyProduction === undefined) {
          return '-';
        }
        const currentDelta = entry.dailyProduction - (entry.hourlyTarget || 0);
        if (currentDelta >= 0) {
          return 'No requerido';
        }
        return renderCausesCell(entry, Math.abs(currentDelta));
      default:
        return entry[columnId] || '-';
    }
  };

  const handleAddEntry = (hour: string) => {
    const newEntry: ProductionEntry = {
      id: `${hour}-${Date.now()}`,
      hour,
      realHeadCount: null,
      additionalHC: null,
      programmedStop: 'Sin paro programado',
      availableTime: 60,
      workOrder: '',
      partNumber: '',
      hourlyTarget: 0,
      dailyProduction: 0,
      delta: 0,
      causes: [],
      registeredAt: new Date()
    };

    const updatedEntries = [...entries, newEntry];
    onUpdateEntries(updatedEntries);
  };

  const handleRemoveEntry = (entryId: string) => {
    const updatedEntries = entries.filter(e => e.id !== entryId);
    onUpdateEntries(updatedEntries);
  };

  const validateShiftCompletion = (entries: ProductionEntry[], hourRanges: string[]): {
    isComplete: boolean;
    missingFields: {
      hour: string;
      fields: string[];
    }[];
  } => {
    const missingFields: { hour: string; fields: string[]; }[] = [];

    hourRanges.forEach(hour => {
      const hourEntry = entries.find(e => e.hour === hour);
      const missing: string[] = [];

      if (!hourEntry) {
        missingFields.push({ hour, fields: ['Registro completo'] });
        return;
      }

      // Validar campos requeridos
      if (!hourEntry.realHeadCount) missing.push('Head Count');
      if (!hourEntry.workOrder) missing.push('Orden de Trabajo');
      if (!hourEntry.partNumber) missing.push('Número de Parte');
      if (!hourEntry.dailyProduction) missing.push('Producción');
      if (hourEntry.delta < 0 && (!hourEntry.causes || hourEntry.causes.length === 0)) {
        missing.push('Causas de Desviación');
      }

      if (missing.length > 0) {
        missingFields.push({ hour, fields: missing });
      }
    });

    return {
      isComplete: missingFields.length === 0,
      missingFields
    };
  };

  const handleShiftClose = () => {
    console.log('Intentando cerrar turno...');
    const validation = validateShiftCompletion(entries, hourRanges);
    
    console.log('Resultado de validación:', validation);
    
    if (!validation.isComplete) {
      setValidationErrors(validation.missingFields);
      setIsClosingShift(true);
      return;
    }
    
    onShiftClose?.(entries);
  };

  // Agregar botones de acciones rápidas
  const QuickActions = () => (
    <div className="mb-4 flex items-center space-x-4">
      <button
        onClick={() => setShowBulkHCModal(true)}
        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
      >
        Establecer HC Real
      </button>
      <button
        onClick={() => setShowPresetsModal(true)}
        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
      >
        Paros Programados Predefinidos
      </button>
    </div>
  );

  // Modal para HC masivo
  const BulkHCModal = () => (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-medium mb-4">
          Establecer HC Real para todo el turno
        </h3>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={bulkHCValue}
          onChange={(e) => {
            const value = e.target.value.replace(/[^0-9]/g, '');
            setBulkHCValue(value === '' ? '' : value);
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Cantidad de personas"
          autoFocus
        />
        <div className="mt-4 flex justify-end space-x-3">
          <button
            onClick={() => setShowBulkHCModal(false)}
            className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              if (bulkHCValue !== '') {
                applyBulkHC();
              }
            }}
            disabled={bulkHCValue === ''}
            className={`px-4 py-2 rounded-md text-white transition-colors
                      ${bulkHCValue === '' 
                        ? 'bg-blue-400 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            Aplicar
          </button>
        </div>
      </div>
    </div>
  );

  // Modal para presets de paros programados
  const PresetsModal = () => (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-medium mb-4">Seleccionar Configuración Predefinida</h3>
        <div className="space-y-2">
          {SHIFT_PRESETS.map(preset => (
            <button
              key={preset.id}
              onClick={() => applyProgrammedStopsPreset(preset)}
              className="w-full text-left px-4 py-3 rounded-md hover:bg-gray-100"
            >
              {preset.name}
            </button>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => setShowPresetsModal(false)}
            className="px-4 py-2 text-gray-700"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );

  // Función para verificar si se puede editar la producción de una hora específica
  const canEditProduction = (hour: string): boolean => {
    const currentIndex = hourRanges.indexOf(hour);
    if (currentIndex === 0) return true;

    // Obtener la entrada anterior
    const previousHour = hourRanges[currentIndex - 1];
    const previousEntry = entries.find(e => e.hour === previousHour);
    
    if (!previousEntry) return true;

    // Verificar que la entrada anterior tenga producción registrada
    if (previousEntry.dailyProduction === null || previousEntry.dailyProduction === undefined) {
      return false;
    }

    // Calcular delta de la entrada anterior
    const previousDelta = previousEntry.dailyProduction - (previousEntry.hourlyTarget || 0);
    
    // Si tiene delta negativo, debe tener causas registradas
    if (previousDelta < 0) {
      return Boolean(previousEntry.causes && previousEntry.causes.length > 0);
    }

    // Si no tiene delta negativo, permitir edición
    return true;
  };

  const handleEditCauses = (entry: ProductionEntry) => {
    // Asegurarse de que haya producción registrada y delta negativo
    if (entry.dailyProduction === null || entry.dailyProduction === undefined) {
      setAlertMessage({
        message: 'Debe registrar la producción antes de agregar causas',
        type: 'warning'
      });
      return;
    }

    const delta = entry.dailyProduction - (entry.hourlyTarget || 0);
    if (delta >= 0) {
      setAlertMessage({
        message: 'Solo se requieren causas cuando la producción es menor a la meta',
        type: 'warning'
      });
      return;
    }

    setEditingCauses({ hour: entry.hour, entry });
  };

  // Función para aplicar HC a todas las filas
  const applyBulkHC = () => {
    if (bulkHCValue === '') return;

    const numericValue = Number(bulkHCValue);
    const updatedEntries = entries.map(entry => {
      const updatedEntry = {
        ...entry,
        realHeadCount: numericValue
      };
      
      // Recalcular meta por hora
      updatedEntry.hourlyTarget = calculateInitialHourlyTarget(updatedEntry);
      
      // Resetear delta si no hay producción
      if (updatedEntry.dailyProduction === null || updatedEntry.dailyProduction === undefined) {
        updatedEntry.delta = 0;
        updatedEntry.downtime = 0;
      } else {
        updatedEntry.delta = updatedEntry.dailyProduction - updatedEntry.hourlyTarget;
        updatedEntry.downtime = calculateDowntime(updatedEntry.delta, updatedEntry.hourlyTarget);
      }

      return updatedEntry;
    });

    onUpdateEntries(updatedEntries);
    setShowBulkHCModal(false);
    setBulkHCValue('');
  };

  // Función para aplicar preset de paros programados
  const applyProgrammedStopsPreset = (preset: ShiftPresets) => {
    const updatedEntries = entries.map(entry => {
      const presetStop = preset.programmedStops.find(stop => stop.hour === entry.hour);
      if (presetStop) {
        const updatedEntry = {
          ...entry,
          programmedStop: presetStop.stopName,
          availableTime: calculateAvailableTime(presetStop.stopName)
        };
        
        // Recalcular meta por hora si tenemos los datos necesarios
        if (updatedEntry.realHeadCount && updatedEntry.partNumber) {
          updatedEntry.hourlyTarget = calculateInitialHourlyTarget(updatedEntry);
          // Actualizar delta si hay producción
          if (updatedEntry.dailyProduction !== null) {
            updatedEntry.delta = updatedEntry.dailyProduction - updatedEntry.hourlyTarget;
            updatedEntry.downtime = calculateDowntime(updatedEntry.delta, updatedEntry.hourlyTarget);
          }
        }
        return updatedEntry;
      }
      return entry;
    });

    onUpdateEntries(updatedEntries);
    setShowPresetsModal(false);
  };

  const handleStartEdit = (hour: string, field: string, currentValue: any, entryId: string) => {
    if (field === 'dailyProduction') {
      if (!canEditProduction(hour)) {
        setAlertMessage({
          message: 'Debe completar el registro de producción de las horas anteriores primero',
          type: 'warning'
        });
        return;
      }
    }

    setEditingCell({
      hour,
      field,
      value: currentValue ?? '',
      id: entryId
    });
  };

  const handleEntryUpdate = (updatedEntry: ProductionEntry) => {
    const newEntries = entries.map(entry => 
      entry.hour === updatedEntry.hour ? updatedEntry : entry
    );
    onUpdateEntries(newEntries);
  };

  return (
    <div className="space-y-4">
      {alertMessage && (
        <AlertMessage message={alertMessage.message} type={alertMessage.type} />
      )}

      <QuickActions />
      
      <TableActions
        onAddOvertime={handleAddOvertime}
        onOpenAdjustments={handleOpenAdjustments}
        onAttemptClose={handleShiftClose}
      />

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {visibleColumns
                .filter(col => col.visible)
                .map(column => (
                  <th
                    key={column.id}
                    scope="col"
                    className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                      column.id === 'downtime' ? 'text-right' : ''
                    }`}
                  >
                    {column.label}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {hourRanges.map((hour) => {
              const hourEntries = entries.filter(e => e.hour === hour);
              const isOvertime = hourEntries.some(e => e.isOvertime);
              const rowClass = getRowBackgroundColor(
                hourEntries[0]?.registeredAt, 
                hour,
                isOvertime
              );
              return renderHourRow(hour, hourEntries, rowClass);
            })}
            {/* Renderizar las horas extra */}
            {entries
              .filter(e => e.isOvertime && !hourRanges.includes(e.hour))
              .map(entry => {
                const rowClass = getRowBackgroundColor(
                  entry.registeredAt,
                  entry.hour,
                  true
                );
                return renderHourRow(entry.hour, [entry], rowClass);
              })}
          </tbody>
        </table>
      </div>

      {editingCauses && (
        <CauseEditor
          causes={editingCauses.entry.causes || []}
          onSave={handleSaveCauses}
          onCancel={() => setEditingCauses(null)}
          deltaUnits={Math.abs(editingCauses.entry.delta)}
          hourlyTarget={editingCauses.entry.hourlyTarget}
        />
      )}

      {isAdjustmentModalOpen && (
        <TargetAdjustmentModal
          isOpen={isAdjustmentModalOpen}
          onClose={() => {
            setIsAdjustmentModalOpen(false);
            setAdjustingEntry(null);
          }}
          onSave={handleSaveAdjustments}
          onSaveSupport={(adjustment) => {
            setSupportAdjustment(adjustment);
            setAlertMessage({
              message: 'Configuración de personal de soporte actualizada',
              type: 'warning'
            });
          }}
          hourRanges={hourRanges}
          currentHour={adjustingEntry?.hour}
          supervisorId={supervisorId || ''}
          shift={typeof shift === 'object' ? 1 : shift}
        />
      )}

      {isClosingShift && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4">
            <h2 className="text-xl font-bold text-red-600 mb-4">
              No es posible cerrar el turno
            </h2>
            <div className="mb-4">
              <p className="text-gray-700 mb-2">
                Los siguientes campos son requeridos:
              </p>
              <div className="max-h-96 overflow-y-auto">
                {validationErrors.map(({ hour, fields }) => (
                  <div key={hour} className="mb-2 p-2 bg-red-50 rounded">
                    <p className="font-medium">{hour}:</p>
                    <ul className="list-disc list-inside">
                      {fields.map((field, index) => (
                        <li key={index} className="text-sm text-red-600">
                          {field}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsClosingShift(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Continuar Editando
              </button>
            </div>
          </div>
        </div>
      )}

      {showBulkHCModal && <BulkHCModal />}
      {showPresetsModal && <PresetsModal />}
    </div>
  );
}