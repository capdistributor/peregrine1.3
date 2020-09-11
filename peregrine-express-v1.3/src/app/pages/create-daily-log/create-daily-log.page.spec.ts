import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CreateDailyLogPage } from './create-daily-log.page';

describe('CreateDailyLogPage', () => {
  let component: CreateDailyLogPage;
  let fixture: ComponentFixture<CreateDailyLogPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateDailyLogPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateDailyLogPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
