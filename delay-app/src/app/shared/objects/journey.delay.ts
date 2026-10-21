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
    public apiResponse: boolean
    public errorCode: number

    constructor(parameters: ParameterBlock, dateChecked: Date | null, dateToCheck: Date | null, delayedJourneys: Map<string, RouteLink[]> | null){
        this.parameterBlock = parameters
        this.dateChecked = dateChecked
        this.dateToCheck = dateToCheck
        this.delayedJourneys = delayedJourneys
        this.apiResponse = true
        this.updating = true
        this.errorCode = 200
    }

    getParameters(){
        if(this.parameterBlock.taskKey === null){
            return undefined
        }
        return this.parameterBlock
    }

    setErrorCode(code: number){
        this.errorCode = code
    }

    getErrorCode(){
        return this.errorCode;
    }

    getDepartureStation(){
        return this.parameterBlock.parameters.get(ParameterKey.EdepartureStation)
    }

    ifApiResponse(){
        return this.apiResponse
    }

    setIfApiResponse(val: boolean){
        this.apiResponse = val
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
