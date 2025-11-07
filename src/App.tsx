import { useState, useEffect } from 'react';
import { Brain } from 'lucide-react';
import { DataImport } from './components/DataImport';
import { TrainingPanel } from './components/TrainingPanel';
import { ClusterVisualization } from './components/ClusterVisualization';
import { PredictionForm } from './components/PredictionForm';
import { StatisticsPanel } from './components/StatisticsPanel';
import { getAllNutritionData } from './lib/dataImport';
import { useSOM } from './hooks/useSOM';
import { NutritionData } from './lib/supabase';

function App() {
  const [nutritionData, setNutritionData] = useState<NutritionData[]>([]);
  const [loading, setLoading] = useState(true);
  const { trainModel, predictCluster, isTraining, stats } = useSOM();

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getAllNutritionData();
      setNutritionData(data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTrain = async (gridSize: number, learningRate: number, iterations: number) => {
    await trainModel(nutritionData, gridSize, learningRate, iterations);
    await loadData();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-green-600 rounded-2xl shadow-lg">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-800">
                Nutrition Deficiency Detection
              </h1>
              <p className="text-gray-600 mt-1">
                Self-Organizing Map Machine Learning Analysis
              </p>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-6">
            <StatisticsPanel data={nutritionData} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DataImport onImportComplete={loadData} />
              <TrainingPanel
                data={nutritionData}
                onTrain={handleTrain}
                isTraining={isTraining}
              />
            </div>

            {stats && stats.clusterCounts && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ClusterVisualization
                  clusterCounts={stats.clusterCounts}
                  gridSize={5}
                />
                <PredictionForm
                  onPredict={predictCluster}
                  disabled={!stats}
                />
              </div>
            )}

            {!stats && nutritionData.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
                <p className="text-blue-800 font-medium">
                  Data loaded successfully! Train the SOM model to see clustering results and make predictions.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
