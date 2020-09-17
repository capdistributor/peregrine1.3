import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
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
  private memoList: AngularFirestoreCollection<any>;
  userId: string;

  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService
    ) {
    this.memoList = this.firestore.collection(`/memos`,
    ref => ref.where('isArchived', '==', false).orderBy('date', 'desc'));

    this.authService.currentUserAuth$
      .subscribe(user => this.userId = user.uid);
  }

  getMemoList(): AngularFirestoreCollection<any> {
    return this.memoList;
  }

  getMemoDetail(memoId: string): Observable<Memo> {
    return this.memoList.valueChanges().pipe(
      map(memos => {
        return memos.find(memo => memo.id === memoId);
      })
    );
  }

  // User Functions
  dateFromFirestore(date): Date {
    return new Date (date.seconds * 1000);
  }

  isMemoConfirmed(memo: Memo): boolean {
    const confirmDate = memo.confirmations && memo.confirmations[this.userId];
    return !!confirmDate;
  }

  unconfirmedMemosExist(): Observable<boolean> {
    return this.memoList.valueChanges()
      .pipe(
        map(memos => memos.some(memo => !memo.confirmations || !memo.confirmations[this.userId])),
      );
  }

  submitMemoConfirmed(memo: Memo, userId: string) {
    const now = new Date();
    if (!memo.confirmations) {
      memo.confirmations = {};
    }
    memo.confirmations[userId] = now;
    return this.firestore.doc<Memo>(`/memos/${memo.id}`).update(memo);
  }


  // Admin Functions
  async createMemo(
    date: Date,
    subject: string = null,
    mainText: string = null,
    isArchived: boolean = false
  ): Promise<any> {
    const newMemoRef: firebase.firestore.DocumentReference = await this.memoList.add({});

    return newMemoRef.update({
      date,
      subject,
      mainText,
      isArchived,
      id: newMemoRef.id,
    });
  }

  // Next Version Functions

  // async updateMemo(memoId, updateMemoFormValue) {
  //   console.log("update form value: ", updateMemoFormValue);
  //   const res = await this.firestore.doc(`/memos/${memoId}`).update(updateMemoFormValue);
  //   console.log("Memo successfully updated!", res);
  // }

  // deleteMemo(memoId: string): Promise<any> {
  //   return this.memoList.doc(memoId).delete();
  // }

  // async archiveMemo(memoId: string) {
  //   return await this.firestore.doc(`/memos/${memoId}`)
  //     .update({
  //       isArchived: true
  //     });
  // }

}