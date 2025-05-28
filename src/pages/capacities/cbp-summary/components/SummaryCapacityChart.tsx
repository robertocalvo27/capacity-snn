import React, { useRef, useEffect } from 'react';

interface ValueStream {
  id: string;
  name: string;
  demand: number;
  capacity: number;
  utilization: number;
  status: 'under' | 'over' | 'balanced';
}

interface SummaryCapacityChartProps {
  valueStreams: ValueStream[];
}

const SummaryCapacityChart: React.FC<SummaryCapacityChartProps> = ({ valueStreams }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configurar canvas
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    ctx.scale(dpr, dpr);
    
    // Limpiar canvas
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Configuración del gráfico
    const padding = { top: 20, right: 30, bottom: 40, left: 60 };
    const chartWidth = rect.width - padding.left - padding.right;
    const chartHeight = rect.height - padding.top - padding.bottom;
    
    // Determinar el valor máximo para escalar el gráfico
    const maxValue = Math.max(
      ...valueStreams.map(vs => Math.max(vs.demand, vs.capacity))
    ) * 1.1; // Añadir un 10% más para espacio

    // Definir colores
    const demandColor = '#f59e0b'; // amber-500
    const capacityColor = '#6366f1'; // indigo-500

    // Dibujar ejes
    ctx.beginPath();
    ctx.strokeStyle = '#e5e7eb'; // gray-200
    ctx.lineWidth = 1;
    
    // Eje Y
    ctx.moveTo(padding.left, padding.top);
    ctx.lineTo(padding.left, padding.top + chartHeight);
    
    // Eje X
    ctx.moveTo(padding.left, padding.top + chartHeight);
    ctx.lineTo(padding.left + chartWidth, padding.top + chartHeight);
    ctx.stroke();

    // Dibujar líneas de cuadrícula horizontales
    const numGridLines = 5;
    ctx.textAlign = 'right';
    ctx.font = '10px sans-serif';
    ctx.fillStyle = '#6b7280'; // gray-500
    
    for (let i = 0; i <= numGridLines; i++) {
      const y = padding.top + (chartHeight / numGridLines) * i;
      const value = Math.round(maxValue - (maxValue / numGridLines) * i);
      
      ctx.beginPath();
      ctx.strokeStyle = '#f3f4f6'; // gray-100
      ctx.moveTo(padding.left, y);
      ctx.lineTo(padding.left + chartWidth, y);
      ctx.stroke();
      
      ctx.fillText(value.toLocaleString(), padding.left - 5, y + 3);
    }

    // Calcular ancho de barra y espacio
    const barCount = valueStreams.length;
    const barWidth = chartWidth / (barCount * 3); // Cada valor stream tiene 2 barras y algo de espacio
    const groupWidth = barWidth * 2 + 10; // Dos barras + espacio entre ellas
    const groupSpacing = (chartWidth - (groupWidth * barCount)) / (barCount + 1);

    // Dibujar barras y etiquetas
    valueStreams.forEach((vs, index) => {
      // Calcular posición x de cada grupo
      const groupX = padding.left + groupSpacing + (groupWidth + groupSpacing) * index;
      
      // Dibujar barra de demanda
      const demandHeight = (vs.demand / maxValue) * chartHeight;
      ctx.fillStyle = demandColor;
      ctx.fillRect(
        groupX, 
        padding.top + chartHeight - demandHeight, 
        barWidth, 
        demandHeight
      );
      
      // Dibujar barra de capacidad
      const capacityHeight = (vs.capacity / maxValue) * chartHeight;
      ctx.fillStyle = capacityColor;
      ctx.fillRect(
        groupX + barWidth + 5, 
        padding.top + chartHeight - capacityHeight, 
        barWidth, 
        capacityHeight
      );
      
      // Dibujar etiqueta del value stream
      ctx.save();
      ctx.translate(groupX + barWidth, padding.top + chartHeight + 15);
      ctx.rotate(-Math.PI / 6); // Rotar ligeramente para mejor legibilidad
      ctx.textAlign = 'right';
      ctx.font = '11px sans-serif';
      ctx.fillStyle = '#111827'; // gray-900
      ctx.fillText(vs.name, 0, 0);
      ctx.restore();
    });

    // Dibujar leyenda
    const legendX = padding.left;
    const legendY = padding.top - 5;
    
    // Demanda
    ctx.fillStyle = demandColor;
    ctx.fillRect(legendX, legendY, 15, 10);
    ctx.fillStyle = '#111827'; // gray-900
    ctx.textAlign = 'left';
    ctx.font = '11px sans-serif';
    ctx.fillText('Demanda', legendX + 20, legendY + 8);
    
    // Capacidad
    ctx.fillStyle = capacityColor;
    ctx.fillRect(legendX + 100, legendY, 15, 10);
    ctx.fillStyle = '#111827'; // gray-900
    ctx.fillText('Capacidad', legendX + 120, legendY + 8);

  }, [valueStreams]);

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full"
      style={{ display: 'block' }}
    />
  );
};

export default SummaryCapacityChart; 