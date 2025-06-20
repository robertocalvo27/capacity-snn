import React, { useState, useEffect } from 'react';
import { FileText, Download, Eye, Calendar, User, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import type { ImportLog } from '@/types/capacity';
import { importLogService } from '@/services/importLogService';
import ImportLogDetailModal from './ImportLogDetailModal';

const ImportHistoryTab: React.FC = () => {
  const [importLogs, setImportLogs] = useState<ImportLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<ImportLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<ImportLog | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  // Filtros
  const [filterType, setFilterType] = useState<ImportLog['fileType'] | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<ImportLog['status'] | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadImportLogs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [importLogs, filterType, filterStatus, searchTerm]);

  const loadImportLogs = async () => {
    try {
      setLoading(true);
      // Cargar mock data para desarrollo
      await importLogService.seedMockData();
      const logs = await importLogService.getAllImportLogs();
      setImportLogs(logs);
    } catch (error) {
      console.error('Error loading import logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...importLogs];

    // Filtrar por tipo
    if (filterType !== 'all') {
      filtered = filtered.filter(log => log.fileType === filterType);
    }

    // Filtrar por estado
    if (filterStatus !== 'all') {
      filtered = filtered.filter(log => log.status === filterStatus);
    }

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredLogs(filtered);
  };

  const handleViewDetails = (log: ImportLog) => {
    setSelectedLog(log);
    setShowDetailModal(true);
  };

  const getStatusIcon = (status: ImportLog['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'processing':
        return <Clock className="w-4 h-4 text-amber-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: ImportLog['status']) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    switch (status) {
      case 'success':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'error':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'processing':
        return `${baseClasses} bg-amber-100 text-amber-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getTypeBadge = (fileType: ImportLog['fileType']) => {
    const colors = {
      buildplan: 'bg-blue-100 text-blue-800',
      headcount: 'bg-purple-100 text-purple-800',
      runrates: 'bg-green-100 text-green-800',
      yield: 'bg-yellow-100 text-yellow-800',
      downtimes: 'bg-red-100 text-red-800',
      calendar: 'bg-indigo-100 text-indigo-800'
    };

    return `px-2 py-1 text-xs font-medium rounded-full ${colors[fileType]}`;
  };

  const getStats = () => {
    const total = importLogs.length;
    const successful = importLogs.filter(log => log.status === 'success').length;
    const failed = importLogs.filter(log => log.status === 'error').length;
    const processing = importLogs.filter(log => log.status === 'processing').length;

    return { total, successful, failed, processing };
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-600" />
              Historial de Importaciones
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Trazabilidad completa de todos los archivos importados al sistema
            </p>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm font-medium text-gray-500">Total Importaciones</div>
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="text-sm font-medium text-green-600">Exitosas</div>
            <div className="text-2xl font-bold text-green-700">{stats.successful}</div>
          </div>
          <div className="bg-red-50 p-3 rounded-lg">
            <div className="text-sm font-medium text-red-600">Con Error</div>
            <div className="text-2xl font-bold text-red-700">{stats.failed}</div>
          </div>
          <div className="bg-amber-50 p-3 rounded-lg">
            <div className="text-sm font-medium text-amber-600">Procesando</div>
            <div className="text-2xl font-bold text-amber-700">{stats.processing}</div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar
            </label>
            <input
              type="text"
              placeholder="Nombre de archivo o usuario..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Archivo
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as ImportLog['fileType'] | 'all')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todos los tipos</option>
              <option value="buildplan">Build Plan</option>
              <option value="headcount">Headcount</option>
              <option value="runrates">Run Rates</option>
              <option value="yield">Yield</option>
              <option value="downtimes">Downtimes</option>
              <option value="calendar">Calendar</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as ImportLog['status'] | 'all')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todos los estados</option>
              <option value="success">Exitoso</option>
              <option value="error">Error</option>
              <option value="processing">Procesando</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterType('all');
                setFilterStatus('all');
              }}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm"
            >
              Limpiar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Tabla de importaciones */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Archivo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registros
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="mr-2 text-lg">
                          {importLogService.getFileTypeIcon(log.fileType)}
                        </span>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {log.fileName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {importLogService.formatFileSize(log.fileSize)}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getTypeBadge(log.fileType)}>
                        {log.fileType}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{log.uploadedBy}</span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm text-gray-900">
                            {log.uploadDate.toLocaleDateString('es-ES')}
                          </div>
                          <div className="text-sm text-gray-500">
                            {log.uploadDate.toLocaleTimeString('es-ES', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {log.recordsProcessed.toLocaleString()}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(log.status)}
                        <span className={`ml-2 ${getStatusBadge(log.status)}`}>
                          {log.status === 'success' ? 'Exitoso' :
                           log.status === 'error' ? 'Error' : 'Procesando'}
                        </span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewDetails(log)}
                          className="text-blue-600 hover:text-blue-900 flex items-center"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Ver
                        </button>
                        
                        {log.status === 'success' && log.filePath && (
                          <button
                            onClick={() => {/* TODO: implementar descarga */}}
                            className="text-green-600 hover:text-green-900 flex items-center"
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Descargar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          
          {!loading && filteredLogs.length === 0 && (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No se encontraron importaciones
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || filterType !== 'all' || filterStatus !== 'all'
                  ? 'Intenta ajustar los filtros de búsqueda.'
                  : 'Las importaciones aparecerán aquí una vez que se suban archivos.'
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de detalle */}
      {showDetailModal && selectedLog && (
        <ImportLogDetailModal
          importLog={selectedLog}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedLog(null);
          }}
        />
      )}
    </div>
  );
};

export default ImportHistoryTab; 