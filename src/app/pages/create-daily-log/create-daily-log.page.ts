import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { LogService } from '../../services/log.service';
import { SettingsService } from 'src/app/services/settings.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-create-daily-log',
  templateUrl: './create-daily-log.page.html',
  styleUrls: ['./create-daily-log.page.scss'],
})
export class CreateDailyLogPage implements OnInit {
  public activities;
  public createLogForm: FormGroup;
  today = new Date().toISOString();
  // todayTimeZoneDate: string = new Date(this.today.getTime() - this.today.getTimezoneOffset() * 60000).toISOString();
  isLoaded = false;
  buttonDisabled = false;
  foundActivities: boolean;

  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    private logService: LogService,
    private settingsService: SettingsService,
    private toastCtrl: ToastController
  ) {
    this.createLogForm = this.formBuilder.group({
      date: [this.today],
      relays: [''],
      lateBags: [''],
      directs: [''],
      tieOuts: [''],
      signature: [''],
      nonSignature: [''],
      customsCOD: [''],
      nonBarcoded: [''],
      cpu: [''],
      cpu11To50: [''],
      cpu51AndUp: [''],
      slb: [''],
      depotTransfers: [''],
      rpoClears: [''],
      latePrios: [''],
      slbExtractions: [''],
      manAndVan: [''],
      stationMain: [''],
      virl: [''],
      boxChecks: [''],
      fedex: [''],
      redBags: [''],
      ported: [''],
      seaplane: [''],
      bhv: [''],
      mobiles: [''],
      boeing: [''],
      overheadDoor: [''],
      wool: [''],
      stationA: [''],
      chHart: [''],
      kimberley: [''],
      viu: [''],
      studentRes: [''],
      nrgh: [''],
      icbc: [''],
      ooa: [''],
      sort: [''],
      lateBagsAddTrip: [''],
      lateLateBags: [''],
      notes: ['']
    });
  }

  ngOnInit() {
    this.settingsService.getSettingsFromStorage().then(settings => {
      this.activities = settings;
      this.isLoaded = true;

      const keys = Object.keys(this.activities);
      const foundActivities = keys.filter(key => !!this.activities[key]);
      this.foundActivities = !!foundActivities.length;
    });
  }

  createLog(createLogForm) {
    this.buttonDisabled = true;
    this.router.navigateByUrl('/home')
      .then(
        () => {
        this.logService
          .createLog(
            createLogForm.value.date,
            createLogForm.value.relays,
            createLogForm.value.lateBags,
            createLogForm.value.directs,
            createLogForm.value.tieOuts,
            createLogForm.value.signature,
            createLogForm.value.nonSignature,
            createLogForm.value.customsCOD,
            createLogForm.value.nonBarcoded,
            createLogForm.value.cpu,
            createLogForm.value.cpu11To50,
            createLogForm.value.cpu51AndUp,
            createLogForm.value.slb,
            createLogForm.value.depotTransfers,
            createLogForm.value.rpoClears,
            createLogForm.value.latePrios,
            createLogForm.value.slbExtractions,
            createLogForm.value.manAndVan,
            createLogForm.value.stationMain,
            createLogForm.value.virl,
            createLogForm.value.boxChecks,
            createLogForm.value.fedex,
            createLogForm.value.redBags,
            createLogForm.value.ported,
            createLogForm.value.seaplane,
            createLogForm.value.bhv,
            createLogForm.value.mobiles,
            createLogForm.value.boeing,
            createLogForm.value.overheadDoor,
            createLogForm.value.wool,
            createLogForm.value.stationA,
            createLogForm.value.chHart,
            createLogForm.value.kimberley,
            createLogForm.value.viu,
            createLogForm.value.studentRes,
            createLogForm.value.nrgh,
            createLogForm.value.icbc,
            createLogForm.value.ooa,
            createLogForm.value.sort,
            createLogForm.value.lateBagsAddTrip,
            createLogForm.value.lateLateBags,
            createLogForm.value.notes
          );
        this.createLogToast();
        },
        error => {
          console.log(error);
        }
      );
  }

  async createLogToast() {
    const toast = await this.toastCtrl.create({
      message: 'Daily Log Uploaded!',
      duration: 1000,
      position: 'top'
    });
    toast.present();
  }
}
