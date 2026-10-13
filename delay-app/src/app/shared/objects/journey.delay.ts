import { inject } from "@angular/core";
import { RouteLink } from "../models/journey.response";
import { ParameterTemplateService } from "../services/parameter.template.service";
import { ParameterBlock } from "./parameter.block";
import { ParameterKey } from "./parameter.key";

export class JourneyDelay{
    public parameterBlock: ParameterBlock
    public dateChecked: Date | null
    public dateToCheck: Date | null
    public delayedJourneys: Map<string, RouteLink[]> | null
    private updating: boolean

    constructor(parameters: ParameterBlock, dateChecked: Date | null, dateToCheck: Date | null, delayedJourneys: Map<string, RouteLink[]> | null){
        this.parameterBlock = parameters
        this.dateChecked = dateChecked
        this.dateToCheck = dateToCheck
        this.delayedJourneys = delayedJourneys
        this.updating = true
    }

    getParameters(){
        if(this.parameterBlock.taskKey === null){
            return undefined
        }
        return this.parameterBlock
    }

    getDepartureStation(){
        return this.parameterBlock.parameters.get(ParameterKey.EdepartureStation)
    }

    getArrivalStation(){
        return this.parameterBlock.parameters.get(ParameterKey.EarrivalStation)
    }

    setDateChecked(dateChecked: Date){
        this.dateChecked = dateChecked
    }

    setTaskKey(taskKey: number){
        this.parameterBlock.taskKey = taskKey
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
