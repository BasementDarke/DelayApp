import { formatDate } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'basementJourneyDate',
})
export class BasementJourneyDatePipe implements PipeTransform {
  transform(value: Date | string | null): unknown {
    if(value === null){
      return value
    }
    return formatDate(value, 'MMM d, y, HH:mm', 'en-US')
  }
}
