/**
 * @fileoverview Componente para mostrar ajustes activos de producción y personal de soporte
 * 
 * @requires types/production - CORRECTION_FACTORS, SUPPORT_POSITIONS, TargetAdjustment, SupportAdjustment
 * 
 * @description
 * Este componente muestra dos tipos de ajustes:
 * 1. Ajustes de meta de producción (pueden ser por hora o por turno)
 * 2. Configuración de personal de soporte del turno
 */

import React from 'react';
import { Info, Users } from 'lucide-react';
import { 
  TargetAdjustment, 
  CORRECTION_FACTORS,
  SupportAdjustment,
  SUPPORT_POSITIONS
} from '../../../types/production';

interface ActiveAdjustmentsProps {
  // Ajustes de meta activos - pueden ser por hora o turno completo
  targetAdjustments: {
    type: 'shift' | 'single';
    hour?: string;
    adjustment: TargetAdjustment;
  }[];
  // Configuración actual de personal de soporte
  supportAdjustment?: SupportAdjustment;
}

/**
 * Componente ActiveAdjustments
 * 
 * @param targetAdjustments - Array de ajustes de meta activos
 * @param supportAdjustment - Configuración actual de personal de soporte
 * 
 * @backend
 * - Los ajustes deben persistir durante todo el turno
 * - Cada ajuste debe tener un ID único para tracking
 * - Se debe mantener historial de cambios con usuario y timestamp
 */
export function ActiveAdjustments({ targetAdjustments, supportAdjustment }: ActiveAdjustmentsProps) {
  // No mostrar nada si no hay ajustes activos
  if (!targetAdjustments || targetAdjustments.length === 0 && !supportAdjustment) return null;

  return (
    <div className="space-y-4">
      {/* Panel de Ajustes de Meta */}
      {targetAdjustments.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Info className="h-5 w-5 text-blue-500" />
            <h3 className="text-sm font-medium text-blue-900">
              Ajustes de Meta Activos
            </h3>
          </div>
          <div className="space-y-2">
            {targetAdjustments.map((item) => {
              const factor = CORRECTION_FACTORS.find(f => f.id === item.adjustment.factorType);
              return (
                <div 
                  key={item.adjustment.id} 
                  className="flex items-start space-x-2 text-sm text-blue-800"
                >
                  <span className="font-medium min-w-[100px]">
                    {item.type === 'shift' ? 'Todo el turno' : `Hora ${item.hour}`}:
                  </span>
                  <div className="flex-1">
                    <span className="font-medium">{factor?.name}</span>
                    <span className="mx-1">•</span>
                    <span className="text-blue-600">{item.adjustment.percentage}% de ajuste</span>
                    <p className="text-blue-600/80 text-xs mt-0.5">
                      {item.adjustment.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Panel de Personal de Soporte */}
      {supportAdjustment && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Users className="h-5 w-5 text-indigo-500" />
            <h3 className="text-sm font-medium text-indigo-900">
              Personal de Soporte - Turno {supportAdjustment.shift.toString()}
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {supportAdjustment.positions.map((position) => {
              const posInfo = SUPPORT_POSITIONS.find(p => p.id === position.positionId);
              if (!posInfo) return null;
              
              return (
                <div 
                  key={position.positionId}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-indigo-800">{posInfo.name}:</span>
                  <span className="font-medium text-indigo-900">
                    {position.value}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-2 text-xs text-indigo-600">
            Actualizado por: {supportAdjustment.appliedBy} • {
              new Date(supportAdjustment.appliedAt).toLocaleString()
            }
          </div>
        </div>
      )}
    </div>
  );
} 