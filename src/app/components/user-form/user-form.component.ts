import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html'
})
export class UserFormComponent {
  userForm: FormGroup;
  workoutTypes = ['Running', 'Cycling', 'Swimming', 'Yoga'];
  
  constructor(private fb: FormBuilder, private userService: UserService) {
    this.userForm = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.maxLength(30),
        Validators.pattern('^[A-Za-z\\s]+$')
      ]],
      workouts: this.fb.array([])
    });
    this.addWorkout();
  }

  get nameControl() {
    return this.userForm.get('name');
  }

  get nameErrorMessage(): string {
    if (this.nameControl?.errors) {
      if (this.nameControl.errors['required']) {
        return 'Name is required';
      }
      if (this.nameControl.errors['maxlength']) {
        return 'Name cannot exceed 30 characters';
      }
      if (this.nameControl.errors['pattern']) {
        return 'Name can only contain letters and spaces';
      }
    }
    return '';
  }

  get workouts() {
    return this.userForm.get('workouts') as FormArray;
  }

  addWorkout() {
    const workout = this.fb.group({
      type: ['', Validators.required],
      minutes: ['', [Validators.required, Validators.min(1)]]
    });
    this.workouts.push(workout);
  }

  removeWorkout(index: number) {
    this.workouts.removeAt(index);
  }

  onSubmit(): void {
    if (this.userForm.valid && this.workouts.length > 0) {
      const { name, workouts } = this.userForm.value;
      this.userService.addUserWithWorkouts(name, workouts);
      this.userForm.reset();
      this.workouts.clear();
      this.addWorkout(); // Add initial workout for next entry
    }
  }
}
