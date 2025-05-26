import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { BarChart2, Filter, X } from 'lucide-react';

const valueStreams = [
  { id: 'roadster', name: 'Roadster', lines: ['L14.5', 'Next', 'CER3'] },
  { id: 'sports-medicine', name: 'Sports Medicine', lines: ['L01', 'L02', 'L03'] },
  { id: 'wound', name: 'Wound', lines: ['L21', 'L22'] },
];

const mockWeeks = [
  { semana: 'wk24-1', inicio: '31-Dic', fin: '6-Ene', linea: 'L14.5', downtime: 0, overtime: 0, available: 35.4, holidays: 0, observaciones: 'Sin incidencias.' },
  { semana: 'wk24-2', inicio: '7-Ene', fin: '13-Ene', linea: 'L14.5', downtime: 0, overtime: 0, available: 35.4, holidays: 0, observaciones: 'Sin incidencias.' },
  { semana: 'wk24-3', inicio: '14-Ene', fin: '20-Ene', linea: 'L14.5', downtime: 0, overtime: 0, available: 35.4, holidays: 1, observaciones: 'Holiday: 15-Ene. Capacitación programada.' },
  { semana: 'wk24-4', inicio: '21-Ene', fin: '27-Ene', linea: 'L14.5', downtime: 0, overtime: 0, available: 35.4, holidays: 0, observaciones: 'Auditoría interna el 23-Ene.' },
  { semana: 'wk24-5', inicio: '28-Ene', fin: '3-Feb', linea: 'L14.5', downtime: 0, overtime: 0, available: 35.4, holidays: 0, observaciones: 'Sin incidencias.' },
  // ...más semanas
];

export default function VSTDetail() {
  const { vstId } = useParams();
  const [showFilters, setShowFilters] = useState(false);
  const [selectedVS, setSelectedVS] = useState(vstId || 'roadster');
  const [selectedLine, setSelectedLine] = useState('');
  const [dateFrom, setDateFrom] = useState('2024-01-01');
  const [dateTo, setDateTo] = useState('2024-01-31');

  // KPIs mock
  const kpi = {
    horas: 142.5,
    downtime: 0,
    holidays: 2,
    diasHabiles: 20,
  };

  // Obtener líneas según VST seleccionado
  const currentVS = valueStreams.find(vs => vs.id === selectedVS) || valueStreams[0];
  const lines = currentVS.lines;

  // Filtrado por línea
  const weeks = selectedLine
    ? mockWeeks.filter(w => w.linea === selectedLine)
    : mockWeeks;

  // Paginado
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;
  const totalPages = Math.ceil(weeks.length / rowsPerPage);
  const paginatedWeeks = weeks.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  // Modal de observaciones
  const [obsOpen, setObsOpen] = useState(false);
  const [obsText, setObsText] = useState('');
  const [obsType, setObsType] = useState<'downtime' | 'holiday'>('downtime');

  // Ejemplo de datos de observaciones
  const obsData = {
    downtime: [
      {
        nombre: 'Capacitación HSE',
        detalle: 'Seguridad basada en comportamientos',
        tiempo: '4 horas',
        area: 'HSE',
        aprobado: 'Sí',
      },
      {
        nombre: 'Auditoría interna',
        detalle: 'Revisión de procesos',
        tiempo: '2 horas',
        area: 'Calidad',
        aprobado: 'Sí',
      },
    ],
    holiday: [
      {
        nombre: 'Holiday: 15-Ene',
        detalle: 'Día feriado nacional',
        tiempo: '1 día',
        area: 'RRHH',
        aprobado: 'Sí',
      },
    ],
  };

  return (
    <div className="space-y-8 p-8">
      {/* Header estilo index.tsx */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <BarChart2 className="w-7 h-7 text-blue-600 mr-2" />
              Calendario de Capacidad - <span className="ml-2 text-blue-700">{currentVS.name}</span>
            </h1>
            <p className="text-gray-500">Visualización de inputs clave para el Value Stream seleccionado</p>
          </div>
          <div className="flex space-x-2">
            <button
              className={`flex items-center px-4 py-2 border rounded-lg hover:bg-gray-50 ${showFilters ? 'border-blue-600 text-blue-600' : 'border-gray-300 text-gray-900'}`}
              onClick={() => setShowFilters((v) => !v)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </button>
          </div>
        </div>
      </div>
      {/* Panel de filtros debajo del header */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
            <button onClick={() => setShowFilters(false)} className="p-2 rounded hover:bg-gray-200">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Value Stream */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Value Stream</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                value={selectedVS}
                onChange={e => {
                  setSelectedVS(e.target.value);
                  setSelectedLine('');
                }}
              >
                {valueStreams.map(vs => (
                  <option key={vs.id} value={vs.id}>{vs.name}</option>
                ))}
              </select>
            </div>
            {/* Línea */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Línea</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                value={selectedLine}
                onChange={e => setSelectedLine(e.target.value)}
              >
                <option value="">Todas</option>
                {lines.map(line => (
                  <option key={line} value={line}>{line}</option>
                ))}
              </select>
            </div>
          </div>
          {/* Selector de rango de fechas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha desde</label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                value={dateFrom}
                onChange={e => setDateFrom(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha hasta</label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                value={dateTo}
                onChange={e => setDateTo(e.target.value)}
              />
            </div>
          </div>
          {/* Acciones de filtro */}
          <div className="mt-6 flex justify-end space-x-2">
            <button
              className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
              onClick={() => {
                setSelectedVS(vstId || 'roadster');
                setSelectedLine('');
                setDateFrom('2024-01-01');
                setDateTo('2024-01-31');
              }}
            >
              Limpiar
            </button>
            <button
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => setShowFilters(false)}
            >
              Aplicar
            </button>
          </div>
        </div>
      )}

      {/* KPI Cards mejorados */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center border-l-4 border-blue-500">
          <span className="text-gray-500 text-sm mb-1">Horas disponibles</span>
          <span className="text-3xl font-bold text-blue-700">{kpi.horas}</span>
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center border-l-4 border-red-500">
          <span className="text-gray-500 text-sm mb-1">Downtime (min)</span>
          <span className="text-3xl font-bold text-red-600">{kpi.downtime}</span>
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center border-l-4 border-yellow-500">
          <span className="text-gray-500 text-sm mb-1">Holidays</span>
          <span className="text-3xl font-bold text-yellow-600">{kpi.holidays}</span>
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center border-l-4 border-green-500">
          <span className="text-gray-500 text-sm mb-1">Días hábiles</span>
          <span className="text-3xl font-bold text-green-700">{kpi.diasHabiles}</span>
        </div>
      </div>

      {/* Tabla calendario semanal */}
      <div className="bg-white rounded-lg shadow-lg p-6 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Semana</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha Inicio</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha Fin</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Línea</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Downtime (min)</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Overtime (min)</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Available Time (H)</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Holidays</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Observaciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedWeeks.map((w, idx) => (
              <tr key={idx} className="hover:bg-gray-50" style={{ lineHeight: '2.2' }}>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{w.semana}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{w.inicio}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{w.fin}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{w.linea}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-red-600">{w.downtime}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-600">{w.overtime}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-green-700">{w.available}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-yellow-600">{w.holidays}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => { setObsText(w.observaciones); setObsOpen(true); }}
                  >
                    Ver
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Paginado */}
        <div className="flex justify-end items-center mt-4 space-x-2">
          <button
            className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Anterior
          </button>
          <span className="text-sm text-gray-600">Página {page} de {totalPages}</span>
          <button
            className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Siguiente
          </button>
        </div>
        {/* Modal de observaciones */}
        {obsOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
              <h4 className="text-lg font-bold mb-4">Observaciones de la semana</h4>
              <div className="mb-4 flex border-b">
                <button
                  className={`px-4 py-2 font-medium ${obsType === 'downtime' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                  onClick={() => setObsType('downtime')}
                >
                  Downtimes
                </button>
                <button
                  className={`px-4 py-2 font-medium ${obsType === 'holiday' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                  onClick={() => setObsType('holiday')}
                >
                  Holidays
                </button>
              </div>
              <div>
                {obsType === 'downtime' && obsData.downtime.length > 0 ? (
                  <ul className="space-y-2">
                    {obsData.downtime.map((d, i) => (
                      <li key={i} className="bg-gray-50 rounded p-3">
                        <div className="font-semibold text-gray-800">{d.nombre}</div>
                        <div className="text-sm text-gray-600">{d.detalle}</div>
                        <div className="text-sm text-gray-600">Tiempo: {d.tiempo}</div>
                        <div className="text-sm text-gray-600">Área que aprueba: {d.area}</div>
                        <div className="text-sm text-gray-600">Aprobado: {d.aprobado}</div>
                      </li>
                    ))}
                  </ul>
                ) : null}
                {obsType === 'holiday' && obsData.holiday.length > 0 ? (
                  <ul className="space-y-2">
                    {obsData.holiday.map((h, i) => (
                      <li key={i} className="bg-gray-50 rounded p-3">
                        <div className="font-semibold text-gray-800">{h.nombre}</div>
                        <div className="text-sm text-gray-600">{h.detalle}</div>
                        <div className="text-sm text-gray-600">Tiempo: {h.tiempo}</div>
                        <div className="text-sm text-gray-600">Área que aprueba: {h.area}</div>
                        <div className="text-sm text-gray-600">Aprobado: {h.aprobado}</div>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
              <button
                className="mt-6 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 w-full"
                onClick={() => setObsOpen(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 