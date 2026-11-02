import { Component, inject, ChangeDetectionStrategy, signal } from '@angular/core';
import { ScheduleService } from '../../shared/services/schedule.service';
import { JourneyService } from '../../shared/services/journey.service';
import { HttpClient } from '@angular/common/http';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfigService } from '../../shared/services/config.service';
import { ToastService } from '../../shared/services/toast.service';
import { LocalstorageService } from '../../shared/services/localstorage-service';
import { JourneyConfig } from '../../shared/models/journey.config';

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
  private localstorageService = inject(LocalstorageService)

  readonly toastService = inject(ToastService);

  private _journeyConfigs = signal<Array<JourneyConfig>>([])
  readonly journeyConfigs = this._journeyConfigs.asReadonly()
  
  form = this.formBuilder.group({
    departureStation: this.formBuilder.control<string>('', {
      validators: [Validators.required]
    }),
    arrivalStation: this.formBuilder.control<string>('', {
      validators: [Validators.required]
    })
  })

  constructor(){
    let settings = Object.entries(localStorage)
    for(let [key, value] of settings){
      let item = JSON.parse(value) as JourneyConfig
      this._journeyConfigs().push(item)
    }
  }

  onSubmit(){
    if(this.form.invalid){
      this.toastService.showError("Invalid Form, please check input")
      return
    }
    else{
      let departureStation = this.form.value.departureStation as string
      let arrivalStation = this.form.value.arrivalStation as string
      const configObject: JourneyConfig = {
        departureStation: departureStation,
        arrivalStation: arrivalStation
      }

      this._journeyConfigs().push(configObject)
      this.toastService.showSuccess("Journey Added")
      this.form.controls['departureStation'].setValue("");
      this.form.controls['arrivalStation'].setValue("");

      console.log(`ADDING: ${departureStation}-${arrivalStation}`)
      this.localstorageService.setItem(`${departureStation}-${arrivalStation}`, configObject)
    }
  }

  onClick(){
    for(let item of this._journeyConfigs()){
      this.configService.registerStationsConfig(item)
    }
    this.scheduleService.configBuild()
    this.router.navigateByUrl("/search")
  }

  deleteConfigItem(id: number){
    this.toastService.showError("Deleted Joruney")
    const item = this.journeyConfigs().at(id)
    console.log(`REMOVING: ${item?.departureStation}-${item?.arrivalStation}`)
    this.localstorageService.removeItem(`${item?.departureStation}-${item?.arrivalStation}`)
    let arr = this.journeyConfigs().splice(id,1)
    this.configService.removeConfigItem(item as JourneyConfig) 
  }
}
