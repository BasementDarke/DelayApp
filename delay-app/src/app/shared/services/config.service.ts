import { Injectable, signal } from '@angular/core';
import { JourneyConfig } from '../models/journey.config';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  // the boolean represents if this config has been registred
  stationsConfig: Map<string, JourneyConfig>

  private _journeyConfigs = signal<Array<JourneyConfig>>([])
  readonly journeyConfigs = this._journeyConfigs.asReadonly()

  constructor(){
    this.stationsConfig = new Map<string, JourneyConfig>
  }

  public registerStationsConfig(jc: JourneyConfig){
    if(this.stationsConfig.get(`${jc.departureStation}-${jc.arrivalStation}`) === undefined){
      this.stationsConfig.set(`${jc.departureStation}-${jc.arrivalStation}`, jc)
    }
  }

  public getStationsConfig(){
    let l = new Array<JourneyConfig>
    for(let [key, item] of this.stationsConfig){
      l.push(item)
    }
    return l
  }

  public clearStationsConfig(){
    this.stationsConfig = new Map<string, JourneyConfig>
  }

  public removeConfigItem(jc: JourneyConfig){
    this.stationsConfig.delete(`${jc.departureStation}-${jc.arrivalStation}`)
  }

  public pushConfig(configObject: JourneyConfig){
    this._journeyConfigs().push(configObject)
    console.log(`ADDING: ${configObject.departureStation}-${configObject.arrivalStation}`)
  }

  public deleteConfigItem(id: number){
    const jc = this._journeyConfigs().at(id) as JourneyConfig
    this.stationsConfig.delete(`${jc.departureStation}-${jc.arrivalStation}`)
    this._journeyConfigs().splice(id,1)
    console.log(`REMOVING: ${jc.departureStation}-${jc.arrivalStation}`)
    return jc
  }

  public getConfig(){
    return this.journeyConfigs();
  }
}
