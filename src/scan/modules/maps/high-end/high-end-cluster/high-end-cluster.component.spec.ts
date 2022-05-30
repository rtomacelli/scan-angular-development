import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HighEndClusterComponent } from './high-end-cluster.component';

describe('HighEndClusterComponent', () => {
  let component: HighEndClusterComponent;
  let fixture: ComponentFixture<HighEndClusterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HighEndClusterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HighEndClusterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
