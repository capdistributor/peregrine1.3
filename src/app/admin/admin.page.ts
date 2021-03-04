import { Component, OnInit } from '@angular/core';
import { SpreadsheetService } from '../services/spreadsheet.service';
import { DatabaseService } from '../services/database.service';
import { combineLatest, of, Subject } from 'rxjs';
import { mergeMap, switchMap, tap } from 'rxjs/operators';


const MONTHS = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {
  runReport$ = new Subject();
  reportRunning = false;
  readonly months = MONTHS;
  readonly years = this.getYears();
  selectedMonth = new Date().getMonth();
  selectedYear = new Date().getFullYear();

  constructor(
    private sheetService: SpreadsheetService,
    private dbService: DatabaseService
  ) {}

  ngOnInit() {
    this.runReport$
      .pipe(
        tap(() => (this.reportRunning = true)),
        switchMap(() => this.dbService.allUserProfiles$),
        mergeMap((userProfiles) => {
          const ids = userProfiles.map((user) => user.id);
          const date = new Date(this.selectedYear, this.selectedMonth);

          return combineLatest([
            of(userProfiles),
            this.dbService.getDriversMonthlyLogListById(ids, date),
            of(date)
          ]);
        })
      )
      .subscribe(([userProfiles, logListsById, date]) => {
        console.log(`preparing report for ${userProfiles.length} drivers`);

        const workbook = this.sheetService.prepareWorkbookData(
          userProfiles,
          logListsById,
          date
        );

        this.sheetService.downloadWorkbook(workbook);
        this.reportRunning = false;
      });
  }

  getReport() {
    this.runReport$.next();
  }

  private getYears() {
    const years = [];
    const currentYear = new Date().getFullYear();
    let year = 2019;

    do {
      years.push(year);
      year++;
    } while (year <= currentYear);

    return years;
  }
}
