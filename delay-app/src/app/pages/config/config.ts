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
    this.router.navigateByUrl("/search")
  }
}
