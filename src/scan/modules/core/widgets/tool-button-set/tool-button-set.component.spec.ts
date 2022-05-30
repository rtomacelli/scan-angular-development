import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolButtonSetComponent } from './tool-button-set.component';

describe('ToolButtonSetComponent', () => {
  let component: ToolButtonSetComponent;
  let fixture: ComponentFixture<ToolButtonSetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToolButtonSetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolButtonSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
