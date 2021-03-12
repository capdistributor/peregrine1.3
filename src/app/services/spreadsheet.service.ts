import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { DateService } from './date.service';
import { LogListById, UserProfile } from './database.service';
import { Log, LogService } from './log.service';
import { ACTIVITY_IDS, SETTINGS } from '../pages/settings/_settings.masterlist';
import { getDaysInMonth, getMonth, getYear } from 'date-fns';

@Injectable({
  providedIn: 'root',
})
export class SpreadsheetService {
  constructor(
    private dateService: DateService,
    private logService: LogService
  ) {}

  prepareWorkbookData(users: UserProfile[], logsById: LogListById, date = new Date()) {
    const sheetData = users.sort(sortUsersByCity).map((user) => {
      return {
        name: this.getSheetName(user),
        sheet: this.prepareSpreadSheet(logsById[user.id], date),
      }
    });

    return this.prepareWorkbook(sheetData);
  }

  downloadWorkbook(workbookData: XLSX.WorkBook) {
    const options: XLSX.WritingOptions = {
      bookType: 'xlsx',
      type: 'array',
    };

    const wbout = XLSX.write(workbookData, options);

    FileSaver.saveAs(
      new Blob([wbout], { type: 'application/octet-stream' }),
      `${this.getFileName()}.xlsx`
    );
  }

  private prepareSpreadSheet(logList: Log[], date: Date) {
    const logsByDateMap = this.mapLogsByDate(logList);
    const fullMonthList = this.padLogListWithEmptyDays(logsByDateMap, date);
    const orderedLogs = fullMonthList.map((log) => this.sortLogActivities(log));

    return XLSX.utils.json_to_sheet(orderedLogs);
  }

  private prepareWorkbook(
    sheetData: { name: string; sheet: XLSX.WorkSheet }[]
  ) {
    const workbook = XLSX.utils.book_new();

    sheetData.forEach(({ name, sheet }) => {
      XLSX.utils.book_append_sheet(workbook, sheet, name);
    });

    return workbook;
  }

  private getFileName() {
    const dateString = this.dateService.shortFormat();
    return `peregrine-express-report_${dateString}`;
  }

  // orders activities into correct order (see _settings.master-list.ts SETTINGS)
  sortLogActivities(log: Log) {
    const orderedLog = new Map();

    // Date first
    orderedLog.set('Date', this.dateService.shortFormat(log.date));
    // then activities
    ACTIVITY_IDS.forEach((activity) => {
      const key = SETTINGS[activity].name;
      orderedLog.set(key, log[activity]);

      // removes all those zeros from the spreasheet
      if (orderedLog.get(key) === 0) {
        orderedLog.set(key, null);
      }
    });
    // Finally Notes
    orderedLog.set('Notes', log.notes);

    return Object.fromEntries(orderedLog);
  }

  private getSheetName(user: UserProfile) {
    let name = `${user.fullName} (${user.city})`;

    if (name.length > 30) {
      name = `${name.substr(0, 27)}...`;
    }

    return name;
  }

  private padLogListWithEmptyDays(logsByDateMap: Map<string, Log>, date: Date): Log[] {
    const paddedList = this.createEmptyMonthMap(date);

    logsByDateMap.forEach((log, dateKey) => {
      paddedList.set(dateKey, log);
    });


    return Array.from(paddedList.values());
  }

  private mapLogsByDate(LogList: Log[]): Map<string, Log> {
    const logsByDateMap = new Map();

    LogList.forEach(log => {
      const shortDate = this.dateService.shortFormat(log.date);
      logsByDateMap.set(shortDate, log);
    });

    return logsByDateMap;
  }

  private createEmptyMonthMap(date: Date): Map<string, Log> {
    const emptyMonthMap = new Map();
    const daysInMonth = getDaysInMonth(date);
    const year = getYear(date);
    const month: string | number = getMonth(date);

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = this.dateService.shortFormat(new Date(year, month, day));

      emptyMonthMap.set(currentDate, this.createEmptyLog(currentDate));
    }

    return emptyMonthMap;
  }

  private createEmptyLog(date: string): Log {
    const emptyLog = this.logService.createEmptyLog();
    emptyLog.date = date;

    return emptyLog;
  }
}

function sortUsersByCity(a, b) {
  if (a.city === b.city) {
    return 0;
  }
  return a.city < b.city ? -1 : 1;
}
