import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverlayMetadataComponent } from './overlay-metadata.component';

describe('OverlayMetadataComponent', () => {
  let component: OverlayMetadataComponent;
  let fixture: ComponentFixture<OverlayMetadataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverlayMetadataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverlayMetadataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
