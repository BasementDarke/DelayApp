import { inject, Injectable } from '@angular/core';
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

  private journeyDelayHandlers: Map<Number, JourneyDelayHandler>

  schedule: TaskObject[]
  runningSchedule = false

  constructor(){
    this.journeyDelayHandlers = new Map<Number, JourneyDelayHandler>()
    this.schedule = new Array<TaskObject>;
    this.runningSchedule = false
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
      this.taskSearchJourneys(taskObject.parameters)
    }, (sec*1000))
    //this.schedule.push(taskObject)
    //this.scheduleSort()

    // use setTimeout instead of pushing to an array and sorting the array
    // Store any tasks in local storage and remove once it is executed
  }

  scheduleSort(){
    this.schedule.sort((a,b) => a.date.getTime() - b.date.getTime())
  }

  DEBUGprintSchedule(){
    this.schedule.forEach( (task) => {
      console.log(`DATE: ${task.date}, ${task.taskKey}`)
    })
  }

  public configBuild(){
    let stationsConfig = this.configService.getStationsCOnfig()
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
    let timeoutSecTime = 20
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
    return
    // debug purposes
    // will define some tasks to register and to see if things work
  }

  taskSearchJourneys(parameters: ParameterBlock){
    return this.journeyService.getSchedule(parameters).subscribe(
      (response) => {
        console.log(response);
        let joureyJsonParser = new JourneyJsonParserHandler(response)
        let parsedJsonData = joureyJsonParser.getJourneys()
        let journeyDelayHandler = this.journeyDelayHandlers.get(parameters.taskKey)
        let rescheduleMinTime = journeyDelayHandler?.analyzeData(parsedJsonData) as number
        
        this.scheduleTask(parameters.taskKey, rescheduleMinTime * 60)
        // problem potentially
        // If the user closes their browser wont this code keep running?
        // I will check with Asi if he knows something to combat this
        // No nvm, this is running in their browser, it should stop
      }
    );
  }
}

