import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  // the boolean represents if this config has been registred
  stationsConfig: Array<[string, string, boolean]>

  constructor(){
    this.stationsConfig = new Array<[string, string, boolean]>
  }

  public registerStationsConfig(departureStation: string, arrivalStation: string){
    this.stationsConfig.push([departureStation, arrivalStation, false])
  }

  public getStationsConfig(){
    let l = new Array<[string, string]>
    for(let tuple of this.stationsConfig){
      if(tuple[2] === false){
        l.push([tuple[0], tuple[1]])
        tuple[2] = true
      }
    }
    return l
  }
}
