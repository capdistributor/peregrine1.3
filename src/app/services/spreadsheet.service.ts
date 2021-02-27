import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import * as FileSaver from  'file-saver'
import { DateService } from './date.service';
import { DatabaseService, LogListById, UserProfile } from './database.service';
import { Log } from './log.service';
import { ACTIVITY_IDS, SETTINGS } from '../pages/settings/_settings.masterlist';

@Injectable({
  providedIn: 'root',
})
export class SpreadsheetService {
  constructor(private dateService: DateService) {}

  prepareWorkbookData(users: UserProfile[], logsById: LogListById) {
    const sheetData = users.sort(sortUsersByCity).map((user) => {
      return {
        name: this.getSheetName(user),
        sheet: this.prepareSpreadSheet(logsById[user.id]),
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

  private prepareSpreadSheet(logList: Log[]) {
    const orderedLogs = logList.map((log) => this.sortLogActivities(log));

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

  sortLogActivities(log: Log) {
    const orderedLog = new Map();

    orderedLog.set('Date', this.dateService.shortFormat(log.date));

    ACTIVITY_IDS.forEach((activity) => {
      const key = SETTINGS[activity].name;
      orderedLog.set(key, log[activity]);
    });

    orderedLog.set('Notes', log.notes);

    return Object.fromEntries(orderedLog);
  }

  private getSheetName(user: UserProfile) {
    let name = `${user.fullName} (${user.city})`;

    if (name.length > 30) {
      name = `${name.substr(0, 27)}...`
    }

    return name;
  }
}

function sortUsersByCity(a, b) {
  if (a.city === b.city) {
    return 0;
  }
  return a.city < b.city ? -1 : 1;
};