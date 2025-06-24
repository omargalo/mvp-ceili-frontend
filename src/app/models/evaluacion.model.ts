export interface AspectoEvaluado {
  nombre: string;
  riesgo: 'Bajo' | 'Medio' | 'Alto';
}

export interface Evaluacion {
  alumno: string;
  fecha: string;
  aspectos: AspectoEvaluado[];
  observacionDocente: string;
}
