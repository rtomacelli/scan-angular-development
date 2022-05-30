import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Db2DetailsComponent } from './db2-details.component';

describe('Db2DetailsComponent', () => {
  let component: Db2DetailsComponent;
  let fixture: ComponentFixture<Db2DetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Db2DetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Db2DetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
