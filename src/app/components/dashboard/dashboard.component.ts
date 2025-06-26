import { Component, OnInit, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

interface EvaluacionResumenDto {
  alumnoId: number;
  id: number;
  alumnoNombre: string;
  fecha: string;
  observacionDocente: string;
  aspectos: { categoria: string; nombre: string; riesgo: 'Bajo' | 'Medio' | 'Alto' }[];
}

@Component({
  selector: 'app-dashboard',
  imports: [DatePipe, NgClass, RouterLink],
  standalone: true,
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  evaluaciones = signal<EvaluacionResumenDto[]>([]);
  loading = false;
  error = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loading = true;
    this.http.get<EvaluacionResumenDto[]>('/api/evaluaciones').subscribe({
      next: res => {
        this.evaluaciones.set(res);
        this.loading = false;
      },
      error: _ => {
        this.error = 'No se pudieron cargar las evaluaciones.';
        this.loading = false;
      }
    });
  }

  // Agrupa por alumno y selecciona la última evaluación de cada uno
  ultimasEvaluaciones = computed(() => {
    const map = new Map<number, EvaluacionResumenDto>();
    for (const ev of this.evaluaciones()) {
      if (!map.has(ev.alumnoId) || new Date(ev.fecha) > new Date(map.get(ev.alumnoId)!.fecha)) {
        map.set(ev.alumnoId, ev);
      }
    }
    return Array.from(map.values());
  });

  totalAlumnos = computed(() => this.ultimasEvaluaciones().length);
  totalEvaluaciones = computed(() => this.evaluaciones().length);

  // Calcula el riesgo global por alumno (igual que el resumen)
  riesgoAlumno = (ev: EvaluacionResumenDto) => {
    let bajo = 0, medio = 0, alto = 0;
    for (const asp of ev.aspectos) {
      if (asp.riesgo === 'Bajo') bajo++;
      else if (asp.riesgo === 'Medio') medio++;
      else if (asp.riesgo === 'Alto') alto++;
    }
    if (alto >= medio && alto >= bajo && alto > 0) return 'Alto';
    if (medio >= bajo && medio > 0) return 'Medio';
    return 'Bajo';
  };

  // Porcentaje de alumnos en cada nivel de riesgo
  porcentajeRiesgo = computed(() => {
    const total = this.totalAlumnos();
    let bajos = 0, medios = 0, altos = 0;
    for (const ev of this.ultimasEvaluaciones()) {
      const r = this.riesgoAlumno(ev);
      if (r === 'Bajo') bajos++;
      else if (r === 'Medio') medios++;
      else if (r === 'Alto') altos++;
    }
    return {
      bajo: total ? Math.round(100 * bajos / total) : 0,
      medio: total ? Math.round(100 * medios / total) : 0,
      alto: total ? Math.round(100 * altos / total) : 0
    };
  });
}
