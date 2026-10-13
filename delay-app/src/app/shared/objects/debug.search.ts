import { JourneyResponse } from "../models/journey.response"
import test1 from "./test1.json"
import test2 from "./test2.json"
import test3 from "./test3.json"
import testballs from "./testballs.json"
import malmoLund from "./malmoLund.json"

export class DEBUGJsonString {
    public testBalls: string
    public testMalmoLund: string

    public test1Str: string
    public test2Str: string
    public test3Str: string
    private testMap: Map<number, JourneyResponse>

    constructor(){
        this.testBalls = JSON.stringify(testballs)
        let yesBalls: JourneyResponse = JSON.parse(this.testBalls)

        this.testMalmoLund = JSON.stringify(malmoLund)
        let yesMalmoLund: JourneyResponse = JSON.parse(this.testMalmoLund)

        this.testMap = new Map<number, JourneyResponse>
        this.testMap.set(0, yesBalls)
        this.testMap.set(1, yesMalmoLund)

        this.test1Str = JSON.stringify(test1)
        let yes1: JourneyResponse = JSON.parse(this.test1Str)
        this.test2Str = JSON.stringify(test2)
        let yes2: JourneyResponse = JSON.parse(this.test2Str)
        this.test3Str = JSON.stringify(test3)
        let yes3: JourneyResponse = JSON.parse(this.test3Str)

        //this.testMap = new Map<number, JourneyResponse>
        //this.testMap.set(0, yes1)
        //this.testMap.set(1, yes2)
        //this.testMap.set(2, yes3)
    }

    public getJourneyResponseDEBUG(num: number){
        return this.testMap.get(num)
    }
}
