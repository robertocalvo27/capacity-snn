import React, { useState } from 'react';
import { Filter, ChevronUp, ChevronDown, Table2, Check, X } from 'lucide-react';
import { PROGRAMMED_STOPS } from '../../../types/production';
import { PART_NUMBERS } from '../../../types/part-numbers';
import { CAUSES } from '../../../types/causes';
import type { Column, ProductionFilters } from './types';

interface ProductionFiltersProps {
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  filters: ProductionFilters;
  setFilters: React.Dispatch<React.SetStateAction<ProductionFilters>>;
  columns: Column[];
  toggleColumn: (columnId: string) => void;
  toggleAllColumns: (visible: boolean) => void;
  visibleColumns: Column[];
}

export function ProductionFilters({ 
  showFilters, 
  setShowFilters, 
  filters, 
  setFilters,
  columns,
  toggleColumn,
  toggleAllColumns,
  visibleColumns
}: ProductionFiltersProps) {
  const [showColumnSelector, setShowColumnSelector] = useState(false);

  return (
    <>
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Filter className="h-5 w-5" />
            <span>Filtros</span>
            {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          <div className="relative">
            <button
              onClick={() => setShowColumnSelector(!showColumnSelector)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Table2 className="h-5 w-5" />
              <span>Columnas</span>
              {showColumnSelector ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>

            {showColumnSelector && (
              <div className="absolute z-10 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200">
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-medium text-gray-900">Columnas visibles</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => toggleAllColumns(true)}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Mostrar todas
                      </button>
                      <span className="text-gray-300">|</span>
                      <button
                        onClick={() => toggleAllColumns(false)}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Ocultar todas
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {columns.map(column => (
                      <label
                        key={column.id}
                        className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer"
                      >
                        <span className="text-sm text-gray-700">{column.label}</span>
                        <button
                          onClick={() => toggleColumn(column.id)}
                          className={`p-1 rounded ${
                            column.visible ? 'text-blue-600 bg-blue-50' : 'text-gray-400 bg-gray-50'
                          }`}
                        >
                          {column.visible ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                        </button>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="text-sm text-gray-500">
          {visibleColumns.length} columnas mostradas
        </div>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700">Hora</label>
            <input
              type="text"
              value={filters.hour}
              onChange={(e) => setFilters(prev => ({ ...prev, hour: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">HC Real</label>
            <input
              type="text"
              value={filters.realHeadCount}
              onChange={(e) => setFilters(prev => ({ ...prev, realHeadCount: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">HC Adic.</label>
            <input
              type="text"
              value={filters.additionalHC}
              onChange={(e) => setFilters(prev => ({ ...prev, additionalHC: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Paro Programado</label>
            <select
              value={filters.programmedStop}
              onChange={(e) => setFilters(prev => ({ ...prev, programmedStop: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Todos</option>
              {PROGRAMMED_STOPS.map(stop => (
                <option key={stop.name} value={stop.name}>{stop.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Work Order</label>
            <input
              type="text"
              value={filters.workOrder}
              onChange={(e) => setFilters(prev => ({ ...prev, workOrder: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Part Number</label>
            <select
              value={filters.partNumber}
              onChange={(e) => setFilters(prev => ({ ...prev, partNumber: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Todos</option>
              {PART_NUMBERS.map(pn => (
                <option key={pn.code} value={pn.code}>{pn.code}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Causa</label>
            <select
              value={filters.cause}
              onChange={(e) => setFilters(prev => ({ ...prev, cause: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Todas</option>
              {CAUSES.map(cause => (
                <option key={cause.name} value={cause.name}>{cause.name.replace('_', ' ')}</option>
              ))}
            </select>
          </div>
        </div>
      )}
    </>
  );
}