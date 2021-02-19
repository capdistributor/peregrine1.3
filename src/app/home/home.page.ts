import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { LogService } from '../services/log.service';
import { Observable, Subscription } from 'rxjs';
import { MemoService } from '../services/memo.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  public logList$: Observable<any>;
  unreadMemoStatus$: Observable<boolean> = this.memoService.unconfirmedMemosExist();
  public unsubscribeBackEvent: Subscription;

  constructor(
    private authService: AuthService,
    private alertCtrl: AlertController,
    private logService: LogService,
    private memoService: MemoService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.logList$ = this.logService.logList$;
    // this.initializeBackButtonCustomHandler();
  }

  // ionViewWillLeave() {
  //   this.unsubscribeBackEvent;
  // }

  // initializeBackButtonCustomHandler(): void {
  //   this.unsubscribeBackEvent = this.platform.backButton.subscribeWithPriority(10, () => {
  //     this.confirmExit();
  //   })
  // }

  // async confirmExit() {
  //   const alert = await this.alertCtrl.create({
  //     message: 'Are you sure you want quit?',
  //     buttons: [
  //       { text: 'Cancel' },
  //       {
  //         text: 'Exit',
  //         handler: () => {
  //           navigator['app'].exitApp();
  //         }
  //       }
  //     ]
  //   });
  //   await alert.present();
  // }

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
    return this.authService.logout().then(() => {
      this.router.navigateByUrl('/login');
    });
  }
}