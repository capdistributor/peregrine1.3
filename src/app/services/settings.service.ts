import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map, startWith, tap } from 'rxjs/operators';
import { Setting, Settings, SETTINGS } from '../pages/settings/_settings.masterlist';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  settings$ = new BehaviorSubject<Settings>(this.settings);
  settingsList$ = new BehaviorSubject<Setting[]>(this.settingsList);

  activeSettings$ = new BehaviorSubject<Settings>({});
  activeSettingsList$: Observable<Setting[]> = this.activeSettings$.pipe(
    filter(settings => !!settings),
    map(settings => this.listifySettings(settings)),
    startWith([])
  );

  constructor(private storage: Storage) {
    this.getSettingsFromStorage().then(settings => {
      const active = this.getActiveSettings(settings);
      this.activeSettings$.next(active);
    });
  }

  get settings() {
    return SETTINGS;
  }

  get settingsList() {
    return this.listifySettings(this.settings);
  }

  getSettingsFromStorage(): Promise<Settings> {
    return new Promise((resolve, reject) => {
      this.storage.get('settings').then(settings => {
        resolve(settings);
      })
      .catch(error => {
        console.log('rejected.', error);
        reject(error);
      });
    });
  }

  saveActiveSettingsToStorage(settings) {
    const active = this.getActiveSettings(settings);
    this.storage.set('settings', active).then(savedSettings => {
      this.activeSettings$.next(savedSettings);
    });
  }

  saveSettingsToStorage(settings): Promise<any> {
    return this.storage.set('settings', settings)
    .then(stuff => {
      console.log('saved:', stuff);
    })
    .catch(error => {
      console.log('storage error:', error);
    });
  }

  clearStorage() {
    this.storage.clear().then(() => {
      console.log('all keys cleared');
    });
  }

  buildInitalSettingsForm(): FormGroup {
    const fields = this.listifySettings(this.settings);
    const formGroup = new FormGroup({});

    fields.forEach(field => {
      const fieldControl = new FormControl(field.active);
      formGroup.addControl(field.id, fieldControl);
    });

    return formGroup;
  }

  private listifySettings(settings: Settings): Setting[]  {
    const keys = Object.keys(settings);
    return keys.map(key => {
      const name = settings[key].name ? settings[key].name : this.settings[key].name;
      const active = settings[key].active ? settings[key].active : !!settings[key];

      return { id: key, name, active };
    });
  }

  private getActiveSettings(settings: Settings): Settings {
    const keys = Object.keys(settings);

    return keys.reduce((obj, key) => {
      if (settings[key]) {
        obj = { ...obj, [key]: settings[key] };
      }
      return obj;
    }, {});
  }
}
