export class SelfOrganizingMap {
  private gridSize: number;
  private inputSize: number;
  private weights: number[][][];
  private learningRate: number;
  private iterations: number;

  constructor(
    gridSize: number,
    inputSize: number,
    learningRate: number = 0.5,
    iterations: number = 100
  ) {
    this.gridSize = gridSize;
    this.inputSize = inputSize;
    this.learningRate = learningRate;
    this.iterations = iterations;
    this.weights = this.initializeWeights();
  }

  private initializeWeights(): number[][][] {
    const weights: number[][][] = [];
    for (let i = 0; i < this.gridSize; i++) {
      weights[i] = [];
      for (let j = 0; j < this.gridSize; j++) {
        weights[i][j] = [];
        for (let k = 0; k < this.inputSize; k++) {
          weights[i][j][k] = Math.random();
        }
      }
    }
    return weights;
  }

  private euclideanDistance(a: number[], b: number[]): number {
    return Math.sqrt(
      a.reduce((sum, val, idx) => sum + Math.pow(val - b[idx], 2), 0)
    );
  }

  private findBMU(input: number[]): [number, number] {
    let minDistance = Infinity;
    let bmuX = 0;
    let bmuY = 0;

    for (let i = 0; i < this.gridSize; i++) {
      for (let j = 0; j < this.gridSize; j++) {
        const distance = this.euclideanDistance(input, this.weights[i][j]);
        if (distance < minDistance) {
          minDistance = distance;
          bmuX = i;
          bmuY = j;
        }
      }
    }

    return [bmuX, bmuY];
  }

  private neighborhoodRadius(iteration: number): number {
    return (
      (this.gridSize / 2) *
      Math.exp(-iteration / (this.iterations / Math.log(this.gridSize / 2)))
    );
  }

  private neighborhoodInfluence(
    distance: number,
    radius: number,
    iteration: number
  ): number {
    const learningRateDecay =
      this.learningRate * Math.exp(-iteration / this.iterations);
    return learningRateDecay * Math.exp(-(distance * distance) / (2 * radius * radius));
  }

  train(data: number[][]): void {
    for (let iter = 0; iter < this.iterations; iter++) {
      const radius = this.neighborhoodRadius(iter);

      for (const input of data) {
        const [bmuX, bmuY] = this.findBMU(input);

        for (let i = 0; i < this.gridSize; i++) {
          for (let j = 0; j < this.gridSize; j++) {
            const distance = Math.sqrt(
              Math.pow(bmuX - i, 2) + Math.pow(bmuY - j, 2)
            );

            if (distance <= radius) {
              const influence = this.neighborhoodInfluence(
                distance,
                radius,
                iter
              );

              for (let k = 0; k < this.inputSize; k++) {
                this.weights[i][j][k] +=
                  influence * (input[k] - this.weights[i][j][k]);
              }
            }
          }
        }
      }
    }
  }

  predict(input: number[]): number {
    const [bmuX, bmuY] = this.findBMU(input);
    return bmuX * this.gridSize + bmuY;
  }

  getWeights(): number[][][] {
    return this.weights;
  }

  setWeights(weights: number[][][]): void {
    this.weights = weights;
  }
}

export function normalizeData(data: number[][]): {
  normalized: number[][];
  mins: number[];
  maxs: number[];
} {
  const numFeatures = data[0].length;
  const mins: number[] = new Array(numFeatures).fill(Infinity);
  const maxs: number[] = new Array(numFeatures).fill(-Infinity);

  for (const row of data) {
    for (let i = 0; i < numFeatures; i++) {
      mins[i] = Math.min(mins[i], row[i]);
      maxs[i] = Math.max(maxs[i], row[i]);
    }
  }

  const normalized = data.map((row) =>
    row.map((val, idx) => {
      const range = maxs[idx] - mins[idx];
      return range === 0 ? 0 : (val - mins[idx]) / range;
    })
  );

  return { normalized, mins, maxs };
}

export function normalizeInput(
  input: number[],
  mins: number[],
  maxs: number[]
): number[] {
  return input.map((val, idx) => {
    const range = maxs[idx] - mins[idx];
    return range === 0 ? 0 : (val - mins[idx]) / range;
  });
}
