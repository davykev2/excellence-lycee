import type { DerivativePlotModel } from "../arena/exercises/derivativePlotModels";

/** Closed, reviewed formulas; no expression or code is executed from learner input. */
export const firstOrderSolution = (a: number, initial: number, x: number) => initial * Math.exp(a * x);
export const oscillatorSolution = (omega: number, initial: number, velocity: number, x: number) =>
  initial * Math.cos(omega * x) + velocity / omega * Math.sin(omega * x);
export const coolingTemperature = (t: number) => 15 + 65 * Math.exp(-2 * t);
export const modelConcentration = (t: number) => 4 * t * Math.exp(-t);
export const dissolvedMass = (t: number) => 50 * (1 - Math.pow(3 / 5, t / 10));
export const objectTemperature = (t: number) => 10 + 90 * Math.pow(3, -t);
export const coolingTime45 = Math.log(13 / 6) / 2;
export const objectThresholdTime = Math.log(18) / Math.log(3);

/** Bisection is used only on these two known brackets of a fixed, continuous function. */
export function concentrationCrossings(): [number, number] {
  const root = (left: number, right: number) => {
    for (let i = 0; i < 60; i++) {
      const middle = (left + right) / 2;
      if ((modelConcentration(left) - .9) * (modelConcentration(middle) - .9) <= 0) right = middle;
      else left = middle;
    }
    return (left + right) / 2;
  };
  return [root(0, 1), root(1, 6)];
}
const series = (fn: (x: number) => number, a: number, b: number, label: string, secondary = false) =>
  ({ fn, ranges: [[a,b] as [number,number]], label, secondary });
export function differentialPlotModel(number: number): { title: string; axes: [string,string]; model: DerivativePlotModel } | null {
  if (number === 34) return {
    title: "Refroidissement · t en heures · q en °C", axes: ["t (h)","q (°C)"],
    model: { bounds: [0,2,0,90], step: [.5,15], series: [series(coolingTemperature,0,2,"q(t) = 15 + 65e⁻²ᵗ")],
      guides: [{label:"Température de la salle : 15 °C",from:[0,15],to:[2,15]},{label:"45 °C",from:[0,45],to:[2,45]}],
      points: [{x:0,y:80,label:"80 °C"},{x:coolingTime45,y:45,label:"45 °C"},{x:.5,y:coolingTemperature(.5),label:"30 min"}] },
  };
  if (number === 37) {
    const [t1,t2] = concentrationCrossings();
    return { title: "f(t) = 4te⁻ᵗ · repère orthonormé", axes: ["t (h)","f (g/L)"],
      model: { bounds:[0,4,0,1.8],orthonormal:true,step:[.5,.3],series:[series(modelConcentration,0,4,"f(t) = 4te⁻ᵗ")],
        guides:[{label:"Seuil 0,9 g/L",from:[0,.9],to:[4,.9]}],
        points:[{x:1,y:4/Math.E,label:"M"},{x:t1,y:.9,label:"S₁"},{x:t2,y:.9,label:"S₂"}] } };
  }
  if (number === 38) return {
    title: "Masse dissoute et masse restante · t en minutes", axes: ["t (min)","masse (g)"],
    model: { bounds:[0,70,0,55],step:[10,10],
      series:[series(dissolvedMass,0,70,"Masse dissoute f(t)"),series(t=>50-dissolvedMass(t),0,70,"Masse restante 50 − f(t)",true)],
      guides:[{label:"Masse initiale : 50 g",from:[0,50],to:[70,50]}],points:[{x:10,y:20,label:"(10 ; 20)"}] },
  };
  if (number === 39) return {
    title: "Température de l’objet · relevés chaque minute", axes: ["t (min)","T (°C)"],
    model: { bounds:[0,5,0,105],step:[1,15],series:[series(objectTemperature,0,5,"T(t) = 10 + 90 × 3⁻ᵗ")],
      guides:[{label:"Seuil 15 °C",from:[0,15],to:[5,15]},{label:"Température ambiante 10 °C",from:[0,10],to:[5,10]}],
      points:[{x:2,y:20,label:"2 min"},{x:3,y:objectTemperature(3),label:"3 min"}] },
  };
  return null;
}
