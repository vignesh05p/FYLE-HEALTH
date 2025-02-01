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
        { type: 'Running', minutes: 30 },
        { type: 'Swimming', minutes: 45 }
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

    expect(component.barChartData.datasets[0].data).toEqual([30, 0, 45, 0]);
  });
});
