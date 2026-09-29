import { Component, inject } from '@angular/core';
import { ScheduleService } from '../../shared/services/schedule.service';

@Component({
  selector: 'app-config',
  imports: [],
  templateUrl: './config.html',
  styleUrl: './config.css',
})
export class Config {
  constructor(){
    let scheduleService = inject(ScheduleService)
    const now = new Date()
    scheduleService.scheduleTask(0, new Date(now.valueOf() + 10*1000))
    //scheduleService.scheduleTask(0, new Date(now.valueOf() + 30*1000))
    //scheduleService.scheduleTask(0, new Date(now.valueOf() + 20*1000))
    //scheduleService.DEBUGprintSchedule()
    scheduleService.scheduleStart()
  }
}
