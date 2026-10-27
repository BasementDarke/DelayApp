import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiUrls } from '../constants/urls';
import { ParameterBlock } from '../objects/parameter.block';
import { RouteModel } from '../models/route.model';
import { ParameterKey } from '../objects/parameter.key';
import { JourneyResponse } from '../models/journey.response';

@Injectable({
  providedIn: 'root',
})
export class JourneyService {
  private readonly http = inject(HttpClient)

  public getSchedule(parameters: ParameterBlock): Observable<JourneyResponse> {
    const depStation=  (parameters.parameters.get(ParameterKey.EdepartureStation) as string).split(" ").join("")
    const arrStation = (parameters.parameters.get(ParameterKey.EarrivalStation) as string).split(" ").join("")
    const taskKey = parameters.taskKey;

    const requestBody: RouteModel = {
      taskKey: taskKey,
      departureStation: depStation,
      arrivalStation: arrStation
    }
    return this.http.post<JourneyResponse>(ApiUrls.BaseApiUrl, requestBody);
  }
}
