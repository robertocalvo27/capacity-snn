import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Check, AlertTriangle, Save } from 'lucide-react';

// Estado de revisión de los inputs (mock - debería venir de una API en producción)
const inputReviewStatus = {
  buildPlan: { complete: true, date: '2024-01-15' },
  headcount: { complete: true, date: '2024-01-16' },
  runRates: { complete: false, date: null },
  yield: { complete: true, date: '2024-01-16' },
  downtimes: { complete: false, date: null }
};

export default function InputReview() {
  const { cbpId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('buildPlan');
  
  // Mock de datos para cada tab
  const tabData = {
    buildPlan: [
      { id: 1, pn: '4391', quantity: 1250, month: 'Enero', week: '1', status: 'approved' },
      { id: 2, pn: '4230', quantity: 980, month: 'Enero', week: '1', status: 'approved' },
      { id: 3, pn: '4403', quantity: 2450, month: 'Enero', week: '1', status: 'approved' },
      { id: 4, pn: '2503-S', quantity: 1120, month: 'Enero', week: '1', status: 'approved' },
      { id: 5, pn: '4565D', quantity: 750, month: 'Enero', week: '1', status: 'approved' },
    ],
    headcount: [
      { id: 1, line: 'FA', operators: 12, supervisors: 1, month: 'Enero', status: 'approved' },
      { id: 2, line: 'Next', operators: 15, supervisors: 1, month: 'Enero', status: 'approved' },
      { id: 3, line: 'CER3', operators: 10, supervisors: 1, month: 'Enero', status: 'approved' },
    ],
    runRates: [
      { id: 1, pn: '4391', line: 'FA', rate: 150, uom: 'pcs/hr', month: 'Enero', status: 'pending' },
      { id: 2, pn: '4230', line: 'Next', rate: 130, uom: 'pcs/hr', month: 'Enero', status: 'pending' },
      { id: 3, pn: '4403', line: 'CER3', rate: 200, uom: 'pcs/hr', month: 'Enero', status: 'pending' },
    ],
    yield: [
      { id: 1, pn: '4391', yield: 98.5, month: 'Enero', status: 'approved' },
      { id: 2, pn: '4230', yield: 97.2, month: 'Enero', status: 'approved' },
      { id: 3, pn: '4403', yield: 99.1, month: 'Enero', status: 'approved' },
    ],
    downtimes: [
      { id: 1, line: 'FA', date: '2024-01-01', hours: 8, reason: 'Holiday - Año Nuevo', status: 'pending' },
      { id: 2, line: 'Next', date: '2024-01-01', hours: 8, reason: 'Holiday - Año Nuevo', status: 'pending' },
      { id: 3, line: 'CER3', date: '2024-01-01', hours: 8, reason: 'Holiday - Año Nuevo', status: 'pending' },
      { id: 4, line: 'FA', date: '2024-01-15', hours: 4, reason: 'Mantenimiento Preventivo', status: 'pending' },
    ]
  };

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center space-x-4 mb-6">
        <button 
          className="p-2 rounded-full hover:bg-gray-100"
          onClick={() => navigate(`/capacities/${cbpId}`)}
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h2 className="text-2xl font-bold">Input Review - CBP {cbpId}</h2>
      </div>

      {/* Progreso general */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h3 className="text-lg font-medium mb-2">Progreso General</h3>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${Object.values(inputReviewStatus).filter(item => item.complete).length / Object.values(inputReviewStatus).length * 100}%` }}
          ></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
          {Object.entries(inputReviewStatus).map(([key, value]) => (
            <div 
              key={key}
              className={`text-center p-2 rounded-md ${value.complete ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-700'}`}
            >
              <div className="text-sm font-medium">{key.charAt(0).toUpperCase() + key.slice(1)}</div>
              <div className="text-xs">{value.complete ? 'Completado' : 'Pendiente'}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs de navegación */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px overflow-x-auto">
            <button
              className={`py-4 px-6 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'buildPlan' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('buildPlan')}
            >
              Build Plan
              {inputReviewStatus.buildPlan.complete && <Check className="inline-block w-4 h-4 ml-1 text-green-500" />}
            </button>
            <button
              className={`py-4 px-6 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'headcount' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('headcount')}
            >
              Headcount
              {inputReviewStatus.headcount.complete && <Check className="inline-block w-4 h-4 ml-1 text-green-500" />}
            </button>
            <button
              className={`py-4 px-6 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'runRates' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('runRates')}
            >
              Run Rates
              {!inputReviewStatus.runRates.complete && <AlertTriangle className="inline-block w-4 h-4 ml-1 text-amber-500" />}
              {inputReviewStatus.runRates.complete && <Check className="inline-block w-4 h-4 ml-1 text-green-500" />}
            </button>
            <button
              className={`py-4 px-6 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'yield' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('yield')}
            >
              Yield
              {inputReviewStatus.yield.complete && <Check className="inline-block w-4 h-4 ml-1 text-green-500" />}
            </button>
            <button
              className={`py-4 px-6 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'downtimes' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('downtimes')}
            >
              Downtimes
              {!inputReviewStatus.downtimes.complete && <AlertTriangle className="inline-block w-4 h-4 ml-1 text-amber-500" />}
              {inputReviewStatus.downtimes.complete && <Check className="inline-block w-4 h-4 ml-1 text-green-500" />}
            </button>
          </nav>
        </div>

        {/* Contenido de las tabs */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">
              {activeTab === 'buildPlan' && 'Build Plan - Demanda por Producto'}
              {activeTab === 'headcount' && 'Headcount - Personal por Línea'}
              {activeTab === 'runRates' && 'Run Rates - Velocidad de Producción'}
              {activeTab === 'yield' && 'Yield - Rendimiento por Producto'}
              {activeTab === 'downtimes' && 'Downtimes - Paros Programados y Festivos'}
            </h3>
            <div className="flex space-x-2">
              <button className="flex items-center px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200">
                <Upload className="w-4 h-4 mr-1" /> Importar
              </button>
              <button className="flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                <Save className="w-4 h-4 mr-1" /> Guardar
              </button>
            </div>
          </div>

          {/* Tabla dinámica según la tab activa */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {activeTab === 'buildPlan' && (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PN</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mes</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Semana</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    </>
                  )}
                  {activeTab === 'headcount' && (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Línea</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Operadores</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supervisores</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mes</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    </>
                  )}
                  {activeTab === 'runRates' && (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PN</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Línea</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UOM</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mes</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    </>
                  )}
                  {activeTab === 'yield' && (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PN</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Yield (%)</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mes</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    </>
                  )}
                  {activeTab === 'downtimes' && (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Línea</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Horas</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Motivo</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tabData[activeTab as keyof typeof tabData].map((item: any) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    {activeTab === 'buildPlan' && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.pn}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.month}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.week}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            item.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {item.status === 'approved' ? 'Aprobado' : 'Pendiente'}
                          </span>
                        </td>
                      </>
                    )}
                    {activeTab === 'headcount' && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.line}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.operators}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.supervisors}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.month}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            item.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {item.status === 'approved' ? 'Aprobado' : 'Pendiente'}
                          </span>
                        </td>
                      </>
                    )}
                    {activeTab === 'runRates' && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.pn}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.line}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.rate}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.uom}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.month}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            item.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {item.status === 'approved' ? 'Aprobado' : 'Pendiente'}
                          </span>
                        </td>
                      </>
                    )}
                    {activeTab === 'yield' && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.pn}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.yield}%</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.month}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            item.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {item.status === 'approved' ? 'Aprobado' : 'Pendiente'}
                          </span>
                        </td>
                      </>
                    )}
                    {activeTab === 'downtimes' && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.line}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.hours}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.reason}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            item.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {item.status === 'approved' ? 'Aprobado' : 'Pendiente'}
                          </span>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 