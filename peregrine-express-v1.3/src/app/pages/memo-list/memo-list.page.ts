import { Component, OnInit } from '@angular/core';
import { MemoService } from '../../services/memo.service';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-memo-list',
  templateUrl: './memo-list.page.html',
  styleUrls: ['./memo-list.page.scss'],
})
export class MemoListPage implements OnInit {
  public memoList: Observable<any>;
  isAdmin$ = this.authService.currentUserProfile$.pipe(
    map(user => user.isAdmin)
  );

  constructor(
    private memoService: MemoService, private authService: AuthService
  ) {

  }

  ngOnInit() {
    this.memoList = this.memoService.getMemoList().valueChanges();
  }

}