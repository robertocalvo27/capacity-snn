import React, { useState } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';

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

interface ActionPlanFormProps {
  causes: Cause[];
  onComplete: (actions: Action[]) => void;
}

export function ActionPlanForm({ causes, onComplete }: ActionPlanFormProps) {
  const [actions, setActions] = useState<Action[]>([]);
  const [newAction, setNewAction] = useState<Partial<Action>>({
    description: '',
    responsible: '',
    dueDate: '',
    status: 'pending',
    comments: ''
  });

  const addAction = () => {
    if (newAction.description && newAction.responsible && newAction.dueDate) {
      setActions([
        ...actions,
        {
          id: crypto.randomUUID(),
          description: newAction.description,
          responsible: newAction.responsible,
          dueDate: newAction.dueDate,
          status: newAction.status as 'pending' | 'in-progress' | 'completed',
          comments: newAction.comments
        }
      ]);
      setNewAction({
        description: '',
        responsible: '',
        dueDate: '',
        status: 'pending',
        comments: ''
      });
    }
  };

  const removeAction = (id: string) => {
    setActions(actions.filter(action => action.id !== id));
  };

  const updateActionStatus = (id: string, status: 'pending' | 'in-progress' | 'completed') => {
    setActions(actions.map(action =>
      action.id === id ? { ...action, status } : action
    ));
  };

  return (
    <div className="space-y-6">
      {/* Causes Summary */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Causas Identificadas</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Causa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unidades
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Comentarios
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {causes.map((cause) => (
                <tr key={cause.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {cause.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {cause.units}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {cause.comments}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Action Form */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Agregar Acción</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Descripción</label>
            <input
              type="text"
              value={newAction.description}
              onChange={(e) => setNewAction({ ...newAction, description: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Descripción de la acción"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Responsable</label>
            <input
              type="text"
              value={newAction.responsible}
              onChange={(e) => setNewAction({ ...newAction, responsible: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Nombre del responsable"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha Límite</label>
            <input
              type="date"
              value={newAction.dueDate}
              onChange={(e) => setNewAction({ ...newAction, dueDate: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Comentarios</label>
            <input
              type="text"
              value={newAction.comments}
              onChange={(e) => setNewAction({ ...newAction, comments: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Comentarios adicionales"
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={addAction}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar Acción
          </button>
        </div>
      </div>

      {/* Actions List */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Acciones Planificadas</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acción
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Responsable
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Límite
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Comentarios
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {actions.map((action) => (
                <tr key={action.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {action.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {action.responsible}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(action.dueDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={action.status}
                      onChange={(e) => updateActionStatus(action.id, e.target.value as 'pending' | 'in-progress' | 'completed')}
                      className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="pending">Pendiente</option>
                      <option value="in-progress">En Progreso</option>
                      <option value="completed">Completado</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {action.comments}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => removeAction(action.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => onComplete(actions)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Save className="w-4 h-4 mr-2" />
          Guardar Plan de Acción
        </button>
      </div>
    </div>
  );
}