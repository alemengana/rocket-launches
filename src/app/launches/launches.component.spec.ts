import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AppModule } from '../app.module';
import { Launch } from '../shared/models/launch';
import { SharedService } from '../shared/services/shared.service';

import { LaunchesComponent } from './launches.component';

describe('LaunchesComponent', () => {
  let component: LaunchesComponent;
  let fixture: ComponentFixture<LaunchesComponent>;
  let sharedService: SharedService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LaunchesComponent],
      imports: [AppModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LaunchesComponent);
    component = fixture.componentInstance;
    sharedService = TestBed.inject(SharedService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load launches', () => {
    component.isLoading = false;
    component.launches = [];
    component.filteredLaunches = [];
    const launch = {
      flight_number: 1,
      details: 'Detail',
      launch_date_unix: 1143239400,
      mission_name: 'Mission 1',
      rocket: {
        active: true,
        company: 'SpaceX',
        cost_per_launch: 10,
        rocket_id: 'falcon1',
        rocket_name: 'Falcon 1',
      },
    } as Launch;

    const spyGetLaunches = spyOn(sharedService, 'getLaunches').and.returnValue(
      of([launch])
    );

    component.loadLaunches();

    expect(spyGetLaunches).toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
    expect(component.launches).toEqual(component.filteredLaunches);
  });
});
