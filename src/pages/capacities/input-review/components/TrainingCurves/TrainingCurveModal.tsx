import React, { useState, useEffect } from 'react';
import { X, User, Calendar, Target, MapPin, Clock } from 'lucide-react';
import type { TrainingCurve } from '@/types/capacity';

interface TrainingCurveModalProps {
  curve: TrainingCurve | null;
  onSave: (curve: Partial<TrainingCurve>) => void;
  onCancel: () => void;
}

const TrainingCurveModal: React.FC<TrainingCurveModalProps> = ({ curve, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<TrainingCurve>>({
    employeeName: '',
    employeeNumber: '',
    employeeId: '',
    position: 'OPER',
    operation: '',
    operationCode: '',
    currentEfficiency: 0,
    targetEfficiency: 100,
    startDate: new Date(),
    expectedCompletionDate: new Date(),
    status: 'pending',
    valueStream: 'ENT',
    line: '',
    shift: 'T1',
    trainer: '',
    notes: ''
  });

  useEffect(() => {
    if (curve) {
      setFormData({
        employeeName: curve.employeeName,
        employeeNumber: curve.employeeNumber || '',
        employeeId: curve.employeeId,
        position: curve.position,
        operation: curve.operation,
        operationCode: curve.operationCode || '',
        currentEfficiency: curve.currentEfficiency,
        targetEfficiency: curve.targetEfficiency,
        startDate: curve.startDate,
        expectedCompletionDate: curve.expectedCompletionDate,
        status: curve.status,
        valueStream: curve.valueStream,
        line: curve.line || '',
        shift: curve.shift,
        trainer: curve.trainer || '',
        notes: curve.notes || ''
      });
    } else {
      // Configurar fecha de finalización estimada (8 semanas por defecto)
      const defaultEndDate = new Date();
      defaultEndDate.setDate(defaultEndDate.getDate() + 56); // 8 semanas
      
      setFormData(prev => ({
        ...prev,
        expectedCompletionDate: defaultEndDate
      }));
    }
  }, [curve]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!formData.employeeName || !formData.operation || !formData.valueStream) {
      alert('Por favor complete los campos obligatorios');
      return;
    }

    onSave(formData);
  };

  const handleDateChange = (field: 'startDate' | 'expectedCompletionDate', value: string) => {
    const newDate = new Date(value);
    setFormData(prev => ({
      ...prev,
      [field]: newDate
    }));

    // Si cambia la fecha de inicio, ajustar automáticamente la fecha de finalización
    if (field === 'startDate' && !curve) {
      const endDate = new Date(newDate);
      endDate.setDate(endDate.getDate() + 56); // 8 semanas por defecto
      setFormData(prev => ({
        ...prev,
        expectedCompletionDate: endDate
      }));
    }
  };

  const positions = [
    { code: 'OPER', name: 'Operario Fijo' },
    { code: 'TMP', name: 'Operario Temporal' },
    { code: 'LL', name: 'Line Leader' },
    { code: 'BU', name: 'Back Up' },
    { code: 'EQC', name: 'Equipment Clerk' },
    { code: 'DHR', name: 'DHR Clerk' },
    { code: 'QC', name: 'Quality Control' },
    { code: 'MH', name: 'Material Handler' },
    { code: 'TRG', name: 'Trainer' }
  ];

  const valueStreams = ['ENT', 'SM', 'JR', 'WND', 'APO'];
  const shifts = ['T1', 'T2', 'T3'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <User className="w-5 h-5 mr-2 text-blue-600" />
            {curve ? 'Editar Curva de Entrenamiento' : 'Nueva Curva de Entrenamiento'}
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Información del Empleado */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <User className="w-4 h-4 mr-2" />
              Información del Empleado
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  value={formData.employeeName || ''}
                  onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número de Empleado
                </label>
                <input
                  type="text"
                  value={formData.employeeNumber || ''}
                  onChange={(e) => setFormData({ ...formData, employeeNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID Empleado *
                </label>
                <input
                  type="text"
                  value={formData.employeeId || ''}
                  onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Posición *
                </label>
                <select
                  value={formData.position || 'OPER'}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  {positions.map(pos => (
                    <option key={pos.code} value={pos.code}>
                      {pos.code} - {pos.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Información de la Operación */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              Información de la Operación
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Operación *
                </label>
                <input
                  type="text"
                  value={formData.operation || ''}
                  onChange={(e) => setFormData({ ...formData, operation: e.target.value })}
                  placeholder="Ej: Assembly Line 6, Quality Control, etc."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Código de Operación
                </label>
                <input
                  type="text"
                  value={formData.operationCode || ''}
                  onChange={(e) => setFormData({ ...formData, operationCode: e.target.value })}
                  placeholder="Ej: ASM_L6, QC_SM"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Value Stream *
                </label>
                <select
                  value={formData.valueStream || 'ENT'}
                  onChange={(e) => setFormData({ ...formData, valueStream: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  {valueStreams.map(vs => (
                    <option key={vs} value={vs}>{vs}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Línea
                </label>
                <input
                  type="text"
                  value={formData.line || ''}
                  onChange={(e) => setFormData({ ...formData, line: e.target.value })}
                  placeholder="Ej: L06, L07"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Turno *
                </label>
                <select
                  value={formData.shift || 'T1'}
                  onChange={(e) => setFormData({ ...formData, shift: e.target.value as 'T1' | 'T2' | 'T3' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  {shifts.map(shift => (
                    <option key={shift} value={shift}>Turno {shift.slice(1)}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Entrenador/Supervisor
                </label>
                <input
                  type="text"
                  value={formData.trainer || ''}
                  onChange={(e) => setFormData({ ...formData, trainer: e.target.value })}
                  placeholder="Nombre del entrenador"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Configuración de Eficiencia y Fechas */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <Target className="w-4 h-4 mr-2" />
              Configuración de Entrenamiento
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Eficiencia Actual (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.currentEfficiency || 0}
                  onChange={(e) => setFormData({ ...formData, currentEfficiency: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Eficiencia Objetivo (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.targetEfficiency || 100}
                  onChange={(e) => setFormData({ ...formData, targetEfficiency: parseInt(e.target.value) || 100 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Inicio *
                </label>
                <input
                  type="date"
                  value={formData.startDate?.toISOString().split('T')[0] || ''}
                  onChange={(e) => handleDateChange('startDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha Estimada de Finalización *
                </label>
                <input
                  type="date"
                  value={formData.expectedCompletionDate?.toISOString().split('T')[0] || ''}
                  onChange={(e) => handleDateChange('expectedCompletionDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Estado y Notas */}
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <select
                  value={formData.status || 'pending'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as TrainingCurve['status'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="pending">Pendiente</option>
                  <option value="active">Activa</option>
                  <option value="completed">Completada</option>
                  <option value="on_hold">En Pausa</option>
                  <option value="cancelled">Cancelada</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notas y Observaciones
              </label>
              <textarea
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                placeholder="Observaciones sobre el progreso, áreas de mejora, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Resumen */}
          {formData.startDate && formData.expectedCompletionDate && (
            <div className="bg-amber-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Resumen del Entrenamiento
              </h4>
              <div className="text-sm text-gray-600">
                <p>
                  <strong>Duración estimada:</strong> {' '}
                  {Math.ceil((formData.expectedCompletionDate.getTime() - formData.startDate.getTime()) / (1000 * 60 * 60 * 24 * 7))} semanas
                </p>
                <p>
                  <strong>Progreso objetivo:</strong> {' '}
                  {formData.currentEfficiency}% → {formData.targetEfficiency}% 
                  ({((formData.targetEfficiency || 100) - (formData.currentEfficiency || 0))} puntos de mejora)
                </p>
              </div>
            </div>
          )}

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
            >
              {curve ? 'Actualizar' : 'Crear'} Curva
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TrainingCurveModal; 