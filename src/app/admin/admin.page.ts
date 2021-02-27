import { Component, OnInit } from '@angular/core';
import { SpreadsheetService } from '../services/spreadsheet.service';
import { DatabaseService } from '../services/database.service';
import { combineLatest, of, Subject } from 'rxjs';
import { distinct, mergeMap, switchMap, tap } from 'rxjs/operators';
import { getMonth, getYear } from 'date-fns';


const MONTHS = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {
  spreadSheetClicked$ = new Subject();
  working = false;
  readonly months = MONTHS;
  readonly years = this.getYears();
  selectedMonth = new Date().getMonth();
  selectedYear = new Date().getFullYear();

  constructor(
    private sheetService: SpreadsheetService,
    private dbService: DatabaseService
  ) {}

  ngOnInit() {
    this.spreadSheetClicked$
      .pipe(
        tap(() => (this.working = true)),
        switchMap(() => this.dbService.userProfilesCollection$),
        mergeMap((userProfiles) => {
          console.log('userProfiles', userProfiles);
          const ids = userProfiles.map((user) => user.id);
          const date = new Date(this.selectedYear, this.selectedMonth);
          return combineLatest([
            of(userProfiles),
            this.dbService.getDriversMonthlyLogListById(ids, date),
          ]);
        }),
        distinct()
      )
      .subscribe(([userProfiles, logListsById]) => {
        const workbook = this.sheetService.prepareWorkbookData(
          userProfiles,
          logListsById
        );

        this.sheetService.downloadWorkbook(workbook);
        this.working = false;
      });
  }

  getSpreadSheet(data) {
    this.spreadSheetClicked$.next();
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
