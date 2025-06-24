import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RegistroDocenteDto {
  nombreCompleto: string;
  grupo: string;
  email: string;
  password: string;
}

export interface LoginDocenteDto {
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  registrar(docente: RegistroDocenteDto): Observable<any> {
    return this.http.post('/api/auth/register', docente, { responseType: 'text' });
  }

  login(dto: LoginDocenteDto): Observable<any> {
    return this.http.post('/api/auth/login', dto);
  }
}
