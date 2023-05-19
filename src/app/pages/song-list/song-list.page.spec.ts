import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SongListPage } from './song-list.page';

describe('SongListPage', () => {
  let component: SongListPage;
  let fixture: ComponentFixture<SongListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SongListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SongListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
