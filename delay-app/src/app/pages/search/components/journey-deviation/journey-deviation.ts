import { Component, input } from '@angular/core';
import { RouteStation } from '../../../../shared/models/journey.response';
import { DatePipe } from '@angular/common';

@Component({
  imports: [DatePipe],
  selector: 'app-journey-deviation',
  styleUrl: './journey-deviation.css',
  templateUrl: './journey-deviation.html',
})
export class JourneyDeviation {
  readonly routeStation = input.required<RouteStation | null>()

  formatDateDeviation(str: string, deviation: number){
    let curr = new Date(str)
    const date = new Date(curr.valueOf() + deviation*60*1000)
    return date
  }
}
