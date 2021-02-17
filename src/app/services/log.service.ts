import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Observable, of } from 'rxjs';

// need to import authservice, or do I?
import { AuthService } from './auth.service';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class LogService {
  private userId$ = this.authService.currentUserAuth$.pipe(
    filter(user => !!user),
    map((user) => user.uid)
  );
  private _userId: string;

  public logList$: Observable<any>;
  private logListCollection: AngularFirestoreCollection<any>;
  logs: Observable<any>;

  constructor(
    private firestore: AngularFirestore,
    public authService: AuthService
  ) {
    this.logList$ = this.userId$.pipe(
      map((id) => {
        this.logListCollection = this.getLogsCollection(id);
      }),
      switchMap(() => this.logListCollection.snapshotChanges()),
      map(snapshot => snapshot.map(snap => {
        const data = snap.payload.doc.data();
        const id = snap.payload.doc.id;
        return { id, ...data };
      }))
    );

    this.userId$.pipe(take(1))
      .subscribe(id => {
        this._userId = id;
      });
  }

  createLog(newLog) {
      const formattedDate = this.formatDate(new Date(newLog.date));
      newLog.date = formattedDate;

      return this.firestore.collection(`/userProfile/${this._userId}/logList`).add(newLog)
        .then(doc => doc.id)
        .catch(error => {
          console.error('Error creating document: ', error);
          return false;
        });
  }

  getLogsCollection(userId): AngularFirestoreCollection<any> {
    return this.firestore.collection(`/userProfile/${userId}/logList`, (ref) =>
      ref.orderBy('date', 'desc').limit(30)
    );
  }

  getLogDetail(logId: string): AngularFirestoreDocument<any> {
    return this.firestore.doc(`/userProfile/${this._userId}/logList/${logId}`);
  }

  updateLog(logId, updateLogFormValue) {
    const formattedDate = this.formatDate(new Date(updateLogFormValue.date));
    updateLogFormValue.date = formattedDate;
    return this.firestore
      .doc(`/userProfile/${this._userId}/logList/${logId}`)
      .update(updateLogFormValue)
      .then(res => {
        console.log('Document successfully updated!');
      });
  }

  deleteLog(logId: string): Promise<any> {
    return this.logListCollection.doc(logId).delete();
  }

  formatDate(date: Date) {
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString();
  }
}