import { Component, inject } from '@angular/core';
import { ScheduleService } from '../../shared/services/schedule.service';
import { JourneyService } from '../../shared/services/journey.service';
import { HttpClient } from '@angular/common/http';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfigService } from '../../shared/services/config.service';

@Component({
  selector: 'app-config',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './config.html',
  styleUrl: './config.css',
})
export class Config {
  private readonly scheduleService = inject(ScheduleService);
  private formBuilder = inject(NonNullableFormBuilder)
  private router = inject(Router)
  private configService = inject(ConfigService)
  
  form = this.formBuilder.group({
    departureStation: this.formBuilder.control<string>('', {
      validators: [Validators.required]
    }),
    arrivalStation: this.formBuilder.control<string>('', {
      validators: [Validators.required]
    })
  })

  onSubmit(){
    if(this.form.invalid){
      console.log("ERROR")
      // ADD TOAST SERVICE LATER
      return
    }
    else{
      console.log("WORKED")
      this.configService.registerStationsConfig(this.form.value.departureStation!, this.form.value.arrivalStation!)
    }
  }

  onClick(){
    console.log("Begin Search")
    this.scheduleService.configBuild()
    this.router.navigateByUrl("/")
  }
  //private readonly journeyService = inject(JourneyService)
  //private readonly http = inject(HttpClient);

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
