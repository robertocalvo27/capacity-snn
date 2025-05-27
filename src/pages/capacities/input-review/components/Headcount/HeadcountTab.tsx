import React, { useState } from 'react';
import { Search, Filter, Upload, Save, FileInput, Check } from 'lucide-react';
import Pagination from '../common/Pagination';
import HeadcountApprovalLog from './HeadcountApprovalLog';
import HeadcountApprovalModal from './HeadcountApprovalModal';
import HeadcountForm from './HeadcountForm';
import { valueStreams } from '../../data/mockData';

interface HeadcountItem {
  id: number;
  line: string;
  operators: number;
  supervisors: number;
  month: string;
  status: string;
  selected?: boolean;
  valueStream?: string;
  approvedBy?: string | null;
  approvedAt?: string | null;
}

interface HeadcountLog {
  id: number;
  line: string;
  operators: number;
  supervisors: number;
  month: string;
  approvedBy: string;
  approvedAt: string;
  valueStream?: string;
}

interface HeadcountTabProps {
  data: HeadcountItem[];
  setData: React.Dispatch<React.SetStateAction<HeadcountItem[]>>;
  onSave: () => void;
  onImport?: () => void;
  approvalLogs?: HeadcountLog[];
  setApprovalLogs?: React.Dispatch<React.SetStateAction<HeadcountLog[]>>;
  lastImportedFile?: string | null;
}

const HeadcountTab: React.FC<HeadcountTabProps> = ({
  data,
  setData,
  onSave,
  onImport,
  approvalLogs = [],
  setApprovalLogs = () => {},
  lastImportedFile
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedValueStream, setSelectedValueStream] = useState<string>('all');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [selectAllHeadcounts, setSelectAllHeadcounts] = useState<boolean>(false);
  const [showApprovalConfirm, setShowApprovalConfirm] = useState<boolean>(false);
  const [showApprovalLogs, setShowApprovalLogs] = useState<boolean>(false);
  const [showHeadcountForm, setShowHeadcountForm] = useState<boolean>(false);

  // Función para seleccionar/deseleccionar todos los headcounts
  const handleSelectAllHeadcounts = (checked: boolean) => {
    setSelectAllHeadcounts(checked);
    setData(prevData => 
      prevData.map(item => ({
        ...item,
        selected: checked
      }))
    );
  };

  // Función para seleccionar/deseleccionar un headcount específico
  const handleSelectHeadcount = (id: number, checked: boolean) => {
    setData(prevData => 
      prevData.map(item => 
        item.id === id ? { ...item, selected: checked } : item
      )
    );
    
    // Verificar si todos están seleccionados para actualizar el estado del "select all"
    const allSelected = data.every(item => item.id === id ? checked : item.selected);
    setSelectAllHeadcounts(allSelected);
  };

  // Función para aprobar los headcounts seleccionados
  const handleApproveHeadcounts = () => {
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
        line: item.line,
        operators: item.operators,
        supervisors: item.supervisors,
        month: item.month,
        valueStream: item.valueStream || 'N/A',
        approvedBy: user,
        approvedAt: now.toISOString()
      }));
    
    // Actualizar los datos de headcount
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
    setSelectAllHeadcounts(false);
    
    // Llamar a la función de guardar
    onSave();
  };

  // Función para manejar la creación de un nuevo headcount
  const handleAddHeadcount = (headcount: Omit<HeadcountItem, 'id' | 'status' | 'selected'>) => {
    const newHeadcount = {
      ...headcount,
      id: Date.now(),
      status: 'pending',
      selected: false
    };
    
    setData(prev => [newHeadcount, ...prev]);
    setShowHeadcountForm(false);
    onSave();
  };

  // Filtrado de datos
  const filteredData = data.filter(item => {
    // Filtrar por término de búsqueda (línea)
    const matchesSearch = searchTerm === '' || 
      item.line.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtrar por Value Stream (si aplica)
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
          Headcount - Personal por Línea
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
              placeholder="Buscar por línea..."
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

          {/* Botón para aprobar los headcounts seleccionados */}
          <button
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none disabled:bg-gray-300 disabled:cursor-not-allowed"
            onClick={handleApproveHeadcounts}
            disabled={!data.some(item => item.selected)}
          >
            <Check className="mr-2 h-5 w-5" />
            Aprobar seleccionados
          </button>

          {/* Botón para registrar un nuevo headcount */}
          <button 
            className="flex items-center px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={() => setShowHeadcountForm(true)}
          >
            <FileInput className="w-4 h-4 mr-2" /> Registrar Headcount
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
          <HeadcountApprovalLog 
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
                  checked={selectAllHeadcounts}
                  onChange={(e) => handleSelectAllHeadcounts(e.target.checked)}
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Línea</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value Stream</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Operadores</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Supervisores</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mes</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.map((item: HeadcountItem) => (
              <tr key={item.id} className={`hover:bg-gray-50 ${item.selected ? 'bg-blue-50' : ''}`}>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={!!item.selected}
                    onChange={(e) => handleSelectHeadcount(item.id, e.target.checked)}
                    disabled={item.status === 'approved'}
                  />
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.line}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.valueStream || '-'}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-center text-gray-900">{item.operators}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-center text-gray-900">{item.supervisors}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.month}</td>
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
        <HeadcountApprovalModal
          selectedItems={data.filter(item => item.selected)}
          onConfirm={confirmApproval}
          onCancel={() => setShowApprovalConfirm(false)}
        />
      )}

      {/* Formulario de headcount */}
      {showHeadcountForm && (
        <HeadcountForm
          onSubmit={handleAddHeadcount}
          onCancel={() => setShowHeadcountForm(false)}
        />
      )}
    </>
  );
};

export default HeadcountTab; 