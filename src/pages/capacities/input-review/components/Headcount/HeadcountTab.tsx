import React, { useState } from 'react';
import { Search, Filter, Upload, Save, FileInput, Check, ChevronDown, ChevronRight, Edit, Info } from 'lucide-react';
import Pagination from '../common/Pagination';
import HeadcountApprovalLog from './HeadcountApprovalLog';
import HeadcountApprovalModal from './HeadcountApprovalModal';
import HeadcountForm from './HeadcountForm';
import { valueStreams, headcountData, headcountPositions, shifts } from '../../data/mockData';

// Interfaces para los datos de headcount
interface HeadcountPosition {
  [key: string]: number;
}

interface HeadcountShift {
  id: number;
  name: string;
  positions: HeadcountPosition;
  total: number;
}

interface HeadcountLine {
  id: number;
  name: string;
  expanded: boolean;
  shifts: HeadcountShift[];
  total: number;
}

interface HeadcountValueStream {
  id: string;
  name: string;
  expanded: boolean;
  lines: HeadcountLine[];
  shifts: HeadcountShift[];
  total: number;
}

// Propiedades para el historial de aprobaciones
interface HeadcountLog {
  id: number;
  valueStream: string;
  line: string;
  operators: number;
  supervisors: number;
  month: string;
  approvedBy: string;
  approvedAt: string;
}

// Propiedades para el componente
interface HeadcountTabProps {
  onSave: () => void;
}

const HeadcountTab: React.FC<HeadcountTabProps> = ({ onSave }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedValueStream, setSelectedValueStream] = useState<string>('all');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [selectAllHeadcounts, setSelectAllHeadcounts] = useState<boolean>(false);
  const [showApprovalConfirm, setShowApprovalConfirm] = useState<boolean>(false);
  const [showApprovalLogs, setShowApprovalLogs] = useState<boolean>(false);
  const [showHeadcountForm, setShowHeadcountForm] = useState<boolean>(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedVST, setSelectedVST] = useState<string | null>(null);
  const [filterValueStream, setFilterValueStream] = useState<string>('');
  const [showPositionDetails, setShowPositionDetails] = useState<Record<string, boolean>>({});
  const [activeDetailLevel, setActiveDetailLevel] = useState<'shift' | 'position'>('shift');
  const [data, setData] = useState<HeadcountValueStream[]>(headcountData);

  // Datos mock para el historial de aprobaciones
  const approvalLogs: HeadcountLog[] = [
    {
      id: 1,
      valueStream: 'ENT',
      line: 'Línea 6',
      operators: 42,
      supervisors: 2,
      month: 'Enero 2024',
      approvedBy: 'Juan Pérez',
      approvedAt: '2024-01-16 10:30'
    },
    {
      id: 2,
      valueStream: 'ENT',
      line: 'Línea 7',
      operators: 41,
      supervisors: 2,
      month: 'Enero 2024',
      approvedBy: 'Juan Pérez',
      approvedAt: '2024-01-16 10:35'
    }
  ];

  // Función para seleccionar/deseleccionar todos los headcounts
  const handleSelectAllHeadcounts = (checked: boolean) => {
    setSelectAllHeadcounts(checked);
    setData(prevData => 
      prevData.map(item => ({
        ...item,
        expanded: checked
      }))
    );
  };

  // Función para seleccionar/deseleccionar un headcount específico
  const handleSelectHeadcount = (id: string, checked: boolean) => {
    setData(prevData => 
      prevData.map(item => 
        item.id === id ? { ...item, expanded: checked } : item
      )
    );
    
    // Verificar si todos están seleccionados para actualizar el estado del "select all"
    const allSelected = data.every(item => item.id === id ? checked : item.expanded);
    setSelectAllHeadcounts(allSelected);
  };

  // Función para aprobar los headcounts seleccionados
  const handleApproveHeadcounts = () => {
    const selectedItems = data.filter(item => item.expanded);
    if (selectedItems.length === 0) return;
    
    setShowApprovalConfirm(true);
  };

  // Función para confirmar la aprobación
  const confirmApproval = () => {
    const now = new Date();
    const user = "Juan Pérez"; // En un caso real, vendría del contexto de autenticación
    
    // Crear registros de aprobación
    const newLogs = data
      .filter(item => item.expanded)
      .map(item => ({
        id: Date.now() + item.id.charCodeAt(0),
        valueStream: item.id,
        line: item.name,
        operators: item.shifts.reduce((sum, shift) => sum + shift.total, 0),
        supervisors: 0, // Assuming no supervisors for this example
        month: item.shifts[0].name, // Assuming the first shift's name as the month
        approvedBy: user,
        approvedAt: now.toISOString()
      }));
    
    // Actualizar los datos de headcount
    setData(prevData => 
      prevData.map(item => 
        item.expanded ? { 
          ...item, 
          expanded: false
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
  const handleAddHeadcount = (headcount: Omit<HeadcountValueStream, 'id' | 'expanded'>) => {
    const newHeadcount = {
      ...headcount,
      id: Date.now().toString(),
      expanded: false
    };
    
    setData(prev => [newHeadcount, ...prev]);
    setShowHeadcountForm(false);
    onSave();
  };

  // Filtrado de datos
  const filteredData = data.filter(item => {
    // Filtrar por término de búsqueda (línea)
    const matchesSearch = searchTerm === '' || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtrar por Value Stream (si aplica)
    const matchesValueStream = selectedValueStream === 'all' || 
      (item.id && item.id.toLowerCase() === selectedValueStream.toLowerCase());
    
    return matchesSearch && matchesValueStream;
  });

  // Paginación
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // Función para alternar la expansión de un value stream
  const toggleExpand = (id: string) => {
    setData(data.map(item => 
      item.id === id ? { ...item, expanded: !item.expanded } : item
    ));
  };

  // Función para alternar la expansión de una línea
  const toggleExpandLine = (vstId: string, lineId: number) => {
    setData(data.map(vst => {
      if (vst.id === vstId) {
        const updatedLines = vst.lines.map(line => 
          line.id === lineId ? { ...line, expanded: !line.expanded } : line
        );
        return { ...vst, lines: updatedLines };
      }
      return vst;
    }));
  };

  // Función para alternar la visualización de detalles de posición
  const togglePositionDetails = (id: string) => {
    setShowPositionDetails({
      ...showPositionDetails,
      [id]: !showPositionDetails[id]
    });
  };

  // Filtrar los datos según el valor stream seleccionado
  const filteredDataStream = filterValueStream 
    ? data.filter(vst => vst.id === filterValueStream)
    : data;

  // Función para calcular el estilo de la fila según el nivel
  const getRowStyle = (level: number) => {
    const baseClasses = "hover:bg-gray-50 border-b";
    
    switch(level) {
      case 0: // Value stream
        return `${baseClasses} font-semibold bg-gray-100`;
      case 1: // Línea
        return `${baseClasses} pl-6`;
      case 2: // Detalle de turno/posición
        return `${baseClasses} pl-12 text-sm`;
      default:
        return baseClasses;
    }
  };

  // Calcular totales
  const totalOperators = data.reduce((sum, vst) => sum + vst.shifts.reduce((sum, shift) => sum + shift.total, 0), 0);
  
  // Manejar aprobación de datos
  const handleApprove = () => {
    setShowApprovalModal(true);
    setSelectedVST('ent');
  };

  const handleApprovalConfirm = () => {
    setShowApprovalModal(false);
    onSave();
  };

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
            disabled={!data.some(item => item.expanded)}
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
            {currentItems.map((item: HeadcountValueStream) => (
              <tr key={item.id} className={`hover:bg-gray-50 ${item.expanded ? 'bg-blue-50' : ''}`}>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={!!item.expanded}
                    onChange={(e) => handleSelectHeadcount(item.id, e.target.checked)}
                  />
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.id}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-center text-gray-900">{item.shifts.reduce((sum, shift) => sum + shift.total, 0)}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-center text-gray-900">0</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.shifts[0].name}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.expanded ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {item.expanded ? 'Aprobado' : 'Pendiente'}
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

      {/* Modal de confirmación de aprobación */}
      {showApprovalConfirm && (
        <HeadcountApprovalModal
          selectedItems={data.filter(item => item.expanded)}
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

      {/* Selector de nivel de detalle */}
      <div className="mb-4 border-b pb-2">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveDetailLevel('shift')}
            className={`px-3 py-1 text-sm rounded-md ${activeDetailLevel === 'shift' ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Ver por turno
          </button>
          <button
            onClick={() => setActiveDetailLevel('position')}
            className={`px-3 py-1 text-sm rounded-md ${activeDetailLevel === 'position' ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Ver por puesto
          </button>
        </div>
      </div>
      
      {/* Historial de aprobaciones */}
      {showApprovalLogs && (
        <HeadcountApprovalLog logs={approvalLogs} onClose={() => setShowApprovalLogs(false)} />
      )}

      {/* Tabla de datos */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3 text-left w-1/4">Value Stream / Línea</th>
              {activeDetailLevel === 'shift' ? (
                <>
                  {shifts.map(shift => (
                    <th key={shift.id} className="px-4 py-3 text-center">{shift.name}</th>
                  ))}
                  <th className="px-4 py-3 text-center font-bold">Total</th>
                </>
              ) : (
                <>
                  {headcountPositions.slice(0, 5).map(position => (
                    <th key={position.code} className="px-4 py-3 text-center" title={position.name}>
                      {position.code}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-center font-bold">Total</th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredDataStream.map(vst => (
              <React.Fragment key={vst.id}>
                {/* Fila del Value Stream */}
                <tr className={getRowStyle(0)}>
                  <td className="px-4 py-3 flex items-center">
                    <button onClick={() => toggleExpand(vst.id)} className="mr-2">
                      {vst.expanded ? 
                        <ChevronDown className="h-4 w-4" /> : 
                        <ChevronRight className="h-4 w-4" />
                      }
                    </button>
                    {vst.name}
                  </td>
                  
                  {activeDetailLevel === 'shift' ? (
                    <>
                      {vst.shifts.map(shift => (
                        <td key={shift.id} className="px-4 py-3 text-center">
                          {shift.total}
                        </td>
                      ))}
                      <td className="px-4 py-3 text-center font-bold">{vst.shifts.reduce((sum, shift) => sum + shift.total, 0)}</td>
                    </>
                  ) : (
                    <>
                      {headcountPositions.slice(0, 5).map(position => (
                        <td key={position.code} className="px-4 py-3 text-center">
                          {vst.shifts.reduce((sum, shift) => sum + (shift.positions[position.code] || 0), 0)}
                        </td>
                      ))}
                      <td className="px-4 py-3 text-center font-bold">{vst.shifts.reduce((sum, shift) => sum + shift.total, 0)}</td>
                    </>
                  )}
                </tr>
                
                {/* Líneas del Value Stream (si está expandido) */}
                {vst.expanded && vst.lines.map(line => (
                  <React.Fragment key={`${vst.id}-${line.id}`}>
                    <tr className={getRowStyle(1)}>
                      <td className="px-4 py-3 flex items-center">
                        {line.shifts.length > 0 && (
                          <button onClick={() => toggleExpandLine(vst.id, line.id)} className="mr-2">
                            {line.expanded ? 
                              <ChevronDown className="h-4 w-4" /> : 
                              <ChevronRight className="h-4 w-4" />
                            }
                          </button>
                        )}
                        Línea {line.name}
                      </td>
                      
                      {activeDetailLevel === 'shift' ? (
                        <>
                          {line.shifts.map(shift => (
                            <td key={shift.id} className="px-4 py-3 text-center">
                              {shift.total}
                            </td>
                          ))}
                          <td className="px-4 py-3 text-center font-bold">{line.total}</td>
                        </>
                      ) : (
                        <>
                          {headcountPositions.slice(0, 5).map(position => (
                            <td key={position.code} className="px-4 py-3 text-center">
                              {line.shifts.reduce((sum, shift) => sum + (shift.positions[position.code] || 0), 0)}
                            </td>
                          ))}
                          <td className="px-4 py-3 text-center font-bold">{line.total}</td>
                        </>
                      )}
                    </tr>
                    
                    {/* Detalles de la línea por turno o posición */}
                    {line.expanded && activeDetailLevel === 'shift' && line.shifts.map(shift => (
                      <tr key={`${vst.id}-${line.id}-${shift.id}`} className={getRowStyle(2)}>
                        <td className="px-4 py-3 flex items-center">
                          <span className="ml-6">{shift.name}</span>
                        </td>
                        {shifts.map(s => (
                          <td key={s.id} className="px-4 py-3 text-center">
                            {s.id === shift.id ? shift.total : ''}
                          </td>
                        ))}
                        <td className="px-4 py-3 text-center font-bold">{shift.total}</td>
                      </tr>
                    ))}
                    
                    {line.expanded && activeDetailLevel === 'position' && (
                      <tr className={getRowStyle(2)}>
                        <td className="px-4 py-3" colSpan={7}>
                          <div className="border rounded-lg overflow-hidden">
                            <table className="min-w-full">
                              <thead className="bg-gray-50 text-xs">
                                <tr>
                                  <th className="px-3 py-2 text-left">Posición</th>
                                  {shifts.map(shift => (
                                    <th key={shift.id} className="px-3 py-2 text-center">{shift.name}</th>
                                  ))}
                                  <th className="px-3 py-2 text-center">Total</th>
                                </tr>
                              </thead>
                              <tbody>
                                {headcountPositions.map(position => {
                                  const total = line.shifts.reduce(
                                    (sum, shift) => sum + (shift.positions[position.code] || 0), 
                                    0
                                  );
                                  
                                  if (total === 0) return null;
                                  
                                  return (
                                    <tr key={position.code} className="border-b text-xs">
                                      <td className="px-3 py-2">{position.name}</td>
                                      {line.shifts.map(shift => (
                                        <td key={shift.id} className="px-3 py-2 text-center">
                                          {shift.positions[position.code] || 0}
                                        </td>
                                      ))}
                                      <td className="px-3 py-2 text-center font-semibold">{total}</td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </React.Fragment>
            ))}
            
            {/* Fila de totales */}
            <tr className="bg-gray-100 font-bold">
              <td className="px-4 py-3">Total</td>
              {activeDetailLevel === 'shift' ? (
                <>
                  {shifts.map(shift => {
                    const total = data.reduce((sum, vst) => {
                      const shiftData = vst.shifts.find(s => s.id === shift.id);
                      return sum + (shiftData?.total || 0);
                    }, 0);
                    
                    return (
                      <td key={shift.id} className="px-4 py-3 text-center">{total}</td>
                    );
                  })}
                  <td className="px-4 py-3 text-center">{totalOperators}</td>
                </>
              ) : (
                <>
                  {headcountPositions.slice(0, 5).map(position => {
                    const total = data.reduce((sum, vst) => {
                      return sum + vst.shifts.reduce((shiftSum, shift) => {
                        return shiftSum + (shift.positions[position.code] || 0);
                      }, 0);
                    }, 0);
                    
                    return (
                      <td key={position.code} className="px-4 py-3 text-center">{total}</td>
                    );
                  })}
                  <td className="px-4 py-3 text-center">{totalOperators}</td>
                </>
              )}
            </tr>
          </tbody>
        </table>
      </div>
      
      {/* Modal de aprobación */}
      {showApprovalModal && (
        <HeadcountApprovalModal
          selectedItems={[
            { id: 1, line: 'Línea 6', operators: 42, supervisors: 2, month: 'Enero 2024', valueStream: 'ENT' },
            { id: 2, line: 'Línea 7', operators: 41, supervisors: 2, month: 'Enero 2024', valueStream: 'ENT' }
          ]}
          onConfirm={handleApprovalConfirm}
          onCancel={() => setShowApprovalModal(false)}
        />
      )}
    </>
  );
};

export default HeadcountTab; 