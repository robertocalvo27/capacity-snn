import { supabase } from '@/lib/supabase';
import type { ImportLog } from '@/types/capacity';

class ImportLogService {
  // Mock data temporal
  private mockImportLogs: ImportLog[] = [];

  async createImportLog(importData: Omit<ImportLog, 'id'>): Promise<ImportLog> {
    // Generar ID único
    const id = `import_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const newImportLog: ImportLog = {
      id,
      ...importData,
      uploadDate: new Date(importData.uploadDate)
    };
    
    this.mockImportLogs.push(newImportLog);
    return newImportLog;
  }

  async getImportLogsByType(fileType: ImportLog['fileType'], limit: number = 10): Promise<ImportLog[]> {
    return this.mockImportLogs
      .filter(log => log.fileType === fileType)
      .sort((a, b) => b.uploadDate.getTime() - a.uploadDate.getTime())
      .slice(0, limit);
  }

  async getAllImportLogs(limit: number = 50): Promise<ImportLog[]> {
    return this.mockImportLogs
      .sort((a, b) => b.uploadDate.getTime() - a.uploadDate.getTime())
      .slice(0, limit);
  }

  async getImportLogById(id: string): Promise<ImportLog | null> {
    return this.mockImportLogs.find(log => log.id === id) || null;
  }

  async updateImportLogStatus(id: string, status: ImportLog['status'], errorMessage?: string): Promise<ImportLog> {
    const index = this.mockImportLogs.findIndex(log => log.id === id);
    if (index === -1) {
      throw new Error('Import log not found');
    }

    this.mockImportLogs[index] = {
      ...this.mockImportLogs[index],
      status,
      errorMessage
    };

    return this.mockImportLogs[index];
  }

  async getLastSuccessfulImport(fileType: ImportLog['fileType']): Promise<ImportLog | null> {
    const successfulImports = this.mockImportLogs
      .filter(log => log.fileType === fileType && log.status === 'success')
      .sort((a, b) => b.uploadDate.getTime() - a.uploadDate.getTime());

    return successfulImports[0] || null;
  }

  async getImportStatsByMonth(year: number, month: number): Promise<{
    total: number;
    successful: number;
    failed: number;
    byType: Record<ImportLog['fileType'], number>;
  }> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const monthLogs = this.mockImportLogs.filter(log => {
      const logDate = new Date(log.uploadDate);
      return logDate >= startDate && logDate <= endDate;
    });

    const stats = {
      total: monthLogs.length,
      successful: monthLogs.filter(log => log.status === 'success').length,
      failed: monthLogs.filter(log => log.status === 'error').length,
      byType: {} as Record<ImportLog['fileType'], number>
    };

    // Contar por tipo
    const types: ImportLog['fileType'][] = ['buildplan', 'headcount', 'runrates', 'yield', 'downtimes', 'calendar'];
    types.forEach(type => {
      stats.byType[type] = monthLogs.filter(log => log.fileType === type).length;
    });

    return stats;
  }

  async deleteImportLog(id: string): Promise<boolean> {
    const index = this.mockImportLogs.findIndex(log => log.id === id);
    if (index === -1) {
      return false;
    }

    this.mockImportLogs.splice(index, 1);
    return true;
  }

  // Método para simular datos mock de desarrollo
  async seedMockData(): Promise<void> {
    // Limpiar datos existentes
    this.mockImportLogs = [];

    // Generar datos de ejemplo
    const mockLogs: ImportLog[] = [
      {
        id: 'import_1703123400000_abc123def',
        fileName: 'build_plan_2024_01.xlsx',
        uploadedBy: 'Juan Pérez',
        uploadDate: new Date('2024-01-15T10:30:00'),
        fileType: 'buildplan',
        status: 'success',
        recordsProcessed: 145,
        fileSize: 2048576,
        filePath: '/uploads/2024/01/build_plan_2024_01.xlsx'
      },
      {
        id: 'import_1703037000000_def456ghi',
        fileName: 'headcount_jan_2024.csv',
        uploadedBy: 'María González',
        uploadDate: new Date('2024-01-14T14:20:00'),
        fileType: 'headcount',
        status: 'success',
        recordsProcessed: 85,
        fileSize: 512000,
        filePath: '/uploads/2024/01/headcount_jan_2024.csv'
      },
      {
        id: 'import_1702950600000_ghi789jkl',
        fileName: 'yield_data_dec_2023.xlsx',
        uploadedBy: 'Carlos Rodríguez',
        uploadDate: new Date('2024-01-13T09:15:00'),
        fileType: 'yield',
        status: 'error',
        recordsProcessed: 0,
        fileSize: 1024768,
        errorMessage: 'Error en la columna "Yield %": Valores fuera del rango permitido (0-100). Filas afectadas: 12, 25, 33'
      },
      {
        id: 'import_1702864200000_jkl012mno',
        fileName: 'downtimes_q4_2023.csv',
        uploadedBy: 'Ana Martínez',
        uploadDate: new Date('2024-01-12T16:45:00'),
        fileType: 'downtimes',
        status: 'success',
        recordsProcessed: 67,
        fileSize: 768000,
        filePath: '/uploads/2024/01/downtimes_q4_2023.csv'
      },
      {
        id: 'import_1702777800000_mno345pqr',
        fileName: 'calendar_2024.xlsx',
        uploadedBy: 'Luis Fernández',
        uploadDate: new Date('2024-01-11T11:30:00'),
        fileType: 'calendar',
        status: 'processing',
        recordsProcessed: 23,
        fileSize: 1536000
      },
      {
        id: 'import_1702691400000_pqr678stu',
        fileName: 'runrates_update_jan.csv',
        uploadedBy: 'Isabel López',
        uploadDate: new Date('2024-01-10T08:45:00'),
        fileType: 'runrates',
        status: 'success',
        recordsProcessed: 198,
        fileSize: 326400,
        filePath: '/uploads/2024/01/runrates_update_jan.csv'
      }
    ];

    this.mockImportLogs = mockLogs;
  }

  // Método de utilidad para formatear tamaño de archivo
  formatFileSize(sizeInBytes?: number): string {
    if (!sizeInBytes) return 'N/A';
    
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (sizeInBytes === 0) return '0 Bytes';
    
    const i = Math.floor(Math.log(sizeInBytes) / Math.log(1024));
    return Math.round(sizeInBytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }

  // Método de utilidad para obtener icono por tipo de archivo
  getFileTypeIcon(fileType: ImportLog['fileType']): string {
    const icons = {
      buildplan: '📋',
      headcount: '👥',
      runrates: '⚡',
      yield: '📈',
      downtimes: '⚠️',
      calendar: '📅'
    };
    return icons[fileType] || '📄';
  }
}

export const importLogService = new ImportLogService();
export default importLogService; 