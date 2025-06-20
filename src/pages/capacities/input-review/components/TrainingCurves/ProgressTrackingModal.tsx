import React, { useState } from 'react';
import { X, TrendingUp, Calendar, User, Target, CheckCircle } from 'lucide-react';
import type { TrainingCurve, TrainingProgress } from '@/types/capacity';

interface ProgressTrackingModalProps {
  curve: TrainingCurve;
  onSave: (progress: Omit<TrainingProgress, 'week'>) => void;
  onCancel: () => void;
}

const ProgressTrackingModal: React.FC<ProgressTrackingModalProps> = ({ curve, onSave, onCancel }) => {
  const [progressData, setProgressData] = useState<Omit<TrainingProgress, 'week'>>({
    date: new Date(),
    efficiencyAchieved: curve.currentEfficiency,
    hoursWorked: 40,
    notes: '',
    evaluatedBy: curve.trainer || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (progressData.efficiencyAchieved < 0 || progressData.efficiencyAchieved > 100) {
      alert('La eficiencia debe estar entre 0 y 100%');
      return;
    }

    if (progressData.hoursWorked <= 0) {
      alert('Las horas trabajadas deben ser mayor a 0');
      return;
    }

    onSave(progressData);
  };

  const nextWeekNumber = (curve.weeklyProgress?.length || 0) + 1;
  const progressPercentage = (curve.currentEfficiency / curve.targetEfficiency) * 100;
  const remainingWeeks = curve.expectedCompletionDate 
    ? Math.ceil((curve.expectedCompletionDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 7))
    : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
            Seguimiento de Progreso - {curve.employeeName}
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Información de la Curva */}
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2 text-blue-600" />
                <div>
                  <div className="text-sm font-medium text-gray-900">{curve.employeeName}</div>
                  <div className="text-sm text-gray-500">{curve.employeeNumber} • {curve.position}</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <Target className="w-4 h-4 mr-2 text-blue-600" />
                <div>
                  <div className="text-sm font-medium text-gray-900">{curve.operation}</div>
                  <div className="text-sm text-gray-500">{curve.valueStream} • {curve.line} • {curve.shift}</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <TrendingUp className="w-4 h-4 mr-2 text-blue-600" />
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {curve.currentEfficiency}% / {curve.targetEfficiency}%
                  </div>
                  <div className="text-sm text-gray-500">
                    {Math.round(progressPercentage)}% completado
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Formulario de Nuevo Progreso */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Registrar Progreso - Semana {nextWeekNumber}
              </h4>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de Evaluación *
                  </label>
                  <input
                    type="date"
                    value={progressData.date.toISOString().split('T')[0]}
                    onChange={(e) => setProgressData({ ...progressData, date: new Date(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Eficiencia Alcanzada (%) *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      value={progressData.efficiencyAchieved}
                      onChange={(e) => setProgressData({ ...progressData, efficiencyAchieved: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">%</span>
                    </div>
                  </div>
                  
                  {/* Indicador visual de progreso */}
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Actual: {curve.currentEfficiency}%</span>
                      <span>Nuevo: {progressData.efficiencyAchieved}%</span>
                      <span>Target: {curve.targetEfficiency}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((progressData.efficiencyAchieved / curve.targetEfficiency) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Horas Trabajadas *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={progressData.hoursWorked}
                    onChange={(e) => setProgressData({ ...progressData, hoursWorked: parseInt(e.target.value) || 40 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Evaluado por
                  </label>
                  <input
                    type="text"
                    value={progressData.evaluatedBy || ''}
                    onChange={(e) => setProgressData({ ...progressData, evaluatedBy: e.target.value })}
                    placeholder="Nombre del supervisor/entrenador"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notas y Observaciones
                  </label>
                  <textarea
                    value={progressData.notes || ''}
                    onChange={(e) => setProgressData({ ...progressData, notes: e.target.value })}
                    rows={4}
                    placeholder="Observaciones sobre el progreso, áreas de mejora, logros destacados..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Resumen del progreso */}
                <div className="bg-amber-50 p-3 rounded-lg">
                  <h5 className="text-sm font-medium text-gray-900 mb-2">Resumen del Progreso</h5>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      <strong>Mejora:</strong> {' '}
                      {progressData.efficiencyAchieved > curve.currentEfficiency ? '+' : ''}
                      {progressData.efficiencyAchieved - curve.currentEfficiency} puntos
                    </p>
                    <p>
                      <strong>Tiempo restante:</strong> {' '}
                      {remainingWeeks > 0 ? `${remainingWeeks} semanas` : 'Vencido'}
                    </p>
                    <p>
                      <strong>Ritmo necesario:</strong> {' '}
                      {remainingWeeks > 0 
                        ? `${Math.ceil((curve.targetEfficiency - progressData.efficiencyAchieved) / remainingWeeks)} puntos/semana`
                        : 'N/A'
                      }
                    </p>
                  </div>
                </div>

                {/* Botones */}
                <div className="flex justify-end space-x-3 pt-4">
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
                    Registrar Progreso
                  </button>
                </div>
              </form>
            </div>

            {/* Historial de Progreso */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Historial de Progreso
              </h4>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {curve.weeklyProgress && curve.weeklyProgress.length > 0 ? (
                  curve.weeklyProgress.map((progress, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-sm font-medium text-blue-600">S{progress.week}</span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              Semana {progress.week}
                            </div>
                            <div className="text-sm text-gray-500">
                              {progress.date.toLocaleDateString('es-ES')}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-lg font-bold text-blue-600">
                            {progress.efficiencyAchieved}%
                          </div>
                          <div className="text-sm text-gray-500">
                            {progress.hoursWorked}h trabajadas
                          </div>
                        </div>
                      </div>
                      
                      {progress.notes && (
                        <div className="text-sm text-gray-600 mb-2">
                          "{progress.notes}"
                        </div>
                      )}
                      
                      {progress.evaluatedBy && (
                        <div className="text-xs text-gray-500">
                          Evaluado por: {progress.evaluatedBy}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <TrendingUp className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No hay progreso registrado aún</p>
                    <p className="text-sm">Registra el primer progreso para comenzar el seguimiento</p>
                  </div>
                )}
              </div>
              
              {/* Estadísticas del progreso */}
              {curve.weeklyProgress && curve.weeklyProgress.length > 0 && (
                <div className="mt-4 bg-green-50 p-3 rounded-lg">
                  <h5 className="text-sm font-medium text-gray-900 mb-2">Estadísticas</h5>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Semanas registradas:</span>
                      <span className="font-medium ml-1">{curve.weeklyProgress.length}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Promedio horas/semana:</span>
                      <span className="font-medium ml-1">
                        {Math.round(curve.weeklyProgress.reduce((sum, p) => sum + p.hoursWorked, 0) / curve.weeklyProgress.length)}h
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Mejora total:</span>
                      <span className="font-medium ml-1 text-green-600">
                        +{curve.currentEfficiency - (curve.weeklyProgress[0]?.efficiencyAchieved || 0)} puntos
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Progreso semanal:</span>
                      <span className="font-medium ml-1">
                        {curve.weeklyProgress.length > 1 
                          ? Math.round((curve.currentEfficiency - curve.weeklyProgress[0].efficiencyAchieved) / curve.weeklyProgress.length)
                          : 0
                        } puntos/sem
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTrackingModal; 