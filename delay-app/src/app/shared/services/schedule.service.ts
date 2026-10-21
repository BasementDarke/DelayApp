import { inject, Injectable, signal } from '@angular/core';
import { ParameterTemplateService } from './parameter.template.service';
import { TaskRegistryHandler } from './task.registry.handler';
import { ParameterKey } from '../objects/parameter.key';
import { ParameterBlock } from '../objects/parameter.block';
import { TaskKeyService } from './task.key.service';
import { TaskRegistryService } from './task.registry.service';
import { TaskObject } from '../objects/task.object';
import { JourneyService } from './journey.service';
import { HttpClient } from '@angular/common/http';
import { JourneyJsonParserHandler } from '../util/journey.json.parser.handler';
import { JourneyDelayHandler } from '../util/journey.delay.handler';
import { ConfigService } from './config.service';
import { JourneyDelay } from '../objects/journey.delay';
import { JourneyResponse, RouteLink } from '../models/journey.response';
import { DEBUGJsonString } from '../objects/debug.search';
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

  private test: DEBUGJsonString

  schedule: TaskObject[]
  runningSchedule = false

  constructor(){
    this.journeyDelayHandlers = new Map<Number, JourneyDelayHandler>()
    this.schedule = new Array<TaskObject>;
    this.runningSchedule = false
    this.test = new DEBUGJsonString()
    //this.builder()
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
    console.log(`${pb.taskKey}, ${pb.parameters.get(ParameterKey.EdepartureStation)}, ${pb.parameters.get(ParameterKey.EarrivalStation)}`)
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
    console.log(`SCHEDULED TASK ${taskKey} for ${date}`)
    
    let taskObject = this.createTaskObject(taskKey, date)
    setTimeout(() => {
      this._delayedJourneyTracker().at(taskObject.taskKey)?.setUpdateStatus(true)
      this._delayedJourneyTracker().at(taskObject.taskKey)?.setDateChecked(date)
      //this.DEBUGSearech(taskObject.parameters) // DEBUG task
      this.taskSearchJourneys(taskObject.parameters) // Correct task
    }, (sec*1000))
  }

  public configBuild(){
    let stationsConfig = this.configService.getStationsConfig()
    for(let tuple of stationsConfig){
      let departureStation = tuple[0]
      let arrivalStation = tuple[1]
      console.log(`${departureStation} + ${arrivalStation} BUILDING:`)
      this.buildStationsTask(departureStation, arrivalStation)
      console.log("=============")
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

  builder(){
    var taskKey = 0
    taskKey = this.registerJourneyTask(
      new Map<ParameterKey, string>([
        [ParameterKey.EarrivalStation, "Lund C"],
        [ParameterKey.EdepartureStation, "Helsingborg C"]
      ]),
      this.taskSearchJourneys 
    )
    this.scheduleTask(taskKey, 2);


    taskKey = this.registerJourneyTask(
      new Map<ParameterKey, string>([
        [ParameterKey.EarrivalStation, "Lund C"],
        [ParameterKey.EdepartureStation, "Malmö C"]
      ]),
      this.taskSearchJourneys 
    )
    this.scheduleTask(taskKey, 2);
    return
    // debug purposes
    // will define some tasks to register and to see if things work
  }

  DEBUGSearech(parameters: ParameterBlock){
    let journeyResponse = this.test.getJourneyResponseDEBUG(parameters.taskKey) as JourneyResponse
    let journeyDelayHandler = this.journeyDelayHandlers.get(parameters.taskKey) as JourneyDelayHandler
    let rescheduleMinTime = journeyDelayHandler.analyzeResponse(journeyResponse) as number

    const now = new Date();
    let dateToCheck = new Date(now.valueOf() + rescheduleMinTime*60*1000);
    this._delayedJourneyTracker().at(parameters.taskKey)?.setDateToCheck(dateToCheck)
    this._delayedJourneyTracker().at(parameters.taskKey)?.setDelayedJourneys(journeyDelayHandler?.getDelayData())
    this._delayedJourneyTracker().at(parameters.taskKey)?.setUpdateStatus(false)
    console.log(this.delayedJourneyTracker)

    //this.scheduleTask(parameters.taskKey, rescheduleMinTime * 60)
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
        console.log(`RESPONSE VALUE: ${response}`);
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
    // if response is of error 404
    // it failed and we need to warn the user and not schedule anything else
    // we can have another signal to keep track of errors
    // Like the signal we have now, for each taskkey we will save room for any messages to pass to the frontend
    // If a message is seen we display it instead of anything else.
  }

  public readDelayedTrainData(){
    return this.delayedJourneyTracker
  }
}


// TODO:
// Use an array to keep track of when tasks are to be scheduled
// Using this array store the info in local storage 
  // Remove info in local storage and array when task is completed

// When booting up the app, check the local storage
// If any tasks are scheduled load them into schedule service
  // Ensure no double loading from config service

// FOR FRONTEND:
// Use an array to keep track of the following information
// When last task was executed 
// When the next task is to be executed
// Delay data if it exists
// The taskkey will be used as the index for this Array/Map

// IN COMPONENT:
// Use a signal to "check" if there is any information in the "info" array
// Display all info neatly on a webpage
