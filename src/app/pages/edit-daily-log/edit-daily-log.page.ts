import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ActionSheetController, AlertController, ToastController } from '@ionic/angular';
import { LogService } from '../../services/log.service';
import { Observable } from 'rxjs';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';

import { SettingsService } from 'src/app/services/settings.service';
import { Setting } from '../settings/_settings.masterlist';

@Component({
  selector: 'app-edit-daily-log',
  templateUrl: './edit-daily-log.page.html',
  styleUrls: ['./edit-daily-log.page.scss'],
})
export class EditDailyLogPage implements OnInit {
  private logId: string;
  logForm: FormGroup;
  isLoaded = true;
  hasActiveSettings = true;

  log$: Observable<any>;
  activitiesList$ = this.settingsService.settingsList$;
  activeActivitiesList$ = this.settingsService.activeSettingsList$;

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

    const initialDate = new Date().toISOString();
    this.logForm = this.settingsService.buildInitalSettingsForm();
    this.logForm.addControl('date', new FormControl(initialDate));
    this.logForm.addControl('notes', new FormControl(''));
  }

  ngOnInit() {
    this.log$.subscribe((log) => {
      this.setFormValues(this.logForm, log);
      this.isLoaded = true;
    });
  }

  onSubmitUpdateLog() {
    this.logService.updateLog(this.logId, this.logForm.value)
    .then(() => {
        this.router.navigateByUrl('/home');
        this.updateLogToast();
      },
      error => {
        console.log(error);
      });
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

  setupForm(form: FormGroup, activities: Setting[]) {
    const initialDate = new Date().toISOString();
    form.addControl('date', new FormControl(initialDate));

    activities.forEach(activity => {
      form.addControl(activity.id, new FormControl(''));
    });
  }

  setFormValues(form: FormGroup, log: Log) {
    Object.keys(log).forEach(key => {
      form.get(key).setValue(log[key]);
    });
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

export interface Log {
  [key: string]: string | number;
}