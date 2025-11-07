import { supabase, NutritionData } from './supabase';

export async function parseCSV(csvText: string): Promise<NutritionData[]> {
  const lines = csvText.trim().split('\n');
  const data: NutritionData[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    if (values.length === 7) {
      data.push({
        calories: parseFloat(values[0]),
        protein: parseFloat(values[1]),
        iron: parseFloat(values[2]),
        calcium: parseFloat(values[3]),
        vitamins: parseInt(values[4]),
        fatigue_level: parseInt(values[5]),
        energy_level: parseInt(values[6]),
      });
    }
  }

  return data;
}

export async function importDataToDatabase(data: NutritionData[]): Promise<void> {
  const { error } = await supabase.from('nutrition_data').insert(data);

  if (error) {
    throw new Error(`Failed to import data: ${error.message}`);
  }
}

export async function loadDatasetFromFile(): Promise<NutritionData[]> {
  try {
    const response = await fetch('/data/nutrition_dataset.csv');
    const csvText = await response.text();
    return await parseCSV(csvText);
  } catch (error) {
    throw new Error('Failed to load dataset file');
  }
}

export async function getAllNutritionData(): Promise<NutritionData[]> {
  const { data, error } = await supabase
    .from('nutrition_data')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch data: ${error.message}`);
  }

  return data || [];
}

export async function clearAllData(): Promise<void> {
  const { error } = await supabase
    .from('nutrition_data')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');

  if (error) {
    throw new Error(`Failed to clear data: ${error.message}`);
  }
}
