import React, { useState, useEffect } from 'react';
import { X, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';
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
    description: '',
    valueStream: 'ALL',
    status: 'pending'
  });

  useEffect(() => {
    if (day) {
      setFormData({
        date: day.date,
        isWorkingDay: day.isWorkingDay,
        description: day.description || '',
        valueStream: day.valueStream || 'ALL',
        status: day.status
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
      description: formData.description,
      valueStream: formData.valueStream,
      status: formData.status || 'pending',
      createdAt: day?.createdAt,
      updatedAt: new Date().toISOString()
    } as CalendarDay);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      date: new Date(e.target.value)
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
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
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="isWorkingDay"
                  checked={formData.isWorkingDay === true}
                  onChange={() => setFormData({ ...formData, isWorkingDay: true })}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1 text-green-600" />
                  Día laborable
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="isWorkingDay"
                  checked={formData.isWorkingDay === false}
                  onChange={() => setFormData({ ...formData, isWorkingDay: false })}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-1 text-red-600" />
                  Día no laborable (feriado, mantenimiento, etc.)
                </span>
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