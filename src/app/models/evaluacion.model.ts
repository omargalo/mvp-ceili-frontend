export interface AspectoEvaluado {
  categoria: string;
  nombre: string;
  riesgo: 'Bajo' | 'Medio' | 'Alto';
}

export interface Evaluacion {
  alumno: string;
  fecha: string;
  aspectos: AspectoEvaluado[];
  observacionDocente: string;
}
