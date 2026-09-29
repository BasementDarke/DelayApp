export class TaskRegistryObject {
    taskKey: number;
    parameters: { [id: number] : string}
    func: Function

    constructor(taskKey: number, parameters: { [id: number] : string}, func: Function) {
        this.taskKey = taskKey
        this.parameters = parameters
        this.func = func
    }
}
