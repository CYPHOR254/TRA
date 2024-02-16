import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllStandardsComponent } from './all-standards.component';

describe('AllStandardsComponent', () => {
  let component: AllStandardsComponent;
  let fixture: ComponentFixture<AllStandardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllStandardsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllStandardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
