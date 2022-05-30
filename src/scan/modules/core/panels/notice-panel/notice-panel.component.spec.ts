import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticePanelComponent } from './notice-panel.component';

describe('NoticePanelComponent', () => {
  let component: NoticePanelComponent;
  let fixture: ComponentFixture<NoticePanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoticePanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
