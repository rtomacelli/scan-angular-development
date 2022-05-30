import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfrastructureLayerComponent } from './infrastructure-layer.component';

describe('InfrastructureLayerComponent', () => {
  let component: InfrastructureLayerComponent;
  let fixture: ComponentFixture<InfrastructureLayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfrastructureLayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfrastructureLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
