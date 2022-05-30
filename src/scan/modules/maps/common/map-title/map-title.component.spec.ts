import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapTitleComponent } from './map-title.component';

describe('MapTitleComponent', () => {
  let component: MapTitleComponent;
  let fixture: ComponentFixture<MapTitleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapTitleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
