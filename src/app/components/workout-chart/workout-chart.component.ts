import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { User } from '../../interfaces/user.interface';

@Component({
  selector: 'app-workout-chart',
  templateUrl: './workout-chart.component.html'
})
export class WorkoutChartComponent implements OnChanges {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  @Input() user: User | null = null;

  public barChartData: ChartData<'bar'> = {
    labels: ['Running', 'Cycling', 'Swimming', 'Yoga'],
    datasets: [{
      data: [0, 0, 0, 0],
      label: 'Minutes',
      backgroundColor: [
        'rgba(99, 102, 241, 0.5)',
        'rgba(16, 185, 129, 0.5)',
        'rgba(59, 130, 246, 0.5)',
        'rgba(236, 72, 153, 0.5)'
      ],
      borderColor: [
        'rgb(99, 102, 241)',
        'rgb(16, 185, 129)',
        'rgb(59, 130, 246)',
        'rgb(236, 72, 153)'
      ],
      borderWidth: 2,
      borderRadius: 8,
      hoverBackgroundColor: [
        'rgba(99, 102, 241, 0.7)',
        'rgba(16, 185, 129, 0.7)',
        'rgba(59, 130, 246, 0.7)',
        'rgba(236, 72, 153, 0.7)'
      ]
    }]
  };

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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user'] && this.user) {
      const workoutTotals = new Map<string, number>();
      
      this.user.workouts.forEach(workout => {
        const current = workoutTotals.get(workout.type) || 0;
        workoutTotals.set(workout.type, current + workout.minutes);
      });

      this.barChartData.datasets[0].data = this.barChartData.labels!.map(
        label => workoutTotals.get(label as string) || 0
      );

      if (this.barChartOptions?.plugins?.title) {
        this.barChartOptions.plugins.title.text = `Workout Minutes for ${this.user.name}`;
      }

      this.chart?.update();
    }
  }
}
