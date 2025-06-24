import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavMenuComponent } from './components/nav-menu/nav-menu.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavMenuComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {}
