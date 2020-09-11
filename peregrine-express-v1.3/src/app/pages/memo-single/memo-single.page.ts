import { Component, OnInit } from '@angular/core';
import { MemoService, Memo } from '../../services/memo.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { LogService } from 'src/app/services/log.service';
import { combineLatest } from 'rxjs/operators';

@Component({
  selector: 'app-memo-single',
  templateUrl: './memo-single.page.html',
  styleUrls: ['./memo-single.page.scss'],
})
export class MemoSinglePage implements OnInit {
  public memo$: Observable<any>;
  memo: Memo;
  public memoId: string;
  public convertedDate: string;
  public isConfirmed: Observable<boolean>;
  userId: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private memoService: MemoService,
    public logService: LogService
  ) { }

  ngOnInit() {
    this.memoId = this.route.snapshot.paramMap.get('id');
    this.memo$ = this.memoService.getMemoDetail(this.memoId);
    this.memoService.getMemoDetail(this.memoId)
      .pipe(
        combineLatest(this.logService.userId)
      )
      .subscribe(([memo, userId]) => {
        this.memo = memo;
        this.memo.date = this.memoService.dateFromFirestore(memo.date);
        this.userId = userId;
        this.isConfirmed = of(memo.confirmations && memo.confirmations[userId]);
      })

  }

  submitConfirmed(memo: Memo) {
    this.memoService.submitMemoConfirmed(memo, this.userId).then(
      () => {
        this.router.navigateByUrl('/memo-list');
      },
      error => {
        console.log(error);
      }
    );
  }
}