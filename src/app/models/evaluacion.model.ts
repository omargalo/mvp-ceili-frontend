export interface AspectoEvaluado {
  nombre: string;
  riesgo: 'Bajo' | 'Medio' | 'Alto';
}

export interface Evaluacion {
  alumno: string;
  grupo: string;
  fecha: string; // ISO
  aspectos: AspectoEvaluado[];
  observacionDocente: string;
}
