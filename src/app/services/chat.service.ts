import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ChatService {
  constructor(private http: HttpClient) {}

  sendMessage(message: string) {
    return this.http.post('/api/chat', JSON.stringify(message), {
      responseType: 'text',
      headers: { 'Content-Type': 'application/json' }
    });
  }
}