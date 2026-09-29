import { Injectable } from '@angular/core';
import { ParameterBlock } from '../objects/parameter.block';
import { ParameterKey } from '../objects/parameter.key';
import { test, expect, BrowserContext, firefox } from '@playwright/test';

@Injectable({
  providedIn: 'root',
})
export class PlaywrightApiService {
  ApiBaseUrl = 'https://www.skanetrafiken.se/'

  constructor(){

  }

  searchJourneys(parameters: ParameterBlock){
    var departureStation = parameters.parameters.get(ParameterKey.EdepartureStation)
    var arrivalStation = parameters.parameters.get(ParameterKey.EarrivalStation)
    var taskKey = parameters.taskKey;

    (async () => {
      const browser = firefox.launch();
      const context = (await browser).newContext();
      const page = (await context).newPage();
      (await page).goto(this.ApiBaseUrl);

      (await page).waitForTimeout(5000);

      (await context).close();
      (await browser).close();
    })
  }
}
