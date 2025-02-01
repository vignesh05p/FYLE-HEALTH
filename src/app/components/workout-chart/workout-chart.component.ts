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

  private colorMap = {
    'Running': { bg: 'rgba(99, 102, 241, 0.5)', border: 'rgb(99, 102, 241)', hover: 'rgba(99, 102, 241, 0.7)' },
    'Cycling': { bg: 'rgba(16, 185, 129, 0.5)', border: 'rgb(16, 185, 129)', hover: 'rgba(16, 185, 129, 0.7)' },
    'Swimming': { bg: 'rgba(59, 130, 246, 0.5)', border: 'rgb(59, 130, 246)', hover: 'rgba(59, 130, 246, 0.7)' },
    'Yoga': { bg: 'rgba(236, 72, 153, 0.5)', border: 'rgb(236, 72, 153)', hover: 'rgba(236, 72, 153, 0.7)' }
  };

  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{
      data: [],
      label: 'Minutes',
      backgroundColor: [],
      borderColor: [],
      borderWidth: 2,
      borderRadius: 8,
      hoverBackgroundColor: []
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
            family: "'Inter', sans-serif",
            size: 10
          },
          maxRotation: 45,
          minRotation: 45
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
      // Sort workouts by timestamp
      const sortedWorkouts = [...this.user.workouts].sort((a, b) => 
        new Date(a.timestamp!).getTime() - new Date(b.timestamp!).getTime()
      );

      // Update chart data
      this.barChartData.labels = sortedWorkouts.map(w => 
        `${w.type} (${new Date(w.timestamp!).toLocaleDateString()})`
      );
      
      this.barChartData.datasets[0].data = sortedWorkouts.map(w => w.minutes);
      
      // Set colors based on workout type
      this.barChartData.datasets[0].backgroundColor = sortedWorkouts.map(w => 
        this.colorMap[w.type as keyof typeof this.colorMap].bg
      );
      this.barChartData.datasets[0].borderColor = sortedWorkouts.map(w => 
        this.colorMap[w.type as keyof typeof this.colorMap].border
      );
      this.barChartData.datasets[0].hoverBackgroundColor = sortedWorkouts.map(w => 
        this.colorMap[w.type as keyof typeof this.colorMap].hover
      );

      if (this.barChartOptions?.plugins?.title) {
        this.barChartOptions.plugins.title.text = `Workout Sessions for ${this.user.name}`;
      }

      this.chart?.update();
    }
  }
}
