import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { UserFormComponent } from './user-form.component';
import { UserService } from '../../services/user.service';

describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;
  let mockUserService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    mockUserService = jasmine.createSpyObj('UserService', ['addUserWithWorkouts']);

    await TestBed.configureTestingModule({
      declarations: [ UserFormComponent ],
      imports: [ ReactiveFormsModule ],
      providers: [
        { provide: UserService, useValue: mockUserService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with one workout', () => {
    expect(component.workouts.length).toBe(1);
  });

  it('should add workout', () => {
    component.addWorkout();
    expect(component.workouts.length).toBe(2);
  });

  it('should remove workout', () => {
    component.addWorkout();
    component.removeWorkout(0);
    expect(component.workouts.length).toBe(1);
  });

  it('should submit valid form', () => {
    const formData = {
      name: 'Test User',
      workouts: [{
        type: 'Running',
        minutes: 30
      }]
    };

    component.userForm.setValue(formData);
    component.onSubmit();

    expect(mockUserService.addUserWithWorkouts).toHaveBeenCalledWith(
      formData.name,
      formData.workouts
    );
  });
});
