import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MyAreaPage } from './my-area.page';

describe('MyAreaPage', () => {
  let component: MyAreaPage;
  let fixture: ComponentFixture<MyAreaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyAreaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MyAreaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
