import { AlumnosComponent } from './components/alumnos/alumnos.component';
import { authGuard } from './guards/auth.guard';
import { ChatComponent } from './components/chat/chat.component';
import { EvaluationFormComponent } from './components/evaluacion-form/evaluacion-form.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  // Rutas protegida por el guard
  { path: 'evaluacion', component: EvaluationFormComponent, canActivate: [authGuard] },
  { path: 'alumnos', component: AlumnosComponent, canActivate: [authGuard] },
  { path: 'chat', component: ChatComponent, canActivate: [authGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
