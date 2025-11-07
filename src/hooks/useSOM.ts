import { useState, useCallback } from 'react';
import { supabase, NutritionData, SOMModel } from '../lib/supabase';
import { SelfOrganizingMap, normalizeData, normalizeInput } from '../lib/som';

interface TrainingStats {
  mins: number[];
  maxs: number[];
  clusterCounts: Record<number, number>;
}

export function useSOM() {
  const [isTraining, setIsTraining] = useState(false);
  const [som, setSom] = useState<SelfOrganizingMap | null>(null);
  const [stats, setStats] = useState<TrainingStats | null>(null);

  const trainModel = useCallback(async (
    data: NutritionData[],
    gridSize: number = 5,
    learningRate: number = 0.5,
    iterations: number = 100
  ) => {
    setIsTraining(true);

    try {
      const features = data.map(d => [
        d.calories,
        d.protein,
        d.iron,
        d.calcium,
        d.vitamins,
        d.fatigue_level,
        d.energy_level,
      ]);

      const { normalized, mins, maxs } = normalizeData(features);

      const somModel = new SelfOrganizingMap(
        gridSize,
        features[0].length,
        learningRate,
        iterations
      );

      somModel.train(normalized);

      const clusterCounts: Record<number, number> = {};
      const updates = [];

      for (let i = 0; i < data.length; i++) {
        const clusterId = somModel.predict(normalized[i]);
        clusterCounts[clusterId] = (clusterCounts[clusterId] || 0) + 1;

        if (data[i].id) {
          updates.push({
            id: data[i].id,
            cluster_id: clusterId,
          });
        }
      }

      for (const update of updates) {
        await supabase
          .from('nutrition_data')
          .update({ cluster_id: update.cluster_id })
          .eq('id', update.id);
      }

      const modelData: SOMModel = {
        name: `SOM_${new Date().toISOString()}`,
        grid_size: gridSize,
        learning_rate: learningRate,
        iterations: iterations,
        weights: somModel.getWeights(),
        training_date: new Date().toISOString(),
      };

      await supabase.from('som_models').insert(modelData);

      setSom(somModel);
      setStats({ mins, maxs, clusterCounts });

      return { success: true, clusterCounts };
    } catch (error) {
      console.error('Training error:', error);
      return { success: false, error: String(error) };
    } finally {
      setIsTraining(false);
    }
  }, []);

  const predictCluster = useCallback(
    (input: NutritionData): number | null => {
      if (!som || !stats) return null;

      const features = [
        input.calories,
        input.protein,
        input.iron,
        input.calcium,
        input.vitamins,
        input.fatigue_level,
        input.energy_level,
      ];

      const normalized = normalizeInput(features, stats.mins, stats.maxs);
      return som.predict(normalized);
    },
    [som, stats]
  );

  return {
    trainModel,
    predictCluster,
    isTraining,
    som,
    stats,
  };
}
