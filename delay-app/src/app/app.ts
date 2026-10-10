import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ScheduleService } from './shared/services/schedule.service';
import { HttpClient } from '@angular/common/http';
import { JourneyService } from './shared/services/journey.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('delay-app');
  private readonly journeyService = inject(JourneyService);
}
