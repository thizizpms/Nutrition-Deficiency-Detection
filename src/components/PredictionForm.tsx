import { useState } from 'react';
import { Calculator, AlertCircle, CheckCircle } from 'lucide-react';
import { NutritionData } from '../lib/supabase';

interface PredictionFormProps {
  onPredict: (data: NutritionData) => number | null;
  disabled: boolean;
}

export function PredictionForm({ onPredict, disabled }: PredictionFormProps) {
  const [formData, setFormData] = useState<NutritionData>({
    calories: 2000,
    protein: 50,
    iron: 10,
    calcium: 700,
    vitamins: 5,
    fatigue_level: 5,
    energy_level: 5,
  });

  const [prediction, setPrediction] = useState<number | null>(null);

  const handleChange = (field: keyof NutritionData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: parseFloat(value) || 0,
    }));
  };

  const handlePredict = () => {
    const result = onPredict(formData);
    setPrediction(result);
  };

  const getDeficiencyLevel = (): { level: string; color: string; icon: JSX.Element } => {
    if (prediction === null) return { level: 'Unknown', color: 'gray', icon: <AlertCircle /> };

    if (formData.energy_level >= 7 && formData.fatigue_level <= 3) {
      return { level: 'Healthy', color: 'green', icon: <CheckCircle /> };
    } else if (formData.energy_level >= 5 && formData.fatigue_level <= 5) {
      return { level: 'Moderate', color: 'amber', icon: <AlertCircle /> };
    } else {
      return { level: 'Deficient', color: 'red', icon: <AlertCircle /> };
    }
  };

  const status = getDeficiencyLevel();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <Calculator className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">Predict Deficiency</h2>
      </div>

      <p className="text-gray-600 mb-6">
        Enter nutrition values to predict deficiency cluster
      </p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Calories
          </label>
          <input
            type="number"
            value={formData.calories}
            onChange={(e) => handleChange('calories', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={disabled}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Protein (g)
          </label>
          <input
            type="number"
            value={formData.protein}
            onChange={(e) => handleChange('protein', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={disabled}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Iron (mg)
          </label>
          <input
            type="number"
            value={formData.iron}
            onChange={(e) => handleChange('iron', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={disabled}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Calcium (mg)
          </label>
          <input
            type="number"
            value={formData.calcium}
            onChange={(e) => handleChange('calcium', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={disabled}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Vitamins (1-9)
          </label>
          <input
            type="number"
            min="1"
            max="9"
            value={formData.vitamins}
            onChange={(e) => handleChange('vitamins', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={disabled}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fatigue Level (1-9)
          </label>
          <input
            type="number"
            min="1"
            max="9"
            value={formData.fatigue_level}
            onChange={(e) => handleChange('fatigue_level', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={disabled}
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Energy Level (1-9)
          </label>
          <input
            type="number"
            min="1"
            max="9"
            value={formData.energy_level}
            onChange={(e) => handleChange('energy_level', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={disabled}
          />
        </div>
      </div>

      <button
        onClick={handlePredict}
        disabled={disabled}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed mb-4"
      >
        <Calculator className="w-5 h-5" />
        Predict Cluster
      </button>

      {prediction !== null && (
        <div className={`p-4 rounded-lg bg-${status.color}-50 border border-${status.color}-200`}>
          <div className="flex items-center gap-3 mb-2">
            <div className={`text-${status.color}-600`}>{status.icon}</div>
            <h3 className={`font-semibold text-${status.color}-800`}>
              Prediction Result
            </h3>
          </div>
          <p className={`text-${status.color}-700`}>
            Assigned to Cluster: <span className="font-bold">{prediction}</span>
          </p>
          <p className={`text-sm text-${status.color}-600 mt-1`}>
            Status: <span className="font-semibold">{status.level}</span>
          </p>
        </div>
      )}

      {disabled && (
        <p className="text-sm text-amber-600 mt-3 text-center">
          Please train the model first
        </p>
      )}
    </div>
  );
}
