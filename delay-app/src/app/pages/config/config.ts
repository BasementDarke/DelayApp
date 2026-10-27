import { Component, inject, ChangeDetectionStrategy, signal } from '@angular/core';
import { ScheduleService } from '../../shared/services/schedule.service';
import { JourneyService } from '../../shared/services/journey.service';
import { HttpClient } from '@angular/common/http';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfigService } from '../../shared/services/config.service';
import { ToastService } from '../../shared/services/toast.service';

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
  readonly toastService = inject(ToastService);

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
      this.toastService.showError("Invalid Form, please check input")
      return
    }
    else{
      let departureStation = this.form.value.departureStation as string
      let arrivalStation = this.form.value.arrivalStation as string
      this._journeyConfigs().push([departureStation, arrivalStation])
      this.toastService.showSuccess("Journey Added")
      this.form.controls['departureStation'].setValue("");
      this.form.controls['arrivalStation'].setValue("");
    }
  }

  onClick(){
    for(let item of this._journeyConfigs()){
      this.configService.registerStationsConfig(item[0], item[1])
    }
    this.scheduleService.configBuild()
    this.router.navigateByUrl("/search")
  }

  deleteConfigItem(id: number){
    this.toastService.showError("Deleted Joruney")
    this.journeyConfigs().splice(id,1)
  }
}
