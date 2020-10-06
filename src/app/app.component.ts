import { Component } from '@angular/core';

import { Platform, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';

import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private nativeAudio: NativeAudio,
    private _location: Location,
    private alertController: AlertController
  ) {
    this.nativeAudio.preloadSimple('falcon', 'assets/audio/falcon.mp3');

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

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.statusBar.backgroundColorByHexString('#1A59A5');
    });
  }

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