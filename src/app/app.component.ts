import { Component } from '@angular/core';
import { User } from './interfaces/user.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'health-pro';
  selectedUser: User | null = null;

  onUserSelected(user: User | null): void {
    this.selectedUser = user;
  }
}