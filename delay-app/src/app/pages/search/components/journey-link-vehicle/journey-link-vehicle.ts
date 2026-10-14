import { Component, input } from '@angular/core';
import { RouteLine } from '../../../../shared/models/journey.response';

@Component({
  imports: [],
  selector: 'app-journey-link-vehicle',
  styleUrl: './journey-link-vehicle.css',
  templateUrl: './journey-link-vehicle.html',
})
export class JourneyLinkVehicle {
  readonly linkVehicle = input.required<RouteLine | null>()
}
