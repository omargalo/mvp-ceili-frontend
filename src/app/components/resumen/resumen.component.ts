import { ActivatedRoute } from '@angular/router';
import { Component, signal, computed, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';

interface AspectoEvaluado {
  nombre: string;
  riesgo: 'Bajo' | 'Medio' | 'Alto';
}
interface EvaluacionResumenDto {
  alumnoId: number;
  id: number;
  alumnoNombre: string;
  fecha: string;
  observacionDocente: string;
  aspectos: AspectoEvaluado[];
}

@Component({
  selector: 'app-resumen',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './resumen.component.html',
})
export class ResumenComponent implements OnInit {
  evaluaciones = signal<EvaluacionResumenDto[]>([]);
  alumnoId = signal<number | null>(null);
  loading = false;
  error = '';

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.alumnoId.set(id ? Number(id) : null);
    this.cargarEvaluaciones();
  }

  cargarEvaluaciones() {
    this.loading = true;
    this.http.get<EvaluacionResumenDto[]>('/api/evaluaciones').subscribe({
      next: (res) => {
        this.evaluaciones.set(res);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'No se pudieron cargar las evaluaciones.';
        this.loading = false;
      },
    });
  }

  evaluacionesFiltradas = computed(() => {
    const id = this.alumnoId();
    if (!id) return [];
    return this.evaluaciones().filter(ev => ev.alumnoId === id);
  });

  nombreAlumno = computed(() => {
    const lista = this.evaluacionesFiltradas();
    return lista.length > 0 ? lista[0].alumnoNombre : '';
  });
}
