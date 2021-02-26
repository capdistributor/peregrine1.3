import { Component, OnInit } from '@angular/core';
import { SpreadsheetService } from '../services/spreadsheet.service';
import { DatabaseService } from '../services/database.service';
import { combineLatest, Subject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';


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

  constructor(
    private sheetService: SpreadsheetService,
    private dbService: DatabaseService
  ) { }

  ngOnInit() {
    this.spreadSheetClicked$
      .pipe(
        switchMap(() => this.dbService.userProfilesColletion$),
        tap(stuff => console.log('stuff', stuff)),
        switchMap(userProfiles => {
          const myMan = userProfiles.find(user => user.fullName
            .toLowerCase()
            .includes('avery raabe'));
            
          return this.dbService.getDriverMonthlyLoglist(myMan.id);
        })
      )
      .subscribe((result) => {
        console.log('result:', result)
      });
  }

  getSpreadSheet(data = dummyData) {
    this.spreadSheetClicked$.next();
    // return this.sheetService.getSpreadSheetUrl(data);
  }

}
