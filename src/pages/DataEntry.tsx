import React, { useState } from 'react';
import { DataEntryForm } from '../components/production/DataEntryForm';
import { ProductionSheet } from '../components/production/ProductionSheet/index';
import { DailySummary } from '../components/production/DailySummary';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { 
  Building2, 
  ClipboardList, 
  Table2, 
  User, 
  Factory, 
  BarChart2,
  ChevronDown,
  ChevronUp,
  Calendar,
  Clock,
  Users
} from 'lucide-react';
import type { ProductionEntry, Shift, ProductionLine, Leader, Supervisor } from '../types/production';
import { PRODUCTION_LINES, LINE_LEADERS, SUPERVISORS } from '../types/production';

const SHIFTS: Shift[] = [
  {
    id: 1,
    name: 'Turno 1',
    startTime: '06:00',
    endTime: '14:00',
    duration: 8
  },
  {
    id: 2,
    name: 'Turno 2',
    startTime: '14:00',
    endTime: '22:00',
    duration: 8
  },
  {
    id: 3,
    name: 'Turno 3',
    startTime: '22:00',
    endTime: '04:00',
    duration: 6
  }
];

export function DataEntryPage() {
  // Estados principales
  const [entries, setEntries] = useState<ProductionEntry[]>([]);
  const [isHeaderExpanded, setIsHeaderExpanded] = useState(true);
  
  // Estados de selección
  const [selectedLine, setSelectedLine] = useState<ProductionLine>(PRODUCTION_LINES[0]);
  const [selectedShift, setSelectedShift] = useState<Shift>(SHIFTS[0]);
  const [selectedSupervisor, setSelectedSupervisor] = useState<Supervisor>(
    SUPERVISORS.find(s => s.shift === SHIFTS[0].id) || SUPERVISORS[0]
  );
  const [selectedLeader, setSelectedLeader] = useState<Leader>(
    LINE_LEADERS.find(l => l.line === PRODUCTION_LINES[0].id && l.shift === SHIFTS[0].id) || LINE_LEADERS[0]
  );

  // Datos filtrados
  const availableSupervisors = SUPERVISORS.filter(s => s.shift === selectedShift.id);
  const availableLeaders = LINE_LEADERS.filter(
    l => l.line === selectedLine.id && l.shift === selectedShift.id
  );

  // Fecha actual formateada
  const currentDate = new Date().toLocaleDateString('es-MX', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const getCurrentHour = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:00`;
  };

  const handleSaveEntry = (entry: ProductionEntry) => {
    setEntries(prev => {
      const index = prev.findIndex(e => e.id === entry.id);
      if (index >= 0) {
        const newEntries = [...prev];
        newEntries[index] = entry;
        return newEntries;
      }
      return [...prev, entry];
    });
  };

  const handleUpdateEntries = (updatedEntries: ProductionEntry[]) => {
    setEntries(updatedEntries);
  };

  return (
    <div className="space-y-6">
      {/* Header Principal */}
      <div className="bg-white rounded-lg shadow-md">
        {/* Barra superior fija */}
        <div className="p-4 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <Factory className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Entrada de Datos de Producción</h2>
              <p className="text-sm text-gray-500">Value Stream: ENT</p>
            </div>
          </div>
          
          {/* Información clave siempre visible */}
          <div className="flex items-center divide-x divide-gray-200">
            <div className="flex items-center space-x-6 px-6">
              <div className="flex items-center space-x-2 text-gray-700">
                <Factory className="h-5 w-5 text-blue-600" />
                <span className="font-medium">{selectedLine.name}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-700">
                <User className="h-5 w-5 text-blue-600" />
                <span className="font-medium">{selectedLeader.name}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-700">
                <Calendar className="h-5 w-5 text-blue-600" />
                <span className="font-medium">{currentDate}</span>
              </div>
            </div>
            <div className="pl-6">
              <button
                onClick={() => setIsHeaderExpanded(!isHeaderExpanded)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title={isHeaderExpanded ? 'Contraer detalles' : 'Expandir detalles'}
              >
                {isHeaderExpanded ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Contenido expandible */}
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isHeaderExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="p-6 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Columna 1: Línea */}
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="text-sm font-medium text-gray-500 mb-4 flex items-center">
                  <Factory className="h-5 w-5 mr-2 text-blue-600" />
                  Información de Línea
                </h3>
                <select
                  value={selectedLine.id}
                  onChange={(e) => {
                    const line = PRODUCTION_LINES.find(l => l.id === e.target.value);
                    if (line) setSelectedLine(line);
                  }}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  {PRODUCTION_LINES.map(line => (
                    <option key={line.id} value={line.id}>{line.name}</option>
                  ))}
                </select>
              </div>

              {/* Columna 2: Turno */}
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="text-sm font-medium text-gray-500 mb-4 flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-blue-600" />
                  Información de Turno
                </h3>
                <select
                  value={selectedShift.id}
                  onChange={(e) => {
                    const shift = SHIFTS.find(s => s.id === Number(e.target.value));
                    if (shift) {
                      setSelectedShift(shift);
                      const newSupervisors = SUPERVISORS.filter(s => s.shift === shift.id);
                      const newLeaders = LINE_LEADERS.filter(
                        l => l.line === selectedLine.id && l.shift === shift.id
                      );
                      if (newSupervisors.length) setSelectedSupervisor(newSupervisors[0]);
                      if (newLeaders.length) setSelectedLeader(newLeaders[0]);
                    }
                  }}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  {SHIFTS.map(shift => (
                    <option key={shift.id} value={shift.id}>
                      {shift.name} ({shift.startTime} - {shift.endTime})
                    </option>
                  ))}
                </select>
              </div>

              {/* Columna 3: Personal */}
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="text-sm font-medium text-gray-500 mb-4 flex items-center">
                  <Users className="h-5 w-5 mr-2 text-blue-600" />
                  Personal Asignado
                </h3>
                <div className="space-y-3">
                  <select
                    value={selectedSupervisor.id}
                    onChange={(e) => {
                      const supervisor = SUPERVISORS.find(s => s.id === e.target.value);
                      if (supervisor) setSelectedSupervisor(supervisor);
                    }}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    {availableSupervisors.map(supervisor => (
                      <option key={supervisor.id} value={supervisor.id}>
                        Supervisor: {supervisor.name}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedLeader.id}
                    onChange={(e) => {
                      const leader = LINE_LEADERS.find(l => l.id === e.target.value);
                      if (leader) setSelectedLeader(leader);
                    }}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    {availableLeaders.map(leader => (
                      <option key={leader.id} value={leader.id}>
                        Líder: {leader.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs con mejor visibilidad */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <Tabs defaultValue="sheet" className="w-full">
          <TabsList className="grid w-full grid-cols-3 gap-2 p-2 bg-gray-100 rounded-lg">
            <TabsTrigger 
              value="form" 
              className="flex items-center space-x-2 bg-white shadow-sm"
            >
              <ClipboardList className="h-5 w-5" />
              <span>Registro por Hora</span>
            </TabsTrigger>
            <TabsTrigger 
              value="sheet" 
              className="flex items-center space-x-2 bg-white shadow-sm"
            >
              <Table2 className="h-5 w-5" />
              <span>Vista de Hoja de Cálculo</span>
            </TabsTrigger>
            <TabsTrigger 
              value="summary" 
              className="flex items-center space-x-2 bg-white shadow-sm"
            >
              <BarChart2 className="h-5 w-5" />
              <span>Resumen del Día</span>
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="form">
              <DataEntryForm
                onSave={handleSaveEntry}
                currentHour={getCurrentHour()}
              />
            </TabsContent>

            <TabsContent value="sheet">
              <ProductionSheet
                entries={entries}
                shift={selectedShift}
                onUpdateEntries={handleUpdateEntries}
              />
            </TabsContent>

            <TabsContent value="summary">
              <DailySummary entries={entries} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}