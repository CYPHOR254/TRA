import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStandComponent } from './view-stand.component';

describe('ViewStandComponent', () => {
  let component: ViewStandComponent;
  let fixture: ComponentFixture<ViewStandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewStandComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewStandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
