import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { shareReplay, tap, switchMap, filter } from 'rxjs/operators';
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
      switchMap(user => this.firestore.doc(`userProfile/${user.uid}`).valueChanges()),
      tap(user => this.currentUser = user),
      shareReplay(1)
    );
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
        .set({ email, fullName, city, isAdmin:false });
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