import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { of, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { Setting, Settings, SETTINGS } from '../pages/settings/_settings.masterlist';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  settings$ = of(SETTINGS);
  settingsList$ = this.settings$.pipe(
    map(settings => this.listifySettings(settings))
  );
  activeSettings$ = from(this.getSettingsFromStorage()).pipe(
    map((settings) => this.getActiveSettings(settings))
  );
  activeSettingsList$ = this.activeSettings$.pipe(
    map(settings => this.listifySettings(settings))
  );

  constructor(
    private storage: Storage
  ) {}

  get settings() {
    return SETTINGS;
  }

  getSettingsFromStorage(): Promise<Settings> {
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

  saveSettingsToStorage(settings): Promise<any> {
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

  private listifySettings(settings: Settings): Setting[]  {
    const keys = Object.keys(settings);
    return keys.map(key => ({
      id: key,
      name: settings[key].name,
      active: settings[key].active
    }));
  }

  private getActiveSettings(settings: Settings): Settings {
    const keys = Object.keys(settings);
    return keys.reduce((obj, key) => {
      if (settings[key].active) {
        return {
          ...obj,
          [key]: settings[key]
        };
      }
    }, {});
  }
}
