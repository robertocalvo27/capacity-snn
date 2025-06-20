import React from 'react';
import { X, FileText, Calendar, User, CheckCircle, AlertCircle, Clock, Download } from 'lucide-react';
import type { ImportLog } from '@/types/capacity';
import { importLogService } from '@/services/importLogService';

interface ImportLogDetailModalProps {
  importLog: ImportLog;
  onClose: () => void;
}

const ImportLogDetailModal: React.FC<ImportLogDetailModalProps> = ({ importLog, onClose }) => {
  const getStatusColor = (status: ImportLog['status']) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-100';
      case 'error':
        return 'text-red-600 bg-red-100';
      case 'processing':
        return 'text-amber-600 bg-amber-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: ImportLog['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <AlertCircle className="w-5 h-5" />;
      case 'processing':
        return <Clock className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const getStatusText = (status: ImportLog['status']) => {
    switch (status) {
      case 'success':
        return 'Importación Exitosa';
      case 'error':
        return 'Error en Importación';
      case 'processing':
        return 'Procesando Importación';
      default:
        return 'Estado Desconocido';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-blue-600" />
            Detalle de Importación
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Estado de la importación */}
          <div className={`p-4 rounded-lg border ${
            importLog.status === 'success' ? 'border-green-200 bg-green-50' :
            importLog.status === 'error' ? 'border-red-200 bg-red-50' :
            'border-amber-200 bg-amber-50'
          }`}>
            <div className={`flex items-center ${getStatusColor(importLog.status)}`}>
              {getStatusIcon(importLog.status)}
              <div className="ml-3">
                <h4 className="font-medium">
                  {getStatusText(importLog.status)}
                </h4>
                <p className="text-sm mt-1">
                  {importLog.status === 'success' && 
                    `Se procesaron ${importLog.recordsProcessed.toLocaleString()} registros correctamente.`
                  }
                  {importLog.status === 'error' && importLog.errorMessage}
                  {importLog.status === 'processing' && 
                    'La importación está siendo procesada en el sistema.'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Información del archivo */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <span className="mr-2 text-lg">
                {importLogService.getFileTypeIcon(importLog.fileType)}
              </span>
              Información del Archivo
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Nombre del archivo</label>
                <p className="text-sm text-gray-900 font-mono bg-white px-2 py-1 rounded border">
                  {importLog.fileName}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500">Tipo de archivo</label>
                <p className="text-sm text-gray-900">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    importLog.fileType === 'buildplan' ? 'bg-blue-100 text-blue-800' :
                    importLog.fileType === 'headcount' ? 'bg-purple-100 text-purple-800' :
                    importLog.fileType === 'runrates' ? 'bg-green-100 text-green-800' :
                    importLog.fileType === 'yield' ? 'bg-yellow-100 text-yellow-800' :
                    importLog.fileType === 'downtimes' ? 'bg-red-100 text-red-800' :
                    'bg-indigo-100 text-indigo-800'
                  }`}>
                    {importLog.fileType}
                  </span>
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500">Tamaño del archivo</label>
                <p className="text-sm text-gray-900">
                  {importLogService.formatFileSize(importLog.fileSize)}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500">Registros procesados</label>
                <p className="text-sm text-gray-900 font-semibold">
                  {importLog.recordsProcessed.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Información de usuario y fecha */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-3 flex items-center">
              <User className="w-4 h-4 mr-2" />
              Información de la Subida
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-blue-700">Usuario que subió</label>
                <p className="text-sm text-blue-900 font-medium">
                  {importLog.uploadedBy}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-blue-700">Fecha y hora</label>
                <p className="text-sm text-blue-900 flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {importLog.uploadDate.toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })} a las {importLog.uploadDate.toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Mensaje de error detallado si existe */}
          {importLog.status === 'error' && importLog.errorMessage && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <h4 className="font-medium text-red-900 mb-2 flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                Detalle del Error
              </h4>
              <div className="bg-white p-3 rounded border border-red-200">
                <code className="text-sm text-red-800 whitespace-pre-wrap">
                  {importLog.errorMessage}
                </code>
              </div>
              
              <div className="mt-3 text-sm text-red-700">
                <p><strong>Recomendaciones:</strong></p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Verifica que el formato del archivo sea correcto</li>
                  <li>Asegúrate de que todas las columnas requeridas estén presentes</li>
                  <li>Revisa que no haya caracteres especiales en los datos</li>
                  <li>Confirma que el archivo no esté corrupto</li>
                </ul>
              </div>
            </div>
          )}

          {/* Información técnica */}
          <div className="border border-gray-200 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Información Técnica</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <label className="block font-medium text-gray-500">ID de Importación</label>
                <p className="text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded">
                  {importLog.id}
                </p>
              </div>
              
              {importLog.filePath && (
                <div>
                  <label className="block font-medium text-gray-500">Ruta del archivo</label>
                  <p className="text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded text-xs">
                    {importLog.filePath}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-500">
            ID: {importLog.id}
          </div>
          
          <div className="flex space-x-3">
            {importLog.status === 'success' && importLog.filePath && (
              <button
                onClick={() => {/* TODO: implementar descarga */}}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center text-sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Descargar Archivo
              </button>
            )}
            
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportLogDetailModal; 