import { ChatService } from '../../services/chat.service';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule,],
  templateUrl: './chat.component.html'
})
export class ChatComponent {
  userMessage = '';
  assistantResponse = '';
  error = '';

  constructor(private chatService: ChatService) {}

  enviar() {
    this.assistantResponse = '';
    this.error = '';
    this.chatService.sendMessage(this.userMessage).subscribe({
      next: resp => {
        this.assistantResponse = resp;
        this.userMessage = '';
      },
      error: err => {
        this.error = 'Ocurrió un error al conectar con el asistente.';
      }
    });
  }
}