import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CreateMemoPage } from './create-memo.page';

describe('CreateMemoPage', () => {
  let component: CreateMemoPage;
  let fixture: ComponentFixture<CreateMemoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateMemoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateMemoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
