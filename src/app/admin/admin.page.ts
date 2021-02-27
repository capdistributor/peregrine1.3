import { Component, OnInit } from '@angular/core';
import { SpreadsheetService } from '../services/spreadsheet.service';
import { DatabaseService } from '../services/database.service';
import { combineLatest, of, Subject } from 'rxjs';
import { debounceTime, distinct, mergeMap, switchMap, tap } from 'rxjs/operators';


const dummyData = [
  { name: "Chris", message: "Hi Chris!" },
  { name: "Steve", message: "Proof of Concept" }
];

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {
  spreadSheetClicked$ = new Subject();

  working = false;

  constructor(
    private sheetService: SpreadsheetService,
    private dbService: DatabaseService
  ) { }

  ngOnInit() {
    this.spreadSheetClicked$
      .pipe(
        tap(() => this.working = true),
        switchMap(() => this.dbService.userProfilesColletion$),
        mergeMap(userProfiles => {
          const ids = userProfiles.map(user => user.id);
            
          return combineLatest([
            of(userProfiles),
            this.dbService.getDriversMonthlyLogListById(ids)
          ]);
        }),
        distinct()
      )
      .subscribe(([userProfiles, logListsById]) => {
        const workbook = this.sheetService.prepareWorkbookData(userProfiles, logListsById);

        this.sheetService.downloadWorkbook(workbook);
        this.working = false;
      });
  }

  getSpreadSheet(data = dummyData) {
    this.spreadSheetClicked$.next();
  }

}
