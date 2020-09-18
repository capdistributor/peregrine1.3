import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';

// need to import authservice, or do I?
import { AuthService } from './auth.service';
import { filter, map, switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LogService {
  private userId$ = this.authService.currentUserAuth$.pipe(
    filter(user => !!user),
    map((user) => user.uid),
    tap((id) => (this._userId = id))
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
      tap((id) => {
        this.logListCollection = this.getLogsCollection(id);
      }),
      switchMap(() => this.logListCollection.valueChanges())
    );
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
    const newLogRef: firebase.firestore.DocumentReference = await this.logListCollection.add({});

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

  getLogsCollection(userId): AngularFirestoreCollection<any> {
    return this.firestore.collection(`/userProfile/${userId}/logList`, (ref) =>
      ref.orderBy('date', 'desc').limit(5)
    );
  }

  getLogDetail(logId: string): AngularFirestoreDocument<any> {
    return this.firestore.doc(`/userProfile/${this._userId}/logList/${logId}`);
  }

  updateLog(logId, updateLogFormValue) {
    return this.firestore
      .doc(`/userProfile/${this._userId}/logList/${logId}`)
      .update(updateLogFormValue)
      .then(function (res) {
        console.log('Document successfully updated!', res);
      });
  }

  deleteLog(logId: string): Promise<any> {
    return this.logListCollection.doc(logId).delete();
  }
}
