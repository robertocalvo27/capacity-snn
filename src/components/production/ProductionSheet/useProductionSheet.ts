import { useState, useCallback, useMemo } from 'react';
import type { ProductionEntry, Shift } from '../../../types/production';
import { generateHourRanges } from './utils';
import type { Column, ProductionFilters } from './types';

const defaultColumns: Column[] = [
  { id: 'hour', label: 'HORA', visible: true },
  { id: 'realHeadCount', label: 'HC REAL', visible: true },
  { id: 'additionalHC', label: 'HC ADIC.', visible: true },
  { id: 'programmedStop', label: 'PARO PROGRAMADO', visible: true },
  { id: 'availableTime', label: 'T. DISPONIBLE', visible: true },
  { id: 'workOrder', label: 'WORK ORDER', visible: true },
  { id: 'partNumber', label: 'PART NUMBER', visible: true },
  { id: 'hourlyTarget', label: 'META POR HORA', visible: true },
  { id: 'hourlyTargetFC', label: 'META POR HORA FULL CAPACITY', visible: false },
  { id: 'dailyProduction', label: 'PRODUCCIÓN DEL DÍA', visible: true },
  { id: 'delta', label: 'DELTA', visible: true },
  { id: 'downtime', label: 'TIEMPO MUERTO (MIN)', visible: false },
  { id: 'causes', label: 'CAUSAS', visible: true },
  { id: 'actions', label: 'ACCIONES', visible: true }
];

export function useProductionSheet(entries: ProductionEntry[], shift: Shift) {
  const [columns, setColumns] = useState<Column[]>(defaultColumns);

  const [filters, setFilters] = useState<ProductionFilters>({
    hour: '',
    realHeadCount: '',
    programmedStop: '',
    workOrder: '',
    partNumber: '',
    cause: ''
  });

  const hourRanges = generateHourRanges(shift);

  const toggleColumn = useCallback((columnId: string) => {
    setColumns(prev => prev.map(col => 
      col.id === columnId ? { ...col, visible: !col.visible } : col
    ));
  }, []);

  const toggleAllColumns = useCallback((visible: boolean) => {
    setColumns(prev => prev.map(col => ({ ...col, visible })));
  }, []);

  const visibleColumns = useMemo(() => 
    columns.filter(col => col.visible), 
    [columns]
  );

  return {
    filters,
    setFilters,
    columns,
    toggleColumn,
    toggleAllColumns,
    visibleColumns,
    hourRanges
  };
}