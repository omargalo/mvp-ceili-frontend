import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface RetroalimentacionIA {
  id: number;
  evaluacionId: number;
  texto: string;
  fechaGeneracion: string;
  modeloIA?: string;
}

@Injectable({ providedIn: 'root' })
export class RetroalimentacionService {
  constructor(private http: HttpClient) {}

  // Obtiene la retro para una evaluación (o null)
  async getPorEvaluacion(
    evaluacionId: number
  ): Promise<RetroalimentacionIA | null> {
    try {
      return await firstValueFrom(
        this.http.get<RetroalimentacionIA>(
          `/api/retroalimentacionia/evaluacion/${evaluacionId}`
        )
      );
    } catch (err) {
      return null;
    }
  }

  async generarRetroalimentacionIA(
    evaluacionId: number
  ): Promise<RetroalimentacionIA | null> {
    try {
      return await firstValueFrom(
        this.http.post<RetroalimentacionIA>(
          `/api/retroalimentacionia/generar/${evaluacionId}`,
          {}
        )
      );
    } catch {
      return null;
    }
  }
}
