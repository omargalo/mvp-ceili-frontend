import { AlumnosComponent } from './components/alumnos/alumnos.component';
import { authGuard } from './guards/auth.guard';
import { ChatComponent } from './components/chat/chat.component';
import { EvaluationFormComponent } from './components/evaluacion-form/evaluacion-form.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ResumenComponent } from './components/resumen/resumen.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  // Rutas protegida por el guard
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'evaluacion/:id', component: EvaluationFormComponent, canActivate: [authGuard] },
  { path: 'evaluacion', component: EvaluationFormComponent, canActivate: [authGuard] },
  { path: 'resumen/:id', component: ResumenComponent, canActivate: [authGuard] },
  { path: 'resumen', component: ResumenComponent, canActivate: [authGuard] },
  { path: 'alumnos', component: AlumnosComponent, canActivate: [authGuard] },
  { path: 'chat', component: ChatComponent, canActivate: [authGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
