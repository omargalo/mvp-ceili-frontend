import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService, RegistroDocenteDto } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  docente: RegistroDocenteDto = {
    nombreCompleto: '',
    grupo: '',
    email: '',
    password: '',
  };
  confirmarPassword = '';
  mensaje = '';
  error = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  registrar() {
    this.mensaje = '';
    this.error = '';
    this.loading = true;
    if (this.docente.password !== this.confirmarPassword) {
      this.error = 'Las contraseñas no coinciden.';
      return;
    }
    this.auth.registrar(this.docente).subscribe({
      next: () => {
        this.loading = false;
        this.mensaje = 'Registro exitoso. Ahora puedes iniciar sesión.';
        setTimeout(() => this.router.navigate(['/login']), 1200);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error || 'Ocurrió un error al registrar.';
      },
    });
  }
}
