import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { LogService } from '../../services/log.service';
import { SettingsService } from 'src/app/services/settings.service';
import { ToastController } from '@ionic/angular';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-create-daily-log',
  templateUrl: './create-daily-log.page.html',
  styleUrls: ['./create-daily-log.page.scss'],
})
export class CreateDailyLogPage implements OnInit {
  public activities;
  logForm: FormGroup;
  isLoaded = false;
  buttonDisabled = false;
  foundActivities: boolean;
  activeActivitiesList$ = this.settingsService.activeSettingsList$;

  constructor(
    private router: Router,
    private logService: LogService,
    private settingsService: SettingsService,
    private toastCtrl: ToastController
  ) {
    this.logForm = this.buildLogForm();
    this.isLoaded = true;
  }

  ngOnInit() {
  }

  createLog() {
    this.buttonDisabled = true;

    this.logService.createLog(this.logForm.value)
      .then(result => {
        if (result) {
          console.log('log created:', result);
          this.router.navigateByUrl('/home').then(() => {
            this.createLogToast();
          });
        }
      });
  }

  handleDateChange(date: string) {
    this.logForm.get('date').setValue(date, {
      onlyself: true
    });
  }

  handleOnFocus(formControlName: string){
    if (this.logForm.get(formControlName).value === 0) {
      this.logForm.get(formControlName).setValue(null);
    }
  }

  handleOnBlur(formControlName: string){
    if (this.logForm.get(formControlName).value === null) {
      this.logForm.get(formControlName).setValue(0);
    }
  }

  async createLogToast() {
    const toast = await this.toastCtrl.create({
      message: 'Daily Log Uploaded!',
      duration: 1000,
      position: 'top'
    });
    toast.present();
  }

  private buildLogForm(): FormGroup {
    const formGroup = new FormGroup({});
    const initialDate = new Date().toISOString();

    this.settingsService.settingsList.forEach(field => {
      const fieldControl = new FormControl(0);
      formGroup.addControl(field.id, fieldControl);
    });

    formGroup.addControl('date', new FormControl(initialDate));
    formGroup.addControl('notes', new FormControl(''));

    return formGroup;
  }
}
