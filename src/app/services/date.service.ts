import { Injectable } from '@angular/core';
import { format } from 'date-fns';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor() { }

  /**
   * Returns ISO date string.
   * Good for saving to DB.
   * If no `date` arg is passed, defaults to today's date.
   * @returns string e.g. "2021-02-18T17:18:42.689Z"
   */
  longFormat(date: Date | string = new Date()) {
    if (typeof date === 'string') {
      date = new Date(this.stripHoursFromDateString(date));
    }

    return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString();
  }

  /**
   * Returns short date string.
   * Good for human-readability.
   * If no `date` arg is passed, defaults to today's date.
   * @returns string e.g. "2021-02-18"
   */
  shortFormat(date: Date | string =  new Date()) {
    if (typeof date === 'string') {
      date = new Date(this.stripHoursFromDateString(date));
    }

    return format(date, 'yyyy-MM-dd');
  }

  // Legacy data contains Zulu time in the date string. This causes issues.
  // This method removes any hour/timezone info by creating a fresh Date form Year, Month, Day.
  private stripHoursFromDateString(dateString: string): Date {
    const [year, month, day] = dateString.slice(0, 10).split('-');

    return new Date(+year, (+month - 1), +day);
  }
}
