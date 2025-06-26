import { ActivatedRoute } from '@angular/router';
import { Component, signal, computed, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { NgClass } from '@angular/common';
import {
  RetroalimentacionService,
  RetroalimentacionIA,
} from '../../services/retroalimentacion.service';

interface AspectoEvaluado {
  categoria: string;
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
  imports: [DatePipe, NgClass],
  templateUrl: './resumen.component.html',
})
export class ResumenComponent implements OnInit {
  evaluaciones = signal<EvaluacionResumenDto[]>([]);
  alumnoId = signal<number | null>(null);
  loading = false;
  error = '';
  categorias = [
    'Desempeño Académico',
    'Socioemocional',
    'Relaciones Interpersonales',
    'Hábitos y Rutinas',
    'Acompañamiento Familiar',
  ];
  retro: RetroalimentacionIA | null = null;
  cargandoRetro = false;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private retroService: RetroalimentacionService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.alumnoId.set(id ? Number(id) : null);
    this.cargarEvaluaciones();
  }

  async cargarEvaluaciones() {
    this.loading = true;
    this.http.get<EvaluacionResumenDto[]>('/api/evaluaciones').subscribe({
      next: async (res) => {
        this.evaluaciones.set(res);
        this.loading = false;
        // Busca la última evaluación de este alumno
        const lista = this.evaluacionesFiltradas();
        if (lista.length > 0) {
          const ultimaEv = lista[0]; // o la que decidas
          this.cargandoRetro = true;
          this.retro = await this.retroService.getPorEvaluacion(ultimaEv.id);
          this.cargandoRetro = false;
        } else {
          this.retro = null;
        }
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
    return this.evaluaciones().filter((ev) => ev.alumnoId === id);
  });

  nombreAlumno = computed(() => {
    const lista = this.evaluacionesFiltradas();
    return lista.length > 0 ? lista[0].alumnoNombre : '';
  });

  // Signal: agrupa y cuenta aspectos por riesgo y por categoría
  kpiPorCategoria = computed(() => {
    const evals = this.evaluacionesFiltradas();
    const todosAspectos = evals.flatMap((ev) => ev.aspectos);

    const resumen: Record<
      string,
      { Bajo: number; Medio: number; Alto: number }
    > = {};
    for (const cat of this.categorias) {
      resumen[cat] = { Bajo: 0, Medio: 0, Alto: 0 };
    }

    for (const asp of todosAspectos) {
      if (asp.categoria && resumen[asp.categoria]) {
        resumen[asp.categoria][asp.riesgo]++;
      }
    }
    return resumen;
  });

  // Signal: calcula el nivel global de riesgo
  nivelGlobal = computed(() => {
    const resumen = this.kpiPorCategoria();
    let totalBajo = 0,
      totalMedio = 0,
      totalAlto = 0;
    for (const cat of this.categorias) {
      totalBajo += resumen[cat].Bajo;
      totalMedio += resumen[cat].Medio;
      totalAlto += resumen[cat].Alto;
    }
    // Retorna el color dominante
    if (totalAlto >= totalMedio && totalAlto >= totalBajo) return 'Alto';
    if (totalMedio >= totalBajo) return 'Medio';
    return 'Bajo';
  });

  // Devuelve "Alto", "Medio" o "Bajo" para cada categoría
  semaforoCategoria = computed(() => {
    const resumen = this.kpiPorCategoria();
    const resultado: Record<string, 'Bajo' | 'Medio' | 'Alto'> = {};
    for (const cat of this.categorias) {
      const { Bajo, Medio, Alto } = resumen[cat];
      if (Alto >= Medio && Alto >= Bajo && Alto > 0) resultado[cat] = 'Alto';
      else if (Medio >= Bajo && Medio > 0) resultado[cat] = 'Medio';
      else resultado[cat] = 'Bajo';
    }
    return resultado;
  });

  async generarRetro() {
    if (!this.evaluacionesFiltradas().length) return;
    const ultimaEv = this.evaluacionesFiltradas()[0];
    this.cargandoRetro = true;
    this.retro = await this.retroService.generarRetroalimentacionIA(
      ultimaEv.id
    );
    this.cargandoRetro = false;
  }
}
