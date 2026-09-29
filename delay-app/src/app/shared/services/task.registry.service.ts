import { Injectable } from '@angular/core';
import { TaskRegistryObject } from '../objects/task.registry.object';

@Injectable({
  providedIn: 'root',
})
export class TaskRegistryService {
  taskRegistryList: Map<number, Function>

  constructor(){
    this.taskRegistryList = new Map<number, Function>()
  }

  registerTask(taskKey: number, func: Function) {
    this.taskRegistryList.set(taskKey, func)
  }

  getTask(taskKey: number){
    return this.taskRegistryList.get(taskKey)
  }
}
