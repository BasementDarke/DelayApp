import { Component, input } from '@angular/core';
import { RouteLink } from '../../../../shared/models/journey.response';
import { JourneyLinkVehicle } from '../journey-link-vehicle/journey-link-vehicle';

@Component({
  imports: [JourneyLinkVehicle],
  selector: 'app-journey-info-header',
  styleUrl: './journey-info-header.css',
  templateUrl: './journey-info-header.html',
})
export class JourneyInfoHeader {
  readonly journey = input.required<RouteLink | null>()
}
