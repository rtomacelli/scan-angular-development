import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiskStorageComponent } from './disk-storage.component';

describe('DiskStorageComponent', () => {
  let component: DiskStorageComponent;
  let fixture: ComponentFixture<DiskStorageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiskStorageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiskStorageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
