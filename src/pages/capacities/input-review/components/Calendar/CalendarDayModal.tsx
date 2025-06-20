import React, { useState, useEffect } from 'react';
import { X, Calendar, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import type { CalendarDay } from '@/types/capacity';

interface CalendarDayModalProps {
  day: CalendarDay | null;
  onSave: (day: CalendarDay) => void;
  onCancel: () => void;
}

const CalendarDayModal: React.FC<CalendarDayModalProps> = ({ day, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<CalendarDay>>({
    date: new Date(),
    isWorkingDay: true,
    workingHours: 8,
    standardHours: 8,
    dayType: 'weekday',
    description: '',
    valueStream: 'ALL',
    status: 'pending'
  });

  useEffect(() => {
    if (day) {
      setFormData({
        date: day.date,
        isWorkingDay: day.isWorkingDay,
        workingHours: day.workingHours,
        standardHours: day.standardHours,
        dayType: day.dayType,
        description: day.description || '',
        valueStream: day.valueStream || 'ALL',
        status: day.status
      });
    } else {
      // Nuevo día - configurar valores por defecto
      const today = new Date();
      const dayOfWeek = today.getDay();
      let defaultType: CalendarDay['dayType'] = 'weekday';
      let defaultHours = 8;
      let defaultIsWorking = true;

      if (dayOfWeek === 0) {
        defaultType = 'sunday';
        defaultHours = 0;
        defaultIsWorking = false;
      } else if (dayOfWeek === 6) {
        defaultType = 'saturday';
        defaultHours = 4;
        defaultIsWorking = true;
      }

      setFormData({
        date: today,
        isWorkingDay: defaultIsWorking,
        workingHours: defaultHours,
        standardHours: defaultHours,
        dayType: defaultType,
        description: '',
        valueStream: 'ALL',
        status: 'pending'
      });
    }
  }, [day]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.date) return;

    onSave({
      id: day?.id,
      date: formData.date,
      isWorkingDay: formData.isWorkingDay || false,
      workingHours: formData.workingHours || 0,
      standardHours: formData.standardHours || 0,
      dayType: formData.dayType || 'weekday',
      description: formData.description,
      valueStream: formData.valueStream,
      status: formData.status || 'pending',
      createdAt: day?.createdAt,
      updatedAt: new Date().toISOString()
    } as CalendarDay);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    const dayOfWeek = newDate.getDay();
    
    // Auto-detectar tipo de día y configurar horas por defecto
    let dayType: CalendarDay['dayType'] = 'weekday';
    let standardHours = 8;
    let isWorking = true;

    if (dayOfWeek === 0) {
      dayType = 'sunday';
      standardHours = 0;
      isWorking = false;
    } else if (dayOfWeek === 6) {
      dayType = 'saturday';
      standardHours = 4;
      isWorking = true;
    }

    setFormData({
      ...formData,
      date: newDate,
      dayType,
      standardHours,
      workingHours: isWorking ? standardHours : 0,
      isWorkingDay: isWorking
    });
  };

  const handleDayTypeChange = (newDayType: CalendarDay['dayType']) => {
    let standardHours = 8;
    let isWorking = true;
    let workingHours = 8;

    switch (newDayType) {
      case 'weekday':
        standardHours = 8;
        isWorking = true;
        workingHours = 8;
        break;
      case 'saturday':
        standardHours = 4;
        isWorking = true;
        workingHours = 4;
        break;
      case 'sunday':
        standardHours = 0;
        isWorking = false;
        workingHours = 0;
        break;
      case 'holiday':
        standardHours = 0;
        isWorking = false;
        workingHours = 0;
        break;
      case 'special':
        standardHours = formData.standardHours || 0;
        isWorking = formData.isWorkingDay || false;
        workingHours = formData.workingHours || 0;
        break;
    }

    setFormData({
      ...formData,
      dayType: newDayType,
      standardHours,
      isWorkingDay: isWorking,
      workingHours
    });
  };

  const handleWorkingDayChange = (isWorking: boolean) => {
    setFormData({
      ...formData,
      isWorkingDay: isWorking,
      workingHours: isWorking ? formData.standardHours || 8 : 0
    });
  };

  const handleWorkingHoursChange = (hours: number) => {
    setFormData({
      ...formData,
      workingHours: hours,
      isWorkingDay: hours > 0
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-blue-600" />
            {day ? 'Editar Día' : 'Agregar Día Especial'}
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Fecha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha
            </label>
            <input
              type="date"
              value={formData.date?.toISOString().split('T')[0] || ''}
              onChange={handleDateChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Value Stream */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Value Stream
            </label>
            <select
              value={formData.valueStream || 'ALL'}
              onChange={(e) => setFormData({ ...formData, valueStream: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="ALL">Todos los VST</option>
              <option value="ENT">ENT</option>
              <option value="JR">JR</option>
              <option value="SM">SM</option>
              <option value="WND">WND</option>
              <option value="FIX">FIX</option>
              <option value="EA">EA</option>
              <option value="APO">APO</option>
            </select>
          </div>

          {/* Tipo de día */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Día
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'weekday', label: 'Día de semana', hours: '8h' },
                { value: 'saturday', label: 'Sábado', hours: '4h' },
                { value: 'sunday', label: 'Domingo', hours: '0h' },
                { value: 'holiday', label: 'Feriado', hours: '0h' },
                { value: 'special', label: 'Especial', hours: 'Variable' }
              ].map((type) => (
                <label key={type.value} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="dayType"
                    value={type.value}
                    checked={formData.dayType === type.value}
                    onChange={() => handleDayTypeChange(type.value as CalendarDay['dayType'])}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <div className="ml-2">
                    <div className="text-sm font-medium text-gray-900">{type.label}</div>
                    <div className="text-xs text-gray-500">{type.hours}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Configuración de horas */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <h4 className="text-sm font-medium text-gray-900 flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Configuración de Horas
            </h4>

            {/* Horas estándar */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Horas Estándar
              </label>
              <input
                type="number"
                min="0"
                max="24"
                step="0.5"
                value={formData.standardHours || 0}
                onChange={(e) => setFormData({ ...formData, standardHours: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={formData.dayType !== 'special'}
              />
              <p className="text-xs text-gray-500 mt-1">
                Horas por defecto para este tipo de día
              </p>
            </div>

            {/* Horas de trabajo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Horas de Trabajo Efectivas
              </label>
              <input
                type="number"
                min="0"
                max="24"
                step="0.5"
                value={formData.workingHours || 0}
                onChange={(e) => handleWorkingHoursChange(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Horas reales de producción para este día
              </p>
            </div>

            {/* Estado laborable */}
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isWorkingDay || false}
                onChange={(e) => handleWorkingDayChange(e.target.checked)}
                className="text-blue-600 focus:ring-blue-500"
              />
              <label className="ml-2 text-sm text-gray-700">
                Día laborable (se incluye en cálculos de capacidad)
              </label>
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Ej: Día feriado nacional, Mantenimiento programado, etc."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Estado */}
          {day && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                value={formData.status || 'pending'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'pending' | 'approved' | 'rejected' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="pending">Pendiente</option>
                <option value="approved">Aprobado</option>
                <option value="rejected">Rechazado</option>
              </select>
            </div>
          )}

          {/* Resumen */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Resumen</h4>
            <div className="text-sm text-blue-800 space-y-1">
              <div>• Tipo: {
                formData.dayType === 'weekday' ? 'Día de semana' :
                formData.dayType === 'saturday' ? 'Sábado' :
                formData.dayType === 'sunday' ? 'Domingo' :
                formData.dayType === 'holiday' ? 'Feriado' : 'Día especial'
              }</div>
              <div>• Horas de trabajo: {formData.workingHours || 0}h</div>
              <div>• Estado: {formData.isWorkingDay ? 'Laborable' : 'No laborable'}</div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:ring-2 focus:ring-gray-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
            >
              {day ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CalendarDayModal; 