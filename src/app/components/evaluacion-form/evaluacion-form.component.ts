import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Evaluacion, AspectoEvaluado } from '../../models/evaluacion.model';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface CategoriaAspecto {
  nombre: string;
  aspectos: AspectoEvaluado[];
}

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

  // CATEGORÍAS Y ASPECTOS
  categorias: CategoriaAspecto[] = [
    {
      nombre: 'Desempeño Académico',
      aspectos: [
        { nombre: 'Comprensión lectora', riesgo: 'Bajo' },
        { nombre: 'Resolución de problemas matemáticos', riesgo: 'Bajo' },
        { nombre: 'Expresión escrita', riesgo: 'Bajo' },
        { nombre: 'Participación en proyectos/tareas', riesgo: 'Bajo' },
        { nombre: 'Atención y concentración', riesgo: 'Bajo' }
      ]
    },
    {
      nombre: 'Socioemocional',
      aspectos: [
        { nombre: 'Estado de ánimo general', riesgo: 'Bajo' },
        { nombre: 'Autoestima', riesgo: 'Bajo' },
        { nombre: 'Gestión de emociones', riesgo: 'Bajo' },
        { nombre: 'Manejo de frustración', riesgo: 'Bajo' },
        { nombre: 'Actitud ante el aprendizaje', riesgo: 'Bajo' }
      ]
    },
    {
      nombre: 'Relaciones Interpersonales',
      aspectos: [
        { nombre: 'Relación con compañeros', riesgo: 'Bajo' },
        { nombre: 'Relación con docentes', riesgo: 'Bajo' },
        { nombre: 'Resolución de conflictos', riesgo: 'Bajo' },
        { nombre: 'Trabajo en equipo', riesgo: 'Bajo' },
        { nombre: 'Integración al grupo', riesgo: 'Bajo' }
      ]
    },
    {
      nombre: 'Hábitos y Rutinas',
      aspectos: [
        { nombre: 'Asistencia', riesgo: 'Bajo' },
        { nombre: 'Puntualidad', riesgo: 'Bajo' },
        { nombre: 'Cumplimiento de tareas', riesgo: 'Bajo' },
        { nombre: 'Organización de materiales', riesgo: 'Bajo' },
        { nombre: 'Autonomía en el trabajo escolar', riesgo: 'Bajo' }
      ]
    },
    {
      nombre: 'Acompañamiento Familiar',
      aspectos: [
        { nombre: 'Comunicación con la familia', riesgo: 'Bajo' },
        { nombre: 'Interés y apoyo familiar', riesgo: 'Bajo' },
        { nombre: 'Estabilidad emocional en el hogar', riesgo: 'Bajo' },
        { nombre: 'Supervisión de tareas', riesgo: 'Bajo' },
        { nombre: 'Participación en reuniones escolares', riesgo: 'Bajo' }
      ]
    }
  ];

  evaluacion: Evaluacion = {
    alumno: '',
    fecha: new Date().toISOString(),
    aspectos: [], // No se usa directamente en el form, pero se llena al enviar.
    observacionDocente: '',
  };

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

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

    // Junta todos los aspectos de todas las categorías en un solo arreglo plano
    const aspectos: AspectoEvaluado[] = this.categorias.flatMap(c => c.aspectos);

    const evaluacionPost = {
      alumnoId: this.alumno.id,
      aspectos,
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
