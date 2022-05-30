import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessLayerComponent } from './business-layer.component';

describe('PortfolioLayerComponent', () => {
  let component: BusinessLayerComponent;
  let fixture: ComponentFixture<BusinessLayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessLayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
