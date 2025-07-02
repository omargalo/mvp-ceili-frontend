import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent implements OnInit {
  token: string | null = null;
  nuevoPassword = '';
  confirmarPassword = '';
  error = '';
  mensaje = '';
  loading = false;
  validando = false;
  tokenValido = false;
  email = '';
  redirigiendo = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token');
    if (this.token) {
      this.validando = true;
      this.http
        .get<{ valido: boolean }>(
          `/api/passwordreset/validar?token=${encodeURIComponent(this.token)}`
        )
        .subscribe({
          next: (resp) => {
            this.tokenValido = resp.valido;
            if (!resp.valido)
              this.error = 'El enlace es inválido o ha expirado.';
            this.validando = false;
          },
          error: () => {
            this.error = 'Ocurrió un error validando el enlace.';
            this.validando = false;
          },
        });
    }
  }

  solicitarReset() {
    this.loading = true;
    this.error = '';
    this.mensaje = '';
    this.http
      .post<any>('/api/passwordreset/solicitar', { email: this.email })
      .subscribe({
        next: () => {
          this.mensaje =
            'Si el correo está registrado, recibirás un enlace para restablecer la contraseña.';
          this.loading = false;
        },
        error: () => {
          this.error = 'Ocurrió un error enviando el correo.';
          this.loading = false;
        },
      });
  }

  cambiarPassword() {
    this.error = '';
    this.mensaje = '';
    if (!this.token) return;
    if (this.nuevoPassword !== this.confirmarPassword) {
      this.error = 'Las contraseñas no coinciden.';
      return;
    }
    this.loading = true;
    this.http
      .post<any>('/api/passwordreset/cambiar', {
        token: this.token,
        nuevoPassword: this.nuevoPassword,
      })
      .subscribe({
        next: (resp) => {
          this.mensaje = resp.message || 'Contraseña cambiada correctamente';
          this.loading = false;
          this.redirigiendo = true;
          // Redirigir después de un pequeño delay
          setTimeout(() => this.router.navigate(['/login']), 5000);
        },
        error: (err) => {
          this.error = err.error || 'No se pudo cambiar la contraseña.';
          this.loading = false;
        },
      });
  }

  redirigirLogin() {
    this.router.navigate(['/login']);
  }
}
