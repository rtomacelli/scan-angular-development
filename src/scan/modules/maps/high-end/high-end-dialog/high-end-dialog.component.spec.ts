import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HighEndDialogComponent } from './high-end-dialog.component';

describe('HighEndDialogComponent', () => {
  let component: HighEndDialogComponent;
  let fixture: ComponentFixture<HighEndDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HighEndDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HighEndDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
