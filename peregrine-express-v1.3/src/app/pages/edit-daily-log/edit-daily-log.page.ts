import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ActionSheetController, AlertController, ToastController } from '@ionic/angular';
import { LogService } from '../../services/log.service';
import { Observable } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-edit-daily-log',
  templateUrl: './edit-daily-log.page.html',
  styleUrls: ['./edit-daily-log.page.scss'],
})
export class EditDailyLogPage implements OnInit {
  public activities;
  public keys: string[];
  public log: Observable<any>;
  public logId: string;
  public updateLogForm: FormGroup;
  isLoaded = false;
  foundActivities: boolean;
  
  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public actionCtrl: ActionSheetController,
    public alertCtrl: AlertController,
    public logService: LogService,
    public formBuilder: FormBuilder,
    private firestore: AngularFirestore,
    public toastCtrl: ToastController,
    private settingsService: SettingsService
  ) {
    this.logId = this.route.snapshot.paramMap.get('id');
    this.log = this.logService.getLogDetail(this.logId).valueChanges();

    this.updateLogForm = this.formBuilder.group({
      date: [''],
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
      notes: ['']
    });
  }

  ngOnInit() {
    this.settingsService.getSettings().then((settings) => {
      this.activities = settings;
      this.keys = Object.keys(settings);
      this.isLoaded = true;

      const keys = Object.keys(this.activities);
      const foundActivities = keys.filter(key => !!this.activities[key]);
      this.foundActivities = !!foundActivities.length;
    });
  }

  onSubmitUpdateLog() {
    this.logService.updateLog(this.logId, this.updateLogForm.value)
    .then(
      () => {
        this.router.navigateByUrl('/home');
        this.updateLogToast();

      },
      error => {
        console.log(error);
      }
    );
  }

  async onSubmitDeleteLog(): Promise<void> {
    const alert = await this.alertCtrl.create({
      message: 'Are you sure you want to delete this daily log?',
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Confirm Delete',
          handler: data => {
            this.router.navigateByUrl('/home');
            this.logService.deleteLog(this.logId);
            this.deleteLogToast();
          }
        }
      ]
    })
    alert.present();
  }

  async updateLogToast () {
    const toast = await this.toastCtrl.create({
      message: 'Daily Log Updated!',
      duration: 1000,
      position: 'top'
    });
    toast.present();
  }

  async deleteLogToast () {
    const toast = await this.toastCtrl.create({
      message: 'Daily Log Deleted!',
      duration: 1000,
      position: 'top'
    });
    toast.present();
  }

}