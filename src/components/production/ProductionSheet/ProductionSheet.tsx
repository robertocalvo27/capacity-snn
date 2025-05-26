import React, { useState, useEffect } from 'react';
import { ProductionTable } from './ProductionTable';
import { useProductionSheet } from './useProductionSheet';
import { useCurrentUser } from '../../../contexts/CurrentUserContext';
import { useUserPermissions } from '../../../hooks/useUserPermissions';
import type { ProductionEntry, Shift } from '../../../types/production';
import { DailySummary } from '../DailySummary';

const ProductionSheet: React.FC = () => {
  const { currentUser } = useCurrentUser();
  const { isSupervisor } = useUserPermissions(currentUser?.id);
  
  // Mantener el estado de las entries en ProductionSheet
  const [entries, setEntries] = useState<ProductionEntry[]>([]);
  
  const {
    columns,
    toggleColumn,
    toggleAllColumns,
    visibleColumns,
    hourRanges
  } = useProductionSheet(entries, 'T1');

  const handleUpdateEntries = (updatedEntries: ProductionEntry[]) => {
    setEntries(updatedEntries);
  };

  return (
    <div className="space-y-6">
      <DailySummary 
        entries={entries}
        shiftType="T1"
        supportHours={3.5}
        laborStandard={0.5} // Este valor debería venir del número de parte actual
      />
      
      <ProductionTable
        hourRanges={hourRanges}
        entries={entries}
        shift="1"
        columns={columns}
        visibleColumns={visibleColumns}
        onToggleColumn={toggleColumn}
        onToggleAllColumns={toggleAllColumns}
        onUpdateEntries={handleUpdateEntries}
        supervisorId={isSupervisor ? currentUser?.id : undefined}
      />
    </div>
  );
};

export default ProductionSheet; 