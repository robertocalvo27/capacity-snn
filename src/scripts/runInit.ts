import { initializeData } from '../services/initData.js';

console.log('Ejecutando inicialización de datos...');
initializeData()
  .then(() => process.exit(0))
  .catch(() => process.exit(1)); 