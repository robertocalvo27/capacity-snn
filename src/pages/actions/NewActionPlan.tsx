import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, BadgeCheck, Truck, Factory, DollarSign, Save } from 'lucide-react';
import { ParetoAnalysis } from './components/ParetoAnalysis';
import { ActionPlanForm } from './components/ActionPlanForm';

interface Cause {
  id: string;
  description: string;
  units: number;
  comments?: string;
}

interface Action {
  id: string;
  description: string;
  responsible: string;
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed';
  comments?: string;
}

export function NewActionPlan() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'info' | 'pareto' | 'plan'>('info');
  const [planInfo, setPlanInfo] = useState({
    area: '',
    metric: '',
    description: '',
    responsible: '',
    dueDate: ''
  });
  const [causes, setCauses] = useState<Cause[]>([]);

  const handleParetoComplete = (newCauses: Cause[]) => {
    setCauses(newCauses);
    setStep('plan');
  };

  const handlePlanComplete = (actions: Action[]) => {
    // Aquí se implementaría la lógica para guardar el plan completo
    console.log('Plan completo:', { planInfo, causes, actions });
    navigate('/actions/history');
  };

  const getAreaIcon = (area: string) => {
    switch (area) {
      case 'Safety':
        return <Shield className="w-5 h-5" />;
      case 'Quality':
        return <BadgeCheck className="w-5 h-5" />;
      case 'Production':
        return <Factory className="w-5 h-5" />;
      case 'Delivery':
        return <Truck className="w-5 h-5" />;
      case 'Cost':
        return <DollarSign className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Nuevo Plan de Acción</h1>
            <p className="text-gray-500">Crea un nuevo plan de acción para resolver un problema</p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between">
          <div className={`flex-1 text-center ${step === 'info' ? 'text-blue-600' : 'text-gray-500'}`}>
            <div className="mb-2">Información General</div>
            <div className="h-1 bg-blue-600"></div>
          </div>
          <div className={`flex-1 text-center ${step === 'pareto' ? 'text-blue-600' : 'text-gray-500'}`}>
            <div className="mb-2">Análisis de Pareto</div>
            <div className={`h-1 ${step === 'info' ? 'bg-gray-200' : 'bg-blue-600'}`}></div>
          </div>
          <div className={`flex-1 text-center ${step === 'plan' ? 'text-blue-600' : 'text-gray-500'}`}>
            <div className="mb-2">Plan de Acción</div>
            <div className={`h-1 ${step === 'plan' ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        {step === 'info' && (
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-gray-900">Información del Plan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Área</label>
                <select
                  value={planInfo.area}
                  onChange={(e) => setPlanInfo({ ...planInfo, area: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Seleccionar área</option>
                  <option value="Safety">Safety</option>
                  <option value="Quality">Quality</option>
                  <option value="Delivery">Delivery</option>
                  <option value="Production">Production</option>
                  <option value="Cost">Cost</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Métrica</label>
                <input
                  type="text"
                  value={planInfo.metric}
                  onChange={(e) => setPlanInfo({ ...planInfo, metric: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Ej: Casi Casi Cerrados, NCs, etc."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Descripción del Problema</label>
                <textarea
                  value={planInfo.description}
                  onChange={(e) => setPlanInfo({ ...planInfo, description: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Describe el problema que se busca resolver..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Responsable</label>
                <input
                  type="text"
                  value={planInfo.responsible}
                  onChange={(e) => setPlanInfo({ ...planInfo, responsible: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Nombre del responsable"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Fecha Límite</label>
                <input
                  type="date"
                  value={planInfo.dueDate}
                  onChange={(e) => setPlanInfo({ ...planInfo, dueDate: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setStep('pareto')}
                disabled={!planInfo.area || !planInfo.metric || !planInfo.responsible || !planInfo.dueDate}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        {step === 'pareto' && (
          <ParetoAnalysis onComplete={handleParetoComplete} />
        )}

        {step === 'plan' && (
          <ActionPlanForm
            causes={causes}
            onComplete={handlePlanComplete}
          />
        )}
      </div>
    </div>
  );
}