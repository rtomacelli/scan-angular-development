import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TapeLibraryDialogComponent } from './tape-library-dialog.component';

describe('TapeLibraryDialogComponent', () => {
  let component: TapeLibraryDialogComponent;
  let fixture: ComponentFixture<TapeLibraryDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TapeLibraryDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TapeLibraryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
