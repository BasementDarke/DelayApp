import { Injectable } from '@angular/core';
import { ParameterBlock } from '../objects/parameter.block';

@Injectable({
  providedIn: 'root',
})
export class ParameterTemplateService {
  templates: Map<number, ParameterBlock>;

  constructor(){
    this.templates = new Map<number, ParameterBlock>()
  }

  registerParameterTemplate(taskKey: number, parameters: ParameterBlock) {
    this.templates.set(taskKey, parameters)
  }

  getParameterBlock(taskKey: number) {
    return this.templates.get(taskKey)
  }
}
