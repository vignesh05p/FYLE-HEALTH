import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, Workout } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: User[] = [];
  private usersSubject = new BehaviorSubject<User[]>([]);
  private isTestEnvironment = false;

  constructor() {
    if (!this.isTestEnvironment) {
      this.initializeData();
    }
  }

  // Add method to set test environment
  setTestEnvironment(isTest: boolean): void {
    this.isTestEnvironment = isTest;
    if (isTest) {
      this.clearData();
    }
  }

  private initializeData(): void {
    const storedData = localStorage.getItem('userData');
    if (storedData) {
      this.users = JSON.parse(storedData);
    }
    this.usersSubject.next(this.users);
  }

  clearData(): void {
    this.users = [];
    localStorage.clear();
    this.usersSubject.next([]);
  }

  getUsers(): Observable<User[]> {
    return this.usersSubject.asObservable();
  }

  addUser(name: string, workout: Workout): void {
    const newUser: User = {
      id: this.users.length + 1,
      name,
      workouts: [workout]
    };
    this.users.push(newUser);
    this.saveToLocalStorage();
    this.usersSubject.next(this.users);
  }

  addUserWithWorkouts(name: string, workouts: { type: string, minutes: number }[]): void {
    const newUser: User = {
      id: this.users.length + 1,
      name,
      workouts
    };
    this.users.push(newUser);
    this.saveToLocalStorage();
    this.usersSubject.next([...this.users]);
  }

  deleteUser(userId: number): void {
    this.users = this.users.filter(user => user.id !== userId);
    this.saveToLocalStorage();
    this.usersSubject.next(this.users);
  }

  deleteWorkout(userId: number, workoutIndex: number): void {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.workouts.splice(workoutIndex, 1);
      // If no workouts left, delete the user
      if (user.workouts.length === 0) {
        this.deleteUser(userId);
      } else {
        this.saveToLocalStorage();
        this.usersSubject.next([...this.users]);
      }
    }
  }

  private saveToLocalStorage(): void {
    localStorage.setItem('userData', JSON.stringify(this.users));
  }
}
