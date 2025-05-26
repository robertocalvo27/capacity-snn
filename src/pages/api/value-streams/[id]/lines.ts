import { NextApiRequest, NextApiResponse } from 'next';
import { valueStreamService } from '@/services/valueStreamService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('API endpoint hit: /api/value-streams/[id]/lines');
  
  if (req.method !== 'GET') {
    console.log('Method not allowed:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;
  console.log('Value stream ID:', id);

  try {
    const lines = await valueStreamService.getLines(id as string);
    console.log('Sending response:', lines);
    return res.status(200).json({ success: true, data: lines });
  } catch (error) {
    console.error('Error in API handler:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Error fetching lines',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 