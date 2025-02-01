import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { UserListComponent } from './user-list.component';
import { UserService } from '../../services/user.service';
import { TotalMinutesPipe } from '../../pipes/total-minutes.pipe';
import { BehaviorSubject } from 'rxjs';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let mockUserService: jasmine.SpyObj<UserService>;
  const mockUsers = [
    {
      id: 1,
      name: 'Test User',
      workouts: [{ type: 'Running', minutes: 30 }]
    }
  ];

  beforeEach(async () => {
    mockUserService = jasmine.createSpyObj('UserService', ['getUsers', 'deleteWorkout']);
    mockUserService.getUsers.and.returnValue(new BehaviorSubject(mockUsers));

    await TestBed.configureTestingModule({
      declarations: [ UserListComponent, TotalMinutesPipe ],
      imports: [ FormsModule ],
      providers: [
        { provide: UserService, useValue: mockUserService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on init', () => {
    expect(component.users.length).toBe(1);
    expect(component.users[0].name).toBe('Test User');
  });

  it('should filter users by name', () => {
    component.searchTerm = 'Test';
    component.applyFilters();
    expect(component.filteredUsers.length).toBe(1);

    component.searchTerm = 'Unknown';
    component.applyFilters();
    expect(component.filteredUsers.length).toBe(0);
  });

  it('should emit selected user', () => {
    spyOn(component.userSelected, 'emit');
    component.selectUser(mockUsers[0]);
    expect(component.userSelected.emit).toHaveBeenCalledWith(mockUsers[0]);
  });
});
