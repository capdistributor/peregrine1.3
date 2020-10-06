import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(
    private storage: Storage
  ) {
  }

  getSettings(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.storage.get('settings').then(settings => {
        resolve(settings);
      })
      .catch(error => {
        console.log('rejected.', error);
        reject(error);
      })
    })
  }

  setSettings(settings): Promise<any> {
    return this.storage.set('settings', settings)
    .catch(error => {
      console.log('error:', error);
    });
  }

  public clearStorage() {
    this.storage.clear().then(() => {
      console.log('all keys cleared');
    });
  }
}