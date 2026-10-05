import { Component, inject } from '@angular/core';
import { ScheduleService } from '../../shared/services/schedule.service';
import { JourneyService } from '../../shared/services/journey.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-config',
  imports: [],
  templateUrl: './config.html',
  styleUrl: './config.css',
})
export class Config {
  private readonly scheduleService : ScheduleService
  //private readonly journeyService = inject(JourneyService)
  //private readonly http = inject(HttpClient);


  constructor(){
    this.scheduleService = new ScheduleService()
  }
  //private readonly journeyService = inject(JourneyService)
    
    //const now = new Date()
    //scheduleService.scheduleTask(0, 2)

    // var taskObject = scheduleService.createTaskObject(0, new Date())
    // journeyService.getSchedule(taskObject.parameters).subscribe(
    //   (response) => {
    //     console.log(response)
    //   }
    // );

    //scheduleService.scheduleTask(0, 30)
    //scheduleService.scheduleTask(0, 20)
    //scheduleService.DEBUGprintSchedule()
    // setTimeout(() => {
    //   scheduleService.scheduleStart()
    // },500)


    // The HTTP client being undefined error seems to stem from how we call the service
    // Calling the service in a component seems to solve the issue,
    // BUT we are not calling it within a component, we are calling it within a service
}
