import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JourneyInfoHeader } from './journey-info-header';

describe('JourneyInfoHeader', () => {
  let component: JourneyInfoHeader;
  let fixture: ComponentFixture<JourneyInfoHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JourneyInfoHeader]
    })
      .compileComponents();

    fixture = TestBed.createComponent(JourneyInfoHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
