import { SUPERVISORS } from '../types/production';

export const useUserPermissions = (userId: string | undefined) => {
  const isSupervisor = userId ? SUPERVISORS.some(s => s.id === userId) : false;

  return {
    isSupervisor,
    canAdjustTargets: isSupervisor
  };
}; 