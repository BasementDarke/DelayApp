import { inject } from "@angular/core";
import { RouteLink } from "../models/journey.response";
import { ParameterTemplateService } from "../services/parameter.template.service";

export class JourneyDelay{
    private parameterTemplateService = inject(ParameterTemplateService);
    public taskKey: number | null
    public dateChecked: Date | null
    public dateToCheck: Date | null
    public delayedJourneys: Map<string, RouteLink[]> | null
    private updating: boolean

    constructor(taskKey: number | null, dateChecked: Date | null, dateToCheck: Date | null, delayedJourneys: Map<string, RouteLink[]> | null){
        this.taskKey = taskKey
        this.dateChecked = dateChecked
        this.dateToCheck = dateToCheck
        this.delayedJourneys = delayedJourneys
        this.updating = true
    }

    getParameters(){
        if(this.taskKey === null){
            return undefined
        }
        return this.parameterTemplateService.getParameterBlock(this.taskKey)
    }

    setDateChecked(dateChecked: Date){
        this.dateChecked = dateChecked
    }

    setTaskKey(taskKey: number){
        this.taskKey = taskKey
    }

    setDateToCheck(dateToCheck: Date){
        this.dateToCheck = dateToCheck
    }

    setDelayedJourneys(delayedJourneys: Map<string, RouteLink[]>){
        this.delayedJourneys = delayedJourneys
    }

    setUpdateStatus(updating: boolean){
        this.updating = updating
    }

    public isDataAvailable(){
        if(this.updating === true){
            return false
        }
        return true
    }
}
