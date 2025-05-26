import { supabase } from '@/lib/supabase';

interface TimeSlot {
  entry_id: string;
  hour: string;
  entry_date: string;
}

interface WorkOrder {
  id: string;
  part_number_code: string;
  time_slots: TimeSlot[];
}

interface CreateWorkOrderData {
  work_order: string;
  part_number_code: string;
  entry_date: string;
  hour: string;
}

class WorkOrderService {
  async getAll() {
    const { data, error } = await supabase
      .from('production_entries')
      .select(`
        id,
        work_order,
        part_number_code,
        entry_date,
        hour
      `)
      .order('entry_date', { ascending: true })
      .order('hour', { ascending: true });
    
    if (error) throw error;
    
    // Agrupar por work order
    const workOrderMap = data.reduce((acc, entry) => {
      if (!acc[entry.work_order]) {
        acc[entry.work_order] = {
          id: entry.work_order,
          part_number_code: entry.part_number_code,
          time_slots: []
        };
      }
      
      acc[entry.work_order].time_slots.push({
        entry_id: entry.id,
        hour: entry.hour,
        entry_date: entry.entry_date
      });
      
      return acc;
    }, {} as Record<string, WorkOrder>);
    
    return Object.values(workOrderMap);
  }

  async getById(id: string) {
    const { data, error } = await supabase
      .from('production_entries')
      .select(`
        id,
        work_order,
        part_number_code,
        entry_date,
        hour,
        part_numbers (*)
      `)
      .eq('work_order', id)
      .order('entry_date', { ascending: true })
      .order('hour', { ascending: true });
    
    if (error) throw error;
    
    if (data.length === 0) return null;
    
    // Agrupar todas las entradas del mismo work order
    return {
      id: data[0].work_order,
      part_number_code: data[0].part_number_code,
      part_numbers: data[0].part_numbers,
      time_slots: data.map(entry => ({
        entry_id: entry.id,
        hour: entry.hour,
        entry_date: entry.entry_date
      }))
    };
  }

  async create(data: CreateWorkOrderData) {
    const { data: newEntry, error } = await supabase
      .from('production_entries')
      .insert({
        work_order: data.work_order,
        part_number_code: data.part_number_code,
        entry_date: data.entry_date,
        hour: data.hour
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: newEntry.work_order,
      part_number_code: newEntry.part_number_code,
      time_slots: [{
        entry_id: newEntry.id,
        hour: newEntry.hour,
        entry_date: newEntry.entry_date
      }]
    };
  }

  async update(entryId: string, data: Partial<CreateWorkOrderData>) {
    const { data: updatedEntry, error } = await supabase
      .from('production_entries')
      .update({
        work_order: data.work_order,
        part_number_code: data.part_number_code,
        entry_date: data.entry_date,
        hour: data.hour
      })
      .eq('id', entryId)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: updatedEntry.work_order,
      part_number_code: updatedEntry.part_number_code,
      time_slots: [{
        entry_id: updatedEntry.id,
        hour: updatedEntry.hour,
        entry_date: updatedEntry.entry_date
      }]
    };
  }

  async delete(entryId: string) {
    const { error } = await supabase
      .from('production_entries')
      .delete()
      .eq('id', entryId);
    
    if (error) throw error;
    
    return true;
  }
}

export const workOrderService = new WorkOrderService(); 