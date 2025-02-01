import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { UserService } from './user.service';
import { take } from 'rxjs/operators';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserService);
    service.setTestEnvironment(true);
  });

  afterEach(() => {
    service.clearData();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a new user with workout', fakeAsync(() => {
    service.addUser('Test User', { type: 'Running', minutes: 30 });
    
    service.getUsers().pipe(take(1)).subscribe(users => {
      expect(users.length).toBe(1);
      expect(users[0].name).toBe('Test User');
      expect(users[0].workouts[0].minutes).toBe(30);
    });
    tick();
  }));

  it('should delete a workout', fakeAsync(() => {
    service.addUser('Test User', { type: 'Running', minutes: 30 });
    let userId: number;
    
    service.getUsers().pipe(take(1)).subscribe(users => {
      userId = users[0].id;
      service.deleteWorkout(userId, 0);
    });
    tick();

    service.getUsers().pipe(take(1)).subscribe(users => {
      expect(users.length).toBe(0);
    });
    tick();
  }));

  it('should save to localStorage', fakeAsync(() => {
    service.addUser('Test User', { type: 'Running', minutes: 30 });
    tick();
    
    const stored = localStorage.getItem('userData');
    expect(stored).toBeTruthy();
    const data = JSON.parse(stored!);
    expect(data[0].name).toBe('Test User');
  }));
});
