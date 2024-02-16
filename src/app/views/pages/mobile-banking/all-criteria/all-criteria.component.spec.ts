import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllCriteriaComponent } from './all-criteria.component';

describe('AllCriteriaComponent', () => {
  let component: AllCriteriaComponent;
  let fixture: ComponentFixture<AllCriteriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllCriteriaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllCriteriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
