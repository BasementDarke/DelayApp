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

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  private journeyService = inject(JourneyService)
  private parameterTemplateService = inject(ParameterTemplateService);
  private taskRegistryHandler = inject(TaskRegistryHandler)
  private taskKeyService = inject(TaskKeyService);
  private taskRegistryService = inject(TaskRegistryService)

  schedule: TaskObject[]
  runningSchedule = false

  constructor(){
    this.schedule = new Array<TaskObject>;
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
    return pb.taskKey
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

  scheduleTask(taskKey: number, sec: number){
    const now = new Date();
    let date = new Date(now.valueOf() + sec*1000);
    console.log(`SCHEDULED TASK ${taskKey} for ${date}`)
    
    let taskObject = this.createTaskObject(taskKey, date)
    setTimeout(() => {
      this.taskSearchJourneys(taskObject.parameters) // doing it this way removes the error

      //taskObject.func(taskObject.parameters) // does this call initialize a new class of ScheduleService????
      // YEP, or atleast all injected services are undefined 
      // It can be related to how we store the function via the taskRegistryService
      // We are just saving a function, so within the functions scope it does not have access to the injected services
      // Otherwise a fix would be to make it "isolated"
      // it create a new class of JourneyService so it is not undefiend
      // Nope, as injections can only happen in an injection context
      // Instead we make use of new and create the class "manually"
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

  builder(){
    var taskKey = 0
    taskKey = this.registerJourneyTask(
      new Map<ParameterKey, string>([
        [ParameterKey.EarrivalStation, "Lund C"],
        [ParameterKey.EdepartureStation, "Helsingborg C"]
      ]),
      this.taskSearchJourneys // i think this is what causes the errors, but i do not know why
      // the best i got is that it is scope issue
    )
    this.scheduleTask(taskKey, 2);
    return
    // debug purposes
    // will define some tasks to register and to see if things work
  }

  taskSearchJourneys(parameters: ParameterBlock){
    //const journeyService = inject(JourneyService)
    console.log(`TEST WITHIN SCHEDULESERVICE TASK: ${this.journeyService}`)
    // strange, when the constructor is called $this.journeyService is clearly defined as an object
    // but when this function is called it is undefined
    return this.journeyService.DEBUG(parameters).subscribe(
      (response) => {
        console.log(response)
      }
    );
  }
}

// TODO:
// Errors, the function is either not saved correctly or executed correctly
// I belive this is a syntax error 
