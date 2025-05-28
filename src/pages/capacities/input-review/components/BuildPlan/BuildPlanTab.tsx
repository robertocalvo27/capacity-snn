import React, { useState, useRef } from 'react';
import { Search, Filter, Eye, Download, FileText, Upload, Save } from 'lucide-react';
import Pagination from '../common/Pagination';
import { valueStreams } from '../../data/mockData';

interface BuildPlanItem {
  id: number;
  catalog: string;
  pn: string;
  description: string;
  quantity: number;
  month: string;
  week: string;
  status: string;
  valueStream: string;
}

interface BuildPlanTabProps {
  data: BuildPlanItem[];
  onImport: () => void;
  onSave: () => void;
  lastImportedFile: string | null;
}

const BuildPlanTab: React.FC<BuildPlanTabProps> = ({
  data,
  onImport,
  onSave,
  lastImportedFile
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedValueStream, setSelectedValueStream] = useState<string>('all');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  // Filtrado de datos
  const filteredData = data.filter(item => {
    // Filtrar por término de búsqueda (PN o descripción)
    const matchesSearch = searchTerm === '' || 
      item.pn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.catalog.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtrar por Value Stream
    const matchesValueStream = selectedValueStream === 'all' || 
      (item.valueStream && item.valueStream.toLowerCase() === selectedValueStream.toLowerCase());
    
    return matchesSearch && matchesValueStream;
  });

  // Paginación
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">
          Build Plan - Demanda por Producto
        </h3>
        <div className="flex space-x-3">
          <button 
            className="flex items-center px-4 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 text-gray-700"
            onClick={onImport}
          >
            <Upload className="w-4 h-4 mr-2" /> Importar Build Plan
          </button>
          <button 
            className="flex items-center px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={onSave}
          >
            <Save className="w-4 h-4 mr-2" /> Guardar
          </button>
        </div>
      </div>

      <div className="mb-6">
        {lastImportedFile && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="w-5 h-5 text-blue-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-blue-800">Archivo importado: {lastImportedFile}</p>
                <p className="text-xs text-blue-600">Importado el {new Date().toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="p-1 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-100">
                <Eye className="w-4 h-4" />
              </button>
              <button className="p-1 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-100">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 mb-4">
          {/* Buscador */}
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Buscar por PN, descripción o catálogo..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
            />
          </div>

          {/* Botón para mostrar/ocultar filtros avanzados */}
          <button
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="mr-2 h-5 w-5 text-gray-400" />
            Filtros avanzados
          </button>

          {/* Items por página */}
          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-2">Mostrar:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1); // Reset to first page when changing items per page
              }}
              className="border border-gray-300 rounded-md text-sm py-1 pl-2 pr-8 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>

        {/* Filtros avanzados (expandibles) */}
        {showFilters && (
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Filtros avanzados</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Value Stream</label>
                <select
                  value={selectedValueStream}
                  onChange={(e) => {
                    setSelectedValueStream(e.target.value);
                    setCurrentPage(1); // Reset to first page on filter change
                  }}
                  className="block w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Todos</option>
                  {valueStreams.map(vs => (
                    <option key={vs.id} value={vs.id}>{vs.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catalog</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PN</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mes</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value Stream</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.map((item: BuildPlanItem) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.catalog}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.pn}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.month}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.valueStream || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {item.status === 'approved' ? 'Aprobado' : 'Pendiente'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPages > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          indexOfFirstItem={indexOfFirstItem}
          indexOfLastItem={indexOfLastItem}
          totalItems={filteredData.length}
          onPageChange={setCurrentPage}
        />
      )}
    </>
  );
};

export default BuildPlanTab; 