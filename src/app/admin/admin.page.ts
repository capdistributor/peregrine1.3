import { Component, OnInit } from '@angular/core';
import { SpreadsheetService } from '../services/spreadsheet.service';


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

  constructor(private sheetService: SpreadsheetService) { }

  ngOnInit() {
  }

  getSpreadSheet(data = dummyData) {
    return this.sheetService.getSpreadSheetUrl(data);
  }

}