/**
 * @fileoverview Editor de causas de desviación en producción
 * 
 * @requires types/causes - CAUSES
 * @requires types/production - CauseEntry
 * 
 * @description
 * Modal para registrar causas de desviación en la producción.
 * Permite agregar múltiples causas con tipo, causa general y específica.
 */

import React, { useState } from 'react';
import { X, Plus, Trash2, Clock } from 'lucide-react';
import { CAUSES } from '../../../types/causes';
import type { CauseEntry } from '../../../types/production';

interface CauseEditorProps {
  causes: CauseEntry[];
  onSave: (causes: CauseEntry[]) => void;
  onCancel: () => void;
  deltaUnits: number;
  hourlyTarget: number;
}

/**
 * Componente CauseEditor
 * 
 * @param causes - Array de causas existentes
 * @param onSave - Callback para guardar cambios
 * @param onCancel - Callback para cancelar edición
 * @param deltaUnits - Valor del delta para validación
 * @param hourlyTarget - Valor del objetivo horario para cálculo de tiempo muerto
 * 
 * @backend
 * - Validar que la suma de unidades afectadas no exceda la desviación total
 * - Mantener relación con el registro de producción (foreign key)
 * - Registrar timestamp y usuario que agregó cada causa
 * - Las causas deben ser configurables desde el backend
 */
export function CauseEditor({ 
  causes: initialCauses, 
  onSave, 
  onCancel,
  deltaUnits,
  hourlyTarget
}: CauseEditorProps) {
  const [causes, setCauses] = useState<CauseEntry[]>(initialCauses);
  const [error, setError] = useState<string>('');

  // Calcular total de unidades asignadas
  const totalUnits = causes.reduce((sum, cause) => sum + (cause.units || 0), 0);

  // Función para calcular el tiempo muerto por causa
  const calculateCauseDowntime = (units: number): number => {
    if (!hourlyTarget || hourlyTarget === 0) return 0;
    const minutesPerPiece = 60 / hourlyTarget;
    return Math.round(units * minutesPerPiece);
  };

  // Función para validar unidades
  const validateUnits = (): boolean => {
    const total = causes.reduce((sum, cause) => sum + (cause.units || 0), 0);
    return total === Math.abs(deltaUnits);
  };

  /**
   * Agrega una nueva causa vacía al estado
   * @backend - Generar ID único para cada nueva causa
   */
  const handleAddCause = () => {
    setCauses([
      ...causes,
      { typeCause: '', generalCause: '', specificCause: '', units: null }
    ]);
  };

  /**
   * Actualiza una causa existente
   * @param index - Índice de la causa a actualizar
   * @param field - Campo a actualizar
   * @param value - Nuevo valor
   */
  const handleUpdateCause = (index: number, field: keyof CauseEntry, value: any) => {
    const updatedCauses = causes.map((cause, i) => {
      if (i === index) {
        return { ...cause, [field]: value };
      }
      return cause;
    });
    setCauses(updatedCauses);
  };

  /**
   * Elimina una causa del estado
   * @backend - No eliminar físicamente si la causa ya está guardada
   */
  const handleRemoveCause = (index: number) => {
    setCauses(causes.filter((_, i) => i !== index));
  };

  /**
   * Valida y guarda los cambios
   * @backend - Validar integridad de datos antes de guardar
   */
  const handleSave = () => {
    // Validar que todas las causas tengan los campos requeridos
    const isValid = causes.every(cause => 
      cause.typeCause && 
      cause.generalCause && 
      cause.specificCause && 
      cause.units !== null
    );

    if (!isValid) {
      setError('Por favor complete todos los campos de cada causa');
      return;
    }

    // Validar que las unidades coincidan con el delta
    if (!validateUnits()) {
      setError(`La suma de unidades debe ser igual a ${Math.abs(deltaUnits)}`);
      return;
    }

    onSave(causes);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl mx-4">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Registro de Causas</h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Agregar contador de unidades y tiempo */}
        <div className="px-6 py-2 bg-blue-50">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="font-medium text-blue-800">
                Unidades a distribuir: {Math.abs(deltaUnits)}
              </span>
              <span className={`font-medium ${
                totalUnits === Math.abs(deltaUnits) 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                Asignadas: {totalUnits}
              </span>
            </div>
            <div className="flex items-center justify-end text-gray-600">
              <Clock className="h-4 w-4 mr-1" />
              <span>Tiempo muerto total: {calculateCauseDowntime(totalUnits)} min</span>
            </div>
          </div>
        </div>

        {/* Mostrar error si existe */}
        {error && (
          <div className="px-6 py-2 bg-red-50 text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Content */}
        <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
          {causes.map((cause, index) => (
            <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Causa {index + 1}
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={cause.typeCause}
                    onChange={(e) => handleUpdateCause(index, 'typeCause', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                             focus:border-blue-500 focus:ring-blue-500 transition-colors"
                  >
                    <option value="">Seleccionar tipo...</option>
                    {CAUSES.map(c => (
                      <option key={c.name} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Causa General {index + 1}
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={cause.generalCause}
                    onChange={(e) => handleUpdateCause(index, 'generalCause', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                             focus:border-blue-500 focus:ring-blue-500 transition-colors"
                    disabled={!cause.typeCause}
                  >
                    <option value="">Seleccionar causa...</option>
                    {CAUSES.find(c => c.name === cause.typeCause)?.subcauses.map(sc => (
                      <option key={sc} value={sc}>
                        {sc}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Causa Específica {index + 1}
                      <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={cause.specificCause}
                      onChange={(e) => handleUpdateCause(index, 'specificCause', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                               focus:border-blue-500 focus:ring-blue-500 transition-colors
                               min-h-[80px]"
                      placeholder="Describa los detalles específicos de la causa..."
                      disabled={!cause.generalCause}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unidades {index + 1}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={cause.units ?? ''}
                        onChange={(e) => {
                          const newValue = Number(e.target.value);
                          handleUpdateCause(index, 'units', newValue);
                          setError(''); // Limpiar error al cambiar valor
                        }}
                        className={`mt-1 block w-full rounded-md shadow-sm 
                                 focus:ring-blue-500 focus:border-blue-500 transition-colors
                                 pr-12 ${
                                   totalUnits === Math.abs(deltaUnits)
                                     ? 'border-green-300'
                                     : 'border-red-300'
                                 }`}
                        placeholder="0"
                        min="0"
                        step="1"
                        disabled={!cause.generalCause}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                        und
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Agregar visualización de tiempo muerto por causa */}
              <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                <div>
                  <Clock className="h-4 w-4 inline mr-1" />
                  <span>
                    Tiempo estimado: {calculateCauseDowntime(cause.units || 0)} min
                  </span>
                </div>
                <button
                  onClick={() => handleRemoveCause(index)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
          <button
            onClick={handleAddCause}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Agregar otra causa</span>
          </button>

          <div className="space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700
                       transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 