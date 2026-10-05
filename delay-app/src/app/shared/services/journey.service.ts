import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiUrls } from '../constants/urls';
import { ParameterBlock } from '../objects/parameter.block';
import { RouteModel } from '../models/route.model';
import { ParameterKey } from '../objects/parameter.key';

@Injectable({
  providedIn: 'root',
})
export class JourneyService {
  private readonly http = inject(HttpClient)

  public getSchedule(parameters: ParameterBlock): Observable<unknown> {
    const depStation=  (parameters.parameters.get(ParameterKey.EdepartureStation) as string).split(" ").join("")
    const arrStation = (parameters.parameters.get(ParameterKey.EarrivalStation) as string).split(" ").join("")
    const taskKey = parameters.taskKey;

    const requestBody: RouteModel = {
      taskKey: taskKey,
      departureStation: depStation,
      arrivalStation: arrStation
    }
    console.log("IN getSchedule()");
    // USE POST!!!
    // Warning, not correct URL, we need to format it in the frontend and define it porperly in the backend
    return this.http.post(ApiUrls.BaseApiUrl, requestBody);
  }

  // HOW IT USED TO LOOK
  public DEBUG(parameters: ParameterBlock): Observable<JSON>{
    console.log("IN DEBUG()")
    console.log(this.http);
    console.log(parameters.parameters.get(ParameterKey.EarrivalStation))
    return this.http.get<JSON>(ApiUrls.BaseApiUrl)
  }
}
