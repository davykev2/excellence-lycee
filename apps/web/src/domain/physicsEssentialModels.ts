export const resonanceMeasurements = { frequency: [0,100,160,180,185,200,202,206,210,220,260], current: [0,16,50,90,107,150,107,100,80,50,30] } as const;
export const acidBaseMeasurements = {
  baseVolumes: [0,2,4.1,6,8.1,10,12.4,14.1,16,18,18.5,19,19.5,20,20.5,21,21.5,22,22.5,23,24,25,30],
  increasingPh: [1.94,2.02,2.11,2.19,2.29,2.39,2.53,2.66,2.84,3.12,3.24,3.40,3.60,4.01,5.57,7.14,9.48,9.79,10.03,10.18,10.37,10.52,10.60],
  acidVolumes: [0,10,20,30,40,45,48,49,52,55,60,70,80],
  decreasingPh: [11.70,11.40,11.10,10.80,10.50,10.20,9.80,9.40,4.40,3.60,3.40,3.20,3.00],
} as const;

export const physicsEssentialPresets = ["position","frenet","forces","projectile","electric-field","oscillator","magnetic","superposition","charged-particle","laplace","flux","induction","aop","lc","fresnel","resonance","radioactivity","carbonyl","amino-forms","ph","predominance","titration"] as const;

export function projectileModel(angleDegrees: number, speed = 20, g = 9.81) {
  const angle = angleDegrees * Math.PI / 180;
  return { duration: 2 * speed * Math.sin(angle) / g, range: speed ** 2 * Math.sin(2 * angle) / g, height: speed ** 2 * Math.sin(angle) ** 2 / (2 * g), vx: speed * Math.cos(angle), vz: speed * Math.sin(angle) };
}
export function oscillatorFractions(phaseDegrees: number) {
  const angle = phaseDegrees * Math.PI / 180;
  return { displacement: Math.cos(angle), speed: -Math.sin(angle), potential: Math.cos(angle) ** 2, kinetic: Math.sin(angle) ** 2 };
}
export function conjugateFractions(phMinusPka: number) {
  const ratio = 10 ** phMinusPka;
  return { ratio, acid: 1 / (1 + ratio), base: ratio / (1 + ratio) };
}
