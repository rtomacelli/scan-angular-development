import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PathInlineComponent } from './path-inline.component';

describe('PathInlineComponent', () => {
  let component: PathInlineComponent;
  let fixture: ComponentFixture<PathInlineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PathInlineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PathInlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
