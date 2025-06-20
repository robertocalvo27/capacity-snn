import { supabase } from '@/lib/supabase';
import type { TrainingCurve, TrainingProgress, TrainingCurveImpact } from '@/types/capacity';

class TrainingCurveService {
  // Mock data temporal hasta que se actualice la base de datos
  private mockTrainingCurves: TrainingCurve[] = [
    {
      id: 'tc_001',
      employeeId: 'EMP_001',
      employeeName: 'María González',
      employeeNumber: '12345',
      position: 'OPER',
      operation: 'Assembly Line 6',
      operationCode: 'ASM_L6',
      currentEfficiency: 75,
      targetEfficiency: 100,
      startDate: new Date('2024-01-15'),
      expectedCompletionDate: new Date('2024-03-15'),
      status: 'active',
      valueStream: 'ENT',
      line: 'L06',
      shift: 'T1',
      trainer: 'Carlos Ruiz',
      notes: 'Progreso constante, necesita refuerzo en control de calidad',
      weeklyProgress: [
        { week: 1, date: new Date('2024-01-22'), efficiencyAchieved: 45, hoursWorked: 40, evaluatedBy: 'Carlos Ruiz' },
        { week: 2, date: new Date('2024-01-29'), efficiencyAchieved: 55, hoursWorked: 40, evaluatedBy: 'Carlos Ruiz' },
        { week: 3, date: new Date('2024-02-05'), efficiencyAchieved: 65, hoursWorked: 40, evaluatedBy: 'Carlos Ruiz' },
        { week: 4, date: new Date('2024-02-12'), efficiencyAchieved: 75, hoursWorked: 40, evaluatedBy: 'Carlos Ruiz' }
      ],
      createdBy: 'admin',
      createdAt: new Date('2024-01-15').toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'tc_002',
      employeeId: 'EMP_002',
      employeeName: 'Juan Pérez',
      employeeNumber: '12346',
      position: 'OPER',
      operation: 'Assembly Line 7',
      operationCode: 'ASM_L7',
      currentEfficiency: 85,
      targetEfficiency: 100,
      startDate: new Date('2024-01-08'),
      expectedCompletionDate: new Date('2024-03-08'),
      status: 'active',
      valueStream: 'ENT',
      line: 'L07',
      shift: 'T2',
      trainer: 'Ana Martínez',
      notes: 'Excelente progreso, casi listo para operación independiente',
      weeklyProgress: [
        { week: 1, date: new Date('2024-01-15'), efficiencyAchieved: 50, hoursWorked: 40, evaluatedBy: 'Ana Martínez' },
        { week: 2, date: new Date('2024-01-22'), efficiencyAchieved: 65, hoursWorked: 40, evaluatedBy: 'Ana Martínez' },
        { week: 3, date: new Date('2024-01-29'), efficiencyAchieved: 75, hoursWorked: 40, evaluatedBy: 'Ana Martínez' },
        { week: 4, date: new Date('2024-02-05'), efficiencyAchieved: 85, hoursWorked: 40, evaluatedBy: 'Ana Martínez' }
      ],
      createdBy: 'admin',
      createdAt: new Date('2024-01-08').toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'tc_003',
      employeeId: 'EMP_003',
      employeeName: 'Sofia Ramírez',
      employeeNumber: '12347',
      position: 'TMP',
      operation: 'Quality Control',
      operationCode: 'QC_SM',
      currentEfficiency: 60,
      targetEfficiency: 90,
      startDate: new Date('2024-02-01'),
      expectedCompletionDate: new Date('2024-04-01'),
      status: 'active',
      valueStream: 'SM',
      line: 'L01',
      shift: 'T1',
      trainer: 'Roberto Silva',
      notes: 'Empleado temporal, requiere entrenamiento intensivo',
      weeklyProgress: [
        { week: 1, date: new Date('2024-02-08'), efficiencyAchieved: 35, hoursWorked: 40, evaluatedBy: 'Roberto Silva' },
        { week: 2, date: new Date('2024-02-15'), efficiencyAchieved: 50, hoursWorked: 40, evaluatedBy: 'Roberto Silva' },
        { week: 3, date: new Date('2024-02-22'), efficiencyAchieved: 60, hoursWorked: 40, evaluatedBy: 'Roberto Silva' }
      ],
      createdBy: 'admin',
      createdAt: new Date('2024-02-01').toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'tc_004',
      employeeId: 'EMP_004',
      employeeName: 'Luis Torres',
      employeeNumber: '12348',
      position: 'OPER',
      operation: 'Packaging Line',
      operationCode: 'PKG_JR',
      currentEfficiency: 100,
      targetEfficiency: 100,
      startDate: new Date('2023-11-01'),
      expectedCompletionDate: new Date('2024-01-01'),
      actualCompletionDate: new Date('2023-12-28'),
      status: 'completed',
      valueStream: 'JR',
      line: 'L01',
      shift: 'T1',
      trainer: 'Patricia López',
      notes: 'Entrenamiento completado exitosamente',
      weeklyProgress: [
        { week: 1, date: new Date('2023-11-08'), efficiencyAchieved: 40, hoursWorked: 40, evaluatedBy: 'Patricia López' },
        { week: 2, date: new Date('2023-11-15'), efficiencyAchieved: 60, hoursWorked: 40, evaluatedBy: 'Patricia López' },
        { week: 3, date: new Date('2023-11-22'), efficiencyAchieved: 80, hoursWorked: 40, evaluatedBy: 'Patricia López' },
        { week: 4, date: new Date('2023-11-29'), efficiencyAchieved: 90, hoursWorked: 40, evaluatedBy: 'Patricia López' },
        { week: 5, date: new Date('2023-12-06'), efficiencyAchieved: 95, hoursWorked: 40, evaluatedBy: 'Patricia López' },
        { week: 6, date: new Date('2023-12-13'), efficiencyAchieved: 100, hoursWorked: 40, evaluatedBy: 'Patricia López' }
      ],
      createdBy: 'admin',
      approvedBy: 'supervisor',
      createdAt: new Date('2023-11-01').toISOString(),
      updatedAt: new Date('2023-12-28').toISOString()
    }
  ];

  // Obtener todas las curvas de entrenamiento con filtros opcionales
  async getTrainingCurves(filters?: {
    valueStream?: string;
    line?: string;
    shift?: 'T1' | 'T2' | 'T3';
    status?: TrainingCurve['status'];
    position?: string;
  }): Promise<TrainingCurve[]> {
    let curves = [...this.mockTrainingCurves];

    if (filters) {
      if (filters.valueStream) {
        curves = curves.filter(curve => curve.valueStream === filters.valueStream);
      }
      if (filters.line) {
        curves = curves.filter(curve => curve.line === filters.line);
      }
      if (filters.shift) {
        curves = curves.filter(curve => curve.shift === filters.shift);
      }
      if (filters.status) {
        curves = curves.filter(curve => curve.status === filters.status);
      }
      if (filters.position) {
        curves = curves.filter(curve => curve.position === filters.position);
      }
    }

    return curves;
  }

  // Obtener curvas activas (las que impactan la capacidad actual)
  async getActiveTrainingCurves(): Promise<TrainingCurve[]> {
    return this.mockTrainingCurves.filter(curve => curve.status === 'active');
  }

  // Crear nueva curva de entrenamiento
  async createTrainingCurve(curveData: Omit<TrainingCurve, 'id' | 'createdAt' | 'updatedAt'>): Promise<TrainingCurve> {
    const id = `tc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const newCurve: TrainingCurve = {
      id,
      ...curveData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.mockTrainingCurves.push(newCurve);
    return newCurve;
  }

  // Actualizar curva de entrenamiento
  async updateTrainingCurve(id: string, updates: Partial<TrainingCurve>): Promise<TrainingCurve> {
    const index = this.mockTrainingCurves.findIndex(curve => curve.id === id);
    if (index === -1) {
      throw new Error('Training curve not found');
    }
    
    this.mockTrainingCurves[index] = {
      ...this.mockTrainingCurves[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    return this.mockTrainingCurves[index];
  }

  // Agregar progreso semanal
  async addWeeklyProgress(curveId: string, progress: Omit<TrainingProgress, 'week'>): Promise<TrainingCurve> {
    const curve = this.mockTrainingCurves.find(c => c.id === curveId);
    if (!curve) {
      throw new Error('Training curve not found');
    }

    if (!curve.weeklyProgress) {
      curve.weeklyProgress = [];
    }

    const weekNumber = curve.weeklyProgress.length + 1;
    const newProgress: TrainingProgress = {
      week: weekNumber,
      ...progress
    };

    curve.weeklyProgress.push(newProgress);
    curve.currentEfficiency = progress.efficiencyAchieved;
    curve.updatedAt = new Date().toISOString();

    // Auto-completar si alcanza el target
    if (progress.efficiencyAchieved >= curve.targetEfficiency) {
      curve.status = 'completed';
      curve.actualCompletionDate = new Date();
    }

    return curve;
  }

  // Calcular impacto en capacidad por Value Stream
  async calculateCapacityImpact(valueStream?: string): Promise<TrainingCurveImpact[]> {
    const activeCurves = await this.getActiveTrainingCurves();
    const impacts: TrainingCurveImpact[] = [];

    // Agrupar por Value Stream, línea y turno
    const groups = new Map<string, TrainingCurve[]>();
    
    activeCurves.forEach(curve => {
      if (valueStream && curve.valueStream !== valueStream) return;
      
      const key = `${curve.valueStream}_${curve.line || 'ALL'}_${curve.shift}`;
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(curve);
    });

    groups.forEach((curves, key) => {
      const [vs, line, shift] = key.split('_');
      
      const totalEmployees = this.getTotalEmployeesForGroup(vs, line === 'ALL' ? undefined : line, shift as any);
      const employeesInTraining = curves.length;
      const averageEfficiency = curves.reduce((sum, curve) => sum + curve.currentEfficiency, 0) / curves.length;
      
      // Calcular impacto en capacidad
      // Fórmula: (Empleados en entrenamiento * (100 - Eficiencia promedio)) / Total empleados
      const capacityImpact = (employeesInTraining * (100 - averageEfficiency)) / totalEmployees;
      
      // Estimar fecha de recuperación (cuando todas las curvas se completen)
      const latestExpectedDate = curves.reduce((latest, curve) => {
        return curve.expectedCompletionDate > latest ? curve.expectedCompletionDate : latest;
      }, new Date());

      impacts.push({
        valueStream: vs,
        line: line === 'ALL' ? undefined : line,
        shift: shift as 'T1' | 'T2' | 'T3',
        totalEmployees,
        employeesInTraining,
        averageEfficiency: Math.round(averageEfficiency),
        capacityImpact: Math.round(capacityImpact * 100) / 100,
        estimatedRecoveryDate: latestExpectedDate
      });
    });

    return impacts.sort((a, b) => b.capacityImpact - a.capacityImpact);
  }

  // Función auxiliar para obtener total de empleados (mock)
  private getTotalEmployeesForGroup(valueStream: string, line?: string, shift?: 'T1' | 'T2' | 'T3'): number {
    // En producción, esto vendría de la base de datos de headcount
    const mockHeadcounts: Record<string, Record<string, number>> = {
      'ENT': { 'T1': 102, 'T2': 98, 'T3': 0 },
      'SM': { 'T1': 140, 'T2': 136, 'T3': 0 },
      'JR': { 'T1': 51, 'T2': 51, 'T3': 0 },
      'WND': { 'T1': 30, 'T2': 10, 'T3': 0 },
      'APO': { 'T1': 7, 'T2': 7, 'T3': 6 }
    };

    return mockHeadcounts[valueStream]?.[shift || 'T1'] || 50;
  }

  // Obtener estadísticas generales
  async getTrainingStatistics(): Promise<{
    totalActive: number;
    totalCompleted: number;
    totalPending: number;
    averageEfficiency: number;
    totalCapacityImpact: number;
  }> {
    const allCurves = this.mockTrainingCurves;
    const activeCurves = allCurves.filter(c => c.status === 'active');
    const completedCurves = allCurves.filter(c => c.status === 'completed');
    const pendingCurves = allCurves.filter(c => c.status === 'pending');

    const averageEfficiency = activeCurves.length > 0 
      ? activeCurves.reduce((sum, curve) => sum + curve.currentEfficiency, 0) / activeCurves.length
      : 0;

    const impacts = await this.calculateCapacityImpact();
    const totalCapacityImpact = impacts.reduce((sum, impact) => sum + impact.capacityImpact, 0);

    return {
      totalActive: activeCurves.length,
      totalCompleted: completedCurves.length,
      totalPending: pendingCurves.length,
      averageEfficiency: Math.round(averageEfficiency),
      totalCapacityImpact: Math.round(totalCapacityImpact * 100) / 100
    };
  }

  // Eliminar curva de entrenamiento
  async deleteTrainingCurve(id: string): Promise<void> {
    const index = this.mockTrainingCurves.findIndex(curve => curve.id === id);
    if (index > -1) {
      this.mockTrainingCurves.splice(index, 1);
    }
  }

  // Aprobar múltiples curvas
  async bulkApproveTrainingCurves(ids: string[], approvedBy: string): Promise<TrainingCurve[]> {
    const approvedCurves: TrainingCurve[] = [];

    for (const id of ids) {
      const curve = this.mockTrainingCurves.find(c => c.id === id);
      if (curve && curve.status === 'pending') {
        curve.status = 'active';
        curve.approvedBy = approvedBy;
        curve.updatedAt = new Date().toISOString();
        approvedCurves.push(curve);
      }
    }

    return approvedCurves;
  }
}

export const trainingCurveService = new TrainingCurveService(); 