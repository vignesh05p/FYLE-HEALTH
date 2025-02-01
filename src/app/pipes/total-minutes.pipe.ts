import { Pipe, PipeTransform } from '@angular/core';
import { Workout } from '../interfaces/user.interface';

@Pipe({
  name: 'totalMinutes'
})
export class TotalMinutesPipe implements PipeTransform {
  transform(workouts: Workout[]): number {
    return workouts.reduce((total, workout) => total + workout.minutes, 0);
  }
}
