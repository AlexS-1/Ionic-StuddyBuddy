import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeveloperPage } from './developer.page';

describe('DeveloperPage', () => {
  let component: DeveloperPage;
  let fixture: ComponentFixture<DeveloperPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DeveloperPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
