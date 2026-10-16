import { TrainGlobals } from "../constants/globals"
import { JourneyResponse, RouteLink } from "../models/journey.response"
import { JourneyJsonParserHandler } from "./journey.json.parser.handler"

export class JourneyDelayHandler{
    private assignedTaskKey : Number
    private delayedJourneys: Map<string, RouteLink[]>
    private activeTrackedJourneys: Map<string, RouteLink[]>

    constructor(taskKey: Number){
        this.delayedJourneys = new Map<string, RouteLink[]>()
        this.activeTrackedJourneys = new Map<string, RouteLink[]>()
        this.assignedTaskKey = taskKey
    }

    public getDelayData(){
        return this.delayedJourneys
    }

    public analyzeResponse(response: JourneyResponse){
        let joureyJsonParser = new JourneyJsonParserHandler(response)
        let parsedData = joureyJsonParser.getJourneys()

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
            if(minDateSec === undefined){
                minDateSec = Math.floor(departureTime.valueOf()/1000)
                initialDeviationMin = routeLink.from?.deviation === null ? 0 : routeLink.from?.deviation as number 
                continue
            }
            else if(Math.floor(departureTime.valueOf()/1000) <= minDateSec){
                minDateSec = Math.floor(departureTime.valueOf()/1000)
                initialDeviationMin = routeLink.from?.deviation === null ? 0 : routeLink.from?.deviation as number 
            }
        }

        // WARNING, this is the only code i believe which will cause most
        // our the errors
        let nowSec = Math.floor(new Date().valueOf()/1000)
        let diffSec = minDateSec! - nowSec
        let diffMin = Math.floor(diffSec/60)
        let delayed = false
        if(diffSec < 0){
            delayed = true
        }

        let offsetMin = 1
        if(delayed){
            let deltaTime = TrainGlobals.TrainDelayThreshholdMinute - Math.abs(diffMin)
            if(deltaTime < 0){
                deltaTime = 0
            }
            return deltaTime + offsetMin
        }
        else if(initialDeviationMin !== 0){
            return diffMin + initialDeviationMin + offsetMin
        }
        return diffMin + TrainGlobals.TrainDelayThreshholdMinute + offsetMin

    }

    private checkDelay(key: string, routeLinks: RouteLink[]){
        var maxDepartureDeviation = 0
        var maxArrivalDeviation = 0

        for(let routeLink of routeLinks){
            let from = routeLink.from
            let fromDeviation = from?.deviation as number
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

            if(maxArrivalDeviation >= TrainGlobals.TrainDelayThreshholdMinute || maxDepartureDeviation >= TrainGlobals.TrainDelayThreshholdMinute){
                this.delayedJourneys.set(key, routeLinks);
            }
        }
    }
}
