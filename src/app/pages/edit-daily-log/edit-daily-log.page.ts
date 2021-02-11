import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ActionSheetController, AlertController, ToastController } from '@ionic/angular';
import { LogService } from '../../services/log.service';
import { combineLatest, from, Observable } from 'rxjs';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';

import { SettingsService } from 'src/app/services/settings.service';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-edit-daily-log',
  templateUrl: './edit-daily-log.page.html',
  styleUrls: ['./edit-daily-log.page.scss'],
})
export class EditDailyLogPage implements OnInit {
  private logId: string;
  logForm: FormGroup;
  isLoaded = false;

  log$: Observable<any>;
  activities$: Observable<Settings>;
  activeActivities$: Observable<any>;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public actionCtrl: ActionSheetController,
    public alertCtrl: AlertController,
    public logService: LogService,
    public formBuilder: FormBuilder,
    public toastCtrl: ToastController,
    private settingsService: SettingsService
  ) {
    this.logId = this.route.snapshot.paramMap.get('logId');
    this.log$ = this.logService.getLogDetail(this.logId).valueChanges();
  }

  ngOnInit() {
    this.activities$ = from(this.settingsService.getSettings())
      .pipe(
        tap(() => {
          this.isLoaded = true;
        })
      );

    combineLatest([
      this.activities$,
      this.log$
    ]).subscribe(([activities, log]) => {
      this.logForm = this.buildForm(log, activities);
      if (log.date) {
        this.handleDateChange(log.date);
      }
    });

    this.activeActivities$ = this.activities$
      .pipe(
        map(activities => {
          const keys = Object.keys(activities);
          return keys.map(key => ({
            id: key,
            name: activities[key].name,
            active: activities[key].active
          }))
          .filter(activity => activity.active);
        })
      );
  }

  onSubmitUpdateLog() {
    this.logService.updateLog(this.logId, this.logForm.value)
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
    });
    alert.present();
  }

  async updateLogToast() {
    const toast = await this.toastCtrl.create({
      message: 'Daily Log Updated!',
      duration: 1000,
      position: 'top'
    });
    toast.present();
  }

  async deleteLogToast() {
    const toast = await this.toastCtrl.create({
      message: 'Daily Log Deleted!',
      duration: 1000,
      position: 'top'
    });
    toast.present();
  }

  // use activities[key] to create a formControl and set value from log[key]
  buildForm(log: Log, activities: Settings) {
    const today = new Date().toISOString();
    const formGroup = this.formBuilder.group({
      date: new FormControl(today)
    });
    const keys = Object.keys(activities);

    keys.forEach(key => {
      formGroup.addControl(key, new FormControl(log[key]));
    });

    return formGroup;
  }

  handleDateChange(date: string) {
    this.logForm.get('date').setValue(date, {
      onlyself: true
    });
  }

  formatDate(dateString) {
    return new Date(dateString).toISOString().substring(0, 10);
  }

}


export interface Settings {
  [key: string]: {
    active: boolean,
    name: string
  }
}
export interface Log {
  [key: string]: string | number;
}