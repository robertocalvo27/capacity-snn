import React, { useState } from 'react';
import { Filter, Download, BarChart2, Plus, Copy, Trash2, Save } from 'lucide-react';
import usageMock from './usageMock.ts';
import { useParams } from 'react-router-dom';

// Definir interfaces para los tipos de datos
interface WeeklyData {
  woi: number;
  wk14: number;
  wk15: number;
  wk16: number;
  wk17: number;
}

interface Scenario {
  id: string;
  name: string;
  description: string;
  targetUtilization: number;
  weeklyValues: {
    [productId: string]: WeeklyData;
  };
  woiProjection?: {
    [productId: string]: number[];
  };
  utilizationRates: {
    wk14: number;
    wk15: number;
    wk16: number;
    wk17: number;
  };
}

export default function UsageRoadster() {
  // Datos mock
  const { products, period, linesSummary } = usageMock;
  const { cbpId } = useParams();
  
  // Estado para manejar múltiples escenarios
  const [scenarios, setScenarios] = useState<Scenario[]>([
    {
      id: '1',
      name: 'Escenario Base',
      description: 'Distribución inicial basada en el CBP',
      targetUtilization: 100,
      weeklyValues: products.reduce((acc, prod, idx) => {
        acc[prod.catalog] = {
          woi: Math.round(Math.random() * 8 + 2),
          wk14: period[idx].wk14,
          wk15: period[idx].wk15,
          wk16: period[idx].wk16,
          wk17: period[idx].wk17
        };
        return acc;
      }, {}),
      utilizationRates: {
        wk14: 101,
        wk15: 101,
        wk16: 0,
        wk17: 101
      }
    }
  ]);
  
  // Escenario activo
  const [activeScenarioId, setActiveScenarioId] = useState<string>('1');
  const activeScenario = scenarios.find(s => s.id === activeScenarioId) || scenarios[0];
  
  // Función para crear un nuevo escenario
  const createNewScenario = () => {
    const newId = (parseInt(scenarios[scenarios.length - 1].id) + 1).toString();
    const newScenario: Scenario = {
      id: newId,
      name: `Escenario ${newId}`,
      description: 'Nuevo escenario de simulación',
      targetUtilization: 100,
      weeklyValues: products.reduce((acc, prod, idx) => {
        acc[prod.catalog] = {
          woi: Math.round(Math.random() * 8 + 2),
          wk14: period[idx].wk14,
          wk15: period[idx].wk15,
          wk16: period[idx].wk16,
          wk17: period[idx].wk17
        };
        return acc;
      }, {}),
      utilizationRates: {
        wk14: 101,
        wk15: 101,
        wk16: 0,
        wk17: 101
      }
    };
    
    setScenarios([...scenarios, newScenario]);
    setActiveScenarioId(newId);
  };
  
  // Función para duplicar un escenario
  const duplicateScenario = (scenarioId: string) => {
    const scenarioToDuplicate = scenarios.find(s => s.id === scenarioId);
    if (!scenarioToDuplicate) return;
    
    const newId = (parseInt(scenarios[scenarios.length - 1].id) + 1).toString();
    const newScenario: Scenario = {
      ...scenarioToDuplicate,
      id: newId,
      name: `${scenarioToDuplicate.name} (copia)`,
      description: `Copia de: ${scenarioToDuplicate.description}`
    };
    
    setScenarios([...scenarios, newScenario]);
    setActiveScenarioId(newId);
  };
  
  // Función para eliminar un escenario
  const deleteScenario = (scenarioId: string) => {
    if (scenarios.length <= 1) return; // No eliminar el último escenario
    
    const newScenarios = scenarios.filter(s => s.id !== scenarioId);
    setScenarios(newScenarios);
    
    // Si se eliminó el escenario activo, activar el primero
    if (activeScenarioId === scenarioId) {
      setActiveScenarioId(newScenarios[0].id);
    }
  };
  
  // Función para actualizar un escenario
  const updateScenario = (scenarioId: string, updates: Partial<Scenario>) => {
    setScenarios(scenarios.map(s => 
      s.id === scenarioId ? { ...s, ...updates } : s
    ));
  };
  
  // Función para actualizar valores semanales de un producto
  const updateWeeklyValue = (productId: string, week: string, value: number) => {
    const updatedWeeklyValues = {
      ...activeScenario.weeklyValues,
      [productId]: {
        ...activeScenario.weeklyValues[productId],
        [week]: value
      }
    };
    
    updateScenario(activeScenarioId, { weeklyValues: updatedWeeklyValues });
  };
  
  // Función para actualizar WOI de un producto
  const updateWOI = (productId: string, value: number) => {
    const updatedWeeklyValues = {
      ...activeScenario.weeklyValues,
      [productId]: {
        ...activeScenario.weeklyValues[productId],
        woi: value
      }
    };
    
    updateScenario(activeScenarioId, { weeklyValues: updatedWeeklyValues });
  };
  
  // Función para calcular la distribución
  const calculateDistribution = () => {
    // Aquí iría la lógica real de distribución
    // Por ahora solo actualizamos las tasas de utilización con valores simulados
    updateScenario(activeScenarioId, {
      utilizationRates: {
        wk14: 95 + Math.round(Math.random() * 10),
        wk15: 95 + Math.round(Math.random() * 10),
        wk16: 95 + Math.round(Math.random() * 10),
        wk17: 95 + Math.round(Math.random() * 10)
      },
      woiProjection: products.reduce((acc, prod) => {
        const baseWoi = activeScenario.weeklyValues[prod.catalog].woi;
        acc[prod.catalog] = Array(7).fill(0).map((_, i) => {
          return parseFloat((baseWoi - i * 0.4 + Math.random() * 1.6 - 0.8).toFixed(1));
        });
        return acc;
      }, {})
    });
  };

  return (
    <div className="space-y-6">
      {/* Header mejorado (similar a index.tsx) */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <BarChart2 className="w-7 h-7 text-purple-600 mr-2" />
              Usage <span className="text-lg font-normal text-gray-500 ml-2">(Capacity Loading)</span>
            </h1>
            <p className="text-gray-500">Detalle de asignación semanal y carga de líneas para Roadster - {cbpId || "Abril 2025"}</p>
          </div>
          <div className="flex space-x-2">
            <button
              className="flex items-center px-4 py-2 border rounded-lg hover:bg-gray-50 border-gray-300 text-gray-900"
            >
              <Filter className="w-4 h-4 mr-2" /> Filtros
            </button>
            <button
              className="flex items-center px-4 py-2 border rounded-lg hover:bg-gray-50 border-gray-300 text-gray-900"
            >
              <Download className="w-4 h-4 mr-2" /> Exportar
            </button>
          </div>
        </div>
      </div>

      {/* Resumen superior de líneas */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumen de Carga por Línea</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Línea</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BP</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CBP</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delta</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delta+</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Load 14</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Load 15</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Load 16</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Load 17</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Load 18</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">T Loading</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {linesSummary.map((line: any) => (
                <tr key={line.name} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{line.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{line.bp}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{line.cbp}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{line.delta}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{line.deltaPlus}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${parseInt(line.load14) > 100 ? 'text-red-600 font-semibold' : 'text-gray-900'}`}>{line.load14}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${parseInt(line.load15) > 100 ? 'text-red-600 font-semibold' : 'text-gray-900'}`}>{line.load15}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${parseInt(line.load16) > 100 ? 'text-red-600 font-semibold' : 'text-gray-900'}`}>{line.load16}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${parseInt(line.load17) > 100 ? 'text-red-600 font-semibold' : 'text-gray-900'}`}>{line.load17}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${parseInt(line.load18) > 100 ? 'text-red-600 font-semibold' : 'text-gray-900'}`}>{line.load18}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${parseInt(line.tLoading) > 100 ? 'text-red-600' : 'text-green-600'}`}>{line.tLoading}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tabla de productos y periodo */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Productos y Programación Semanal</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catalog</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PN</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lot Size</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Yield</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Line</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BP</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CBP</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delta</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delta+</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">wk25-14</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">wk25-15</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">wk25-16</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">wk25-17</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((prod: any, idx: number) => (
                <tr key={prod.catalog} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{prod.catalog}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{prod.pn}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{prod.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{prod.lotSize}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{prod.yield}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{prod.line}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{period[idx].bp}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{period[idx].cbp}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{period[idx].delta}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{period[idx].deltaPlus}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${period[idx].wk14 > 0 ? 'bg-blue-50' : ''}`}>{period[idx].wk14}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${period[idx].wk15 > 0 ? 'bg-blue-50' : ''}`}>{period[idx].wk15}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${period[idx].wk16 > 0 ? 'bg-blue-50' : ''}`}>{period[idx].wk16}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${period[idx].wk17 > 0 ? 'bg-blue-50' : ''}`}>{period[idx].wk17}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Nueva sección: Simulación de Productos y Programación Semanal */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Simulación de Productos y Programación Semanal</h2>
          <div className="flex space-x-2">
            <button 
              className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 flex items-center"
              onClick={() => createNewScenario()}
            >
              <Plus className="w-4 h-4 mr-1" /> Nuevo Escenario
            </button>
          </div>
        </div>

        {/* Pestañas de escenarios */}
        <div className="border-b border-gray-200 mb-4">
          <div className="flex overflow-x-auto">
            {scenarios.map((scenario) => (
              <button
                key={scenario.id}
                className={`px-4 py-2 font-medium text-sm whitespace-nowrap border-b-2 ${
                  activeScenarioId === scenario.id 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveScenarioId(scenario.id)}
              >
                {scenario.name}
              </button>
            ))}
          </div>
        </div>

        {/* Barra de herramientas del escenario activo */}
        <div className="flex justify-between items-center mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <input 
                type="text" 
                className="font-medium border-none bg-transparent focus:ring-0 text-gray-900"
                value={activeScenario.name}
                onChange={(e) => updateScenario(activeScenarioId, { name: e.target.value })}
              />
              <div className="flex space-x-2">
                <button 
                  className="p-1 text-gray-500 hover:text-blue-600"
                  onClick={() => duplicateScenario(activeScenarioId)}
                  title="Duplicar escenario"
                >
                  <Copy className="w-4 h-4" />
                </button>
                {scenarios.length > 1 && (
                  <button 
                    className="p-1 text-gray-500 hover:text-red-600"
                    onClick={() => deleteScenario(activeScenarioId)}
                    title="Eliminar escenario"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button 
                  className="p-1 text-gray-500 hover:text-green-600"
                  title="Guardar escenario"
                >
                  <Save className="w-4 h-4" />
                </button>
              </div>
            </div>
            <input 
              type="text" 
              className="text-sm border-none bg-transparent focus:ring-0 text-gray-500"
              value={activeScenario.description}
              onChange={(e) => updateScenario(activeScenarioId, { description: e.target.value })}
              placeholder="Descripción del escenario..."
            />
          </div>
          <div className="flex space-x-2">
            <button
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={calculateDistribution}
            >
              Calcular Distribución
            </button>
            <button
              className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Reiniciar
            </button>
          </div>
        </div>

        {/* Capacidad y Utilización */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500">Capacidad Total</label>
              <span className="text-lg font-bold">3180</span>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500">Utilización Wk14</label>
              <span className={`text-lg font-bold ${activeScenario.utilizationRates.wk14 > 100 ? 'text-red-600' : 'text-green-600'}`}>
                {activeScenario.utilizationRates.wk14}%
              </span>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500">Utilización Wk15</label>
              <span className={`text-lg font-bold ${activeScenario.utilizationRates.wk15 > 100 ? 'text-red-600' : 'text-green-600'}`}>
                {activeScenario.utilizationRates.wk15}%
              </span>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500">Utilización Wk16</label>
              <span className={`text-lg font-bold ${activeScenario.utilizationRates.wk16 > 100 ? 'text-red-600' : 'text-green-600'}`}>
                {activeScenario.utilizationRates.wk16}%
              </span>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500">Utilización Wk17</label>
              <span className={`text-lg font-bold ${activeScenario.utilizationRates.wk17 > 100 ? 'text-red-600' : 'text-green-600'}`}>
                {activeScenario.utilizationRates.wk17}%
              </span>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500">Target Utilización</label>
              <input 
                type="number" 
                className="w-20 px-2 py-1 border border-gray-300 rounded text-center" 
                value={activeScenario.targetUtilization}
                onChange={(e) => updateScenario(activeScenarioId, { targetUtilization: parseInt(e.target.value) })}
              />
            </div>
          </div>
        </div>

        {/* Tabla de Simulación Editable */}
        <div className="overflow-x-auto mb-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PN</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">WOI</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BP</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CBP</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lot Size</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-blue-50">wk25-14</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-blue-50">wk25-15</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-blue-50">wk25-16</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-blue-50">wk25-17</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((prod: any, idx: number) => {
                const weeklyData = activeScenario.weeklyValues[prod.catalog];
                const total = weeklyData ? (
                  weeklyData.wk14 + weeklyData.wk15 + weeklyData.wk16 + weeklyData.wk17
                ) : (period[idx].wk14 + period[idx].wk15 + period[idx].wk16 + period[idx].wk17);
                
                return (
                  <tr key={`sim-${prod.catalog}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{prod.pn}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <input 
                        type="number" 
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-center" 
                        value={weeklyData?.woi || Math.round(Math.random() * 8 + 2)}
                        onChange={(e) => updateWOI(prod.catalog, parseInt(e.target.value))}
                        step="0.1"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{period[idx].bp}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{period[idx].cbp}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                      {total}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{prod.lotSize}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 bg-blue-50">
                      <input 
                        type="number" 
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-center" 
                        value={weeklyData?.wk14 || period[idx].wk14}
                        onChange={(e) => updateWeeklyValue(prod.catalog, 'wk14', parseInt(e.target.value))}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 bg-blue-50">
                      <input 
                        type="number" 
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-center" 
                        value={weeklyData?.wk15 || period[idx].wk15}
                        onChange={(e) => updateWeeklyValue(prod.catalog, 'wk15', parseInt(e.target.value))}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 bg-blue-50">
                      <input 
                        type="number" 
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-center" 
                        value={weeklyData?.wk16 || period[idx].wk16}
                        onChange={(e) => updateWeeklyValue(prod.catalog, 'wk16', parseInt(e.target.value))}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 bg-blue-50">
                      <input 
                        type="number" 
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-center" 
                        value={weeklyData?.wk17 || period[idx].wk17}
                        onChange={(e) => updateWeeklyValue(prod.catalog, 'wk17', parseInt(e.target.value))}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Tabla de Semanas de Inventario Resultantes */}
        <div className="overflow-x-auto">
          <h3 className="text-md font-medium text-gray-900 mb-2">Semanas de Inventario Resultantes</h3>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PN</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">WOI Actual</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">wk25-14</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">wk25-15</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">wk25-16</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">wk25-17</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">wk25-18</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">wk25-19</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">wk25-20</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((prod: any, idx: number) => {
                const woiActual = activeScenario.weeklyValues[prod.catalog]?.woi || Math.round(Math.random() * 8 + 2);
                const woiValues = activeScenario.woiProjection?.[prod.catalog] || 
                  Array(7).fill(0).map((_, i) => {
                    return parseFloat((woiActual - i * 0.4 + Math.random() * 1.6 - 0.8).toFixed(1));
                  });

                return (
                  <tr key={`woi-${prod.catalog}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{prod.pn}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{woiActual}</td>
                    {woiValues.map((val, i) => (
                      <td 
                        key={`woi-${prod.catalog}-${i}`} 
                        className={`px-6 py-4 whitespace-nowrap text-sm ${
                          val < 0 ? 'text-red-600 font-bold' : 
                          val < 2 ? 'text-yellow-600' : 
                          'text-green-600'
                        }`}
                      >
                        {val}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 