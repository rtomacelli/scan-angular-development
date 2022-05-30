import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdabasDetailsComponent } from './adabas-details.component';

describe('AdabasDetailsComponent', () => {
  let component: AdabasDetailsComponent;
  let fixture: ComponentFixture<AdabasDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdabasDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdabasDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
