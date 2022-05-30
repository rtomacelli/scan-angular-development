import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PathOverlayComponent } from './path-overlay.component';

describe('PathOverlayComponent', () => {
  let component: PathOverlayComponent;
  let fixture: ComponentFixture<PathOverlayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PathOverlayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PathOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
