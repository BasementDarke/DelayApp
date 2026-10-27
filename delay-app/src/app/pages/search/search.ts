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

  

  // TODO:
  // Using imported Json data test this component
  // See if the delay handler can spot delayed journeys 
  // Then see if this component lists them all

  // PROBLEMS:
  // JSON data is TOO FUCKING long



  // all info is now neatly in an array
  // get this array
  // on the html page loop over this array
    // create a table for each element in the array
    // using the taskKey in the element get all parameters
    // the table will have the following info

    // IN HEADER
    // Which stations are we tracking? 
    // When did we last check?
    // When are we going to check again?

    // IN TABLE ROW
    // The delayed train info
    // When was it going to depart and arrive?
    // Any deviations in the scheduled timings? 
}
