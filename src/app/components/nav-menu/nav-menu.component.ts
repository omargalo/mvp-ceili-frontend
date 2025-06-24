import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-nav-menu',
  standalone: true,
  imports: [RouterModule, ],
  templateUrl: './nav-menu.component.html'
})
export class NavMenuComponent {
  constructor(private router: Router) {}

  get autenticado(): boolean {
    return !!localStorage.getItem('token');
  }

    get docenteNombre(): string {
    const docente = localStorage.getItem('docente');
    if (docente) {
      try {
        const parsed = JSON.parse(docente);
        return parsed.nombreCompleto || '';
      } catch {
        return '';
      }
    }
    return '';
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('docente');
    this.router.navigate(['/login']);
  }
}
