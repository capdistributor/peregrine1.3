import { Component, OnDestroy, OnInit } from '@angular/core';
import { MemoService, Memo } from '../../services/memo.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, of, combineLatest as CombineLatest, Subscription } from 'rxjs';
import { LogService } from 'src/app/services/log.service';
import { AuthService } from 'src/app/services/auth.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-memo-single',
  templateUrl: './memo-single.page.html',
  styleUrls: ['./memo-single.page.scss'],
})
export class MemoSinglePage implements OnInit, OnDestroy {
  public memo$: Observable<any>;
  memo: Memo;
  public memoId: string;
  public convertedDate: string;
  public isConfirmed: Observable<boolean>;
  userId: string;
  memoSubscription: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private memoService: MemoService,
    public logService: LogService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.memoId = this.route.snapshot.paramMap.get('id');
    this.memo$ = this.memoService.getMemoDetail(this.memoId)
      .pipe(
        tap(m => console.log('memo', m))
      );
    this.memoSubscription = CombineLatest([
      this.memoService.getMemoDetail(this.memoId),
      this.authService.currentUser$
    ])
      .subscribe(([memo, user]) => {
        this.memo = memo;
        this.memo.date = this.memoService.dateFromFirestore(memo.date);
        this.userId = user.uid;
        this.isConfirmed = of(memo.confirmations && memo.confirmations[this.userId]);
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