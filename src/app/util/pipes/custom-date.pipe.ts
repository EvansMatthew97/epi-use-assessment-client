import { PipeTransform, Pipe } from '@angular/core';
import { DatePipe } from '@angular/common';

/**
 * Date pipe for universal use throughout the application.
 * Helps ensure consistent date format (dd-MM-yyyy)
 */
@Pipe({
  name: 'customDate',
})
export class CustomDatePipe implements PipeTransform {
  transform(date: Date | string): string {
    return new DatePipe('en-GB').transform(date, 'dd-MM-yyyy');
  }
}
