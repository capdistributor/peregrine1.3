import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, AlertController } from '@ionic/angular';
import { SettingsService } from 'src/app/services/settings.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  public activities = {
    relays: {active: false, name: 'Relays'},
    lateBags: {active: false, name: 'Late Bags'},
    directs: {active: false, name: 'Directs'},
    tieOuts: {active: false, name: 'Tie Outs'},
    signature: {active: false, name: 'Signature'},
    nonSignature: {active: false, name: 'Non-Signature'},
    customsCOD: {active: false, name: 'Customs COD'},
    nonBarcoded: {active: false, name: 'Non-Barcoded'},
    cpu: {active: false, name: 'CPU'},
    cpu11To50: {active: false, name: 'CPU 11 to 50'},
    cpu51AndUp: {active: false, name: 'CPU 51 and Up'},
    slb: {active: false, name: 'SLB'},
    depotTransfers: {active: false, name: 'Depot Transfers'},
    rpoClears: {active: false, name: 'RPO Clears'},
    latePrios: {active: false, name: 'Late Prios'},
    slbExtractions: {active: false, name: 'SLB Extractions'},
    manAndVan: {active: false, name: 'Man and Van'},
    stationMain: {active: false, name: 'Station Main'},
    virl: {active: false, name: 'VIRL'},
    boxChecks: {active: false, name: 'Box Checks'},
    fedex: {active: false, name: 'Fedex'},
    redBags: {active: false, name: 'Red Bags'},
    ported: {active: false, name: 'Ported'},
    seaplane: {active: false, name: 'Seaplane'},
    bhv: {active: false, name: 'BHV'},
    mobiles: {active: false, name: 'Mobiles'},
    boeing: {active: false, name: 'Boeing'},
    overheadDoor: {active: false, name: 'Overhead Door'},
    wool: {active: false, name: 'Wool'},
    stationA: {active: false, name: 'Station A'},
    chHart: {active: false, name: 'CH Hart'},
    kimberley: {active: false, name: 'Kimberley'},
    viu: {active: false, name: 'VIU'},
    studentRes: {active: false, name: 'Student Res'},
    nrgh: {active: false, name: 'NRGH'},
    icbc: {active: false, name: 'ICBC'},
    ooa: {active: false, name: 'OOA'},
    sort: {active: false, name: 'Sort'},
    lateBagsAddTrip: {active: false, name: 'Late Bags Add Trip'},
    lateLateBags: {active: false, name: 'Late Late Bags'}
  };
  keys = Object.keys(this.activities);

  isLoaded = false;

  // Relays
  // Late Bags
  // Directs
  // Tie Outs
  // Signature
  // Non-Signature
  // Customs COD
  // Non-Barcoded
  // CPU
  // CPU 11 to 50
  // CPU 51 and Up
  // SLB
  // Depot Transfers
  // RPO Clears
  // Late Prios
  // SLB Extractions
  // Man and Van
  // Station Main
  // VIRL
  // Box Checks
  // Fedex
  // Red Bags
  // Ported
  // Seaplane
  // BHV
  // Mobiles
  // Boeing
  // Overhead Door
  // Wool
  // Station A
  // CH Hart
  // Kimberley
  // VIU
  // Student Res
  // NRGH
  // ICBC
  // OOA
  // Sort
  // Late Bags Add Trip
  // Late Late Bags

  constructor(
    private fb: FormBuilder,
    public router: Router,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    private settingsService: SettingsService
  ) {
    
    this.settingsService.getSettings().then(settings => {
      if (settings) {
        this.activities = settings;
      }
      this.isLoaded = true;
    });
  }

  ngOnInit() {
    console.log("init says hi");
  }

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

  async settingsClearedToast () {
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
    })
    alert.present();
  }
}