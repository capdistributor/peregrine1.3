import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { forkJoin, Observable } from 'rxjs';
import { map, shareReplay, take } from 'rxjs/operators';
import { startOfMonth, endOfMonth } from 'date-fns';
import { DateService } from './date.service';
import { Log } from './log.service';


@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  constructor(
    private firestore: AngularFirestore,
    private dateService: DateService
  ) {}

  get userProfilesColletion$() {
    return this.getCollectionSnapshot('userProfile').pipe(
      take(1),
      shareReplay(1)
    ) as Observable<UserProfile[]>;
  }

  getDriverMonthlyLoglist(id: string, date = new Date()) {
    const firstOfMonth = this.dateService.longFormat(startOfMonth(date));
    const lastOfMonth = this.dateService.longFormat(endOfMonth(date));
    return this.firestore
      .collection('userProfile')
      .doc(id)
      .collection('logList', (query) =>
        query.where('date', '>=', firstOfMonth).where('date', '<', lastOfMonth)
      )
      .valueChanges()
      .pipe(take(1), shareReplay(1)) as Observable<Log[]>;
  }

  getDriversMonthlyLogListById(ids: string[], date = new Date()) {
    const actions = ids.reduce((map, id) => {
      map.set(id, this.getDriverMonthlyLoglist(id, date))
      return map;
    }, new Map());

    return forkJoin(Object.fromEntries(actions)) as unknown as Observable<LogListById>;
  }

  getCollection(collection: string) {
    return this.firestore.collection(collection).valueChanges();
  }

  getCollectionSnapshot(collection: string) {
    return this.firestore
      .collection<any>(collection)
      .snapshotChanges()
      .pipe(map(this.mapSnapshotChangesToData));
  }

  private mapSnapshotChangesToData(snapshot) {
    return snapshot.map((snap) => {
      const data = snap.payload.doc.data();
      const id = snap.payload.doc.id;
      return { id, ...data };
    });
  }

}


export interface UserProfile {
  id: string;
  city: string;
  email: string;
  fullName: string;
  isAdmin: boolean;
  isVerified: boolean;
}

export interface LogListById {
  [key: string]: Log[];
}