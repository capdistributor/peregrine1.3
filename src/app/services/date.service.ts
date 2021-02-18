import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor() { }

  /**
   * Returns ISO date string.
   * Good for saving to DB.
   * @returns string e.g. "2021-02-18T17:18:42.689Z"
   */
  longFormat(date: Date | string) {
    if (typeof date === 'string') {
      date = new Date(date);
    }

    return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString();
  }

  /**
   * Returns short date string.
   * Good for human-readability.
   * @returns string e.g. "2021-02-18"
   */
  shortFormat(date: Date | string) {
    if (typeof date === 'string') {
      date = new Date(date);
    }

    return date.toISOString().substring(0, 10);
  }
}
