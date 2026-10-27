import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigService } from '../../shared/services/config.service';
import { ScheduleService } from '../../shared/services/schedule.service';
import { ParameterKey } from '../../shared/objects/parameter.key';
import { BasementJourneyDatePipe } from '../../shared/pipes/basement-journey-date-pipe';
import { JourneyDeviation } from './components/journey-deviation/journey-deviation';
import { JourneyInfoHeader } from './components/journey-info-header/journey-info-header';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-search',
  imports: [BasementJourneyDatePipe, JourneyDeviation, JourneyInfoHeader],
  templateUrl: './search.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './search.css',
})
export class Search {
  private readonly scheduleService = inject(ScheduleService);
  private router = inject(Router)
  private configService = inject(ConfigService)
  readonly toastService = inject(ToastService);

  delayedJourneys = this.scheduleService.readDelayedTrainData()
  readonly parameterKey = ParameterKey;

  constructor(){
    let configLen = this.configService.stationsConfig.length;
    if(configLen == 0){
      this.toastService.showError("Empty Journey List, please enter a Journey")
      this.router.navigateByUrl("/config")
    }
    else{
      this.toastService.showSuccess("Starting Search")
    }
  }
}
