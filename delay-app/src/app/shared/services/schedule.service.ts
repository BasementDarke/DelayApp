import { Injectable } from '@angular/core';
import { ParameterTemplateService } from './parameter.template.service';
import { TaskRegistryHandler } from './task.registry.handler';
import { ParameterKey } from '../objects/parameter.key';
import { ParameterBlock } from '../objects/parameter.block';
import { TaskKeyService } from './task.key.service';
import { TaskRegistryService } from './task.registry.service';
import { TaskObject } from '../objects/task.object';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  schedule: TaskObject[]
  parameterTemplateService: ParameterTemplateService;
  taskRegistryHandler: TaskRegistryHandler;
  taskKeyService: TaskKeyService
  taskRegistryService: TaskRegistryService

  runningSchedule = false

  constructor(){
    this.schedule = new Array<TaskObject>;
    this.parameterTemplateService = new ParameterTemplateService;
    this.taskRegistryHandler = new TaskRegistryHandler;

    this.taskKeyService = new TaskKeyService;
    this.taskRegistryService = new TaskRegistryService
    this.runningSchedule = false

    this.builder()
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
  }

  scheduleStart(){
    this.runningSchedule = true

    console.log("STARTING SCHEDULE")

    while(this.runningSchedule){
      if(this.schedule.length == 0){
        this.runningSchedule = false
        break
      }

      let task = this.schedule[0]
      let taskDate = task.date
      let dateNow = new Date()

      if(taskDate.valueOf() <= dateNow.valueOf()){

        console.log(`${this.schedule.length}`)
        task.func(task.parameters)

        var arrLength = this.schedule.length
        if(arrLength <= 1){
          console.log("CALLED POP")
          this.schedule.pop()
        }
        else {
          console.log("CALLED SLICE")
          this.schedule = this.schedule.slice(0+1, arrLength) // HUH????
        }
        console.log(`${this.schedule.length}`)
        console.log("============")

      }
    }

    console.log("ENDING SCHEDULE")
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

  scheduleTask(taskKey: number, date: Date){
    console.log(`SCHEDULED TASK ${taskKey} for ${date}`)
    if(this.taskKeyService.checkKey(taskKey) === null){
      throw new Error("Task Key not Registerd")
    }

    var taskObject = this.createTaskObject(taskKey, date)
    this.schedule.push(taskObject)
    this.scheduleSort()
  }

  scheduleSort(){
    this.schedule.sort((a,b) => a.date.getTime() - b.date.getTime())
  }

  DEBUGprintSchedule(){
    this.schedule.forEach( (task) => {
      console.log(`DATE: ${task.date}, ${task.taskKey}`)
    })
  }

  builder(){
    this.registerJourneyTask(
      new Map<ParameterKey, string>([
        [ParameterKey.EarrivalStation, "Lund C"],
        [ParameterKey.EdepartureStation, "Helsingborg C"]
      ]),
      this.testFunc
    )
    // debug purposes
    // will define some tasks to register and to see if things work
  }

  testFunc(parameters: ParameterBlock){
    console.log(`WORKED: ${parameters.taskKey}`)
  }
}

// TODO:
// Errors, the function is either not saved correctly or executed correctly
// I belive this is a syntax error 
