import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainframeDialogComponent } from './mainframe-dialog.component';

describe('MainframeDialogComponent', () => {
  let component: MainframeDialogComponent;
  let fixture: ComponentFixture<MainframeDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainframeDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainframeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
