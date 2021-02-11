import { Component } from '@angular/core';

import { Platform, AlertController, ToastController } from '@ionic/angular';
// import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';

import { Location } from '@angular/common';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    // private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private nativeAudio: NativeAudio,
    private _location: Location,
    private alertController: AlertController,
    private swUpdate: SwUpdate,
    // private toastCtrl: ToastController,
  ) {
    this.nativeAudio.preloadSimple('falcon', 'assets/audio/falcon.mp3');

    this.initializeApp();

    this.platform.backButton.subscribeWithPriority(10, (processNextHandler) => {
      console.log('Back press handler!');
      if (this._location.isCurrentPathEqualTo('/home')) {
        // Show Exit Alert!
        this.showExitConfirm();
        processNextHandler();
      } else {
        // Navigate to back page
        this._location.back();
      }
    });
  
    this.platform.backButton.subscribeWithPriority(5, () => {
      this.alertController.getTop().then(r => {
        if (r) {
          navigator['app'].exitApp();
        }
      }).catch(e => {
        console.log(e);
      })
    });
  }

  initializeApp(): void {
    console.log("initializing");
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      // this.splashScreen.hide();

      this.statusBar.backgroundColorByHexString('#1A59A5');
    });
    if (this.swUpdate.available) {
      console.log("if update available");
      this.swUpdate.available.subscribe(() => {
        if (confirm('A new version is available. Load it?'))
          window.location.reload();
      });
    }
  }

  // async ngOnInit() {

  //   this.swUpdate.available.subscribe(async res => {
  //     const toast = await this.toastCtrl.create({
  //       message: 'Update available!',
  //       position: 'bottom',
  //       buttons: [
  //         {
  //           role: 'cancel',
  //           text: 'Reload'
  //         }
  //       ]
  //     });

  //     await toast.present();

  //     toast
  //       .onDidDismiss()
  //       .then(() => this.swUpdate.activateUpdate())
  //       .then(() => window.location.reload());
  //   });
  // }

  showExitConfirm() {
    this.alertController.create({
      header: 'App Termination',
      message: 'Are you sure you want to close the app?',
      backdropDismiss: false,
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
        }
      }, {
        text: 'Exit',
        handler: () => {
          navigator['app'].exitApp();
        }
      }]
    })
      .then(alert => {
        alert.present();
      });
  }

}