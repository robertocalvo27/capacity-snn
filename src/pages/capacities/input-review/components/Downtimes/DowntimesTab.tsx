import React, { useState } from 'react';
import { Search, Filter, ClipboardList, Check, Upload, FileInput } from 'lucide-react';
import Pagination from '../common/Pagination';
import DowntimeApprovalLog from './DowntimeApprovalLog';
import DowntimeApprovalModal from './DowntimeApprovalModal';
import DowntimeForm from './DowntimeForm';
import { valueStreams } from '../../data/mockData';

interface DowntimeItem {
  id: number;
  type: string;
  date: string;
  hours: number;
  reason: string;
  description: string;
  valueStream?: string;
  line?: string;
  area: string;
  status: string;
  selected: boolean;
  approvedBy: string | null;
  approvedAt: string | null;
}

interface DowntimeLog {
  id: number;
  type: string;
  date: string;
  hours: number;
  reason: string;
  description: string;
  valueStream: string;
  line: string;
  approvedBy: string;
  approvedAt: string;
  area: string;
}

interface DowntimesTabProps {
  data: DowntimeItem[];
  setData: React.Dispatch<React.SetStateAction<DowntimeItem[]>>;
  onSave: () => void;
  onImport: () => void;
  approvalLogs: DowntimeLog[];
  setApprovalLogs: React.Dispatch<React.SetStateAction<DowntimeLog[]>>;
  lastImportedFile: string | null;
}

const DowntimesTab: React.FC<DowntimesTabProps> = ({
  data,
  setData,
  onSave,
  onImport,
  approvalLogs,
  setApprovalLogs,
  lastImportedFile
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedValueStream, setSelectedValueStream] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [selectAllDowntimes, setSelectAllDowntimes] = useState<boolean>(false);
  const [showApprovalConfirm, setShowApprovalConfirm] = useState<boolean>(false);
  const [showApprovalLogs, setShowApprovalLogs] = useState<boolean>(false);
  const [showDowntimeForm, setShowDowntimeForm] = useState<boolean>(false);

  // Función para seleccionar/deseleccionar todos los downtimes
  const handleSelectAllDowntimes = (checked: boolean) => {
    setSelectAllDowntimes(checked);
    setData(prevData => 
      prevData.map(item => ({
        ...item,
        selected: checked
      }))
    );
  };

  // Función para seleccionar/deseleccionar un downtime específico
  const handleSelectDowntime = (id: number, checked: boolean) => {
    setData(prevData => 
      prevData.map(item => 
        item.id === id ? { ...item, selected: checked } : item
      )
    );
    
    // Verificar si todos están seleccionados para actualizar el estado del "select all"
    const allSelected = data.every(item => item.id === id ? checked : item.selected);
    setSelectAllDowntimes(allSelected);
  };

  // Función para aprobar los downtimes seleccionados
  const handleApproveDowntimes = () => {
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
        type: item.type,
        date: item.date,
        hours: item.hours,
        reason: item.reason,
        description: item.description,
        valueStream: item.valueStream || 'N/A',
        line: item.line || 'N/A',
        approvedBy: user,
        approvedAt: now.toISOString(),
        area: item.area
      }));
    
    // Actualizar los datos de downtime
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
    setSelectAllDowntimes(false);
    
    // Llamar a la función de guardar
    onSave();
  };

  // Función para manejar la creación de un nuevo downtime
  const handleAddDowntime = (downtime: Omit<DowntimeItem, 'id'>) => {
    const newDowntime = {
      ...downtime,
      id: Date.now(),
      selected: false
    };
    
    setData(prev => [newDowntime, ...prev]);
    setShowDowntimeForm(false);
    onSave();
  };

  // Filtrado de datos
  const filteredData = data.filter(item => {
    // Filtrar por término de búsqueda (razón o descripción)
    const matchesSearch = searchTerm === '' || 
      item.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filtrar por Value Stream (si aplica)
    const matchesValueStream = selectedValueStream === 'all' || 
      (item.valueStream && item.valueStream.toLowerCase() === selectedValueStream.toLowerCase());
    
    // Filtrar por tipo
    const matchesType = selectedType === 'all' || item.type === selectedType;
    
    return matchesSearch && matchesValueStream && matchesType;
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
          Downtimes - Paros Programados y Festivos
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
              placeholder="Buscar por motivo o descripción..."
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

          {/* Botón para aprobar los downtimes seleccionados */}
          <button
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none disabled:bg-gray-300 disabled:cursor-not-allowed"
            onClick={handleApproveDowntimes}
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

          {/* Botón para importar downtimes */}
          <button 
            className="flex items-center px-4 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 text-gray-700"
            onClick={onImport}
          >
            <Upload className="w-4 h-4 mr-2" /> Importar Downtimes
          </button>

          {/* Botón para registrar un nuevo downtime */}
          <button 
            className="flex items-center px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={() => setShowDowntimeForm(true)}
          >
            <FileInput className="w-4 h-4 mr-2" /> Registrar Downtime
          </button>
        </div>

        {/* Filtros avanzados (expandibles) */}
        {showFilters && (
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Filtros avanzados</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <select
                  value={selectedType}
                  onChange={(e) => {
                    setSelectedType(e.target.value);
                    setCurrentPage(1); // Reset to first page on filter change
                  }}
                  className="block w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Todos</option>
                  <option value="general">General</option>
                  <option value="valueStream">Value Stream</option>
                  <option value="line">Línea</option>
                </select>
              </div>

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
          <DowntimeApprovalLog 
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
                  checked={selectAllDowntimes}
                  onChange={(e) => handleSelectAllDowntimes(e.target.checked)}
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Horas</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Motivo</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aplicación</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Área</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.map((item: DowntimeItem) => (
              <tr key={item.id} className={`hover:bg-gray-50 ${item.selected ? 'bg-blue-50' : ''}`}>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={!!item.selected}
                    onChange={(e) => handleSelectDowntime(item.id, e.target.checked)}
                    disabled={item.status === 'approved'}
                  />
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.type === 'general' 
                      ? 'bg-blue-100 text-blue-800' 
                      : item.type === 'valueStream' 
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-green-100 text-green-800'
                  }`}>
                    {item.type === 'general' 
                      ? 'General' 
                      : item.type === 'valueStream' 
                        ? 'Value Stream' 
                        : 'Línea'
                    }
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.hours}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{item.reason}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.description}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.type === 'general' 
                    ? 'Toda la planta' 
                    : item.type === 'valueStream' 
                      ? item.valueStream 
                      : `${item.valueStream} / ${item.line}`
                  }
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.area}</td>
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
        <DowntimeApprovalModal
          selectedItems={data.filter(item => item.selected)}
          onConfirm={confirmApproval}
          onCancel={() => setShowApprovalConfirm(false)}
        />
      )}

      {/* Formulario de downtime */}
      {showDowntimeForm && (
        <DowntimeForm
          onSubmit={handleAddDowntime}
          onCancel={() => setShowDowntimeForm(false)}
        />
      )}
    </>
  );
};

export default DowntimesTab; 