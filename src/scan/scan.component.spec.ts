import { TestBed, async } from '@angular/core/testing';
import { ScanComponent } from './scan.component';
describe('ScanComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ScanComponent
      ],
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(ScanComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  it(`should have as title 'scan'`, async(() => {
    const fixture = TestBed.createComponent(ScanComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('Scan');
  }));
  it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(ScanComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to scan!');
  }));
});
