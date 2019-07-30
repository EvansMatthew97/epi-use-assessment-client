import { PipeTransform, Pipe } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'customDate',
})
export class CustomDatePipe implements PipeTransform {
  transform(date: Date | string): string {
    return new DatePipe('en-GB').transform(date, 'dd-MM-yyyy');
  }
}
