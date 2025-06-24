import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Evaluacion, AspectoEvaluado } from '../../models/evaluacion.model';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Alumno {
  id: number;
  nombreCompleto: string;
  edad: number;
  sexo: string;
}

@Component({
  selector: 'app-evaluation-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './evaluation-form.component.html',
})
export class EvaluationFormComponent implements OnInit {
  alumno: Alumno | null = null;
  loading = false;
  error = '';

  aspectosBase = [
    'Desempeño académico',
    'Participación en clase',
    'Estado de ánimo',
    'Relación con compañeros',
    'Asistencia y puntualidad',
    'Higiene y autocuidado',
    'Acompañamiento familiar',
  ];
  evaluacion: Evaluacion = {
    alumno: '',
    fecha: new Date().toISOString(),
    aspectos: [],
    observacionDocente: '',
  };

  constructor(private route: ActivatedRoute, private http: HttpClient) {
    this.evaluacion.aspectos = this.aspectosBase.map((nombre) => ({
      nombre,
      riesgo: 'Bajo',
    }));
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarAlumno(Number(id));
    }
  }

  cargarAlumno(id: number) {
    this.loading = true;
    this.http.get<Alumno>(`/api/alumnos/${id}`).subscribe({
      next: (data) => {
        this.alumno = data;
        // Prellenar nombre en la evaluación:
        this.evaluacion.alumno = data.nombreCompleto;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'No se pudo cargar la información del alumno.';
        this.loading = false;
      },
    });
  }

  enviar() {
    if (!this.alumno) return;

    const evaluacionPost = {
      alumnoId: this.alumno.id,
      aspectos: this.evaluacion.aspectos,
      observacionDocente: this.evaluacion.observacionDocente,
      fecha: new Date().toISOString(),
    };

    this.http.post('/api/evaluaciones', evaluacionPost).subscribe({
      next: (resp) => {
        alert('¡Evaluación enviada correctamente!');
        // Opcional: limpiar formulario, redirigir, etc.
      },
      error: (err) => {
        alert('Error al enviar la evaluación.');
      },
    });
  }
}
