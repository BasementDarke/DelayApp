import { Journey, JourneyResponse, RouteLink } from "../models/journey.response";

export class JourneyJsonParserHandler {
    private jsonData: JourneyResponse
    private journeys: Map<string, RouteLink[]>

    constructor(jsonData: JourneyResponse){
        this.jsonData = jsonData;
        this.journeys = new Map<string, RouteLink[]>()
        this.parse()
        console.log(this.journeys)
    }

    private parse() {
        for(let journey of this.jsonData.journeys){
            let routeLinkArray = new Array<RouteLink>
            for(let routeLink of journey.routeLinks){
                if(routeLink.id === null){
                    continue;
                }
                else{
                    routeLinkArray.push(routeLink);
                }
            }
            this.journeys.set(journey.journeyKey, routeLinkArray)
        }
    } 

    public getJourneys(){
        return this.journeys;
    }
}
