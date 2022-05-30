import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HighEndComponent } from './high-end.component';

describe('HighEndComponent', () => {
  let component: HighEndComponent;
  let fixture: ComponentFixture<HighEndComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HighEndComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HighEndComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
