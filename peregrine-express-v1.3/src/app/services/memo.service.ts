import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { Observable, of, Timestamp } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

export interface Memo {
  id: string;
  date: any;
  subject: string;
  mainText: string;
  isArchived: boolean;
  confirmations?: {};
}

export interface ConfirmedMemo {
  id?: string;
  memoId: string;
  confirmedDate: Date;
}

@Injectable({
  providedIn: 'root'
})
export class MemoService {
  private memoList: AngularFirestoreCollection<Memo>;
  userId: string;

  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService) {

    this.memoList = this.firestore.collection(`memos`,
    ref => ref.where('isArchived', '==', false)
    .orderBy('date', 'desc'));

    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.userId = user.uid;
      }
    });
    // get list of confirmed memos from userId
  }

  dateFromFirestore(date) {
    return new Date (date.seconds * 1000);
  }


  getMemoList(): AngularFirestoreCollection<any> {
    return this.memoList;
  }

  getMemoDetail(memoId: string): Observable<Memo> {
    return this.memoList.valueChanges().pipe(
      map(memos => {
        return memos.find(memo => memo.id === memoId);
      })
    )
  }

  isMemoConfirmed(memo: Memo): Observable<ConfirmedMemo> {
    return of(!!memo.confirmations && memo.confirmations[this.userId])
  }

  unconfirmedMemosExist(): Observable<boolean> {
    return this.memoList.valueChanges()
      .pipe(
        map(memos => memos.some(memo => !memo.confirmations || !memo.confirmations[this.userId])),
      )
  }

  submitMemoConfirmed(memo: Memo, userId: string) {
    const now = new Date();
    if (!memo.confirmations) {
      memo.confirmations = {};
    }
    memo.confirmations[userId] = now;
    return this.firestore.doc<Memo>(`/memos/${memo.id}`).update(memo);
  };
}