import React from 'react';
import type { ProductionEntry, Shift } from '../../../types/production';
import { ProductionFilters } from './ProductionFilters';
import { ProductionTable } from './ProductionTable';
import { ProductionLegend } from './ProductionLegend';
import { useProductionSheet } from './useProductionSheet';

interface ProductionSheetProps {
  entries: ProductionEntry[];
  shift: Shift;
  onUpdateEntries: (entries: ProductionEntry[]) => void;
}

export function ProductionSheet({ entries = [], shift, onUpdateEntries }: ProductionSheetProps) {
  const [showFilters, setShowFilters] = React.useState(false);
  const {
    filters,
    setFilters,
    columns,
    toggleColumn,
    toggleAllColumns,
    visibleColumns,
    hourRanges,
    filteredEntries
  } = useProductionSheet(entries, shift);

  return (
    <div className="space-y-4">
      <ProductionFilters 
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        filters={filters}
        setFilters={setFilters}
        columns={columns}
        toggleColumn={toggleColumn}
        toggleAllColumns={toggleAllColumns}
        visibleColumns={visibleColumns}
      />

      <ProductionTable
        hourRanges={hourRanges}
        entries={entries}
        shift={shift}
        visibleColumns={visibleColumns}
        onUpdateEntries={onUpdateEntries}
      />

      <ProductionLegend />
    </div>
  );
}