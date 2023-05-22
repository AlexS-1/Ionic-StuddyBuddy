import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyCoursesPage } from './my-courses.page';

describe('MyCoursesPage', () => {
  let component: MyCoursesPage;
  let fixture: ComponentFixture<MyCoursesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MyCoursesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
