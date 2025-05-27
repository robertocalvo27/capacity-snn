import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Upload, 
  Check, 
  AlertTriangle, 
  Save, 
  FileInput, 
  ClipboardList, 
  X, 
  File, 
  FileText,
  Loader2,
  CheckCircle2,
  Bell,
  Search,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Filter,
  Eye,
  Download
} from 'lucide-react';

// Estado de revisión de los inputs (mock - debería venir de una API en producción)
const inputReviewStatus = {
  buildPlan: { complete: true, date: '2024-01-15' },
  headcount: { complete: true, date: '2024-01-16' },
  runRates: { complete: false, date: null },
  yield: { complete: true, date: '2024-01-16' },
  downtimes: { complete: false, date: null }
};

// Mock de datos para cada tab
const tabData = {
  buildPlan: [
    { id: 1, catalog: 'R_126_329990', pn: '4391', description: 'BEATH PIN 2.4MM', quantity: 1250, month: 'Enero', week: '1', status: 'approved', valueStream: 'Roadster' },
    { id: 2, catalog: 'R_126_329991', pn: '4230', description: 'BEATH PIN 2.4MM', quantity: 980, month: 'Enero', week: '1', status: 'approved', valueStream: 'Sports Medicine' },
    { id: 3, catalog: 'R_126_329992', pn: '4403', description: 'BEATH PIN 2.4MM', quantity: 2450, month: 'Enero', week: '1', status: 'approved', valueStream: 'Wound' },
    { id: 4, catalog: 'R_126_329993', pn: '2503-S', description: 'BEATH PIN 2.4MM', quantity: 1120, month: 'Enero', week: '1', status: 'approved', valueStream: 'Roadster' },
    { id: 5, catalog: 'R_126_329994', pn: '4565D', description: 'BEATH PIN 2.4MM', quantity: 750, month: 'Enero', week: '1', status: 'approved', valueStream: 'Sports Medicine' },
  ],
  headcount: [
    { id: 1, line: 'FA', operators: 12, supervisors: 1, month: 'Enero', status: 'approved' },
    { id: 2, line: 'Next', operators: 15, supervisors: 1, month: 'Enero', status: 'approved' },
    { id: 3, line: 'CER3', operators: 10, supervisors: 1, month: 'Enero', status: 'approved' },
  ],
  runRates: [
    { id: 1, pn: '4391', line: 'FA', rate: 150, uom: 'pcs/hr', month: 'Enero', status: 'pending' },
    { id: 2, pn: '4230', line: 'Next', rate: 130, uom: 'pcs/hr', month: 'Enero', status: 'pending' },
    { id: 3, pn: '4403', line: 'CER3', rate: 200, uom: 'pcs/hr', month: 'Enero', status: 'pending' },
  ],
  yield: [
    { id: 1, catalog: 'R_126_329990', pn: '4391', description: 'BEATH PIN 2.4MM', oct2023: 98.2, nov2023: 98.4, dec2023: 98.5, yield: 98.5, month: 'Enero', status: 'pending', valueStream: 'Roadster', selected: false, approvedBy: null, approvedAt: null },
    { id: 2, catalog: 'R_126_329991', pn: '4230', description: 'BEATH PIN 2.4MM', oct2023: 97.1, nov2023: 97.0, dec2023: 97.2, yield: 97.2, month: 'Enero', status: 'pending', valueStream: 'Sports Medicine', selected: false, approvedBy: null, approvedAt: null },
    { id: 3, catalog: 'R_126_329992', pn: '4403', description: 'BEATH PIN 2.4MM', oct2023: 99.0, nov2023: 99.0, dec2023: 99.1, yield: 99.1, month: 'Enero', status: 'pending', valueStream: 'Wound', selected: false, approvedBy: null, approvedAt: null },
    { id: 4, catalog: 'R_126_329993', pn: '2503-S', description: 'BEATH PIN 2.4MM', oct2023: 98.7, nov2023: 98.9, dec2023: 99.0, yield: 99.0, month: 'Enero', status: 'pending', valueStream: 'Roadster', selected: false, approvedBy: null, approvedAt: null },
    { id: 5, catalog: 'R_126_329994', pn: '4565D', description: 'BEATH PIN 2.4MM', oct2023: 96.8, nov2023: 97.0, dec2023: 97.3, yield: 97.3, month: 'Enero', status: 'pending', valueStream: 'Sports Medicine', selected: false, approvedBy: null, approvedAt: null },
    { id: 6, catalog: 'R_126_329995', pn: '4725A', description: 'DRILL BIT 3.2MM', oct2023: 98.5, nov2023: 98.7, dec2023: 98.9, yield: 98.9, month: 'Enero', status: 'pending', valueStream: 'Roadster', selected: false, approvedBy: null, approvedAt: null },
    { id: 7, catalog: 'R_126_329996', pn: '4802B', description: 'SUTURE ANCHOR', oct2023: 97.5, nov2023: 97.8, dec2023: 98.0, yield: 98.0, month: 'Enero', status: 'pending', valueStream: 'Sports Medicine', selected: false, approvedBy: null, approvedAt: null },
    { id: 8, catalog: 'R_126_329997', pn: '4912C', description: 'CANNULA 6MM', oct2023: 99.2, nov2023: 99.3, dec2023: 99.3, yield: 99.3, month: 'Enero', status: 'pending', valueStream: 'Wound', selected: false, approvedBy: null, approvedAt: null },
    { id: 9, catalog: 'R_126_329998', pn: '5067D', description: 'INTERFERENCE SCREW', oct2023: 98.0, nov2023: 98.2, dec2023: 98.4, yield: 98.4, month: 'Enero', status: 'pending', valueStream: 'Roadster', selected: false, approvedBy: null, approvedAt: null },
    { id: 10, catalog: 'R_126_329999', pn: '5134E', description: 'GUIDEWIRE 2.0MM', oct2023: 97.2, nov2023: 97.5, dec2023: 97.8, yield: 97.8, month: 'Enero', status: 'pending', valueStream: 'Sports Medicine', selected: false, approvedBy: null, approvedAt: null },
    { id: 11, catalog: 'R_126_330000', pn: '5256F', description: 'FEMORAL NAIL', oct2023: 98.8, nov2023: 99.0, dec2023: 99.1, yield: 99.1, month: 'Enero', status: 'pending', valueStream: 'Wound', selected: false, approvedBy: null, approvedAt: null },
    { id: 12, catalog: 'R_126_330001', pn: '5378G', description: 'HUMERAL STEM', oct2023: 98.3, nov2023: 98.5, dec2023: 98.7, yield: 98.7, month: 'Enero', status: 'pending', valueStream: 'Roadster', selected: false, approvedBy: null, approvedAt: null },
    { id: 13, catalog: 'R_126_330002', pn: '5492H', description: 'ACETABULAR CUP', oct2023: 97.0, nov2023: 97.2, dec2023: 97.4, yield: 97.4, month: 'Enero', status: 'pending', valueStream: 'Sports Medicine', selected: false, approvedBy: null, approvedAt: null },
    { id: 14, catalog: 'R_126_330003', pn: '5587I', description: 'TIBIAL TRAY', oct2023: 99.3, nov2023: 99.2, dec2023: 99.2, yield: 99.2, month: 'Enero', status: 'pending', valueStream: 'Wound', selected: false, approvedBy: null, approvedAt: null },
    { id: 15, catalog: 'R_126_330004', pn: '5698J', description: 'FEMORAL COMPONENT', oct2023: 98.6, nov2023: 98.8, dec2023: 99.0, yield: 99.0, month: 'Enero', status: 'pending', valueStream: 'Roadster', selected: false, approvedBy: null, approvedAt: null },
    { id: 16, catalog: 'R_126_330005', pn: '5723K', description: 'PATELLAR BUTTON', oct2023: 97.8, nov2023: 98.0, dec2023: 98.2, yield: 98.2, month: 'Enero', status: 'pending', valueStream: 'Sports Medicine', selected: false, approvedBy: null, approvedAt: null },
    { id: 17, catalog: 'R_126_330006', pn: '5889L', description: 'POLYETHYLENE LINER', oct2023: 99.1, nov2023: 99.2, dec2023: 99.3, yield: 99.3, month: 'Enero', status: 'pending', valueStream: 'Wound', selected: false, approvedBy: null, approvedAt: null },
    { id: 18, catalog: 'R_126_330007', pn: '5942M', description: 'FEMORAL HEAD', oct2023: 98.4, nov2023: 98.6, dec2023: 98.8, yield: 98.8, month: 'Enero', status: 'pending', valueStream: 'Roadster', selected: false, approvedBy: null, approvedAt: null },
    { id: 19, catalog: 'R_126_330008', pn: '6073N', description: 'TIBIAL INSERT', oct2023: 97.3, nov2023: 97.5, dec2023: 97.7, yield: 97.7, month: 'Enero', status: 'pending', valueStream: 'Sports Medicine', selected: false, approvedBy: null, approvedAt: null },
    { id: 20, catalog: 'R_126_330009', pn: '6154O', description: 'GLENOID COMPONENT', oct2023: 99.4, nov2023: 99.4, dec2023: 99.5, yield: 99.5, month: 'Enero', status: 'pending', valueStream: 'Wound', selected: false, approvedBy: null, approvedAt: null },
    { id: 21, catalog: 'R_126_330010', pn: '6289P', description: 'HUMERAL HEAD', oct2023: 98.7, nov2023: 98.9, dec2023: 99.0, yield: 99.0, month: 'Enero', status: 'pending', valueStream: 'Roadster', selected: false, approvedBy: null, approvedAt: null },
    { id: 22, catalog: 'R_126_330011', pn: '6345Q', description: 'DISTAL RADIUS PLATE', oct2023: 97.6, nov2023: 97.8, dec2023: 98.0, yield: 98.0, month: 'Enero', status: 'pending', valueStream: 'Sports Medicine', selected: false, approvedBy: null, approvedAt: null },
    { id: 23, catalog: 'R_126_330012', pn: '6478R', description: 'INTRAMEDULLARY ROD', oct2023: 99.0, nov2023: 99.1, dec2023: 99.2, yield: 99.2, month: 'Enero', status: 'pending', valueStream: 'Wound', selected: false, approvedBy: null, approvedAt: null },
    { id: 24, catalog: 'R_126_330013', pn: '6592S', description: 'BONE SCREW 3.5MM', oct2023: 98.9, nov2023: 99.0, dec2023: 99.1, yield: 99.1, month: 'Enero', status: 'pending', valueStream: 'Roadster', selected: false, approvedBy: null, approvedAt: null },
    { id: 25, catalog: 'R_126_330014', pn: '6647T', description: 'LOCKING PLATE', oct2023: 97.9, nov2023: 98.1, dec2023: 98.3, yield: 98.3, month: 'Enero', status: 'pending', valueStream: 'Sports Medicine', selected: false, approvedBy: null, approvedAt: null },
  ],
  downtimes: [
    { id: 1, line: 'FA', date: '2024-01-01', hours: 8, reason: 'Holiday - Año Nuevo', status: 'pending' },
    { id: 2, line: 'Next', date: '2024-01-01', hours: 8, reason: 'Holiday - Año Nuevo', status: 'pending' },
    { id: 3, line: 'CER3', date: '2024-01-01', hours: 8, reason: 'Holiday - Año Nuevo', status: 'pending' },
    { id: 4, line: 'FA', date: '2024-01-15', hours: 4, reason: 'Mantenimiento Preventivo', status: 'pending' },
  ]
};

export default function InputReview() {
  const { cbpId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('buildPlan');
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [importStep, setImportStep] = useState<number>(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [lastImportedFile, setLastImportedFile] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const [importSuccess, setImportSuccess] = useState<boolean>(false);
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedValueStream, setSelectedValueStream] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Estados específicos para Yield
  const [yieldData, setYieldData] = useState<any[]>(tabData.yield);
  const [yieldSearchTerm, setYieldSearchTerm] = useState<string>('');
  const [yieldValueStream, setYieldValueStream] = useState<string>('all');
  const [yieldShowFilters, setYieldShowFilters] = useState<boolean>(false);
  const [yieldCurrentPage, setYieldCurrentPage] = useState<number>(1);
  const [yieldItemsPerPage, setYieldItemsPerPage] = useState<number>(10);
  const [selectAllYields, setSelectAllYields] = useState<boolean>(false);
  const [showApprovalConfirm, setShowApprovalConfirm] = useState<boolean>(false);
  const [approvalLogs, setApprovalLogs] = useState<any[]>([]);
  const [showApprovalLogs, setShowApprovalLogs] = useState<boolean>(false);
  
  // Estado para los datos del Build Plan
  const [buildPlanData, setBuildPlanData] = useState(tabData.buildPlan);

  // Efecto para actualizar los datos después de una importación exitosa
  useEffect(() => {
    if (importSuccess && previewData.length > 0) {
      // Preparamos los nuevos datos para el BuildPlan
      const newBuildPlanData = previewData.map((item, index) => ({
        id: buildPlanData.length + index + 1,
        catalog: item.catalog,
        pn: item.pn,
        description: item.description,
        quantity: item.bp,
        month: item.month,
        week: '1',
        status: 'approved',
        valueStream: item.valueStream || '-'
      }));
      
      // Actualizamos el estado con los nuevos datos
      setBuildPlanData([...buildPlanData, ...newBuildPlanData]);
      setImportSuccess(false);
    }
  }, [importSuccess, previewData]);

  // Función para manejar la importación del archivo
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
        setImportStep(2);
      }, 1000);
    }
  };

  const handleImportFile = () => {
    setImportStep(3);
    setIsImporting(true);

    // Simulamos un proceso de importación
    setTimeout(() => {
      setIsImporting(false);
      setImportSuccess(true);
      // Guardamos la referencia del archivo importado
      if (selectedFile) {
        setLastImportedFile(selectedFile.name);
      }

      // Actualizamos el estado después de importar
      // En una implementación real, haríamos un API call para guardar los datos
      setTimeout(() => {
        setIsImportModalOpen(false);
        setImportStep(1);
        setSelectedFile(null);
        setShowNotification(true);
        
        // Ocultar la notificación después de 5 segundos
        setTimeout(() => {
          setShowNotification(false);
        }, 5000);
      }, 2000);
    }, 3000);
  };

  const resetImportModal = () => {
    setIsImportModalOpen(false);
    setImportStep(1);
    setSelectedFile(null);
    setPreviewData([]);
    setImportSuccess(false);
  };

  // Mock data for valueStreams
  const valueStreams = [
    { id: 'roadster', name: 'Roadster' },
    { id: 'sports-medicine', name: 'Sports Medicine' },
    { id: 'wound', name: 'Wound' }
  ];

  // Filtrado de datos para Build Plan
  const filteredBuildPlanData = buildPlanData
    .filter(item => {
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
  const totalPages = Math.ceil(filteredBuildPlanData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBuildPlanData.slice(indexOfFirstItem, indexOfLastItem);

  // Funciones para la pestaña de Yield
  
  // Función para seleccionar/deseleccionar todos los items de yield
  const handleSelectAllYields = (checked: boolean) => {
    setSelectAllYields(checked);
    setYieldData(prevData => 
      prevData.map(item => ({
        ...item,
        selected: checked
      }))
    );
  };

  // Función para seleccionar/deseleccionar un item específico
  const handleSelectYield = (id: number, checked: boolean) => {
    setYieldData(prevData => 
      prevData.map(item => 
        item.id === id ? { ...item, selected: checked } : item
      )
    );
    
    // Verificar si todos están seleccionados para actualizar el estado del "select all"
    const allSelected = yieldData.every(item => item.id === id ? checked : item.selected);
    setSelectAllYields(allSelected);
  };

  // Función para modificar el valor de yield de un producto
  const handleYieldChange = (id: number, value: number) => {
    setYieldData(prevData => 
      prevData.map(item => 
        item.id === id ? { ...item, yield: value } : item
      )
    );
  };

  // Función para aprobar los yields seleccionados
  const handleApproveYields = () => {
    const selectedItems = yieldData.filter(item => item.selected);
    if (selectedItems.length === 0) return;
    
    setShowApprovalConfirm(true);
  };

  // Función para confirmar la aprobación
  const confirmApproval = () => {
    const now = new Date();
    const user = "Juan Pérez"; // En un caso real, vendría del contexto de autenticación
    
    // Crear registros de aprobación
    const newLogs = yieldData
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
    setYieldData(prevData => 
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
    
    // Mostrar notificación de éxito
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 5000);
  };

  // Filtrado de datos para Yield
  const filteredYieldData = yieldData
    .filter(item => {
      // Filtrar por término de búsqueda (PN, descripción o catálogo)
      const matchesSearch = yieldSearchTerm === '' || 
        item.pn.toLowerCase().includes(yieldSearchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(yieldSearchTerm.toLowerCase()) ||
        item.catalog.toLowerCase().includes(yieldSearchTerm.toLowerCase());
      
      // Filtrar por Value Stream
      const matchesValueStream = yieldValueStream === 'all' || 
        (item.valueStream && item.valueStream.toLowerCase() === yieldValueStream.toLowerCase());
      
      return matchesSearch && matchesValueStream;
    });

  // Paginación para Yield
  const yieldTotalPages = Math.ceil(filteredYieldData.length / yieldItemsPerPage);
  const yieldIndexOfLastItem = yieldCurrentPage * yieldItemsPerPage;
  const yieldIndexOfFirstItem = yieldIndexOfLastItem - yieldItemsPerPage;
  const yieldCurrentItems = filteredYieldData.slice(yieldIndexOfFirstItem, yieldIndexOfLastItem);

  return (
    <div className="space-y-6 p-8">
      {/* Header mejorado al estilo de MonthDetail.tsx */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <ClipboardList className="w-7 h-7 text-blue-600 mr-2" />
              Input Review - CBP {cbpId}
            </h1>
            <p className="text-gray-500">Revisión y gestión de los inputs necesarios para el modelo de capacidad</p>
          </div>
          <button 
            className="p-2 rounded-lg hover:bg-gray-100 flex items-center text-gray-600"
            onClick={() => navigate(`/capacities/${cbpId}`)}
          >
            <ArrowLeft className="w-5 h-5 mr-1" /> Volver
          </button>
        </div>
      </div>

      {/* Progreso general */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-medium mb-2 text-gray-900">Progreso General</h3>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${Object.values(inputReviewStatus).filter(item => item.complete).length / Object.values(inputReviewStatus).length * 100}%` }}
          ></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {Object.entries(inputReviewStatus).map(([key, value]) => (
            <div 
              key={key}
              className={`text-center p-3 rounded-lg border ${value.complete ? 'border-green-200 bg-green-50 text-green-700' : 'border-gray-200 bg-gray-50 text-gray-700'}`}
            >
              <div className="text-sm font-medium">{key.charAt(0).toUpperCase() + key.slice(1)}</div>
              <div className="text-xs">{value.complete ? 'Completado' : 'Pendiente'}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs de navegación */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px overflow-x-auto">
            <button
              className={`py-4 px-6 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'buildPlan' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('buildPlan')}
            >
              Build Plan
              {inputReviewStatus.buildPlan.complete && <Check className="inline-block w-4 h-4 ml-1 text-green-500" />}
            </button>
            <button
              className={`py-4 px-6 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'headcount' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('headcount')}
            >
              Headcount
              {inputReviewStatus.headcount.complete && <Check className="inline-block w-4 h-4 ml-1 text-green-500" />}
            </button>
            <button
              className={`py-4 px-6 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'runRates' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('runRates')}
            >
              Run Rates
              {!inputReviewStatus.runRates.complete && <AlertTriangle className="inline-block w-4 h-4 ml-1 text-amber-500" />}
              {inputReviewStatus.runRates.complete && <Check className="inline-block w-4 h-4 ml-1 text-green-500" />}
            </button>
            <button
              className={`py-4 px-6 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'yield' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('yield')}
            >
              Yield
              {inputReviewStatus.yield.complete && <Check className="inline-block w-4 h-4 ml-1 text-green-500" />}
            </button>
            <button
              className={`py-4 px-6 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'downtimes' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('downtimes')}
            >
              Downtimes
              {!inputReviewStatus.downtimes.complete && <AlertTriangle className="inline-block w-4 h-4 ml-1 text-amber-500" />}
              {inputReviewStatus.downtimes.complete && <Check className="inline-block w-4 h-4 ml-1 text-green-500" />}
            </button>
          </nav>
        </div>

        {/* Contenido de las tabs */}
        <div className="p-6 bg-white">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              {activeTab === 'buildPlan' && 'Build Plan - Demanda por Producto'}
              {activeTab === 'headcount' && 'Headcount - Personal por Línea'}
              {activeTab === 'runRates' && 'Run Rates - Velocidad de Producción'}
              {activeTab === 'yield' && 'Yield - Rendimiento por Producto'}
              {activeTab === 'downtimes' && 'Downtimes - Paros Programados y Festivos'}
            </h3>
            <div className="flex space-x-3">
              {activeTab === 'buildPlan' ? (
                <button 
                  className="flex items-center px-4 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 text-gray-700"
                  onClick={() => setIsImportModalOpen(true)}
                >
                  <Upload className="w-4 h-4 mr-2" /> Importar Build Plan
                </button>
              ) : (
                <button className="flex items-center px-4 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 text-gray-700">
                  <Upload className="w-4 h-4 mr-2" /> Importar
                </button>
              )}
              <button className="flex items-center px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Save className="w-4 h-4 mr-2" /> Guardar
              </button>
            </div>
          </div>

          {/* Referencia al archivo importado y controles de búsqueda/filtro para Build Plan */}
          {activeTab === 'buildPlan' && (
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
                    {/* Aquí puedes añadir más filtros según necesites */}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Controles de búsqueda/filtro y aprobación para Yield */}
          {activeTab === 'yield' && (
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
                    value={yieldSearchTerm}
                    onChange={(e) => {
                      setYieldSearchTerm(e.target.value);
                      setYieldCurrentPage(1); // Reset to first page on search
                    }}
                  />
                </div>

                {/* Botón para mostrar/ocultar filtros avanzados */}
                <button
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                  onClick={() => setYieldShowFilters(!yieldShowFilters)}
                >
                  <Filter className="mr-2 h-5 w-5 text-gray-400" />
                  Filtros avanzados
                </button>

                {/* Items por página */}
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-2">Mostrar:</span>
                  <select
                    value={yieldItemsPerPage}
                    onChange={(e) => {
                      setYieldItemsPerPage(Number(e.target.value));
                      setYieldCurrentPage(1); // Reset to first page when changing items per page
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
                  disabled={!yieldData.some(item => item.selected)}
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
              {yieldShowFilters && (
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Filtros avanzados</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Value Stream</label>
                      <select
                        value={yieldValueStream}
                        onChange={(e) => {
                          setYieldValueStream(e.target.value);
                          setYieldCurrentPage(1); // Reset to first page on filter change
                        }}
                        className="block w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="all">Todos</option>
                        {valueStreams.map(vs => (
                          <option key={vs.id} value={vs.id}>{vs.name}</option>
                        ))}
                      </select>
                    </div>
                    {/* Aquí puedes añadir más filtros según necesites */}
                  </div>
                </div>
              )}

              {/* Log de aprobaciones (expandible) */}
              {showApprovalLogs && (
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-medium text-gray-700">Historial de aprobaciones</h4>
                    <button 
                      className="text-gray-400 hover:text-gray-500"
                      onClick={() => setShowApprovalLogs(false)}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {approvalLogs.length === 0 ? (
                    <p className="text-sm text-gray-500">No hay registros de aprobación.</p>
                  ) : (
                    <div className="overflow-x-auto border rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PN</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Yield</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aprobado por</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {approvalLogs.map(log => (
                            <tr key={log.id} className="hover:bg-gray-50">
                              <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{log.pn}</td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{log.description}</td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{log.yieldValue}%</td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{log.approvedBy}</td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                {new Date(log.approvedAt).toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Tabla dinámica según la tab activa */}
          <div className="overflow-x-auto border rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {activeTab === 'buildPlan' && (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catalog</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PN</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mes</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value Stream</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    </>
                  )}
                  {activeTab === 'headcount' && (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Línea</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Operadores</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supervisores</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mes</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    </>
                  )}
                  {activeTab === 'runRates' && (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PN</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Línea</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UOM</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mes</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    </>
                  )}
                  {activeTab === 'yield' && (
                    <>
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
                    </>
                  )}
                  {activeTab === 'downtimes' && (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Línea</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Horas</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Motivo</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {activeTab === 'buildPlan' 
                  ? currentItems.map((item: any) => (
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
                    ))
                  : activeTab === 'yield'
                    ? yieldCurrentItems.map((item: any) => (
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
                      ))
                    : tabData[activeTab as keyof typeof tabData].map((item: any) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          {activeTab === 'headcount' && (
                            <>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.line}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.operators}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.supervisors}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.month}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  item.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                                }`}>
                                  {item.status === 'approved' ? 'Aprobado' : 'Pendiente'}
                                </span>
                              </td>
                            </>
                          )}
                          {activeTab === 'runRates' && (
                            <>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.pn}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.line}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.rate}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.uom}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.month}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  item.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                                }`}>
                                  {item.status === 'approved' ? 'Aprobado' : 'Pendiente'}
                                </span>
                              </td>
                            </>
                          )}
                          {activeTab === 'downtimes' && (
                            <>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.line}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.hours}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.reason}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  item.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                                }`}>
                                  {item.status === 'approved' ? 'Aprobado' : 'Pendiente'}
                                </span>
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
              </tbody>
            </table>
          </div>

          {/* Paginación para Build Plan */}
          {activeTab === 'buildPlan' && totalPages > 0 && (
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
              <div className="flex flex-1 justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium ${
                    currentPage === 1
                      ? 'border-gray-300 bg-white text-gray-300 cursor-not-allowed'
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Anterior
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`relative ml-3 inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium ${
                    currentPage === totalPages
                      ? 'border-gray-300 bg-white text-gray-300 cursor-not-allowed'
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Siguiente
                </button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Mostrando <span className="font-medium">{indexOfFirstItem + 1}</span> a{' '}
                    <span className="font-medium">
                      {Math.min(indexOfLastItem, filteredBuildPlanData.length)}
                    </span>{' '}
                    de <span className="font-medium">{filteredBuildPlanData.length}</span> resultados
                  </p>
                </div>
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center rounded-l-md px-2 py-2 ${
                        currentPage === 1
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <span className="sr-only">Anterior</span>
                      <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                    </button>
                    
                    {/* Páginas numeradas */}
                    {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                      // Mostrar páginas alrededor de la página actual
                      let pageNum = 0;
                      if (totalPages <= 5) {
                        // Si hay 5 o menos páginas, mostrar todas
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        // Si estamos en las primeras páginas
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        // Si estamos en las últimas páginas
                        pageNum = totalPages - 4 + i;
                      } else {
                        // Estamos en el medio, mostrar la página actual en el centro
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                            currentPage === pageNum
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-900 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className={`relative inline-flex items-center rounded-r-md px-2 py-2 ${
                        currentPage === totalPages
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <span className="sr-only">Siguiente</span>
                      <ChevronRight className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}

          {/* Paginación para Yield */}
          {activeTab === 'yield' && yieldTotalPages > 0 && (
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
              <div className="flex flex-1 justify-between sm:hidden">
                <button
                  onClick={() => setYieldCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={yieldCurrentPage === 1}
                  className={`relative inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium ${
                    yieldCurrentPage === 1
                      ? 'border-gray-300 bg-white text-gray-300 cursor-not-allowed'
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Anterior
                </button>
                <button
                  onClick={() => setYieldCurrentPage(prev => Math.min(prev + 1, yieldTotalPages))}
                  disabled={yieldCurrentPage === yieldTotalPages}
                  className={`relative ml-3 inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium ${
                    yieldCurrentPage === yieldTotalPages
                      ? 'border-gray-300 bg-white text-gray-300 cursor-not-allowed'
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Siguiente
                </button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Mostrando <span className="font-medium">{yieldIndexOfFirstItem + 1}</span> a{' '}
                    <span className="font-medium">
                      {Math.min(yieldIndexOfLastItem, filteredYieldData.length)}
                    </span>{' '}
                    de <span className="font-medium">{filteredYieldData.length}</span> resultados
                  </p>
                </div>
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    <button
                      onClick={() => setYieldCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={yieldCurrentPage === 1}
                      className={`relative inline-flex items-center rounded-l-md px-2 py-2 ${
                        yieldCurrentPage === 1
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <span className="sr-only">Anterior</span>
                      <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                    </button>
                    
                    {/* Páginas numeradas */}
                    {Array.from({ length: Math.min(5, yieldTotalPages) }).map((_, i) => {
                      // Mostrar páginas alrededor de la página actual
                      let pageNum = 0;
                      if (yieldTotalPages <= 5) {
                        // Si hay 5 o menos páginas, mostrar todas
                        pageNum = i + 1;
                      } else if (yieldCurrentPage <= 3) {
                        // Si estamos en las primeras páginas
                        pageNum = i + 1;
                      } else if (yieldCurrentPage >= yieldTotalPages - 2) {
                        // Si estamos en las últimas páginas
                        pageNum = yieldTotalPages - 4 + i;
                      } else {
                        // Estamos en el medio, mostrar la página actual en el centro
                        pageNum = yieldCurrentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setYieldCurrentPage(pageNum)}
                          className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                            yieldCurrentPage === pageNum
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-900 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => setYieldCurrentPage(prev => Math.min(prev + 1, yieldTotalPages))}
                      disabled={yieldCurrentPage === yieldTotalPages}
                      className={`relative inline-flex items-center rounded-r-md px-2 py-2 ${
                        yieldCurrentPage === yieldTotalPages
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <span className="sr-only">Siguiente</span>
                      <ChevronRight className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Build Plan Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center border-b border-gray-200 p-4">
              <h3 className="text-lg font-medium text-gray-900">
                {importStep === 1 && 'Importar Build Plan'}
                {importStep === 2 && 'Previsualización de datos'}
                {importStep === 3 && (isImporting ? 'Importando datos...' : 'Importación completada')}
              </h3>
              <button 
                onClick={resetImportModal}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              {/* Step 1: File Upload */}
              {importStep === 1 && (
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
                      <File className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500"
                        >
                          <span>Seleccionar archivo</span>
                          <input
                            ref={fileInputRef}
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            accept=".xlsx,.xls"
                            onChange={handleFileChange}
                          />
                        </label>
                        <p className="pl-1">o arrastra y suelta</p>
                      </div>
                      <p className="text-xs text-gray-500">XLSX o XLS hasta 10MB</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Step 2: Data Preview */}
              {importStep === 2 && (
                <div>
                  <div className="mb-4">
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 text-blue-600 mr-2" />
                      <span className="text-sm font-medium">{selectedFile?.name}</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Revisa los datos antes de importar. Se importarán {previewData.length} registros.
                    </p>
                  </div>
                  
                  <div className="mt-4 border rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Catalog</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">PN</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descripción</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">BP</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mes</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {previewData.map((item, index) => (
                          <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-4 py-2 text-sm text-gray-500">{item.catalog}</td>
                            <td className="px-4 py-2 text-sm font-medium text-gray-900">{item.pn}</td>
                            <td className="px-4 py-2 text-sm text-gray-500">{item.description}</td>
                            <td className="px-4 py-2 text-sm text-gray-500">{item.bp}</td>
                            <td className="px-4 py-2 text-sm text-gray-500">{item.month}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              
              {/* Step 3: Importing/Completed */}
              {importStep === 3 && (
                <div className="text-center py-8">
                  {isImporting ? (
                    <>
                      <Loader2 className="w-12 h-12 text-blue-600 mx-auto animate-spin" />
                      <h3 className="mt-4 text-lg font-medium text-gray-900">Importando datos</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Por favor espera mientras procesamos tu archivo...
                      </p>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto" />
                      <h3 className="mt-4 text-lg font-medium text-gray-900">Importación exitosa</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Se han importado {previewData.length} registros correctamente.
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-3 border-t border-gray-200 px-4 py-3 bg-gray-50">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                onClick={resetImportModal}
              >
                Cancelar
              </button>
              
              {importStep === 2 && (
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                  onClick={handleImportFile}
                >
                  Importar datos
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de aprobación */}
      {showApprovalConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirmar aprobación</h3>
            <p className="text-sm text-gray-500 mb-4">
              Estás a punto de aprobar el yield para {yieldData.filter(item => item.selected).length} productos. Esta acción quedará registrada y no puede deshacerse.
            </p>

            <div className="mb-4 max-h-48 overflow-y-auto border rounded-md p-2">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PN</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Yield (%)</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {yieldData.filter(item => item.selected).map(item => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900">{item.pn}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">{item.description}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-right text-gray-500">{item.yield}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                onClick={() => setShowApprovalConfirm(false)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700"
                onClick={confirmApproval}
              >
                Confirmar aprobación
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Alert */}
      {showNotification && (
        <div className="fixed bottom-4 right-4 bg-green-50 border border-green-200 rounded-lg shadow-lg p-4 w-80 z-50 transition-all duration-300 ease-in-out transform translate-x-0 opacity-100">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Operación exitosa</h3>
              <div className="mt-1 text-xs text-green-700">
                {activeTab === 'buildPlan' 
                  ? `Se ha importado correctamente el Build Plan para el CBP ${cbpId}.`
                  : activeTab === 'yield'
                    ? `Se han aprobado correctamente los yields seleccionados.`
                    : 'Operación completada con éxito.'}
              </div>
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  onClick={() => setShowNotification(false)}
                  className="inline-flex rounded-md p-1.5 text-green-500 hover:bg-green-100 focus:outline-none"
                >
                  <span className="sr-only">Dismiss</span>
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 