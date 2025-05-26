import { NextApiRequest, NextApiResponse } from 'next';
import { valueStreamService } from '@/services/valueStreamService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Agregar CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed' 
    });
  }

  try {
    const valueStreams = await valueStreamService.getAll();
    
    // Asegurarnos de enviar una respuesta JSON válida
    return res.status(200).json({
      success: true,
      data: valueStreams || []
    });
    
  } catch (error) {
    console.error('Error in value-streams endpoint:', error);
    
    // Enviar una respuesta de error estructurada
    return res.status(500).json({
      success: false,
      error: 'Error fetching value streams',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 