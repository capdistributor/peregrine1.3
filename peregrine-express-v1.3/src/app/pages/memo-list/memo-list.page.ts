import { Component, OnInit } from '@angular/core';
import { MemoService } from '../../services/memo.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-memo-list',
  templateUrl: './memo-list.page.html',
  styleUrls: ['./memo-list.page.scss'],
})
export class MemoListPage implements OnInit {
  public memoList: Observable<any>;

  constructor(
    private memoService: MemoService,
  ) {

  }

  ngOnInit() {
    this.memoList = this.memoService.getMemoList().valueChanges()
    .pipe(
      tap(m => console.log('memos', m))
    );
  }

}