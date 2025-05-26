import React, { useState } from 'react';
import { 
  Plus, 
  Save,
  Edit2,
  Trash2,
  Settings,
  Users,
  Clock,
  Target,
  AlertTriangle,
  CheckCircle2,
  Factory,
  X,
  Database
} from 'lucide-react';
import { PART_NUMBERS } from '../../types/part-numbers';
import { THEORETICAL_HC } from '../../types/capacity';
import { PROGRAMMED_STOPS } from '../../types/production';
import { CAUSES } from '../../types/causes';

interface HeadCountCapacity {
  valueStream: string;
  line: string;
  shift: string;
  theoreticalHC: number;
}

interface ValueStream {
  id: string;
  name: string;
  description: string;
}

export function ProductionSettings() {
  const [activeTab, setActiveTab] = useState('valueStreams');
  const [successMessage, setSuccessMessage] = useState('');
  const [viewMode, setViewMode] = useState<'compact' | 'detailed'>('compact');
  const [selectedPartNumber, setSelectedPartNumber] = useState<string>('');
  const [selectedShift, setSelectedShift] = useState<string>('T1');
  const [isAddHCModalOpen, setIsAddHCModalOpen] = useState(false);
  const [newHC, setNewHC] = useState<number>(19);
  const [localPartNumbers, setLocalPartNumbers] = useState(PART_NUMBERS);

  const [valueStreams] = useState<ValueStream[]>([
    { id: 'ENT', name: 'ENT', description: 'Ear Nose Throat' },
    { id: 'JR', name: 'Joint Repair', description: 'Joint Repair Products' },
    { id: 'SM', name: 'Sports Medicine', description: 'Sports Medicine Products' },
    { id: 'FIX', name: 'Fixation', description: 'Fixation Products' },
    { id: 'EA', name: 'External Areas', description: 'External Areas Products' },
    { id: 'APO', name: 'Apolo', description: 'Apolo Products' },
    { id: 'WND', name: 'Wound', description: 'Wound Products' }
  ]);

  const [headCountCapacity] = useState<HeadCountCapacity[]>(
    THEORETICAL_HC.map(hc => ({
      valueStream: 'ENT',
      line: 'Línea 1',
      shift: hc.shift,
      theoreticalHC: hc.theoreticalHC
    }))
  );

  const handleSave = () => {
    setSuccessMessage('Cambios guardados exitosamente');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const calculateNewRunRates = (partNumber: PartNumber, newHC: number) => {
    const closestHC = partNumber.runRatesT1
      .reduce((prev, curr) => {
        return Math.abs(curr.hc - newHC) < Math.abs(prev.hc - newHC) ? curr : prev;
      });

    const newRate = Math.round((closestHC.rate * newHC) / closestHC.hc);
    
    return {
      hc: newHC,
      rate: newRate
    };
  };

  const handleAddNewHC = () => {
    const updatedPartNumbers = localPartNumbers.map(part => {
      const closestHC = part.runRatesT1
        .reduce((prev, curr) => {
          return Math.abs(curr.hc - newHC) < Math.abs(prev.hc - newHC) ? curr : prev;
        });

      const newRate = Math.round((closestHC.rate * newHC) / closestHC.hc);
      
      return {
        ...part,
        runRatesT1: [...part.runRatesT1, { hc: newHC, rate: newRate }]
          .sort((a, b) => a.hc - b.hc)
      };
    });

    setLocalPartNumbers(updatedPartNumbers);
    setIsAddHCModalOpen(false);
    setSuccessMessage('Nuevos Run Rates calculados exitosamente');
  };

  const tabs = [
    { id: 'valueStreams', label: 'Value Streams', icon: Factory },
    { id: 'capacity', label: 'Capacidad', icon: Users },
    { id: 'dataEntry', label: 'Entrada de Datos', icon: Database },
    { id: 'runRates', label: 'Run Rates', icon: Target },
    { id: 'stops', label: 'Paros Programados', icon: Clock },
    { id: 'causes', label: 'Causas', icon: AlertTriangle },
    { id: 'other', label: 'Otros Parámetros', icon: Settings }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Parámetros de Producción</h1>
            <p className="text-gray-500">Configura los parámetros del sistema de producción</p>
          </div>
          <button
            onClick={handleSave}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Save className="w-5 h-5 mr-2" />
            Guardar Cambios
          </button>
        </div>

        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg flex items-center">
            <CheckCircle2 className="w-5 h-5 mr-2" />
            {successMessage}
          </div>
        )}

        <div className="flex space-x-4 border-b mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 border-b-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-500'
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {activeTab === 'valueStreams' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Value Streams</h2>
              <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
                <Plus className="w-4 h-4" />
                <span>Agregar Value Stream</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {valueStreams.map(vs => (
                <div key={vs.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-medium text-gray-900">{vs.name}</h3>
                    <div className="flex space-x-2">
                      <button className="text-gray-400 hover:text-blue-500">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">{vs.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'capacity' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Head Count en Modelo de Capacidad</h3>
                <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
                  <Plus className="w-4 h-4" />
                  <span>Agregar Capacidad</span>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Value Stream
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Línea
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Turno
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        HC Teórico
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {headCountCapacity.map((hc, index) => (
                      <tr key={`${hc.shift}-${index}`}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {hc.valueStream}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {hc.line}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {hc.shift}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {hc.theoreticalHC}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-700">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-700">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Posiciones de Soporte</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rol
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        T1
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        T2
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        T3
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {[
                      { role: 'Líder', t1: 2, t2: 2, t3: 0 },
                      { role: 'DHR', t1: 0.5, t2: 0.5, t3: 0 },
                      { role: 'Equipment', t1: 0.5, t2: 0.5, t3: 0 },
                      { role: 'Trainer', t1: 0.5, t2: 0.5, t3: 0 },
                      { role: 'Back up', t1: 0, t2: 0, t3: 0 },
                      { role: 'Tira etiquetas', t1: 0, t2: 0, t3: 0 }
                    ].map((role, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {role.role}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {role.t1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {role.t2}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {role.t3}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'dataEntry' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Configuración de Entrada de Datos</h2>
            </div>
            
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Tiempos de Registro</h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h4 className="text-md font-medium text-gray-800">Segmentos de Tiempo</h4>
                  <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
                    <Plus className="w-4 h-4" />
                    <span>Agregar Segmento</span>
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Orden
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nombre del Segmento
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tiempo Límite (min)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Color
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {[
                        { id: 1, name: 'Hora futura o sin registro', timeLimit: 0, color: '#F3F4F6' },
                        { id: 2, name: 'Registro inmediato', timeLimit: 15, color: '#DCFCE7' },
                        { id: 3, name: 'Registro tardío', timeLimit: 30, color: '#FEF9C3' },
                        { id: 4, name: 'Registro crítico', timeLimit: null, color: '#FEE2E2' }
                      ].map((segment, index) => (
                        <tr key={segment.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <input
                              type="text"
                              defaultValue={segment.name}
                              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center">
                              {segment.timeLimit !== null ? (
                                <input
                                  type="number"
                                  min="0"
                                  max="120"
                                  defaultValue={segment.timeLimit}
                                  className="w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                              ) : (
                                <span className="text-gray-500 italic">Sin límite</span>
                              )}
                              {segment.timeLimit !== null && (
                                <span className="ml-2 text-sm text-gray-500">min después del fin de hora</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center space-x-2">
                              <div 
                                className="w-6 h-6 border rounded" 
                                style={{ backgroundColor: segment.color }}
                              ></div>
                              <input
                                type="text"
                                defaultValue={segment.color}
                                className="w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              />
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex space-x-2">
                              {index > 0 && (
                                <button className="text-gray-400 hover:text-blue-500">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                  </svg>
                                </button>
                              )}
                              {index < 3 && (
                                <button className="text-gray-400 hover:text-blue-500">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </button>
                              )}
                              <button className="text-red-600 hover:text-red-700">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Vista previa de segmentos</h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { name: 'Hora futura o sin registro', color: '#F3F4F6' },
                      { name: 'Registro inmediato (0-15 min)', color: '#DCFCE7' },
                      { name: 'Registro tardío (16-30 min)', color: '#FEF9C3' },
                      { name: 'Registro crítico (>30 min)', color: '#FEE2E2' }
                    ].map((segment, index) => (
                      <div 
                        key={index}
                        className="px-3 py-2 rounded-md text-xs font-medium"
                        style={{ backgroundColor: segment.color }}
                      >
                        {segment.name}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-md">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">Información</h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <p>
                          Los segmentos se aplican en orden secuencial. El sistema evaluará el tiempo transcurrido desde el fin de hora y asignará el color correspondiente al último segmento cuyo límite de tiempo no haya sido superado.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Restricciones y Validaciones</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div>
                    <h4 className="font-medium text-gray-800">Bloquear registro de horas futuras</h4>
                    <p className="text-sm text-gray-500">
                      Impide que los usuarios registren datos para horas que aún no han transcurrido
                    </p>
                  </div>
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      defaultChecked={true}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div>
                    <h4 className="font-medium text-gray-800">Requerir registro secuencial</h4>
                    <p className="text-sm text-gray-500">
                      Obliga a completar las horas anteriores antes de registrar las siguientes
                    </p>
                  </div>
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      defaultChecked={true}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div>
                    <h4 className="font-medium text-gray-800">Requerir causas para delta negativo</h4>
                    <p className="text-sm text-gray-500">
                      Obliga a registrar causas cuando la producción es menor a la meta
                    </p>
                  </div>
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      defaultChecked={true}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div>
                    <h4 className="font-medium text-gray-800">Validar distribución completa de causas</h4>
                    <p className="text-sm text-gray-500">
                      Verifica que las unidades en causas sumen exactamente el delta negativo
                    </p>
                  </div>
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      defaultChecked={true}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Campos Obligatorios</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Campo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Obligatorio
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Validación
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {[
                      { field: 'Head Count Real', required: true, validation: 'Numérico > 0' },
                      { field: 'Work Order', required: true, validation: 'Alfanumérico' },
                      { field: 'Part Number', required: true, validation: 'Lista predefinida' },
                      { field: 'Producción del Día', required: true, validation: 'Numérico ≥ 0' },
                      { field: 'Causa General', required: false, validation: 'Condicional si Delta < 0' },
                      { field: 'Causa Específica', required: false, validation: 'Condicional si hay Causa General' }
                    ].map((field, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {field.field}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {field.required ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          ) : (
                            <AlertTriangle className="w-5 h-5 text-yellow-500" />
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {field.validation}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-700">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-700">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Ventanas de Tiempo para Edición</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tiempo máximo para edición sin aprobación (horas)
                  </label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      min="1"
                      max="48"
                      defaultValue="24"
                      className="w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-500">horas después del registro</span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Después de este tiempo, se requerirá aprobación de un supervisor para modificar datos
                  </p>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div>
                    <h4 className="font-medium text-gray-800">Requerir justificación para ediciones</h4>
                    <p className="text-sm text-gray-500">
                      Solicita un motivo cuando se edita un registro existente
                    </p>
                  </div>
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      defaultChecked={true}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div>
                    <h4 className="font-medium text-gray-800">Mantener historial de cambios</h4>
                    <p className="text-sm text-gray-500">
                      Registra todas las modificaciones realizadas a los datos
                    </p>
                  </div>
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      defaultChecked={true}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Configuraciones Predefinidas de Paros Programados</h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">
                    Configure listas predefinidas de paros programados por turno para facilitar la entrada de datos
                  </p>
                  <button 
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                    onClick={() => {
                      alert('Agregar nueva configuración');
                    }}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Nueva Configuración</span>
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { id: 1, name: 'Línea 1 - Turno 1', description: 'Paros programados para el turno matutino', parosCount: 5 },
                    { id: 2, name: 'Línea 1 - Turno 2', description: 'Paros programados para el turno vespertino', parosCount: 4 },
                    { id: 3, name: 'Línea 2 - Turno 1', description: 'Paros programados para el turno matutino', parosCount: 6 }
                  ].map(config => (
                    <div key={config.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-medium text-gray-900">{config.name}</h3>
                        <div className="flex space-x-2">
                          <button className="text-gray-400 hover:text-blue-500">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button className="text-gray-400 hover:text-red-500">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">{config.description}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1 text-gray-400" />
                        <span>{config.parosCount} paros configurados</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 p-4 border border-dashed rounded-lg bg-gray-50">
                  <h4 className="text-md font-medium text-gray-800 mb-4">Ejemplo: Configuración "Línea 1 - Turno 1"</h4>
                  
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <label className="block text-sm font-medium text-gray-700 mr-2">
                          Nombre de la configuración:
                        </label>
                        <input
                          type="text"
                          defaultValue="Línea 1 - Turno 1"
                          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <button 
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                        onClick={() => {
                          alert('Agregar nuevo paro programado');
                        }}
                      >
                        <Plus className="w-4 h-4" />
                        <span>Agregar Paro</span>
                      </button>
                    </div>
                    <div className="flex items-center">
                      <label className="block text-sm font-medium text-gray-700 mr-2">
                        Descripción:
                      </label>
                      <input
                        type="text"
                        defaultValue="Paros programados para el turno matutino"
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Hora
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Paro Programado
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Duración (min)
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {[
                          { hora: '06:00', paro: 'Ejercicios', duracion: 5 },
                          { hora: '08:00', paro: 'Desayuno / café', duracion: 25 },
                          { hora: '10:00', paro: 'Cambio de orden', duracion: 15 },
                          { hora: '12:00', paro: 'Almuerzo / cena', duracion: 35 },
                          { hora: '13:00', paro: 'Cierre de turno', duracion: 15 },
                          { hora: '', paro: '', duracion: '' }
                        ].map((paro, index, array) => (
                          <tr key={index} className={paro.hora === '' ? 'bg-gray-50' : ''}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              <select 
                                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                defaultValue={paro.hora}
                              >
                                <option value="" disabled={paro.hora !== ''}>Seleccionar hora</option>
                                {['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00'].map(hora => (
                                  <option key={hora} value={hora}>
                                    {hora}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <select 
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                defaultValue={paro.paro}
                              >
                                <option value="" disabled={paro.paro !== ''}>Seleccionar tipo de paro</option>
                                {PROGRAMMED_STOPS.map((stop, i) => (
                                  <option key={i} value={stop.name}>
                                    {stop.name}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <input
                                type="number"
                                min="1"
                                max="60"
                                placeholder="Duración"
                                defaultValue={paro.duracion || ''}
                                className="w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex space-x-2">
                                {index > 0 && (
                                  <button 
                                    className="text-gray-400 hover:text-blue-500"
                                    title="Mover hacia arriba"
                                    onClick={() => {
                                      alert(`Mover fila ${index + 1} hacia arriba`);
                                    }}
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                    </svg>
                                  </button>
                                )}
                                {index < array.length - 1 && paro.hora !== '' && (
                                  <button 
                                    className="text-gray-400 hover:text-blue-500"
                                    title="Mover hacia abajo"
                                    onClick={() => {
                                      alert(`Mover fila ${index + 1} hacia abajo`);
                                    }}
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                  </button>
                                )}
                                <button 
                                  className="text-red-600 hover:text-red-700"
                                  title="Eliminar"
                                  onClick={() => {
                                    alert(`Eliminar fila ${index + 1}`);
                                  }}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="mt-4 flex justify-end space-x-3">
                    <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                      Cancelar
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                      Guardar Configuración
                    </button>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-md">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">Información</h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <p>
                          Las configuraciones predefinidas permiten a los usuarios seleccionar rápidamente un conjunto de paros programados durante la entrada de datos. Esto facilita la consistencia y reduce el tiempo de captura.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'runRates' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Run Rates</h2>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode('compact')}
                    className={`px-3 py-1 rounded ${
                      viewMode === 'compact' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    Vista Compacta
                  </button>
                  <button
                    onClick={() => setViewMode('detailed')}
                    className={`px-3 py-1 rounded ${
                      viewMode === 'detailed' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    Vista Detallada
                  </button>
                </div>
                <button 
                  onClick={() => setIsAddHCModalOpen(true)}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  <span>Agregar Run Rate</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Value Stream
                </label>
                <select className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                  <option value="ENT">ENT</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Línea de Producción
                </label>
                <select className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                  <option value="L1">Línea 1</option>
                </select>
              </div>
              {viewMode === 'detailed' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Part Number
                  </label>
                  <select 
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={selectedPartNumber}
                    onChange={(e) => setSelectedPartNumber(e.target.value)}
                  >
                    <option value="">Todos</option>
                    {PART_NUMBERS.map(part => (
                      <option key={part.code} value={part.code}>
                        {part.code}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Turno
                </label>
                <select 
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={selectedShift}
                  onChange={(e) => setSelectedShift(e.target.value)}
                >
                  <option value="T1">T1</option>
                  <option value="T2">T2</option>
                  <option value="T3">T3</option>
                </select>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <div className="overflow-x-auto">
                {viewMode === 'compact' ? (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Part Number
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Run Rate T1
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Run Rate T2
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Run Rate T3
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Labor STD
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          HC Total
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {PART_NUMBERS.map(part => (
                        <tr key={part.code}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {part.code}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {part.runRateT1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {part.runRateT2}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {part.runRateT3}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {part.laborStd}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {part.totalHC}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex space-x-2">
                              <button className="text-blue-600 hover:text-blue-700">
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button className="text-red-600 hover:text-red-700">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Part Number
                        </th>
                        {[6,7,8,9,10,11,12,13,14,15,16,17,18,19].map(hc => (
                          <th key={hc} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {hc}
                          </th>
                        ))}
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Labor STD
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {localPartNumbers
                        .filter(part => !selectedPartNumber || part.code === selectedPartNumber)
                        .map(part => (
                          <tr key={part.code}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {part.code}
                            </td>
                            {[6,7,8,9,10,11,12,13,14,15,16,17,18,19].map(hc => (
                              <td key={hc} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {part.runRatesT1.find(r => r.hc === hc)?.rate || '-'}
                              </td>
                            ))}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {part.laborStd}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex space-x-2">
                                <button className="text-blue-600 hover:text-blue-700">
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button className="text-red-600 hover:text-red-700">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'stops' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Paros Programados</h3>
                <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
                  <Plus className="w-4 h-4" />
                  <span>Agregar Paro</span>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nombre
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Duración (min)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Lunes-Viernes
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sábado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {PROGRAMMED_STOPS.map((stop, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {stop.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {stop.duration}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {stop.weekday ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          ) : (
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {stop.saturday ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          ) : (
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-700">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-700">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'causes' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Causas y Subcausas</h2>
              <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
                <Plus className="w-4 h-4" />
                <span>Agregar Causa</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {CAUSES.map(cause => (
                <div key={cause.name} className="bg-white p-6 rounded-lg border">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {cause.name.replace('_', ' ')}
                    </h3>
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-700">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {cause.subcauses.map((subcause, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                        <span>{subcause}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {isAddHCModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Agregar Nuevo HC Total</h3>
              <button 
                onClick={() => setIsAddHCModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  HC Total
                </label>
                <input
                  type="number"
                  value={newHC}
                  onChange={(e) => setNewHC(Number(e.target.value))}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  min="6"
                  max="30"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Se calculará el Run Rate para todos los Part Numbers usando regla de tres
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsAddHCModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddNewHC}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Calcular y Agregar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}