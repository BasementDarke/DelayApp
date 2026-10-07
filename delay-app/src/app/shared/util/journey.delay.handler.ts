import { TrainGlobals } from "../constants/globals"
import { RouteLink } from "../models/journey.response"

export class JourneyDelayHandler{
    private assignedTaskKey : Number
    private delayedJourneys: Map<string, RouteLink[]>
    private activeTrackedJourneys: Map<string, RouteLink[]>

    constructor(taskKey: Number){
        this.delayedJourneys = new Map<string, RouteLink[]>()
        this.activeTrackedJourneys = new Map<string, RouteLink[]>()
        this.assignedTaskKey = taskKey
    }

    public analyzeData(parsedData: Map<string, RouteLink[]>){
        let foundKeys = new Array<String>()

        // add or update any journey 
        for (let [key, value] of parsedData){
            let activeJourney = this.activeTrackedJourneys.get(key)
            let journey = parsedData.get(key)

            this.checkDelay(key, value)
            this.activeTrackedJourneys.set(key, value)
            foundKeys.push(key)
        }

        // check delay and delete data for old journeys
        for (let [key, value] of this.activeTrackedJourneys){
            if(foundKeys.includes(key)){
                continue
            }
            // check delay before deleting
            this.checkDelay(key, value)
            this.activeTrackedJourneys.delete(key)
        }
        return this.checkRescheduleTime()
    }

    private checkRescheduleTime(){
        let minDateSec = undefined
        let initialDeviationMin = 0
        for(let [key, value] of this.activeTrackedJourneys){
            let routeLink = value[0]
            let departureTime = new Date((routeLink.from?.time) as string)
            if(minDateSec == undefined){
                minDateSec = departureTime.getSeconds()
                initialDeviationMin = routeLink.from?.deviation as number
                continue
            }
            else if(departureTime.getSeconds() <= minDateSec){
                minDateSec = departureTime.getSeconds()
                initialDeviationMin = routeLink.from?.deviation as number
            }
        }

        // WARNING, this is the only code i believe which will cause most
        // our the errors

        let diffSec = minDateSec! - (new Date().getSeconds())
        let diffMin = Math.floor(diffSec/60)
        let delayed = false
        if(diffSec < 0){
            delayed = true
        }

        let offsetMin = 1
        if(delayed){
            let deltaTime = TrainGlobals.TrainDelayMinTimer - Math.abs(diffMin)
            if(deltaTime <0){
                deltaTime = 0
            }
            return deltaTime + offsetMin
        }
        else if(initialDeviationMin != 0){
            return diffMin + initialDeviationMin + offsetMin
        }
        return diffMin + TrainGlobals.TrainDelayMinTimer + offsetMin

    }

    private checkDelay(key: string, routeLinks: RouteLink[]){
        var maxDepartureDeviation = 0
        var maxArrivalDeviation = 0

        for(let routeLink of routeLinks){
            let from = routeLink.from
            let fromDeviation = from?.deviation as number // i hope this works
            if(fromDeviation === null || undefined){
                fromDeviation = 0
            }
            let to = routeLink.to
            let toDeviation = to?.deviation as number
            if(toDeviation === null || undefined){
                toDeviation = 0
            }

            if(fromDeviation > maxDepartureDeviation){
                maxDepartureDeviation = fromDeviation
            }
            if(toDeviation > maxArrivalDeviation){
                maxArrivalDeviation = toDeviation
            }

            if(maxArrivalDeviation >= TrainGlobals.TrainDelayMinTimer || maxDepartureDeviation >= TrainGlobals.TrainDelayMinTimer){
                this.delayedJourneys.set(key, routeLinks);
            }
        }
    }
}
