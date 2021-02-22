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
  settingsList$ = this.settingsService.settingsList$;
  activeSettings$ = this.settingsService.activeSettings$;

  isLoaded = false;
  settingsForm: FormGroup;

  constructor(
    public router: Router,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    private settingsService: SettingsService
  ) {}

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
    this.settingsService.saveActiveSettingsToStorage(this.settingsForm.value);
    this.router.navigateByUrl('/home').then(() => {
      this.settingsToast();
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
      let value = false;
      if (activeSettings && activeSettings[setting.id]) {
        value = !!activeSettings[setting.id];
      }

      formGroup.addControl(setting.id, new FormControl(value));
    });

    return formGroup;
  }
}