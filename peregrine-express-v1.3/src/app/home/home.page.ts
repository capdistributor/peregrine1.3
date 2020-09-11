import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { LogService } from '../services/log.service';
import { Observable, Subscription } from 'rxjs';
import { MemoService } from '../services/memo.service';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public logList: Observable<any>;
  unreadMemoStatus$: Observable<boolean> = this.memoService.unconfirmedMemosExist();
  public unsubscribeBackEvent: Subscription;

  constructor(
    private afAuth: AngularFireAuth,
    private alertCtrl: AlertController,
    private logService: LogService,
    private memoService: MemoService,
    private platform: Platform
  ) {}

  ngOnInit() {
    this.logList = this.logService.getLogList().valueChanges();
    this.initializeBackButtonCustomHandler();
  }

  ionViewWillLeave() {
    this.unsubscribeBackEvent;
  }

  initializeBackButtonCustomHandler(): void {
    this.unsubscribeBackEvent = this.platform.backButton.subscribeWithPriority(999999, () => {
      this.confirmExit();
    })
  }

  async confirmExit() {
    const alert = await this.alertCtrl.create({
      message: 'Are you sure you want quit?',
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Exit',
          handler: () => {
            navigator['app'].exitApp();
          }
        }
      ]
    });
    await alert.present();
  }

  async confirmLogout() {
    const alert = await this.alertCtrl.create({
      message: 'Are you sure you want log out?',
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Log Out',
          handler: () => {
            this.userLogout();
          }
        }
      ]
    });
    await alert.present();
  }

  userLogout(): Promise<void> {
    return this.afAuth.signOut();
  }
}