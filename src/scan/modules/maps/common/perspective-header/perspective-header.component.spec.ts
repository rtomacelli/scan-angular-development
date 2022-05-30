import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerspectiveHeaderComponent } from './perspective-header.component';

describe('PerspectiveHeaderComponent', () => {
  let component: PerspectiveHeaderComponent;
  let fixture: ComponentFixture<PerspectiveHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerspectiveHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerspectiveHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
