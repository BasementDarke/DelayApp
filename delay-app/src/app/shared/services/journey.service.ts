import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiUrls } from '../constants/urls';

@Injectable({
  providedIn: 'root',
})
export class JourneyService {
  private readonly http = inject(HttpClient);

  public getBalls(): Observable<JSON> {
    return this.http.get<JSON>(ApiUrls.BaseApiUrl);
  }
}
