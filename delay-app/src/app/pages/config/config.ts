import { Component, inject, ChangeDetectionStrategy, signal } from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './config.css',
})
export class Config {
  private readonly scheduleService = inject(ScheduleService);
  private formBuilder = inject(NonNullableFormBuilder)
  private router = inject(Router)
  private configService = inject(ConfigService)

  private _journeyConfigs = signal<Array<[string, string]>>([])
  readonly journeyConfigs = this._journeyConfigs.asReadonly()
  
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
      let departureStation = this.form.value.departureStation as string
      let arrivalStation = this.form.value.arrivalStation as string
      this._journeyConfigs().push([departureStation, arrivalStation])
      console.log("WORKED")
      //this.configService.registerStationsConfig(this.form.value.departureStation!, this.form.value.arrivalStation!)
      this.form.controls['departureStation'].setValue("");
      this.form.controls['arrivalStation'].setValue("");
    }
  }

  onClick(){
    console.log("Begin Search")
    for(let item of this._journeyConfigs()){
      this.configService.registerStationsConfig(item[0], item[1])
    }
    this.scheduleService.configBuild()
    this.router.navigateByUrl("/search")
  }

  // should save the configs to local storage
  // will make it way easier on reloads to see what is going on
  deleteConfigItem(id: number){
    this.journeyConfigs().splice(id,1)
  }
}
