export interface Layer {
  thickness: number; // mm
  conductivity: number; // W/mK
}

export function calculateThermalPerformance(
  layers: Layer[],
  area: number,
  insideTemp: number,
  outsideTemp: number
) {
  // 1. Calculate Individual Resistances (R = d/k)
  // Converting thickness from mm to m
  const resistances = layers.map(l => (l.thickness / 1000) / l.conductivity);

  // 2. R_total
  const rTotal = resistances.reduce((a, b) => a + b, 0);

  // 3. U-Value (1/R)
  const uValue = 1 / rTotal;

  // 4. Heat Loss (Q = U * A * dT)
  const deltaT = insideTemp - outsideTemp;
  const heatLoss = uValue * area * deltaT;
  const heatLossDensity = uValue * deltaT; // W/m2

  // 5. Temperature Profile
  const tempProfile = [{ position: 0, temp: insideTemp }];
  let currentPos = 0;
  let currentTemp = insideTemp;

  for (let i = 0; i < layers.length; i++) {
    currentPos += layers[i].thickness;
    currentTemp -= heatLossDensity * resistances[i];
    tempProfile.push({
      position: currentPos,
      temp: parseFloat(currentTemp.toFixed(2)),
    });
  }

  // 6. Efficiency Rating (Simplified 0-100 score based on U-value)
  // Standard insulation targets often around 0.15-0.20 U-value
  // Score = 100 - (U * 50), clamped 0-100
  const efficiency = Math.max(0, Math.min(100, Math.round(100 - (uValue * 50))));

  return {
    uValue: parseFloat(uValue.toFixed(4)),
    rValue: parseFloat(rTotal.toFixed(4)),
    heatLoss: parseFloat(heatLoss.toFixed(2)),
    efficiency,
    tempProfile,
  };
}
