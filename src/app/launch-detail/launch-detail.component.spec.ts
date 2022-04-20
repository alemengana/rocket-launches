import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AppModule } from '../app.module';
import { Launch } from '../shared/models/launch';
import { SharedService } from '../shared/services/shared.service';

import { LaunchDetailComponent } from './launch-detail.component';

describe('LaunchDetailComponent', () => {
  let component: LaunchDetailComponent;
  let fixture: ComponentFixture<LaunchDetailComponent>;
  let sharedService: SharedService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LaunchDetailComponent],
      imports: [AppModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LaunchDetailComponent);
    component = fixture.componentInstance;
    sharedService = TestBed.inject(SharedService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load launch detail', () => {
    component.isLoading = false;
    component.launchDetail = {} as Launch;
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

    const spyGetLaunchDetail = spyOn(
      sharedService,
      'getLaunchDetail'
    ).and.returnValue(of(launch));

    const spyIsFavorite = spyOn(sharedService, 'isFavorite');

    component.ngOnInit();

    expect(spyGetLaunchDetail).toHaveBeenCalled();
    expect(spyIsFavorite).toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
    expect(component.launchDetail).toEqual(launch);
  });

  it('should add favorite', () => {
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

    component.isFavorite = false;
    const spyIsFavorite = spyOn(sharedService, 'isFavorite').and.callThrough();
    const spyAddFavorite = spyOn(sharedService, 'addFavorite').and.callThrough();

    component.addFavorite(launch);

    expect(spyIsFavorite).toHaveBeenCalled();
    expect(spyAddFavorite).toHaveBeenCalledWith(launch);
    expect(component.isFavorite).toBeTrue();
  });
});
