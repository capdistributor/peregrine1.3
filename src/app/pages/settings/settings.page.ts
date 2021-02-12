import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, AlertController } from '@ionic/angular';
import { SettingsService } from 'src/app/services/settings.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Setting, Settings } from './_settings.masterlist';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  isLoaded = false;
  settingsForm: FormGroup;

  settingsList$ = this.settingsService.settingsList$;
  activeSettings$ = this.settingsService.activeSettings$;

  constructor(
    public router: Router,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    private settingsService: SettingsService
  ) {
  }

  ngOnInit() {
    combineLatest([
      this.settingsList$,
      this.activeSettings$
    ]).subscribe(([settingsList, activeSettings]) => {
      this.settingsForm = this.buildForm(settingsList, activeSettings);
      this.isLoaded = true;
    });
  }

  async saveSettingsToast() {
    this.settingsService.saveSettingsToStorage(this.settingsForm.value).then(() => {
      this.router.navigateByUrl('/home').then(() => {
        this.settingsToast();
      });
    });
  }

  async settingsToast() {
    const toast = await this.toastCtrl.create({
      message: 'Settings Saved',
      duration: 1000,
      position: 'top'
    });
    toast.present();
  }

  async settingsClearedToast() {
    const toast = await this.toastCtrl.create({
      message: 'Settings Cleared',
      duration: 1000,
      position: 'top'
    });
    toast.present();
  }

  async onSubmitClearStorage(): Promise<void> {
    const alert = await this.alertCtrl.create({
      message: 'Are you sure you want to delete your settings?',
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Confirm Delete',
          handler: data => {
            this.settingsService.clearStorage();
            this.router.navigateByUrl('/home').then(() => {
              this.settingsClearedToast();
            });
          }
        }
      ]
    });

    alert.present();
  }

  private buildForm(settings: Setting[], activeSettings: Settings) {
    const formGroup = new FormGroup({});
    settings.forEach(setting => {
      const value = activeSettings[setting.id]?.active || false;
      formGroup.addControl(setting.id, new FormControl(value));
    });

    return formGroup;
  }
}