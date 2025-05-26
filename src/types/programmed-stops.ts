export interface ProgrammedStop {
  id: string;
  name: string;
  duration: number;
  description?: string;
  created_at: string;
}

export interface ProductionProgrammedStop {
  id: string;
  production_entry_id: string;
  programmed_stop_id: string;
  created_at: string;
} 