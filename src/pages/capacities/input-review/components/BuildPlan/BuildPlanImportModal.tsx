import React, { useState, useRef } from 'react';
import { X, FileText, Loader2, CheckCircle2 } from 'lucide-react';

interface BuildPlanImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (file: File, previewData: any[]) => void;
}

const BuildPlanImportModal: React.FC<BuildPlanImportModalProps> = ({
  isOpen,
  onClose,
  onImport
}) => {
  const [step, setStep] = useState<number>(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const [importSuccess, setImportSuccess] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Simulamos parsear el archivo Excel
      // En una implementación real, utilizaríamos una biblioteca como xlsx o similar
      setTimeout(() => {
        const mockPreviewData = [
          { catalog: 'R_126_329990', pn: '4391', description: 'BEATH PIN 2.4MM', bp: 1250, month: 'Enero', valueStream: 'Roadster' },
          { catalog: 'R_126_329991', pn: '4230', description: 'BEATH PIN 2.4MM', bp: 980, month: 'Enero', valueStream: 'Sports Medicine' },
          { catalog: 'R_126_329992', pn: '4403', description: 'BEATH PIN 2.4MM', bp: 2450, month: 'Enero', valueStream: 'Wound' },
          { catalog: 'R_126_329993', pn: '2503-S', description: 'BEATH PIN 2.4MM', bp: 1120, month: 'Enero', valueStream: 'Roadster' },
          { catalog: 'R_126_329994', pn: '4565D', description: 'BEATH PIN 2.4MM', bp: 750, month: 'Enero', valueStream: 'Sports Medicine' },
        ];
        setPreviewData(mockPreviewData);
        setStep(2);
      }, 1000);
    }
  };

  const handleImport = () => {
    setStep(3);
    setIsImporting(true);

    // Simulamos un proceso de importación
    setTimeout(() => {
      setIsImporting(false);
      setImportSuccess(true);

      // Pasamos los datos procesados al componente padre
      if (selectedFile) {
        onImport(selectedFile, previewData);
      }

      // Cerramos el modal después de un tiempo
      setTimeout(() => {
        resetModal();
      }, 2000);
    }, 3000);
  };

  const resetModal = () => {
    onClose();
    setStep(1);
    setSelectedFile(null);
    setPreviewData([]);
    setImportSuccess(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center border-b border-gray-200 p-4">
          <h3 className="text-lg font-medium text-gray-900">
            {step === 1 && 'Importar Build Plan'}
            {step === 2 && 'Previsualización de datos'}
            {step === 3 && (isImporting ? 'Importando datos...' : 'Importación completada')}
          </h3>
          <button 
            onClick={resetModal}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          {/* Step 1: File Upload */}
          {step === 1 && (
            <div className="text-center">
              <div className="mb-6">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Selecciona un archivo</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Selecciona el archivo Excel con los datos del Build Plan
                </p>
              </div>
              
              <div 
                className="mt-4 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-blue-500"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="space-y-1 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500"
                    >
                      <span>Seleccionar archivo</span>
                      <input 
                        id="file-upload" 
                        name="file-upload" 
                        type="file" 
                        className="sr-only"
                        ref={fileInputRef}
                        accept=".xlsx,.xls,.csv"
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="pl-1">o arrastra y suelta</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    Excel (.xlsx, .xls) o CSV
                  </p>
                </div>
              </div>
              
              {selectedFile && (
                <div className="mt-4 text-sm text-gray-600">
                  Archivo seleccionado: <span className="font-medium">{selectedFile.name}</span>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Preview Data */}
          {step === 2 && (
            <div>
              <p className="mb-4 text-sm text-gray-600">
                Revisa los datos antes de importar. Se importarán los siguientes registros:
              </p>
              
              <div className="overflow-x-auto border rounded-md mb-4">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catalog</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PN</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BP</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mes</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value Stream</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {previewData.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.catalog}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.pn}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.description}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.bp}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.month}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.valueStream || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none"
                >
                  Volver
                </button>
                <button
                  onClick={handleImport}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none"
                >
                  Importar
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Importing / Success */}
          {step === 3 && (
            <div className="text-center py-6">
              {isImporting ? (
                <div>
                  <Loader2 className="h-12 w-12 mx-auto animate-spin text-blue-600" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Importando datos...</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Por favor espera mientras procesamos el archivo.
                  </p>
                </div>
              ) : (
                <div>
                  <CheckCircle2 className="h-12 w-12 mx-auto text-green-600" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">¡Importación completada!</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Los datos han sido importados correctamente.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuildPlanImportModal; 