export interface Column {
  id: string;
  label: string;
  visible: boolean;
}

export interface ProductionFilters {
  hour: string;
  realHeadCount: string;
  additionalHC: string;
  programmedStop: string;
  workOrder: string;
  partNumber: string;
  cause: string;
}

export interface EditingCell {
  id: string;
  field: string;
  value: any;
  entry?: any; // Para mantener el contexto de la entrada completa
}

export interface ProductionEntry {
  // ... existing properties ...
  isOvertime?: boolean;
}