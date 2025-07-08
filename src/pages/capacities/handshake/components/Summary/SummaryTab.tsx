import React from 'react';
import { BarChart3, CheckCircle, AlertTriangle, Users, FileText, Calendar } from 'lucide-react';
import type { HandShakeSession, HandShakeStatusItem } from '../../../../../types/capacity';

interface SummaryTabProps {
  sessionData: HandShakeSession;
  handShakeStatus: HandShakeStatusItem;
  cbpId?: string;
}

const SummaryTab: React.FC<SummaryTabProps> = ({
  sessionData,
  handShakeStatus,
  cbpId
}) => {
  const totalVSTs = sessionData.vstData.length;
  const approvedVSTs = sessionData.vstData.filter(vst => vst.status === 'approved').length;
  const totalConcerns = sessionData.vstData.reduce((acc, vst) => acc + vst.concerns.length, 0);
  const resolvedConcerns = sessionData.vstData.reduce((acc, vst) => 
    acc + vst.concerns.filter(c => c.status === 'resolved').length, 0);
  const totalAgreements = sessionData.globalAgreements.length;
  const mutualAgreements = sessionData.globalAgreements.filter(a => 
    a.agreedBy.includes('production_director') && a.agreedBy.includes('planning_director')).length;

  const avgUtilization = sessionData.vstData.reduce((acc, vst) => acc + vst.utilizationPercentage, 0) / totalVSTs;
  const avgEfficiency = sessionData.vstData.reduce((acc, vst) => acc + vst.efficiency, 0) / totalVSTs;

  const completionPercentage = Object.values(handShakeStatus).filter(Boolean).length / Object.keys(handShakeStatus).length * 100;

  const finalStatus = sessionData.finalSignoff?.productionDirector && sessionData.finalSignoff?.planningDirector
    ? (sessionData.finalSignoff.productionDirector.approved && sessionData.finalSignoff.planningDirector.approved ? 'approved' : 'rejected')
    : 'pending';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600';
      case 'rejected': return 'text-red-600';
      default: return 'text-yellow-600';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-50 border-green-200';
      case 'rejected': return 'bg-red-50 border-red-200';
      default: return 'bg-yellow-50 border-yellow-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Resumen Ejecutivo</h2>
          <p className="text-gray-600">
            Resumen completo del proceso de Hand Shake para CBP {cbpId}
          </p>
        </div>
        <div className={`px-4 py-2 rounded-lg font-semibold ${getStatusColor(finalStatus)} ${getStatusBg(finalStatus)}`}>
          {finalStatus === 'approved' ? '✅ Aprobado' : 
           finalStatus === 'rejected' ? '❌ Rechazado' : '⏳ Pendiente'}
        </div>
      </div>

      {/* Progress Overview */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Progreso General</h3>
        <div className="flex items-center mb-3">
          <div className="flex-1 bg-gray-200 rounded-full h-4">
            <div 
              className="bg-blue-600 h-4 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <span className="ml-3 text-lg font-semibold text-gray-900">
            {completionPercentage.toFixed(0)}%
          </span>
        </div>
        <p className="text-sm text-gray-600">
          {Object.values(handShakeStatus).filter(Boolean).length} de {Object.keys(handShakeStatus).length} fases completadas
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center">
            <BarChart3 className="w-8 h-8 text-blue-500 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900">{approvedVSTs}/{totalVSTs}</div>
              <div className="text-sm text-gray-500">VSTs Aprobados</div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="w-8 h-8 text-yellow-500 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900">{resolvedConcerns}/{totalConcerns}</div>
              <div className="text-sm text-gray-500">Preocupaciones Resueltas</div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center">
            <FileText className="w-8 h-8 text-purple-500 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900">{mutualAgreements}/{totalAgreements}</div>
              <div className="text-sm text-gray-500">Acuerdos Mutuos</div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-green-500 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900">{avgUtilization.toFixed(1)}%</div>
              <div className="text-sm text-gray-500">Utilización Promedio</div>
            </div>
          </div>
        </div>
      </div>

      {/* VST Summary */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen por Value Stream</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">VST</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Utilización</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Eficiencia</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Preocupaciones</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aprobaciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sessionData.vstData.map((vst) => (
                <tr key={vst.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {vst.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      vst.status === 'approved' ? 'bg-green-100 text-green-800' :
                      vst.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {vst.status === 'approved' ? 'Aprobado' :
                       vst.status === 'rejected' ? 'Rechazado' : 'Pendiente'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className={
                      vst.utilizationPercentage >= 95 ? 'text-red-600' :
                      vst.utilizationPercentage >= 90 ? 'text-yellow-600' : 'text-green-600'
                    }>
                      {vst.utilizationPercentage.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {vst.efficiency.toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {vst.concerns.filter(c => c.status === 'open').length > 0 ? (
                      <span className="text-yellow-600">
                        {vst.concerns.filter(c => c.status === 'open').length} abiertas
                      </span>
                    ) : (
                      <span className="text-green-600">Sin preocupaciones</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {vst.approvals.length}/2
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Final Signoff Status */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado de Aprobación Final</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center p-4 border border-gray-200 rounded-lg">
            {sessionData.finalSignoff?.productionDirector ? (
              sessionData.finalSignoff.productionDirector.approved ? (
                <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-red-500 mr-3" />
              )
            ) : (
              <div className="w-6 h-6 bg-gray-300 rounded-full mr-3" />
            )}
            <div>
              <div className="font-medium text-gray-900">Director de Producción</div>
              <div className="text-sm text-gray-500">
                {sessionData.finalSignoff?.productionDirector 
                  ? (sessionData.finalSignoff.productionDirector.approved ? 'Aprobado' : 'Rechazado')
                  : 'Pendiente'}
              </div>
            </div>
          </div>

          <div className="flex items-center p-4 border border-gray-200 rounded-lg">
            {sessionData.finalSignoff?.planningDirector ? (
              sessionData.finalSignoff.planningDirector.approved ? (
                <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-red-500 mr-3" />
              )
            ) : (
              <div className="w-6 h-6 bg-gray-300 rounded-full mr-3" />
            )}
            <div>
              <div className="font-medium text-gray-900">Director de Planeación</div>
              <div className="text-sm text-gray-500">
                {sessionData.finalSignoff?.planningDirector 
                  ? (sessionData.finalSignoff.planningDirector.approved ? 'Aprobado' : 'Rechazado')
                  : 'Pendiente'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Cronología</h3>
        <div className="space-y-3">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 text-gray-400 mr-3" />
            <span className="text-sm text-gray-600">
              <strong>Iniciado:</strong> {new Date(sessionData.createdAt).toLocaleString()}
            </span>
          </div>
          {sessionData.startedAt && (
            <div className="flex items-center">
              <Calendar className="w-4 h-4 text-gray-400 mr-3" />
              <span className="text-sm text-gray-600">
                <strong>En revisión desde:</strong> {new Date(sessionData.startedAt).toLocaleString()}
              </span>
            </div>
          )}
          {sessionData.completedAt && (
            <div className="flex items-center">
              <Calendar className="w-4 h-4 text-gray-400 mr-3" />
              <span className="text-sm text-gray-600">
                <strong>Completado:</strong> {new Date(sessionData.completedAt).toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Next Steps */}
      {sessionData.nextSteps && sessionData.nextSteps.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Próximos Pasos</h3>
          <ul className="space-y-2">
            {sessionData.nextSteps.map((step, index) => (
              <li key={index} className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                <span className="text-blue-800">{step}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SummaryTab;