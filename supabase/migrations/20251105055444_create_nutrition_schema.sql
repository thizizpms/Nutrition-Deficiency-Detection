/*
  # Nutrition Deficiency Detection Schema

  1. New Tables
    - `nutrition_data`
      - `id` (uuid, primary key)
      - `calories` (numeric) - Daily calorie intake
      - `protein` (numeric) - Protein in grams
      - `iron` (numeric) - Iron in mg
      - `calcium` (numeric) - Calcium in mg
      - `vitamins` (integer) - Vitamin level (1-9 scale)
      - `fatigue_level` (integer) - Fatigue level (1-9 scale)
      - `energy_level` (integer) - Energy level (1-9 scale)
      - `cluster_id` (integer) - SOM cluster assignment
      - `created_at` (timestamptz) - Record creation timestamp
    
    - `som_models`
      - `id` (uuid, primary key)
      - `name` (text) - Model name
      - `grid_size` (integer) - SOM grid dimension
      - `learning_rate` (numeric) - Training learning rate
      - `iterations` (integer) - Training iterations
      - `weights` (jsonb) - Trained SOM weights
      - `training_date` (timestamptz) - Model training timestamp
      - `created_at` (timestamptz) - Record creation timestamp

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to read and write data
    - Public read access for demonstration purposes
*/

CREATE TABLE IF NOT EXISTS nutrition_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  calories numeric NOT NULL,
  protein numeric NOT NULL,
  iron numeric NOT NULL,
  calcium numeric NOT NULL,
  vitamins integer NOT NULL,
  fatigue_level integer NOT NULL,
  energy_level integer NOT NULL,
  cluster_id integer DEFAULT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS som_models (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  grid_size integer NOT NULL DEFAULT 5,
  learning_rate numeric NOT NULL DEFAULT 0.5,
  iterations integer NOT NULL DEFAULT 100,
  weights jsonb DEFAULT NULL,
  training_date timestamptz DEFAULT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE nutrition_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE som_models ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to nutrition data"
  ON nutrition_data
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert access to nutrition data"
  ON nutrition_data
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update access to nutrition data"
  ON nutrition_data
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public read access to som models"
  ON som_models
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert access to som models"
  ON som_models
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update access to som models"
  ON som_models
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);