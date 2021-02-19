import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ActionSheetController, AlertController, ToastController } from '@ionic/angular';
import { Log, LogService } from '../../services/log.service';
import { combineLatest, Observable } from 'rxjs';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { SettingsService } from 'src/app/services/settings.service';
import { Setting } from '../settings/_settings.masterlist';
import { DateService } from 'src/app/services/date.service';
import { map, startWith, tap } from 'rxjs/operators';

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

  log$: Observable<Log>;
  activitiesList$ = this.settingsService.settingsList$;
  activeSettingsList$ = this.settingsService.activeSettingsList$;
  visibleActivities$: Observable<Partial<Setting>[]>;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public actionCtrl: ActionSheetController,
    public alertCtrl: AlertController,
    public logService: LogService,
    public formBuilder: FormBuilder,
    public toastCtrl: ToastController,
    private settingsService: SettingsService,
    private dateService: DateService
  ) {
    this.logId = this.route.snapshot.paramMap.get('logId');
    this.log$ = this.logService.getLogDetail(this.logId).valueChanges();

    const initialDate = new Date().toISOString();
    this.logForm = this.settingsService.buildInitalSettingsForm();
    this.logForm.addControl('date', new FormControl(initialDate));
    this.logForm.addControl('notes', new FormControl(''));

    this.visibleActivities$ = combineLatest([
      this.log$,
      this.activeSettingsList$
    ]).pipe(
      map(([log, activeSettings]) => this.getVisibleActivities(log, activeSettings)),
      startWith([]),
      tap(() => this.isLoaded = true)
    );
  }

  ngOnInit() {
    this.log$.subscribe(log => {
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

  setFormValues(form: FormGroup, log: Log) {
    Object.keys(log).forEach(key => {
      if (key !== 'id') {
        form.get(key).setValue(log[key]);
      }
    });
  }

  handleDateChange(date: string) {
    this.logForm.get('date').setValue(date, {
      onlyself: true
    });
  }

  formatDate(date: string) {
    return this.dateService.shortFormat(date);
  }

  private getLogActivities(log: Log): Partial<Setting>[] {
    const masterList = this.settingsService.settings;
    const skipKeys = ['date', 'notes', 'id'];
    const logKeys = Object.keys(log).filter(key => !skipKeys.includes(key) && log[key]);

    return logKeys
      .map(key => {
        const { name } = masterList[key];
        return { id: key, name};
      })
      .filter(activity => activity);
  }

  private getVisibleActivities(log: Log, activeSettings: Setting[]): Partial<Setting>[] {
    const logActivities = this.getLogActivities(log);

    return activeSettings.reduce((list, setting) => {
      // if an activeSetting is falsy (zero) in the log, add it to logActivities anyway.
      if (!log[setting.id]) {
        const { id, name } = setting;
        list.push({ id, name });
      }

      return list;
    }, logActivities);
  }
}
