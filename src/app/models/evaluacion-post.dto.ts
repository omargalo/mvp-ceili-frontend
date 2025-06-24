import { AspectoEvaluado } from "./evaluacion.model";

export interface EvaluacionPostDto {
  alumnoId: number;
  aspectos: AspectoEvaluado[];
  observacionDocente: string;
  fecha?: string;
}