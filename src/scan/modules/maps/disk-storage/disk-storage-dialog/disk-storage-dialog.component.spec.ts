import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiskStorageDialogComponent } from './disk-storage-dialog.component';

describe('DiskStorageDialogComponent', () => {
  let component: DiskStorageDialogComponent;
  let fixture: ComponentFixture<DiskStorageDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiskStorageDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiskStorageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
