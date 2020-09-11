import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { SettingsService } from 'src/app/services/settings.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  public activities = {
    relays: null,
    lateBags: null,
    directs: null,
    tieOuts: null,
    signature: null,
    nonSignature: null,
    customsCOD: null,
    nonBarcoded: null,
    cpu: null,
    cpu11To50: null,
    cpu51AndUp: null,
    slb: null,
    depotTransfers: null,
    rpoClears: null,
    latePrios: null,
    slbExtractions: null,
    manAndVan: null,
    stationMain: null,
    virl: null,
    boxChecks: null,
    fedex: null,
    redBags: null,
    ported: null,
    seaplane: null,
    bhv: null,
    mobiles: null,
    boeing: null,
  };
  keys = Object.keys(this.activities);

  isLoaded = false;

  constructor(
    private fb: FormBuilder,
    public router: Router,
    public toastCtrl: ToastController,
    private settingsService: SettingsService
  ) {
    
    this.settingsService.getSettings().then(settings => {
      if (settings) {
        this.activities = settings;
      }
      this.isLoaded = true;
    });
  }

  ngOnInit() {}

  async saveSettingsToast() {
    this.settingsService.setSettings(this.activities).then(() =>{
      this.router.navigateByUrl('/home').then(() => {
        this.settingsToast();
      });
    });
  }

  async settingsToast () {
    const toast = await this.toastCtrl.create({
      message: 'Settings Saved',
      duration: 1000,
      position: 'top'
    });
    toast.present();
  }
}