import React, { useState } from 'react';
import { X } from 'lucide-react';
import { valueStreams } from '../../data/mockData';

interface HeadcountFormProps {
  onSubmit: (headcount: HeadcountFormData) => void;
  onCancel: () => void;
  initialData?: HeadcountFormData;
}

interface HeadcountFormData {
  line: string;
  operators: number;
  supervisors: number;
  month: string;
  valueStream?: string;
}

const HeadcountForm: React.FC<HeadcountFormProps> = ({ 
  onSubmit, 
  onCancel,
  initialData
}) => {
  const [formData, setFormData] = useState<HeadcountFormData>(initialData || {
    line: '',
    operators: 0,
    supervisors: 0,
    month: 'Enero',
    valueStream: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación simple
    if (!formData.line || formData.operators < 0 || formData.supervisors < 0) {
      // En una implementación real, mostraríamos un mensaje de error
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <div className="mb-6 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Registrar Headcount</h3>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Línea</label>
            <input
              type="text"
              name="line"
              value={formData.line}
              onChange={handleChange}
              placeholder="Ej: FA, Next, CER3, etc."
              className="block w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
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
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Operadores</label>
            <input
              type="number"
              name="operators"
              min="0"
              value={formData.operators}
              onChange={handleChange}
              className="block w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Supervisores</label>
            <input
              type="number"
              name="supervisors"
              min="0"
              value={formData.supervisors}
              onChange={handleChange}
              className="block w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mes</label>
            <select
              name="month"
              value={formData.month}
              onChange={handleChange}
              className="block w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="Enero">Enero</option>
              <option value="Febrero">Febrero</option>
              <option value="Marzo">Marzo</option>
              <option value="Abril">Abril</option>
              <option value="Mayo">Mayo</option>
              <option value="Junio">Junio</option>
              <option value="Julio">Julio</option>
              <option value="Agosto">Agosto</option>
              <option value="Septiembre">Septiembre</option>
              <option value="Octubre">Octubre</option>
              <option value="Noviembre">Noviembre</option>
              <option value="Diciembre">Diciembre</option>
            </select>
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

export default HeadcountForm; 