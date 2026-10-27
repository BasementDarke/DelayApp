import { Injectable } from '@angular/core';
import { ParameterKey } from '../objects/parameter.key';
import type { ParameterMap } from '../objects/parameter.map';
import { ParameterBlock } from '../objects/parameter.block';

@Injectable({
  providedIn: 'root',
})
export class TaskRegistryHandler {
  taskKey: number

  constructor() {
      this.taskKey = 0
  }

  registerJourneyParameters(parameters: Map<ParameterKey, string>){
    let generatedTaskKey = this.taskKey
    this.taskKey += 1
    return new ParameterBlock(generatedTaskKey, parameters)
  }
}
