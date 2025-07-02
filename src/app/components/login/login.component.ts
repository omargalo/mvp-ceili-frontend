import { AuthService, LoginDocenteDto } from '../../services/auth.service';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  credenciales: LoginDocenteDto = { email: '', password: '' };
  error = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    this.error = '';
    this.loading = true;
    this.auth.login(this.credenciales).subscribe({
      next: (resp) => {
        this.loading = false;
        // Guarda el token y usuario (localStorage, sessionStorage, etc.)
        localStorage.setItem('token', resp.token);
        localStorage.setItem('docente', JSON.stringify(resp.docente));
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error || 'Correo o contraseña incorrectos.';
      },
    });
  }

  redirigirRegistro() {
    this.router.navigate(['/register']);
  }

  resetPassword() {
    this.router.navigate(['/reset-password']);
  }
}
