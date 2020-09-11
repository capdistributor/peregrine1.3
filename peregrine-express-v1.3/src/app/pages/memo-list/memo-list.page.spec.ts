import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MemoListPage } from './memo-list.page';

describe('MemoListPage', () => {
  let component: MemoListPage;
  let fixture: ComponentFixture<MemoListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemoListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MemoListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
