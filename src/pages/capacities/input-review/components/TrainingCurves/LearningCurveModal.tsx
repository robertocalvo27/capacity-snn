import React, { useState, useEffect } from 'react';
import { X, Save, TrendingDown, AlertTriangle } from 'lucide-react';
import type { LearningCurveAdjustment } from '../../../../../types/capacity';

interface LearningCurveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (adjustmentData: Partial<LearningCurveAdjustment>) => void;
  adjustment?: LearningCurveAdjustment | null;
}

const LearningCurveModal: React.FC<LearningCurveModalProps> = ({
  isOpen,
  onClose,
  onSave,
  adjustment
}) => {
  const [formData, setFormData] = useState({
    valueStream: 'ENT',
    productionLine: '',
    operation: '',
    operationCode: '',
    adjustmentPercentage: 0,
    effectiveStartDate: '',
    effectiveEndDate: '',
    reason: '',
    notes: '',
    status: 'active' as 'active' | 'inactive' | 'expired'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-populate form if editing
  useEffect(() => {
    if (adjustment) {
      setFormData({
        valueStream: adjustment.valueStream,
        productionLine: adjustment.productionLine,
        operation: adjustment.operation,
        operationCode: adjustment.operationCode,
        adjustmentPercentage: adjustment.adjustmentPercentage,
        effectiveStartDate: adjustment.effectiveStartDate,
        effectiveEndDate: adjustment.effectiveEndDate || '',
        reason: adjustment.reason,
        notes: adjustment.notes || '',
        status: adjustment.status
      });
    } else {
      // Reset form for new adjustment
      const today = new Date().toISOString().split('T')[0];
      setFormData({
        valueStream: 'ENT',
        productionLine: '',
        operation: '',
        operationCode: '',
        adjustmentPercentage: 0,
        effectiveStartDate: today,
        effectiveEndDate: '',
        reason: '',
        notes: '',
        status: 'active'
      });
    }
    setErrors({});
  }, [adjustment, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.operation.trim()) {
      newErrors.operation = 'La operación es requerida';
    }

    if (!formData.operationCode.trim()) {
      newErrors.operationCode = 'El código de operación es requerido';
    }

    if (!formData.productionLine.trim()) {
      newErrors.productionLine = 'La línea de producción es requerida';
    }

    if (formData.adjustmentPercentage < 0 || formData.adjustmentPercentage > 100) {
      newErrors.adjustmentPercentage = 'El porcentaje debe estar entre 0 y 100';
    }

    if (!formData.effectiveStartDate) {
      newErrors.effectiveStartDate = 'La fecha de inicio es requerida';
    }

    if (!formData.reason.trim()) {
      newErrors.reason = 'La razón del ajuste es requerida';
    }

    if (formData.effectiveEndDate && formData.effectiveStartDate && 
        new Date(formData.effectiveEndDate) <= new Date(formData.effectiveStartDate)) {
      newErrors.effectiveEndDate = 'La fecha de fin debe ser posterior a la fecha de inicio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const adjustmentData = {
        ...formData,
        createdBy: 'current_user@company.com', // TODO: Get from auth context
        effectiveEndDate: formData.effectiveEndDate || undefined
      };

      onSave(adjustmentData);
    } catch (error) {
      console.error('Error saving adjustment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getImpactLevel = (percentage: number) => {
    if (percentage >= 15) return { level: 'Crítico', color: 'text-red-600', bg: 'bg-red-50' };
    if (percentage >= 10) return { level: 'Alto', color: 'text-orange-600', bg: 'bg-orange-50' };
    if (percentage >= 5) return { level: 'Medio', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { level: 'Bajo', color: 'text-green-600', bg: 'bg-green-50' };
  };

  const impact = getImpactLevel(formData.adjustmentPercentage);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <TrendingDown className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {adjustment ? 'Editar Ajuste' : 'Nuevo Ajuste por Curva de Aprendizaje'}
              </h2>
              <p className="text-sm text-gray-600">
                Configure el factor de ajuste de capacidad para la operación
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Operation Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <TrendingDown className="h-5 w-5 text-gray-600 mr-2" />
              Información de la Operación
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Operación *
                </label>
                <input
                  type="text"
                  value={formData.operation}
                  onChange={(e) => handleInputChange('operation', e.target.value)}
                  placeholder="Ej: Assembly Line 6, Quality Control"
                  className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                    errors.operation ? 'border-red-300' : ''
                  }`}
                />
                {errors.operation && (
                  <p className="mt-1 text-sm text-red-600">{errors.operation}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Código de Operación *
                </label>
                <input
                  type="text"
                  value={formData.operationCode}
                  onChange={(e) => handleInputChange('operationCode', e.target.value)}
                  placeholder="Ej: ASM_L6, QC_SM"
                  className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                    errors.operationCode ? 'border-red-300' : ''
                  }`}
                />
                {errors.operationCode && (
                  <p className="mt-1 text-sm text-red-600">{errors.operationCode}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Value Stream *
                </label>
                <select
                  value={formData.valueStream}
                  onChange={(e) => handleInputChange('valueStream', e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="ENT">ENT</option>
                  <option value="HIP">HIP</option>
                  <option value="SPN">SPN</option>
                  <option value="KNE">KNE</option>
                  <option value="TRA">TRA</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Línea de Producción *
                </label>
                <input
                  type="text"
                  value={formData.productionLine}
                  onChange={(e) => handleInputChange('productionLine', e.target.value)}
                  placeholder="Ej: L06, L07"
                  className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                    errors.productionLine ? 'border-red-300' : ''
                  }`}
                />
                {errors.productionLine && (
                  <p className="mt-1 text-sm text-red-600">{errors.productionLine}</p>
                )}
              </div>
            </div>
          </div>

          {/* Adjustment Configuration */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <AlertTriangle className="h-5 w-5 text-gray-600 mr-2" />
              Configuración del Ajuste
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Porcentaje de Ajuste (%) *
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={formData.adjustmentPercentage}
                  onChange={(e) => handleInputChange('adjustmentPercentage', parseFloat(e.target.value) || 0)}
                  className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                    errors.adjustmentPercentage ? 'border-red-300' : ''
                  }`}
                />
                {errors.adjustmentPercentage && (
                  <p className="mt-1 text-sm text-red-600">{errors.adjustmentPercentage}</p>
                )}
                
                {/* Impact Indicator */}
                <div className={`mt-2 p-2 rounded-md ${impact.bg}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Nivel de Impacto:</span>
                    <span className={`text-sm font-semibold ${impact.color}`}>
                      {impact.level}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    Capacidad ajustada = Capacidad base × (100% - {formData.adjustmentPercentage}%)
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Inicio *
                </label>
                <input
                  type="date"
                  value={formData.effectiveStartDate}
                  onChange={(e) => handleInputChange('effectiveStartDate', e.target.value)}
                  className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                    errors.effectiveStartDate ? 'border-red-300' : ''
                  }`}
                />
                {errors.effectiveStartDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.effectiveStartDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Fin (Opcional)
                </label>
                <input
                  type="date"
                  value={formData.effectiveEndDate}
                  onChange={(e) => handleInputChange('effectiveEndDate', e.target.value)}
                  className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                    errors.effectiveEndDate ? 'border-red-300' : ''
                  }`}
                />
                {errors.effectiveEndDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.effectiveEndDate}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Dejar vacío para aplicación indefinida
                </p>
              </div>
            </div>
          </div>

          {/* Reason and Notes */}
          <div>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Razón del Ajuste *
                </label>
                <input
                  type="text"
                  value={formData.reason}
                  onChange={(e) => handleInputChange('reason', e.target.value)}
                  placeholder="Ej: Nuevo mix de productos, rotación de personal, cambio de proceso"
                  className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                    errors.reason ? 'border-red-300' : ''
                  }`}
                />
                {errors.reason && (
                  <p className="mt-1 text-sm text-red-600">{errors.reason}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notas Adicionales
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Información adicional sobre el ajuste..."
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>{adjustment ? 'Actualizar' : 'Crear'} Ajuste</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LearningCurveModal; 