import React, { useRef, useEffect } from 'react';

interface SummaryChartProps {
  demandHours: number;
  capacityHours: number;
  utilizationPercentage: number;
}

const SummaryChart: React.FC<SummaryChartProps> = ({
  demandHours,
  capacityHours,
  utilizationPercentage
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // En una implementación real, usaríamos una biblioteca como Chart.js, Recharts, o D3.js
  // Para este ejemplo, haremos un gráfico simple con Canvas API
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Limpiar el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Dimensiones del gráfico
    const chartWidth = canvas.width - 80; // Margen para etiquetas
    const chartHeight = canvas.height - 60; // Margen para etiquetas
    const barWidth = 100;
    const gap = 40;
    const startX = 60;
    const startY = 20;
    
    // Determinar la escala
    const maxValue = Math.max(demandHours, capacityHours) * 1.2; // 20% de margen superior
    const scale = chartHeight / maxValue;
    
    // Dibujar ejes
    ctx.beginPath();
    ctx.strokeStyle = '#CBD5E1'; // Gris claro para los ejes
    ctx.moveTo(startX, startY);
    ctx.lineTo(startX, startY + chartHeight);
    ctx.lineTo(startX + chartWidth, startY + chartHeight);
    ctx.stroke();
    
    // Dibujar líneas horizontales de referencia
    ctx.setLineDash([5, 5]);
    for (let i = 0; i <= 5; i++) {
      const y = startY + chartHeight - (i * chartHeight / 5);
      const value = (maxValue * i / 5).toFixed(1);
      
      ctx.beginPath();
      ctx.moveTo(startX, y);
      ctx.lineTo(startX + chartWidth, y);
      ctx.stroke();
      
      // Etiquetas en el eje Y
      ctx.fillStyle = '#64748B'; // Gris para texto
      ctx.font = '12px Arial';
      ctx.textAlign = 'right';
      ctx.fillText(value, startX - 10, y + 5);
    }
    ctx.setLineDash([]);
    
    // Dibujar barras
    // Barra de Demanda
    const barHeight1 = demandHours * scale;
    ctx.fillStyle = '#BFDBFE'; // Azul claro
    ctx.fillRect(startX + 50, startY + chartHeight - barHeight1, barWidth, barHeight1);
    ctx.strokeStyle = '#3B82F6'; // Borde azul
    ctx.strokeRect(startX + 50, startY + chartHeight - barHeight1, barWidth, barHeight1);
    
    // Barra de Capacidad
    const barHeight2 = capacityHours * scale;
    ctx.fillStyle = '#BBF7D0'; // Verde claro
    ctx.fillRect(startX + 50 + barWidth + gap, startY + chartHeight - barHeight2, barWidth, barHeight2);
    ctx.strokeStyle = '#22C55E'; // Borde verde
    ctx.strokeRect(startX + 50 + barWidth + gap, startY + chartHeight - barHeight2, barWidth, barHeight2);
    
    // Etiquetas de las barras
    ctx.fillStyle = '#1E293B'; // Color oscuro para texto
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    
    // Etiqueta y valor de Demanda
    ctx.fillText('Demanda', startX + 50 + barWidth/2, startY + chartHeight + 20);
    ctx.fillText(demandHours.toFixed(2), startX + 50 + barWidth/2, startY + chartHeight - barHeight1 - 10);
    
    // Etiqueta y valor de Capacidad
    ctx.fillText('Capacidad', startX + 50 + barWidth + gap + barWidth/2, startY + chartHeight + 20);
    ctx.fillText(capacityHours.toFixed(2), startX + 50 + barWidth + gap + barWidth/2, startY + chartHeight - barHeight2 - 10);
    
    // Indicador de utilización
    ctx.fillStyle = getUtilizationColor(utilizationPercentage);
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${utilizationPercentage}% Utilización`, canvas.width / 2, startY + chartHeight + 45);
  }, [demandHours, capacityHours, utilizationPercentage]);
  
  // Función para determinar el color según el porcentaje de utilización
  const getUtilizationColor = (percentage: number): string => {
    if (percentage <= 84) return '#EF4444'; // Rojo - Subutilizado
    if (percentage <= 91) return '#F59E0B'; // Amarillo - Aceptable
    if (percentage <= 95) return '#10B981'; // Verde - Óptimo
    if (percentage <= 100) return '#3B82F6'; // Azul - Excelente
    return '#EF4444'; // Rojo - Sobrecarga
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      <canvas 
        ref={canvasRef} 
        width={600} 
        height={300}
        className="w-full h-full"
      ></canvas>
    </div>
  );
};

export default SummaryChart; 