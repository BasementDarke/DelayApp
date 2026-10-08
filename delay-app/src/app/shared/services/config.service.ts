import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  stationsConfig: Array<[string, string]>

  constructor(){
    this.stationsConfig = new Array<[string, string]>
  }

  public registerStationsConfig(departureStation: string, arrivalStation: string){
    this.stationsConfig.push([departureStation, arrivalStation])
  }

  public getStationsCOnfig(){
    return this.stationsConfig
  }
}
