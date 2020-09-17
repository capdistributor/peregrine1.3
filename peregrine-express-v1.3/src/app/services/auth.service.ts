import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { shareReplay, tap, filter, map,  concatMap } from 'rxjs/operators';
import 'firebase/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public currentUser;
  public currentUser$: Observable<any>;

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {
    this.currentUser$ = this.afAuth.authState.pipe(
      filter(user => !!user),
      tap(user => this.currentUser = user),
      concatMap(user => this.getUserProfile(user.uid)),
      map(userPofile => {
        return {...this.currentUser, ...userPofile};
      }),
      tap((megaUser) => this.currentUser = megaUser),
      shareReplay(1)
    );
  }

  getUserProfile(uid: string): Observable<any> {
    return this.firestore.doc(`userProfile/${uid}`).valueChanges();
  }

  getUser(): Promise<firebase.User> {
    return this.currentUser$.toPromise();
  }

  login(
    email: string,
    password: string
  ): Promise<firebase.auth.UserCredential> {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  async signup(
    email: string,
    password: string,
    fullName: string,
    city: string
  ): Promise<firebase.auth.UserCredential> {
    try {
      const newUserCredential: firebase.auth.UserCredential = await this.afAuth.createUserWithEmailAndPassword(
        email,
        password
      );
      await this.firestore
        .doc(`userProfile/${newUserCredential.user.uid}`)
        .set({ email, fullName, city, isAdmin:false, isActive:true });
      return newUserCredential;
    } catch (error) {
      throw error;
    }
  }

  resetPassword(email: string): Promise<void> {
    return this.afAuth.sendPasswordResetEmail(email);
  }

  logout(): Promise<void> {
    return this.afAuth.signOut();
  }
}