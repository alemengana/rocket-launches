import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Launch } from '../shared/models/launch';
import { SharedService } from '../shared/services/shared.service';

@Component({
  selector: 'app-launches',
  templateUrl: './launches.component.html',
  styleUrls: ['./launches.component.scss'],
})
export class LaunchesComponent implements OnInit, OnDestroy {
  launches: Launch[] = [];
  filteredLaunches: Launch[] = [];
  isLoading: boolean = false;

  _unsubscribeAll: Subject<any>;

  constructor(
    private sharedService: SharedService,
    private router: Router,
    private titleService: Title
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.titleService.setTitle('Launches');
    this.loadLaunches();
  }

  loadLaunches(): void {
    this.isLoading = true;
    this.sharedService
      .getLaunches()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data) => {
        this.launches = data;
        this.filteredLaunches = data;
        this.isLoading = false;
      });
  }

  goToLaunchDetails(id: number): void {
    this.router.navigate(['/launch', id]);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filteredLaunches = this.launches.filter(
      (l) =>
        l.flight_number.toString().includes(filterValue.trim()) ||
        l.mission_name.trim().toLowerCase().includes(filterValue.trim().toLocaleLowerCase())
    );
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next({});
    this._unsubscribeAll.complete();
  }
}
