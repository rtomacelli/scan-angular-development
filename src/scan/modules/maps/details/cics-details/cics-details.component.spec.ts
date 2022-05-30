import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CicsDetailsComponent } from './cics-details.component';

describe('CicsDetailsComponent', () => {
  let component: CicsDetailsComponent;
  let fixture: ComponentFixture<CicsDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CicsDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CicsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
