import React, { useState } from 'react';
import { X } from 'lucide-react';
import { valueStreams } from '../../data/mockData';

interface DowntimeFormProps {
  onSubmit: (downtime: DowntimeFormData) => void;
  onCancel: () => void;
}

interface DowntimeFormData {
  type: string;
  date: string;
  hours: number;
  reason: string;
  description: string;
  area: string;
  valueStream?: string;
  line?: string;
  status: string;
  selected: boolean;
  approvedBy: null;
  approvedAt: null;
}

const DowntimeForm: React.FC<DowntimeFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<DowntimeFormData>({
    type: 'general',
    date: new Date().toISOString().split('T')[0],
    hours: 0,
    reason: '',
    description: '',
    area: '',
    valueStream: '',
    line: '',
    status: 'pending',
    selected: false,
    approvedBy: null,
    approvedAt: null
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'hours' ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación simple
    if (!formData.date || !formData.reason || formData.hours <= 0 || !formData.area) {
      // En una implementación real, mostraríamos un mensaje de error
      return;
    }
    
    // Si es un downtime de tipo valueStream, debe tener un valueStream seleccionado
    if (formData.type === 'valueStream' && !formData.valueStream) {
      return;
    }
    
    // Si es un downtime de tipo line, debe tener un valueStream y una línea
    if (formData.type === 'line' && (!formData.valueStream || !formData.line)) {
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <div className="mb-6 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Registrar Downtime</h3>
        <button 
          className="text-gray-400 hover:text-gray-500"
          onClick={onCancel}
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Downtime</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="block w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="general">General</option>
              <option value="valueStream">Value Stream</option>
              <option value="line">Línea</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="block w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Horas</label>
            <input
              type="number"
              name="hours"
              min="0"
              step="0.5"
              value={formData.hours}
              onChange={handleChange}
              className="block w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Área responsable</label>
            <input
              type="text"
              name="area"
              value={formData.area}
              onChange={handleChange}
              placeholder="Ej: RRHH, Producción, HSE, etc."
              className="block w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {(formData.type === 'valueStream' || formData.type === 'line') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Value Stream</label>
              <select
                name="valueStream"
                value={formData.valueStream}
                onChange={handleChange}
                className="block w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Seleccione...</option>
                {valueStreams.map(vs => (
                  <option key={vs.id} value={vs.name}>{vs.name}</option>
                ))}
              </select>
            </div>
          )}
          
          {formData.type === 'line' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Línea</label>
              <input
                type="text"
                name="line"
                value={formData.line}
                onChange={handleChange}
                placeholder="Ej: FA, Next, CER3, etc."
                className="block w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Motivo</label>
            <input
              type="text"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Ej: Capacitación, Mantenimiento, Festivo, etc."
              className="block w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Descripción detallada del downtime..."
              className="block w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none"
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
};

export default DowntimeForm; 