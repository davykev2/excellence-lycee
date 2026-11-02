import type { CourseNativeFigure } from "../../../domain/courseDocument";
import { GcdFigure } from "../../mathematics/GcdFigure";
import { IntegralFigure } from "../../mathematics/IntegralFigure";
import { DifferentialFigure } from "../../mathematics/DifferentialFigure";
import { ProbabilityFigure } from "../../mathematics/ProbabilityFigure";
import { StatisticsFigure } from "../../mathematics/StatisticsFigure";
import { BarycenterFigure } from "../../mathematics/BarycenterFigure";
import { ArithmeticFigure } from "../../mathematics/ArithmeticFigure";
import { SpaceGeometryFigure } from "../../mathematics/SpaceGeometryFigure";
import { ConicFigure } from "../../mathematics/ConicFigure";
import { ComplexFigure } from "../../mathematics/ComplexFigure";
import { PhysicsEssentialFigure } from "./PhysicsEssentialFigure";
import { BiologyEssentialFigure } from "./BiologyEssentialFigure";

export function DocumentNativeFigure({figure}:{figure:CourseNativeFigure}){
  if(figure.kind==="biology")return <BiologyEssentialFigure preset={figure.preset}/>;
  if(figure.kind==="physics")return <PhysicsEssentialFigure preset={figure.preset}/>;
  if(figure.kind==="gcd")return <GcdFigure preset={figure.preset}/>;
  if(figure.kind==="complex")return <ComplexFigure preset={figure.preset}/>;
  if(figure.kind==="conic")return <ConicFigure preset={figure.preset}/>;
  if(figure.kind==="space")return <SpaceGeometryFigure preset={figure.preset}/>;
  if(figure.kind==="arithmetic")return <ArithmeticFigure preset={figure.preset}/>;
  if(figure.kind==="barycenter")return <BarycenterFigure preset={figure.preset}/>;
  if(figure.kind==="integral")return <IntegralFigure preset={figure.preset}/>;
  if(figure.kind==="differential")return <DifferentialFigure preset={figure.preset}/>;
  if(figure.kind==="statistics")return <StatisticsFigure preset={figure.preset}/>;
  return <ProbabilityFigure preset={figure.preset}/>;
}
