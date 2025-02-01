import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkoutChartComponent } from './workout-chart.component';
import { NgChartsModule } from 'ng2-charts';

describe('WorkoutChartComponent', () => {
  let component: WorkoutChartComponent;
  let fixture: ComponentFixture<WorkoutChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkoutChartComponent ],
      imports: [ NgChartsModule ]
    }).compileComponents();

    fixture = TestBed.createComponent(WorkoutChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update chart data when user changes', () => {
    const mockUser = {
      id: 1,
      name: 'Test User',
      workouts: [
        { type: 'Health', minutes: 30 },
        { type: 'Cardio', minutes: 45 }
      ]
    };

    component.user = mockUser;
    component.ngOnChanges({
      user: {
        currentValue: mockUser,
        previousValue: null,
        firstChange: true,
        isFirstChange: () => true
      }
    });

    // The expected data array should match the order of workout types in the component
    const expectedData = [30, 0, 0, 45, 0, 0]; // [Health, Energy, Endurance, Cardio, Strength, Flexibility]
    expect(component.barChartData.datasets[0].data).toEqual(expectedData);
  });
});
