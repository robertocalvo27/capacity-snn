import { supabase } from '@/lib/supabase';
import type { LearningCurveAdjustment, LearningCurveImpact, LearningCurveStats } from '@/types/capacity';

// Mock data for development
const mockLearningCurveAdjustments: LearningCurveAdjustment[] = [
  {
    id: '1',
    valueStream: 'ENT',
    productionLine: 'L06',
    operation: 'Assembly Line 6',
    operationCode: 'ASM_L06',
    adjustmentPercentage: 15,
    effectiveStartDate: '2025-01-15',
    effectiveEndDate: '2025-03-15',
    reason: 'Nuevo mix de productos requiere adaptación del equipo',
    notes: 'Productos de alta complejidad introducidos en enero',
    status: 'active',
    createdAt: '2025-01-10T08:00:00Z',
    updatedAt: '2025-01-10T08:00:00Z',
    createdBy: 'supervisor@company.com',
    approvedBy: 'manager@company.com',
    approvedAt: '2025-01-12T10:00:00Z'
  },
  {
    id: '2',
    valueStream: 'ENT',
    productionLine: 'L07',
    operation: 'Quality Control',
    operationCode: 'QC_L07',
    adjustmentPercentage: 8,
    effectiveStartDate: '2025-02-01',
    effectiveEndDate: '2025-04-01',
    reason: 'Rotación de personal y entrenamiento de nuevos operarios',
    notes: 'Tres operarios nuevos en proceso de certificación',
    status: 'active',
    createdAt: '2025-01-25T09:00:00Z',
    updatedAt: '2025-01-25T09:00:00Z',
    createdBy: 'supervisor@company.com'
  },
  {
    id: '3',
    valueStream: 'HIP',
    productionLine: 'L02',
    operation: 'Machining Center 2',
    operationCode: 'MC_L02',
    adjustmentPercentage: 12,
    effectiveStartDate: '2025-01-20',
    effectiveEndDate: '2025-02-28',
    reason: 'Implementación de nuevo proceso de manufactura',
    notes: 'Cambio en especificaciones técnicas requiere re-entrenamiento',
    status: 'active',
    createdAt: '2025-01-15T14:00:00Z',
    updatedAt: '2025-01-15T14:00:00Z',
    createdBy: 'engineer@company.com',
    approvedBy: 'manager@company.com',
    approvedAt: '2025-01-18T11:00:00Z'
  },
  {
    id: '4',
    valueStream: 'SPN',
    productionLine: 'L01',
    operation: 'Final Assembly',
    operationCode: 'FA_L01',
    adjustmentPercentage: 5,
    effectiveStartDate: '2024-12-01',
    effectiveEndDate: '2025-01-31',
    reason: 'Ajuste menor por optimización de proceso',
    notes: 'Mejoras implementadas, impacto mínimo esperado',
    status: 'expired',
    createdAt: '2024-11-25T10:00:00Z',
    updatedAt: '2024-11-25T10:00:00Z',
    createdBy: 'supervisor@company.com',
    approvedBy: 'manager@company.com',
    approvedAt: '2024-11-28T09:00:00Z'
  }
];

// Base capacities for impact calculation (mock data)
const baseCapacities = {
  'ASM_L06': 450,
  'QC_L07': 500,
  'MC_L02': 380,
  'FA_L01': 420
};

export const learningCurveService = {
  // Get all learning curve adjustments
  async getAllAdjustments(): Promise<LearningCurveAdjustment[]> {
    try {
      // TODO: Replace with actual Supabase query
      // const { data, error } = await supabase
      //   .from('learning_curve_adjustments')
      //   .select('*')
      //   .order('createdAt', { ascending: false });
      
      // if (error) throw error;
      // return data || [];
      
      return mockLearningCurveAdjustments;
    } catch (error) {
      console.error('Error fetching learning curve adjustments:', error);
      throw error;
    }
  },

  // Get adjustments by filters
  async getAdjustmentsByFilters(filters: {
    valueStream?: string;
    status?: string;
    productionLine?: string;
  }): Promise<LearningCurveAdjustment[]> {
    try {
      let adjustments = mockLearningCurveAdjustments;

      if (filters.valueStream && filters.valueStream !== 'all') {
        adjustments = adjustments.filter(adj => adj.valueStream === filters.valueStream);
      }

      if (filters.status && filters.status !== 'all') {
        adjustments = adjustments.filter(adj => adj.status === filters.status);
      }

      if (filters.productionLine && filters.productionLine !== 'all') {
        adjustments = adjustments.filter(adj => adj.productionLine === filters.productionLine);
      }

      return adjustments;
    } catch (error) {
      console.error('Error filtering learning curve adjustments:', error);
      throw error;
    }
  },

  // Create new adjustment
  async createAdjustment(adjustment: Omit<LearningCurveAdjustment, 'id' | 'createdAt' | 'updatedAt'>): Promise<LearningCurveAdjustment> {
    try {
      const newAdjustment: LearningCurveAdjustment = {
        ...adjustment,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // TODO: Replace with actual Supabase insert
      // const { data, error } = await supabase
      //   .from('learning_curve_adjustments')
      //   .insert([newAdjustment])
      //   .select()
      //   .single();
      
      // if (error) throw error;
      // return data;

      mockLearningCurveAdjustments.unshift(newAdjustment);
      return newAdjustment;
    } catch (error) {
      console.error('Error creating learning curve adjustment:', error);
      throw error;
    }
  },

  // Update adjustment
  async updateAdjustment(id: string, updates: Partial<LearningCurveAdjustment>): Promise<LearningCurveAdjustment> {
    try {
      const updatedAdjustment = {
        ...updates,
        id,
        updatedAt: new Date().toISOString()
      };

      // TODO: Replace with actual Supabase update
      // const { data, error } = await supabase
      //   .from('learning_curve_adjustments')
      //   .update(updatedAdjustment)
      //   .eq('id', id)
      //   .select()
      //   .single();
      
      // if (error) throw error;
      // return data;

      const index = mockLearningCurveAdjustments.findIndex(adj => adj.id === id);
      if (index !== -1) {
        mockLearningCurveAdjustments[index] = { ...mockLearningCurveAdjustments[index], ...updatedAdjustment };
        return mockLearningCurveAdjustments[index];
      }
      throw new Error('Adjustment not found');
    } catch (error) {
      console.error('Error updating learning curve adjustment:', error);
      throw error;
    }
  },

  // Delete adjustment
  async deleteAdjustment(id: string): Promise<void> {
    try {
      // TODO: Replace with actual Supabase delete
      // const { error } = await supabase
      //   .from('learning_curve_adjustments')
      //   .delete()
      //   .eq('id', id);
      
      // if (error) throw error;

      const index = mockLearningCurveAdjustments.findIndex(adj => adj.id === id);
      if (index !== -1) {
        mockLearningCurveAdjustments.splice(index, 1);
      }
    } catch (error) {
      console.error('Error deleting learning curve adjustment:', error);
      throw error;
    }
  },

  // Calculate capacity impact
  async getCapacityImpact(): Promise<LearningCurveImpact[]> {
    try {
      const activeAdjustments = mockLearningCurveAdjustments.filter(adj => adj.status === 'active');
      
      const impacts: LearningCurveImpact[] = activeAdjustments.map(adj => {
        const baseCapacity = baseCapacities[adj.operationCode as keyof typeof baseCapacities] || 400;
        const adjustedCapacity = baseCapacity * (1 - adj.adjustmentPercentage / 100);
        
        let impactLevel: 'low' | 'medium' | 'high' | 'critical';
        if (adj.adjustmentPercentage >= 15) impactLevel = 'critical';
        else if (adj.adjustmentPercentage >= 10) impactLevel = 'high';
        else if (adj.adjustmentPercentage >= 5) impactLevel = 'medium';
        else impactLevel = 'low';

        return {
          valueStream: adj.valueStream,
          productionLine: adj.productionLine,
          operation: adj.operation,
          baseCapacity,
          adjustmentPercentage: adj.adjustmentPercentage,
          adjustedCapacity: Math.round(adjustedCapacity),
          impactLevel,
          effectivePeriod: `${adj.effectiveStartDate} - ${adj.effectiveEndDate || 'Indefinido'}`
        };
      });

      return impacts;
    } catch (error) {
      console.error('Error calculating capacity impact:', error);
      throw error;
    }
  },

  // Get statistics
  async getStatistics(): Promise<LearningCurveStats> {
    try {
      const allAdjustments = mockLearningCurveAdjustments;
      const activeAdjustments = allAdjustments.filter(adj => adj.status === 'active');
      
      const averageAdjustment = activeAdjustments.length > 0 
        ? activeAdjustments.reduce((sum, adj) => sum + adj.adjustmentPercentage, 0) / activeAdjustments.length
        : 0;

      const impacts = await this.getCapacityImpact();
      const totalCapacityImpact = impacts.reduce((sum, impact) => 
        sum + (impact.baseCapacity - impact.adjustedCapacity), 0
      );

      const impactByLevel = {
        low: impacts.filter(i => i.impactLevel === 'low').length,
        medium: impacts.filter(i => i.impactLevel === 'medium').length,
        high: impacts.filter(i => i.impactLevel === 'high').length,
        critical: impacts.filter(i => i.impactLevel === 'critical').length
      };

      return {
        totalAdjustments: allAdjustments.length,
        activeAdjustments: activeAdjustments.length,
        averageAdjustment: Math.round(averageAdjustment * 100) / 100,
        totalCapacityImpact: Math.round(totalCapacityImpact),
        impactByLevel
      };
    } catch (error) {
      console.error('Error calculating statistics:', error);
      throw error;
    }
  },

  // Bulk approve adjustments
  async bulkApprove(ids: string[], approvedBy: string): Promise<void> {
    try {
      const approvedAt = new Date().toISOString();
      
      for (const id of ids) {
        await this.updateAdjustment(id, {
          approvedBy,
          approvedAt,
          status: 'active'
        });
      }
    } catch (error) {
      console.error('Error bulk approving adjustments:', error);
      throw error;
    }
  },

  // Get unique values for filters
  async getFilterOptions(): Promise<{
    valueStreams: string[];
    productionLines: string[];
    operations: string[];
  }> {
    try {
      const adjustments = mockLearningCurveAdjustments;
      
      return {
        valueStreams: [...new Set(adjustments.map(adj => adj.valueStream))],
        productionLines: [...new Set(adjustments.map(adj => adj.productionLine))],
        operations: [...new Set(adjustments.map(adj => adj.operation))]
      };
    } catch (error) {
      console.error('Error getting filter options:', error);
      throw error;
    }
  }
}; 