import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ScheduleService } from './shared/services/schedule.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('delay-app');
  
}
