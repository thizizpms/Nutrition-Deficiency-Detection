import { BarChart3, TrendingUp, Users, Zap } from 'lucide-react';
import { NutritionData } from '../lib/supabase';

interface StatisticsPanelProps {
  data: NutritionData[];
}

export function StatisticsPanel({ data }: StatisticsPanelProps) {
  if (data.length === 0) {
    return null;
  }

  const avgCalories = data.reduce((sum, d) => sum + d.calories, 0) / data.length;
  const avgProtein = data.reduce((sum, d) => sum + d.protein, 0) / data.length;
  const avgEnergy = data.reduce((sum, d) => sum + d.energy_level, 0) / data.length;
  const avgFatigue = data.reduce((sum, d) => sum + d.fatigue_level, 0) / data.length;

  const stats = [
    {
      label: 'Avg Calories',
      value: avgCalories.toFixed(0),
      icon: <BarChart3 className="w-5 h-5" />,
      color: 'blue',
    },
    {
      label: 'Avg Protein',
      value: `${avgProtein.toFixed(1)}g`,
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'green',
    },
    {
      label: 'Total Records',
      value: data.length.toString(),
      icon: <Users className="w-5 h-5" />,
      color: 'purple',
    },
    {
      label: 'Avg Energy',
      value: avgEnergy.toFixed(1),
      icon: <Zap className="w-5 h-5" />,
      color: 'amber',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
        >
          <div className={`inline-flex p-3 rounded-lg bg-${stat.color}-100 text-${stat.color}-600 mb-3`}>
            {stat.icon}
          </div>
          <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
          <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
