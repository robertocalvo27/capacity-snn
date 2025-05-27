import React, { useState } from 'react';
import { Search, Filter, ClipboardList, Check } from 'lucide-react';
import Pagination from '../common/Pagination';
import YieldApprovalLog from './YieldApprovalLog';
import YieldApprovalModal from './YieldApprovalModal';
import { valueStreams } from '../../data/mockData';

interface YieldItem {
  id: number;
  catalog: string;
  pn: string;
  description: string;
  oct2023: number;
  nov2023: number;
  dec2023: number;
  yield: number;
  month: string;
  status: string;
  valueStream: string;
  selected: boolean;
  approvedBy: string | null;
  approvedAt: string | null;
}

interface YieldLog {
  id: number;
  pn: string;
  description: string;
  yieldValue: number;
  approvedBy: string;
  approvedAt: string;
  month: string;
}

interface YieldTabProps {
  data: YieldItem[];
  setData: React.Dispatch<React.SetStateAction<YieldItem[]>>;
  onSave: () => void;
  approvalLogs: YieldLog[];
  setApprovalLogs: React.Dispatch<React.SetStateAction<YieldLog[]>>;
}

const YieldTab: React.FC<YieldTabProps> = ({
  data,
  setData,
  onSave,
  approvalLogs,
  setApprovalLogs
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedValueStream, setSelectedValueStream] = useState<string>('all');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [selectAllYields, setSelectAllYields] = useState<boolean>(false);
  const [showApprovalConfirm, setShowApprovalConfirm] = useState<boolean>(false);
  const [showApprovalLogs, setShowApprovalLogs] = useState<boolean>(false);
  
  // Función para seleccionar/deseleccionar todos los items de yield
  const handleSelectAllYields = (checked: boolean) => {
    setSelectAllYields(checked);
    setData(prevData => 
      prevData.map(item => ({
        ...item,
        selected: checked
      }))
    );
  };

  // Función para seleccionar/deseleccionar un item específico
  const handleSelectYield = (id: number, checked: boolean) => {
    setData(prevData => 
      prevData.map(item => 
        item.id === id ? { ...item, selected: checked } : item
      )
    );
    
    // Verificar si todos están seleccionados para actualizar el estado del "select all"
    const allSelected = data.every(item => item.id === id ? checked : item.selected);
    setSelectAllYields(allSelected);
  };

  // Función para modificar el valor de yield de un producto
  const handleYieldChange = (id: number, value: number) => {
    setData(prevData => 
      prevData.map(item => 
        item.id === id ? { ...item, yield: value } : item
      )
    );
  };

  // Función para aprobar los yields seleccionados
  const handleApproveYields = () => {
    const selectedItems = data.filter(item => item.selected);
    if (selectedItems.length === 0) return;
    
    setShowApprovalConfirm(true);
  };

  // Función para confirmar la aprobación
  const confirmApproval = () => {
    const now = new Date();
    const user = "Juan Pérez"; // En un caso real, vendría del contexto de autenticación
    
    // Crear registros de aprobación
    const newLogs = data
      .filter(item => item.selected)
      .map(item => ({
        id: Date.now() + item.id,
        pn: item.pn,
        description: item.description,
        yieldValue: item.yield,
        approvedBy: user,
        approvedAt: now.toISOString(),
        month: item.month
      }));
    
    // Actualizar los datos de yield
    setData(prevData => 
      prevData.map(item => 
        item.selected ? { 
          ...item, 
          status: 'approved', 
          selected: false,
          approvedBy: user,
          approvedAt: now.toISOString()
        } : item
      )
    );
    
    // Guardar los logs
    setApprovalLogs(prev => [...prev, ...newLogs]);
    
    // Cerrar el modal y mostrar notificación
    setShowApprovalConfirm(false);
    setSelectAllYields(false);
    
    // Llamar a la función de guardar
    onSave();
  };

  // Filtrado de datos
  const filteredData = data.filter(item => {
    // Filtrar por término de búsqueda (PN, descripción o catálogo)
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
          Yield - Rendimiento por Producto
        </h3>
      </div>

      <div className="mb-6">
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

          {/* Botón para aprobar los yields seleccionados */}
          <button
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none disabled:bg-gray-300 disabled:cursor-not-allowed"
            onClick={handleApproveYields}
            disabled={!data.some(item => item.selected)}
          >
            <Check className="mr-2 h-5 w-5" />
            Aprobar seleccionados
          </button>

          {/* Botón para ver el log de aprobaciones */}
          <button
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            onClick={() => setShowApprovalLogs(!showApprovalLogs)}
          >
            <ClipboardList className="mr-2 h-5 w-5 text-gray-400" />
            Ver historial
          </button>
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

        {/* Log de aprobaciones (expandible) */}
        {showApprovalLogs && (
          <YieldApprovalLog 
            logs={approvalLogs} 
            onClose={() => setShowApprovalLogs(false)} 
          />
        )}
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={selectAllYields}
                  onChange={(e) => handleSelectAllYields(e.target.checked)}
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catalog</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PN</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value Stream</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Oct 2023</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Nov 2023</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Dic 2023</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Ene 2024</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.map((item: YieldItem) => (
              <tr key={item.id} className={`hover:bg-gray-50 ${item.selected ? 'bg-blue-50' : ''}`}>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={item.selected}
                    onChange={(e) => handleSelectYield(item.id, e.target.checked)}
                    disabled={item.status === 'approved'}
                  />
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.catalog}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.pn}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.description}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.valueStream}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-center text-gray-500">{item.oct2023}%</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-center text-gray-500">{item.nov2023}%</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-center text-gray-500">{item.dec2023}%</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                  {item.status === 'approved' ? (
                    <span className="font-medium text-gray-900">{item.yield}%</span>
                  ) : (
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={item.yield}
                      onChange={(e) => handleYieldChange(item.id, parseFloat(e.target.value))}
                      className="w-16 px-2 py-1 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  )}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {item.status === 'approved' ? 'Aprobado' : 'Pendiente'}
                  </span>
                  {item.approvedBy && (
                    <div className="mt-1 text-xs text-gray-500">
                      por {item.approvedBy}
                    </div>
                  )}
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

      {/* Modal de confirmación de aprobación */}
      {showApprovalConfirm && (
        <YieldApprovalModal
          selectedItems={data.filter(item => item.selected)}
          onConfirm={confirmApproval}
          onCancel={() => setShowApprovalConfirm(false)}
        />
      )}
    </>
  );
};

export default YieldTab; 