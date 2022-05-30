import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TapeLibraryComponent } from './tape-library.component';

describe('TapeLibraryComponent', () => {
  let component: TapeLibraryComponent;
  let fixture: ComponentFixture<TapeLibraryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TapeLibraryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TapeLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
