import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MemoService } from 'src/app/services/memo.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { NativeAudio } from '@ionic-native/native-audio/ngx';

@Component({
  selector: 'app-create-memo',
  templateUrl: './create-memo.page.html',
  styleUrls: ['./create-memo.page.scss'],
})
export class CreateMemoPage implements OnInit {
  public createMemoForm: FormGroup;
  today = new Date();
  todayTimeZoneDate: String = new Date(this.today.getTime() - this.today.getTimezoneOffset()*60000).toISOString();
  buttonDisabled = false;

  constructor(
    private formBuilder: FormBuilder,
    private memoService: MemoService,
    private toastCtrl: ToastController,
    private router: Router,
    private nativeAudio: NativeAudio
  ) {
    this.createMemoForm = this.formBuilder.group({
      // date: [new Date().toISOString()],
      date: [this.todayTimeZoneDate],
      id: [''],
      subject: [''],
      mainText: [''],
    });
  }

  ngOnInit() {
  }

  onSubmitCreateMemo(createMemoForm) {
    this.buttonDisabled = true;
    this.nativeAudio.play('falcon');
    this.router.navigateByUrl('/home')
      .then(
        () => {
        this.memoService
            .createMemo(
              new Date(createMemoForm.value.date),
              createMemoForm.value.subject,
              createMemoForm.value.mainText
            );
          this.createMemoToast();
        },
        error => {
          console.log(error);
        }
      );
  }

  async createMemoToast () {
    const toast = await this.toastCtrl.create({
      message: 'Memo Blasted!',
      duration: 1000,
      position: 'top'
    });
    toast.present();
  }

}