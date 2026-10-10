import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigService } from '../../shared/services/config.service';
import { ScheduleService } from '../../shared/services/schedule.service';

@Component({
  selector: 'app-search',
  imports: [],
  templateUrl: './search.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './search.css',
})
export class Search {
  private readonly scheduleService = inject(ScheduleService);
  private router = inject(Router)
  private configService = inject(ConfigService)

  constructor(){
    let configLen = this.configService.stationsConfig.length;
    if(configLen == 0){
      // ADD TOAST SERVICE LATER
      console.log("Empty Seach List")
      this.router.navigateByUrl('/')
    }
    else{
      console.log("ALL GOOD")
    }

  }
}
