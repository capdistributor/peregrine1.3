import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MemoSinglePage } from './memo-single.page';

describe('MemoSinglePage', () => {
  let component: MemoSinglePage;
  let fixture: ComponentFixture<MemoSinglePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemoSinglePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MemoSinglePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
