import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JourneyDeviation } from './journey-deviation';

describe('JourneyDeviation', () => {
  let component: JourneyDeviation;
  let fixture: ComponentFixture<JourneyDeviation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JourneyDeviation]
    })
      .compileComponents();

    fixture = TestBed.createComponent(JourneyDeviation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
