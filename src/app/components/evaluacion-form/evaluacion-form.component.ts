import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Evaluacion, AspectoEvaluado } from '../../models/evaluacion.model';

@Component({
  selector: 'app-evaluation-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './evaluation-form.component.html'
})
export class EvaluationFormComponent {
  aspectosBase = [
    "Desempeño académico",
    "Participación en clase",
    "Estado de ánimo",
    "Relación con compañeros",
    "Asistencia y puntualidad",
    "Higiene y autocuidado",
    "Acompañamiento familiar"
  ];
  evaluacion: Evaluacion = {
    alumno: '',
    grupo: '',
    fecha: new Date().toISOString(),
    aspectos: [],
    observacionDocente: ''
  };

  constructor() {
    this.evaluacion.aspectos = this.aspectosBase.map(nombre => ({
      nombre,
      riesgo: 'Bajo'
    }));
  }

  enviar() {
    // Aquí iría la llamada a tu servicio backend
    console.log('Evaluación enviada:', this.evaluacion);
    alert('Evaluación enviada:\n' + JSON.stringify(this.evaluacion, null, 2));
    // Limpia el formulario si lo deseas
    this.evaluacion.alumno = '';
    this.evaluacion.grupo = '';
    this.evaluacion.fecha = new Date().toISOString();
    this.evaluacion.aspectos = this.aspectosBase.map(nombre => ({
      nombre,
      riesgo: 'Bajo'
    }));
    this.evaluacion.observacionDocente = '';
  }
}
