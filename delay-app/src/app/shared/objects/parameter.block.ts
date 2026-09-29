import { ParameterKey } from "./parameter.key";

export class ParameterBlock {
    taskKey: number;
    parameters: Map<ParameterKey, string>;

    constructor(taskKey: number, parameters: Map<ParameterKey, string>) {
        this.taskKey = taskKey
        this.parameters = parameters
    }

    
}
