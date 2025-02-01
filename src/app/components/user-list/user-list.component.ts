import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user.interface';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html'
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm = '';
  selectedWorkoutType = '';
  currentPage = 1;
  pageSize = 5;
  workoutTypes = ['Running', 'Cycling', 'Swimming', 'Yoga'];  // Add this line
  @Output() userSelected = new EventEmitter<User | null>();
  selectedUserId: number | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
      this.applyFilters();
    });
  }

  applyFilters(): void {
    this.filteredUsers = this.users
      .filter(user => 
        user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
        (this.selectedWorkoutType === '' || 
         user.workouts.some(w => w.type === this.selectedWorkoutType))
      );
  }

  selectUser(user: User): void {
    this.selectedUserId = user.id;
    this.userSelected.emit(user);
  }

  get paginatedUsers(): User[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredUsers.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredUsers.length / this.pageSize);
  }

  deleteWorkout(event: Event, userId: number, workoutIndex: number): void {
    event.stopPropagation(); // Prevent row selection when clicking delete
    if (confirm('Are you sure you want to delete this workout?')) {
      this.userService.deleteWorkout(userId, workoutIndex);
      // If currently selected user is deleted, clear selection
      if (this.selectedUserId === userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user || user.workouts.length === 0) {
          this.selectedUserId = null;
          this.userSelected.emit(null);
        } else {
          this.userSelected.emit(user);
        }
      }
    }
  }
}
