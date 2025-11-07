import { useState } from 'react';
import { Brain, Play } from 'lucide-react';
import { NutritionData } from '../lib/supabase';

interface TrainingPanelProps {
  data: NutritionData[];
  onTrain: (gridSize: number, learningRate: number, iterations: number) => Promise<void>;
  isTraining: boolean;
}

export function TrainingPanel({ data, onTrain, isTraining }: TrainingPanelProps) {
  const [gridSize, setGridSize] = useState(5);
  const [learningRate, setLearningRate] = useState(0.5);
  const [iterations, setIterations] = useState(100);

  const handleTrain = async () => {
    await onTrain(gridSize, learningRate, iterations);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <Brain className="w-6 h-6 text-green-600" />
        <h2 className="text-2xl font-bold text-gray-800">SOM Training</h2>
      </div>

      <p className="text-gray-600 mb-6">
        Configure and train the Self-Organizing Map algorithm
      </p>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Grid Size: {gridSize}x{gridSize}
          </label>
          <input
            type="range"
            min="3"
            max="10"
            value={gridSize}
            onChange={(e) => setGridSize(parseInt(e.target.value))}
            disabled={isTraining}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>3x3</span>
            <span>10x10</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Learning Rate: {learningRate.toFixed(2)}
          </label>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.1"
            value={learningRate}
            onChange={(e) => setLearningRate(parseFloat(e.target.value))}
            disabled={isTraining}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0.1</span>
            <span>1.0</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Iterations: {iterations}
          </label>
          <input
            type="range"
            min="50"
            max="500"
            step="50"
            value={iterations}
            onChange={(e) => setIterations(parseInt(e.target.value))}
            disabled={isTraining}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>50</span>
            <span>500</span>
          </div>
        </div>
      </div>

      <button
        onClick={handleTrain}
        disabled={isTraining || data.length === 0}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        <Play className="w-5 h-5" />
        {isTraining ? 'Training...' : `Train Model (${data.length} records)`}
      </button>

      {data.length === 0 && (
        <p className="text-sm text-amber-600 mt-3 text-center">
          Please import data first
        </p>
      )}
    </div>
  );
}
