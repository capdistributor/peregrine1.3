import { Injectable } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import * as XLSX from 'xlsx';
import * as FileSaver from  'file-saver'
import { DateService } from './date.service';

@Injectable({
  providedIn: 'root'
})
export class SpreadsheetService {

  constructor(
    private dateService: DateService
  ) { }



  getSpreadSheetUrl(data: any) {
    const sheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet, 'Test Sheet');
    
    const options: XLSX.WritingOptions = {
      bookType: 'xlsx',
      type: 'array',
    };

    const wbout = XLSX.write(workbook, options);

    FileSaver.saveAs(new Blob([wbout],{type:"application/octet-stream"}), `${this.getFileName()}.xlsx`);
  }

  getFileName() {
    const dateString = this.dateService.shortFormat();
    return `peregrine-express-report_${dateString}`;
  }
}
