import React from 'react';

interface DetailedMetric {
  product: string;
  volume: number;
  yield: string;
  newVolume: number;
  lotSize: number;
  cbp: number;
  runRate: number;
  curvaEntren: string;
  newRunRate: number;
  demandHours: number;
}

interface SummaryTableProps {
  data: DetailedMetric[];
  type: 'demand' | 'capacity';
}

const SummaryTable: React.FC<SummaryTableProps> = ({ data, type }) => {
  // Calcular totales
  const totalVolume = data.reduce((sum, item) => sum + item.volume, 0);
  const totalNewVolume = data.reduce((sum, item) => sum + item.newVolume, 0);
  const totalLotSize = data.reduce((sum, item) => sum + item.lotSize, 0);
  const totalCbp = data.reduce((sum, item) => sum + item.cbp, 0);
  const totalDemandHours = data.reduce((sum, item) => sum + item.demandHours, 0);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 border">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
              Producto
            </th>
            <th colSpan={3} className="px-4 py-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border">
              PARTE 1.
            </th>
            <th className="px-4 py-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border">
              &nbsp;
            </th>
            <th className="px-4 py-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border">
              &nbsp;
            </th>
            <th colSpan={3} className="px-4 py-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border">
              PARTE 2.
            </th>
            <th className="px-4 py-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border">
              Final Est.
            </th>
          </tr>
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
              &nbsp;
            </th>
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border">
              Volumen
            </th>
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border">
              Yield
            </th>
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border">
              New Volumen
            </th>
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border">
              Lot Size
            </th>
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border">
              CBP
            </th>
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border">
              Run Rate
            </th>
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border">
              Curva Entren.
            </th>
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border">
              New Run Rate
            </th>
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border">
              Demanda
            </th>
          </tr>
          <tr>
            <th className="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
              &nbsp;
            </th>
            <th className="px-4 py-1 text-center text-xs font-medium text-gray-500 tracking-wider border">
              Unidades / sem
            </th>
            <th className="px-4 py-1 text-center text-xs font-medium text-gray-500 tracking-wider border">
              % Unid Buenas
            </th>
            <th className="px-4 py-1 text-center text-xs font-medium text-gray-500 tracking-wider border">
              Unidades / sem
            </th>
            <th className="px-4 py-1 text-center text-xs font-medium text-gray-500 tracking-wider border">
              (Lot Size = X)
            </th>
            <th className="px-4 py-1 text-center text-xs font-medium text-gray-500 tracking-wider border">
              &nbsp;
            </th>
            <th className="px-4 py-1 text-center text-xs font-medium text-gray-500 tracking-wider border">
              u/hr neta línea
            </th>
            <th className="px-4 py-1 text-center text-xs font-medium text-gray-500 tracking-wider border">
              &nbsp;
            </th>
            <th className="px-4 py-1 text-center text-xs font-medium text-gray-500 tracking-wider border">
              u/hr neta
            </th>
            <th className="px-4 py-1 text-center text-xs font-medium text-gray-500 tracking-wider border">
              horas línea / sem
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item, index) => (
            <tr key={index} className="bg-green-50">
              <td className="px-4 py-2 text-sm text-gray-900 border">{item.product}</td>
              <td className="px-4 py-2 text-sm text-gray-900 text-center border">{item.volume.toLocaleString()}</td>
              <td className="px-4 py-2 text-sm text-gray-900 text-center border">{item.yield}</td>
              <td className="px-4 py-2 text-sm text-gray-900 text-center border">{item.newVolume.toLocaleString()}</td>
              <td className="px-4 py-2 text-sm text-gray-900 text-center border">{item.lotSize}</td>
              <td className="px-4 py-2 text-sm text-gray-900 text-center border">{item.cbp}</td>
              <td className="px-4 py-2 text-sm text-gray-900 text-center border">{item.runRate}</td>
              <td className="px-4 py-2 text-sm text-gray-900 text-center border">{item.curvaEntren}</td>
              <td className="px-4 py-2 text-sm text-gray-900 text-center border">{item.newRunRate}</td>
              <td className="px-4 py-2 text-sm text-gray-900 text-center border">{item.demandHours}</td>
            </tr>
          ))}
          <tr className="bg-white">
            <td className="px-4 py-2 text-sm font-medium text-gray-900 border">Total</td>
            <td className="px-4 py-2 text-sm font-medium text-gray-900 text-center border">{totalVolume.toLocaleString()}</td>
            <td className="px-4 py-2 text-sm text-gray-900 text-center border"></td>
            <td className="px-4 py-2 text-sm font-medium text-gray-900 text-center border">{totalNewVolume.toLocaleString()}</td>
            <td className="px-4 py-2 text-sm font-medium text-gray-900 text-center border">{totalLotSize}</td>
            <td className="px-4 py-2 text-sm font-medium text-gray-900 text-center border">{totalCbp}</td>
            <td className="px-4 py-2 text-sm text-gray-900 text-center border"></td>
            <td className="px-4 py-2 text-sm text-gray-900 text-center border"></td>
            <td className="px-4 py-2 text-sm text-gray-900 text-center border"></td>
            <td className="px-4 py-2 text-sm font-medium text-purple-800 text-center border bg-purple-100">{totalDemandHours.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default SummaryTable; 