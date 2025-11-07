import { Activity, TrendingUp, TrendingDown } from 'lucide-react';

interface ClusterVisualizationProps {
  clusterCounts: Record<number, number>;
  gridSize: number;
}

export function ClusterVisualization({ clusterCounts, gridSize }: ClusterVisualizationProps) {
  const totalSamples = Object.values(clusterCounts).reduce((a, b) => a + b, 0);
  const maxCount = Math.max(...Object.values(clusterCounts), 1);

  const getClusterColor = (count: number): string => {
    const intensity = count / maxCount;
    if (intensity > 0.7) return 'bg-red-500';
    if (intensity > 0.4) return 'bg-amber-500';
    if (intensity > 0.2) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getCellPosition = (clusterId: number): { row: number; col: number } => {
    const row = Math.floor(clusterId / gridSize);
    const col = clusterId % gridSize;
    return { row, col };
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <Activity className="w-6 h-6 text-purple-600" />
        <h2 className="text-2xl font-bold text-gray-800">Cluster Visualization</h2>
      </div>

      <div className="mb-6">
        <p className="text-gray-600 mb-2">
          Total Samples: <span className="font-semibold">{totalSamples}</span>
        </p>
        <p className="text-sm text-gray-500">
          Darker colors indicate higher concentration of samples
        </p>
      </div>

      <div
        className="grid gap-2 mb-6"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
        }}
      >
        {Array.from({ length: gridSize * gridSize }, (_, i) => {
          const count = clusterCounts[i] || 0;
          const { row, col } = getCellPosition(i);

          return (
            <div
              key={i}
              className={`aspect-square rounded-lg ${
                count > 0 ? getClusterColor(count) : 'bg-gray-100'
              } flex flex-col items-center justify-center text-white font-bold shadow-sm hover:scale-105 transition-transform`}
              title={`Cluster ${i} (${row},${col}): ${count} samples`}
            >
              <div className="text-xs opacity-70">C{i}</div>
              <div className="text-lg">{count}</div>
            </div>
          );
        })}
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold text-gray-700 mb-2">Cluster Distribution</h3>
        {Object.entries(clusterCounts)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([clusterId, count]) => {
            const percentage = ((count / totalSamples) * 100).toFixed(1);
            const { row, col } = getCellPosition(parseInt(clusterId));

            return (
              <div key={clusterId} className="flex items-center gap-3">
                <div className="flex-shrink-0 w-16 text-sm font-medium text-gray-700">
                  C{clusterId}
                </div>
                <div className="flex-grow">
                  <div className="bg-gray-200 rounded-full h-6 overflow-hidden">
                    <div
                      className={`h-full ${getClusterColor(count)} flex items-center justify-end px-2 transition-all`}
                      style={{ width: `${percentage}%` }}
                    >
                      <span className="text-xs font-semibold text-white">
                        {count}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0 w-16 text-sm text-gray-600 text-right">
                  {percentage}%
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
