import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { User } from '../../interfaces/user.interface';

// Workout statistics chart component
@Component({
  selector: 'app-workout-chart',
  templateUrl: './workout-chart.component.html'
})
export class WorkoutChartComponent implements OnChanges {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  @Input() user: User | null = null;

  // Chart configuration
  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{
      data: [],
      label: 'Minutes',
      backgroundColor: [
        'rgba(0, 200, 83, 0.5)',    // Health
        'rgba(255, 87, 51, 0.5)',    // Energy
        'rgba(66, 133, 244, 0.5)',   // Endurance
        'rgba(241, 90, 141, 0.5)',   // Cardio
        'rgba(255, 167, 38, 0.5)',   // Strength
        'rgba(156, 39, 176, 0.5)'    // Flexibility
      ],
      borderColor: [
        'rgb(0, 200, 83)',
        'rgb(255, 87, 51)',
        'rgb(66, 133, 244)',
        'rgb(241, 90, 141)',
        'rgb(255, 167, 38)',
        'rgb(156, 39, 176)'
      ],
      borderWidth: 2,
      borderRadius: 8,
      hoverBackgroundColor: [
        'rgba(0, 200, 83, 0.7)',
        'rgba(255, 87, 51, 0.7)',
        'rgba(66, 133, 244, 0.7)',
        'rgba(241, 90, 141, 0.7)',
        'rgba(255, 167, 38, 0.7)',
        'rgba(156, 39, 176, 0.7)'
      ]
    }]
  };

  // Chart styling options
  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          font: {
            family: "'Inter', sans-serif",
            size: 12
          },
          padding: 20
        }
      },
      title: {
        display: true,
        text: 'Select a user to view statistics',
        font: {
          family: "'Inter', sans-serif",
          size: 16,
          weight: 'bold'
        },
        padding: {
          top: 10,
          bottom: 30
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          color: 'rgba(0,0,0,0.05)'
        },
        ticks: {
          font: {
            family: "'Inter', sans-serif"
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            family: "'Inter', sans-serif"
          }
        }
      }
    },
    hover: {
      mode: 'index',
      intersect: false
    }
  };

  // Update chart when user changes
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user']) {
      this.updateChartData();
    }
  }

  private readonly workoutTypes = ['Health', 'Energy', 'Endurance', 'Cardio', 'Strength', 'Flexibility'];

  private updateChartData(): void {
    if (this.user && this.user.workouts) {
      // Create a map to store totals for each workout type
      const workoutTotals = new Map<string, number>();
      
      // Initialize all workout types with 0
      this.workoutTypes.forEach(type => workoutTotals.set(type, 0));
      
      // Sum up minutes for each workout type
      this.user.workouts.forEach(workout => {
        if (workoutTotals.has(workout.type)) {
          workoutTotals.set(
            workout.type, 
            (workoutTotals.get(workout.type) || 0) + workout.minutes
          );
        }
      });

      // Update chart data
      this.barChartData.labels = this.workoutTypes;
      this.barChartData.datasets[0].data = this.workoutTypes.map(type => 
        workoutTotals.get(type) || 0
      );

      if (this.barChartOptions?.plugins?.title) {
        this.barChartOptions.plugins.title.text = `Workout Minutes for ${this.user.name}`;
      }
    } else {
      // Reset chart when user is null
      this.barChartData.labels = [];
      this.barChartData.datasets[0].data = [];

      if (this.barChartOptions?.plugins?.title) {
        this.barChartOptions.plugins.title.text = 'Select a user to view statistics';
      }
    }

    this.chart?.update();
  }
}
