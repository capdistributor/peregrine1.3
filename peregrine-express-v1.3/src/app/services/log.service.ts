import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Observable, of } from 'rxjs';

// need to import authservice, or do I?
import { AuthService } from './auth.service';
import { filter, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  public logList: AngularFirestoreCollection<any>;
  private _userId: string;

  private logsCollection: AngularFirestoreCollection<any>;
  logs: Observable<any>;
  

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    public authService: AuthService
  ) {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        console.log("user:", user);
        this._userId = user.uid;

        this.logList = this.firestore.collection(`/userProfile/${user.uid}/logList`,
        ref =>
          ref.orderBy('date', 'desc').limit(5)
        );
      }
      else {
        console.log("no user data");
      }
    });
  }

  async createLog(
    date: Date,
    relays: number = null,
    lateBags: number = null,
    directs: number = null,
    tieOuts: number = null,
    signature: number = null,
    nonSignature: number = null,
    customsCOD: number = null,
    nonBarcoded: number = null,
    cpu: number = null,
    cpu11To50: number = null,
    cpu51AndUp: number = null,
    slb: number = null,
    depotTransfers: number = null,
    rpoClears: number = null,
    latePrios: number = null,
    slbExtractions: number = null,
    manAndVan: number = null,
    stationMain: number = null,
    virl: number = null,
    boxChecks: number = null,
    fedex: number = null,
    redBags: number = null,
    ported: number = null,
    seaplane: number = null,
    bhv: number = null,
    mobiles: number = null,
    boeing: number = null,
    notes: string = null
  ): Promise<any> {
    const newLogRef: firebase.firestore.DocumentReference = await this.logList.add({});

    return newLogRef.update({
      date,
      relays,
      lateBags,
      directs,
      tieOuts,
      signature,
      nonSignature,
      customsCOD,
      nonBarcoded,
      cpu,
      cpu11To50,
      cpu51AndUp,
      slb,
      depotTransfers,
      rpoClears,
      latePrios,
      slbExtractions,
      manAndVan,
      stationMain,
      virl,
      boxChecks,
      fedex,
      redBags,
      ported,
      seaplane,
      bhv,
      mobiles,
      boeing,
      notes,
      id: newLogRef.id,
    });
  }

  // this is only called once, in memo-single.page.ts
  get userId(): Observable<string> {
    console.log('getting userid...', this._userId);
    return of(this._userId);
  }

  getLogsCollection(userId) {
    return this.firestore
      .collection(`/userProfile/${userId}/logList`,
        ref => ref.orderBy('date', 'desc').limit(5)
      )
      .valueChanges()
  }

  getLogList() {
    return this.afAuth.authState.pipe(
      filter(user => !!user),
      switchMap(user => this.getLogsCollection(user.uid))
    );
  }

  getLogDetail(logId: string): AngularFirestoreDocument<any> {
    return this.firestore.doc(`/userProfile/${this._userId}/logList/${logId}`);
  }

  updateLog(logId, updateLogFormValue) {
    return this.firestore.doc(`/userProfile/${this._userId}/logList/${logId}`).update(
      updateLogFormValue
    )
    .then(function(res) {
      console.log("Document successfully updated!", res);
    });
  }

  deleteLog(logId: string): Promise<any> {
    return this.logList.doc(logId).delete();
  }

}