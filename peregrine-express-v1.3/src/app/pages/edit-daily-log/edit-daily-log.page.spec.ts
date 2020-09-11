import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditDailyLogPage } from './edit-daily-log.page';

describe('EditDailyLogPage', () => {
  let component: EditDailyLogPage;
  let fixture: ComponentFixture<EditDailyLogPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditDailyLogPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditDailyLogPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
