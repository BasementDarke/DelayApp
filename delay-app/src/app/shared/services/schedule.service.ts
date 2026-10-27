import { inject, Injectable, signal } from '@angular/core';
import { ParameterTemplateService } from './parameter.template.service';
import { TaskRegistryHandler } from './task.registry.handler';
import { ParameterKey } from '../objects/parameter.key';
import { ParameterBlock } from '../objects/parameter.block';
import { TaskKeyService } from './task.key.service';
import { TaskRegistryService } from './task.registry.service';
import { TaskObject } from '../objects/task.object';
import { JourneyService } from './journey.service';
import { JourneyDelayHandler } from '../util/journey.delay.handler';
import { ConfigService } from './config.service';
import { JourneyDelay } from '../objects/journey.delay';
import { JourneyResponse, RouteLink } from '../models/journey.response';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  private journeyService = inject(JourneyService)
  private parameterTemplateService = inject(ParameterTemplateService);
  private taskRegistryHandler = inject(TaskRegistryHandler)
  private taskKeyService = inject(TaskKeyService);
  private taskRegistryService = inject(TaskRegistryService)
  private configService = inject(ConfigService)

  private _delayedJourneyTracker = signal<Array<JourneyDelay>>([])
  public readonly delayedJourneyTracker = this._delayedJourneyTracker.asReadonly()
  private journeyDelayHandlers: Map<Number, JourneyDelayHandler>

  constructor(){
    this.journeyDelayHandlers = new Map<Number, JourneyDelayHandler>()
  }

  registerJourneyTask(parameters: Map<ParameterKey, string>, func: Function){

    // Generate taskKey and ParameterBlock
    let pb = this.taskRegistryHandler.registerJourneyParameters(parameters)

    // Register taskKey
    this.taskKeyService.registerNewKey(pb.taskKey, pb.taskKey.toString())

    // Register ParameterBlock to taskKey
    this.parameterTemplateService.registerParameterTemplate(pb.taskKey, pb)

    // Register function/task to taskKey
    this.taskRegistryService.registerTask(pb.taskKey, func)

    // Register Train Delay Handler to taskKey
    this.journeyDelayHandlers.set(pb.taskKey, new JourneyDelayHandler(pb.taskKey))
    this._delayedJourneyTracker().push(new JourneyDelay(pb, null, null, null))
    return pb.taskKey
  }

  createTaskObject(taskKey: number, date: Date){
    if(this.taskKeyService.checkKey(taskKey) === null){
      throw new Error("Task Key not Registerd")
    }

    return new TaskObject(
      date,
      taskKey,
      this.parameterTemplateService.getParameterBlock(taskKey)!,
      this.taskRegistryService.getTask(taskKey)!
    )
  }

  scheduleTask(taskKey: number, sec: number){
    const now = new Date();
    let date = new Date(now.valueOf() + sec*1000);
    
    let taskObject = this.createTaskObject(taskKey, date)
    setTimeout(() => {
      this._delayedJourneyTracker().at(taskObject.taskKey)?.setUpdateStatus(true)
      this._delayedJourneyTracker().at(taskObject.taskKey)?.setDateChecked(date)
      this.taskSearchJourneys(taskObject.parameters)
    }, (sec*1000))
  }

  public configBuild(){
    let stationsConfig = this.configService.getStationsConfig()
    for(let tuple of stationsConfig){
      let departureStation = tuple[0]
      let arrivalStation = tuple[1]
      this.buildStationsTask(departureStation, arrivalStation)
    }
    return
  }

  private buildStationsTask(departureStation: string, arrivalStation: string){
    var taskKey = this.registerJourneyTask(
      new Map<ParameterKey, string>([
        [ParameterKey.EdepartureStation, departureStation],
        [ParameterKey.EarrivalStation, arrivalStation]
      ]),
      this.taskSearchJourneys
    )
    let timeoutSecTime = 4
    this.scheduleTask(taskKey, timeoutSecTime);
    return
  }

  taskSearchJourneys(parameters: ParameterBlock){
    return this.journeyService.getSchedule(parameters).pipe(
      tap({error: (response) => {
        if(response.status === 400){
          this._delayedJourneyTracker().at(parameters.taskKey)?.setIfApiResponse(false)
        }
        this._delayedJourneyTracker().at(parameters.taskKey)?.setErrorCode(response.status)
      }})
    )
    .subscribe(
      (response) => {
        let journeyDelayHandler = this.journeyDelayHandlers.get(parameters.taskKey) as JourneyDelayHandler
        let rescheduleMinTime = journeyDelayHandler.analyzeResponse(response) as number

        const now = new Date();
        let dateToCheck = new Date(now.valueOf() + rescheduleMinTime*60*1000);
        this._delayedJourneyTracker().at(parameters.taskKey)?.setDateToCheck(dateToCheck)
        this._delayedJourneyTracker().at(parameters.taskKey)?.setDelayedJourneys(journeyDelayHandler?.getDelayData())
        this._delayedJourneyTracker().at(parameters.taskKey)?.setUpdateStatus(false)

        this.scheduleTask(parameters.taskKey, rescheduleMinTime * 60)
      }
    );
  }

  public readDelayedTrainData(){
    return this.delayedJourneyTracker
  }
}
