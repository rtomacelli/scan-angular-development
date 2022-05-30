import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TapeLibraryBarGraphComponent } from './tape-library-bar-graph.component';

describe('TapeLibraryBarGraphComponent', () => {
  let component: TapeLibraryBarGraphComponent;
  let fixture: ComponentFixture<TapeLibraryBarGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TapeLibraryBarGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TapeLibraryBarGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
