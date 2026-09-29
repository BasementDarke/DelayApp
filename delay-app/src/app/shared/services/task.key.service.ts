import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TaskKeyService {
  taskKeys: Map<number, string>

  constructor() {
    this.taskKeys = new Map<number, string>()
  }

  registerNewKey(key: number, value: string) {
    this.taskKeys.set(key, value)
  }

  checkKey(key: number) {
    const value = this.taskKeys.get(key)
    if(value === undefined) {
      return null
    }
    return key
  }
}
