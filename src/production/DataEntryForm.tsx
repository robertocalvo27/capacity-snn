import React, { useState } from 'react';
import { Clock, Users, Clipboard, Package, Target, AlertCircle, Save, TrendingDown } from 'lucide-react';
import type { ProductionEntry } from '../../types/production';
import { PROGRAMMED_STOPS } from '../../types/production';
import { CAUSES } from '../../types/causes';
import { PART_NUMBERS } from '../../types/part-numbers';

interface DataEntryFormProps {
  onSave: (entry: ProductionEntry) => void;
  currentHour: string;
}

export function DataEntryForm({ onSave, currentHour }: DataEntryFormProps) {
  const [entry, setEntry] = useState<Partial<ProductionEntry>>({
    id: `${currentHour}-${Date.now()}`,
    hour: currentHour,
    realHeadCount: 0,
    programmedStop: null,
    workOrder: '',
    partNumber: '',
    hourlyTarget: 0,
    dailyProduction: 0,
    delta: 0,
    registeredAt: new Date()
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEntry(prev => {
      const updatedEntry = { ...prev, [name]: value };

      // Actualizar target cuando se selecciona un PN
      if (name === 'partNumber') {
        const selectedPart = PART_NUMBERS.find(pn => pn.code === value);
        if (selectedPart) {
          updatedEntry.hourlyTarget = selectedPart.runRateT1; // Por defecto usamos T1
        }
      }

      // Calcular delta
      if (name === 'dailyProduction' || name === 'hourlyTarget' || updatedEntry.hourlyTarget) {
        updatedEntry.delta = calculateDelta(
          name === 'dailyProduction' ? parseInt(value) : (updatedEntry.dailyProduction || 0),
          name === 'hourlyTarget' ? parseInt(value) : (updatedEntry.hourlyTarget || 0)
        );
      }

      // Limpiar causas si el delta no es negativo
      if (updatedEntry.delta >= 0) {
        updatedEntry.generalCause = undefined;
        updatedEntry.specificCause = undefined;
      }

      return updatedEntry;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const calculatedEntry = {
      ...entry,
      availableTime: calculateAvailableTime(entry.programmedStop),
      delta: calculateDelta(entry.dailyProduction || 0, entry.hourlyTarget || 0),
      downtime: calculateDowntime(entry.dailyProduction || 0, entry.hourlyTarget || 0)
    } as ProductionEntry;
    
    onSave(calculatedEntry);
    
    // Limpiar el formulario
    setEntry({
      id: `${currentHour}-${Date.now()}`,
      hour: currentHour,
      realHeadCount: 0,
      programmedStop: null,
      workOrder: '',
      partNumber: '',
      hourlyTarget: 0,
      dailyProduction: 0,
      delta: 0,
      registeredAt: new Date()
    });
  };

  const calculateAvailableTime = (stop: string | null) => {
    if (!stop) return 60;
    const programmedStop = PROGRAMMED_STOPS.find(s => s.name === stop);
    return programmedStop ? 60 - programmedStop.duration : 60;
  };

  const calculateDelta = (production: number, target: number) => {
    return production - target;
  };

  const calculateDowntime = (production: number, target: number) => {
    return Math.max(0, target - production);
  };

  const isWeekend = new Date().getDay() === 6;
  const availableStops = PROGRAMMED_STOPS.filter(stop => 
    isWeekend ? stop.saturday : stop.weekday
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 rounded-lg shadow">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Hora y Head Count */}
        <div className="space-y-6">
          <div className="flex items-center space-x-4 text-lg">
            <Clock className="h-6 w-6 text-gray-500" />
            <span className="font-medium">{currentHour}</span>
          </div>
          
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-gray-700">
              <Users className="h-5 w-5" />
              <span>Head Count Real</span>
            </label>
            <input
              type="number"
              min="0"
              step="1"
              name="realHeadCount"
              value={entry.realHeadCount}
              onChange={handleInputChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Paro Programado */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-gray-700">
            <AlertCircle className="h-5 w-5" />
            <span>Paro Programado</span>
          </label>
          <select
            name="programmedStop"
            value={entry.programmedStop || ''}
            onChange={handleInputChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Sin paro programado</option>
            {availableStops.map(stop => (
              <option key={stop.name} value={stop.name}>
                {stop.name}
              </option>
            ))}
          </select>
        </div>

        {/* Work Order y Part Number */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-gray-700">
            <Clipboard className="h-5 w-5" />
            <span>Work Order</span>
          </label>
          <input
            type="text"
            name="workOrder"
            value={entry.workOrder}
            onChange={handleInputChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Ingrese WO..."
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-gray-700">
            <Package className="h-5 w-5" />
            <span>Part Number</span>
          </label>
          <select
            name="partNumber"
            value={entry.partNumber}
            onChange={handleInputChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Seleccionar PN</option>
            {PART_NUMBERS.map(pn => (
              <option key={pn.code} value={pn.code}>{pn.code}</option>
            ))}
          </select>
        </div>

        {/* Meta y Producción */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-gray-700">
            <Target className="h-5 w-5" />
            <span>Meta por Hora</span>
          </label>
          <input
            type="number"
            min="0"
            step="1"
            name="hourlyTarget"
            value={entry.hourlyTarget}
            onChange={handleInputChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Producción del Día
          </label>
          <input
            type="number"
            min="0"
            step="1"
            name="dailyProduction"
            value={entry.dailyProduction}
            onChange={handleInputChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Delta */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-gray-700">
            <TrendingDown className="h-5 w-5" />
            <span>Delta</span>
          </label>
          <div className={`text-lg font-medium ${
            entry.delta < 0 ? 'text-red-600' : 'text-green-600'
          }`}>
            {entry.delta || 0}
          </div>
        </div>

        {/* Causas y Subcausas (solo si hay delta negativo) */}
        {entry.delta < 0 && (
          <>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Causa General
              </label>
              <select
                name="generalCause"
                value={entry.generalCause || ''}
                onChange={handleInputChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Seleccione una causa</option>
                {CAUSES.map(cause => (
                  <option key={cause.name} value={cause.name}>
                    {cause.name.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            {entry.generalCause && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Causa Específica
                </label>
                <select
                  name="specificCause"
                  value={entry.specificCause || ''}
                  onChange={handleInputChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Seleccione una subcausa</option>
                  {CAUSES.find(c => c.name === entry.generalCause)?.subcauses.map(subcause => (
                    <option key={subcause} value={subcause}>{subcause}</option>
                  ))}
                </select>
              </div>
            )}
          </>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Save className="h-5 w-5" />
          <span>Guardar Registro</span>
        </button>
      </div>
    </form>
  );
}