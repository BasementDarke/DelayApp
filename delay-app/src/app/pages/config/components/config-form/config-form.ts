import { Component, inject, signal } from '@angular/core';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '../../../../shared/services/toast.service';
import { JourneyConfig } from '../../../../shared/models/journey.config';
import { LocalstorageService } from '../../../../shared/services/localstorage-service';
import { ConfigService } from '../../../../shared/services/config.service';
import { ScheduleService } from '../../../../shared/services/schedule.service';
import { Router } from '@angular/router';
import { JourneyService } from '../../../../shared/services/journey.service';
import { Point } from '../../../../shared/models/points-response';

@Component({
  imports: [FormsModule, ReactiveFormsModule],
  selector: 'app-config-form',
  styleUrl: './config-form.css',
  templateUrl: './config-form.html',
})
export class ConfigForm {
  private readonly scheduleService = inject(ScheduleService);
  private formBuilder = inject(NonNullableFormBuilder)
  private router = inject(Router)
  readonly toastService = inject(ToastService);
  private localstorageService = inject(LocalstorageService)
  private configService = inject(ConfigService)
  private journeyService = inject(JourneyService)

  private _departureAutocomplete = signal<Array<Point>>([])
  private _arrivalAutocomplete = signal<Array<Point>>([])
  readonly departureAutocomplete = this._departureAutocomplete.asReadonly()
  readonly arrivalAutocomplete = this._arrivalAutocomplete.asReadonly()
  
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
      const configObject: JourneyConfig = {
        departureStation: departureStation,
        arrivalStation: arrivalStation
      }

      this.configService.pushConfig(configObject);
      this.toastService.showSuccess("Journey Added")
      this.form.controls['departureStation'].setValue("");
      this.form.controls['arrivalStation'].setValue("");
      this.localstorageService.setItem(`${departureStation}-${arrivalStation}`, configObject)
    }
  }

  onClick(){
    for(let item of this.configService.getConfig()){
      this.configService.registerStationsConfig(item)
    }
    this.scheduleService.configBuild()
    this.router.navigateByUrl("/search")
  }

  pointsSearch(id: string){
    let input = ''
    if(id === "departure"){
      input = this.form.controls['departureStation'].value
    }
    else if(id === "arrival"){
      input = this.form.controls['arrivalStation'].value
    }
    if(input.length < 2){
      this.clearPointsArray(id);
      return
    }
    
    this.journeyService.getPoints(input).subscribe(
      (response) =>{
        let points = response.points;
        if(points.length > 6){
          let tempPoints: Point[] = []
          for(let i = 0; i < 6; i++){
            tempPoints.push(points[i]);
          }
          points = tempPoints;
        }
        this.setPointsArray(points, id);
      }
    )
  }

  setPointsArray(points: Point[], id: string){
    if(id === "departure"){
      this._departureAutocomplete.set(points);
    }
    else if(id === "arrival"){
      this._arrivalAutocomplete.set(points);
    }
  }

  clearPointsArray(id: string){
    this._departureAutocomplete.set([]);
    this._arrivalAutocomplete.set([]);
  }

  selectStation(stationName: string, id: string){
    if(id === "departure"){
      this.form.controls.departureStation.setValue(stationName);
    }
    else if(id === "arrival"){
      this.form.controls.arrivalStation.setValue(stationName);
    }
    this.clearPointsArray(id);
  }
}
