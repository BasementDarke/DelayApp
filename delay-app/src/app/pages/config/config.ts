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
import { Point } from '../../shared/models/points-response';
import { ConfigForm } from './components/config-form/config-form';

@Component({
  selector: 'app-config',
  imports: [FormsModule, ReactiveFormsModule, ConfigForm],
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
  private journeyService = inject(JourneyService)

  readonly toastService = inject(ToastService);

  //private _journeyConfigs = signal<Array<JourneyConfig>>([])
  readonly journeyConfigs = this.configService.getConfig()

  private _departureAutocomplete = signal<Array<Point>>([])
  private _arrivalAutocomplete = signal<Array<Point>>([])
  readonly departureAutocomplete = this._departureAutocomplete.asReadonly()
  readonly arrivalAutocomplete = this._arrivalAutocomplete.asReadonly()
  
  constructor(){
    let settings = Object.entries(localStorage)
    for(let [key, value] of settings){
      let item = JSON.parse(value) as JourneyConfig
      this.configService.pushConfig(item)
    }
  }

  onClick(){
    for(let item of this.configService.getConfig()){
      this.configService.registerStationsConfig(item)
    }
    this.scheduleService.configBuild()
    this.router.navigateByUrl("/search")
  }

  deleteConfigItem(id: number){
    this.toastService.showError("Deleted Joruney")
    let item = this.configService.deleteConfigItem(id);
    this.localstorageService.removeItem(`${item?.departureStation}-${item?.arrivalStation}`)
  }
}
