import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface NutritionData {
  id?: string;
  calories: number;
  protein: number;
  iron: number;
  calcium: number;
  vitamins: number;
  fatigue_level: number;
  energy_level: number;
  cluster_id?: number | null;
  created_at?: string;
}

export interface SOMModel {
  id?: string;
  name: string;
  grid_size: number;
  learning_rate: number;
  iterations: number;
  weights?: number[][][];
  training_date?: string | null;
  created_at?: string;
}
