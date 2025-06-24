import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Alumno {
  id: number;
  nombreCompleto: string;
  edad: number;
  sexo: string;
}

@Component({
  selector: 'app-alumnos',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './alumnos.component.html'
})
export class AlumnosComponent implements OnInit {
  alumnos: Alumno[] = [];
  alumno: Partial<Alumno> = {};
  editando: Alumno | null = null;
  error = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cargarAlumnos();
  }

  cargarAlumnos() {
    this.http.get<Alumno[]>('/api/alumnos').subscribe({
      next: res => this.alumnos = res,
      error: err => this.error = 'No se pudieron cargar los alumnos.'
    });
  }

  guardarAlumno() {
    if (this.editando) {
      // Editar
      this.http.put<Alumno>(`/api/alumnos/${this.editando.id}`, this.alumno).subscribe({
        next: () => {
          this.cargarAlumnos();
          this.cancelar();
        },
        error: err => this.error = 'Error al editar alumno.'
      });
    } else {
      // Crear
      this.http.post<Alumno>('/api/alumnos', this.alumno).subscribe({
        next: () => {
          this.cargarAlumnos();
          this.cancelar();
        },
        error: err => this.error = 'Error al agregar alumno.'
      });
    }
  }

  editarAlumno(alumno: Alumno) {
    this.editando = alumno;
    this.alumno = { ...alumno };
  }

  eliminarAlumno(id: number) {
    if (confirm('¿Eliminar este alumno?')) {
      this.http.delete(`/api/alumnos/${id}`).subscribe({
        next: () => this.cargarAlumnos(),
        error: err => this.error = 'Error al eliminar alumno.'
      });
    }
  }

  cancelar() {
    this.editando = null;
    this.alumno = {};
    this.error = '';
  }
}
