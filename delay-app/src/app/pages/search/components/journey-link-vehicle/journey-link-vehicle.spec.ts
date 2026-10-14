import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JourneyLinkVehicle } from './journey-link-vehicle';

describe('JourneyLinkVehicle', () => {
  let component: JourneyLinkVehicle;
  let fixture: ComponentFixture<JourneyLinkVehicle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JourneyLinkVehicle]
    })
      .compileComponents();

    fixture = TestBed.createComponent(JourneyLinkVehicle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
