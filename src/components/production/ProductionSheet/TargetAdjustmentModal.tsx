import React, { useState } from 'react';
import { X, Settings } from 'lucide-react';
import { 
  CorrectionFactorType, 
  CORRECTION_FACTORS, 
  TargetAdjustment,
  SUPPORT_POSITIONS,
  SupportAdjustment
} from '../../../types/production';

interface TargetAdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (adjustment: TargetAdjustment, range: 'single' | 'shift') => void;
  onSaveSupport?: (adjustment: SupportAdjustment) => void;
  hourRanges: string[];
  currentHour?: string;
  supervisorId: string;
  shift: string | number;
}

export function TargetAdjustmentModal({
  isOpen,
  onClose,
  onSave,
  onSaveSupport,
  hourRanges,
  currentHour,
  supervisorId,
  shift
}: TargetAdjustmentModalProps) {
  const [activeTab, setActiveTab] = useState<'target' | 'support'>('target');
  
  // Estados para ajuste de meta
  const [selectedFactor, setSelectedFactor] = useState<string>('');
  const [description, setDescription] = useState('');
  const [percentage, setPercentage] = useState<number>(0);
  const [adjustmentRange, setAdjustmentRange] = useState<'single' | 'shift'>('shift');

  // Estados para ajuste de soporte
  const [supportPositions, setSupportPositions] = useState(
    SUPPORT_POSITIONS.map(pos => ({
      positionId: pos.id,
      value: pos.defaultValue
    }))
  );

  const handleSaveTarget = () => {
    if (!selectedFactor || !description || percentage <= 0) {
      alert('Por favor complete todos los campos');
      return;
    }

    const adjustment: TargetAdjustment = {
      id: `adj-${Date.now()}`,
      factorType: selectedFactor,
      description,
      percentage,
      appliedBy: supervisorId,
      appliedAt: new Date()
    };

    onSave(adjustment, adjustmentRange);
  };

  const handleSaveSupport = () => {
    if (!onSaveSupport) return;

    const shiftNumber = typeof shift === 'object' ? 1 : Number(shift);

    const adjustment: SupportAdjustment = {
      id: `support-${Date.now()}`,
      shift: shiftNumber,
      positions: supportPositions,
      appliedBy: supervisorId,
      appliedAt: new Date()
    };

    onSaveSupport(adjustment);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-gray-500" />
            <h2 className="text-xl font-semibold text-gray-800">Ajustes</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="px-6 -mb-px flex space-x-6">
            <button
              onClick={() => setActiveTab('target')}
              className={`py-4 border-b-2 font-medium text-sm ${
                activeTab === 'target'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Ajuste a Meta de Producción
            </button>
            <button
              onClick={() => setActiveTab('support')}
              className={`py-4 border-b-2 font-medium text-sm ${
                activeTab === 'support'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Personal de Soporte
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {activeTab === 'target' ? (
            // Contenido del tab de ajuste de meta
            <>
              {/* Selector de Rango de Aplicación */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aplicar Ajuste a:
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="shift"
                      checked={adjustmentRange === 'shift'}
                      onChange={(e) => setAdjustmentRange('shift')}
                      className="mr-2"
                    />
                    <span>Todo el turno</span>
                  </label>
                  {currentHour && (
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="single"
                        checked={adjustmentRange === 'single'}
                        onChange={(e) => setAdjustmentRange('single')}
                        className="mr-2"
                      />
                      <span>Solo franja {currentHour}</span>
                    </label>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Factor de Corrección
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedFactor}
                    onChange={(e) => setSelectedFactor(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                             focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Seleccionar tipo...</option>
                    {CORRECTION_FACTORS.map(factor => (
                      <option key={factor.id} value={factor.id}>
                        {factor.name}
                      </option>
                    ))}
                  </select>
                  {selectedFactor && (
                    <p className="mt-1 text-sm text-gray-500">
                      {CORRECTION_FACTORS.find(f => f.id === selectedFactor)?.description}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                             focus:border-blue-500 focus:ring-blue-500 min-h-[80px]"
                    placeholder="Describa el motivo del ajuste..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Porcentaje de Ajuste
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="number"
                      value={percentage}
                      onChange={(e) => setPercentage(Math.max(0, Math.min(100, Number(e.target.value))))}
                      className="block w-full rounded-md border-gray-300 pr-12
                               focus:border-blue-500 focus:ring-blue-500"
                      placeholder="0"
                      min="0"
                      max="100"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">%</span>
                    </div>
                  </div>
                </div>

                {/* Preview */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Vista Previa</h4>
                  <div className="text-sm text-gray-600">
                    Se aplicará un ajuste del {percentage}% a {adjustmentRange === 'shift' ? 'todas las metas del turno' : `la meta de ${currentHour}`}
                  </div>
                </div>
              </div>
            </>
          ) : (
            // Contenido del tab de personal de soporte
            <div className="space-y-6">
              <h3 className="text-sm font-medium text-gray-700">
                Configuración de Personal de Soporte - Turno {typeof shift === 'object' ? '' : shift}
              </h3>
              <div className="grid gap-4">
                {SUPPORT_POSITIONS.map((position) => (
                  <div key={position.id} className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">
                      {position.name}
                    </label>
                    <input
                      type="number"
                      value={supportPositions.find(p => p.positionId === position.id)?.value || 0}
                      onChange={(e) => {
                        const value = Math.max(0, Number(e.target.value));
                        setSupportPositions(prev => 
                          prev.map(p => 
                            p.positionId === position.id ? { ...p, value } : p
                          )
                        );
                      }}
                      className="w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      min="0"
                      step="0.5"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={activeTab === 'target' ? handleSaveTarget : handleSaveSupport}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700
                     transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Guardar {activeTab === 'target' ? 'Ajuste' : 'Configuración'}
          </button>
        </div>
      </div>
    </div>
  );
} 