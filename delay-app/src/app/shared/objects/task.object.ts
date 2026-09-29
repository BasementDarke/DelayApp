import { ParameterBlock } from "./parameter.block";

export class TaskObject {
    date: Date;
    taskKey: number;
    parameters: ParameterBlock;
    func: Function

    constructor(date: Date, taskKey: number, parameters: ParameterBlock, func: Function) {
        this.date = date
        this.taskKey = taskKey;
        this.parameters = parameters;
        this.func = func;
    }
}
