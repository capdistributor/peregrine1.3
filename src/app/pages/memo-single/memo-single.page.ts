import { Component, OnDestroy, OnInit } from '@angular/core';
import { MemoService, Memo } from '../../services/memo.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, of, combineLatest as CombineLatest, Subscription } from 'rxjs';
import { LogService } from 'src/app/services/log.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-memo-single',
  templateUrl: './memo-single.page.html',
  styleUrls: ['./memo-single.page.scss'],
})
export class MemoSinglePage implements OnInit, OnDestroy {
  memoId: string;
  userId: string;
  currentMemo: Memo;
  isConfirmed$: Observable<boolean>;
  memoSubscription: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private memoService: MemoService,
    public logService: LogService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    const memoId = this.route.snapshot.paramMap.get('id');

    this.memoSubscription = CombineLatest([
      this.memoService.getMemoDetail(memoId),
      this.authService.currentUserAuth$
    ])
      .subscribe(([memo, user]) => {
        this.currentMemo = {
          ...memo,
          date: this.memoService.dateFromFirestore(memo.date)
        };

        this.userId = user.uid;
        this.isConfirmed$ = of(memo.confirmations && memo.confirmations[this.userId]);
      });

  }

  ngOnDestroy() {
    this.memoSubscription.unsubscribe();
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
