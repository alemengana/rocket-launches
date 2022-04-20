import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Launch } from '../shared/models/launch';
import { SharedService } from '../shared/services/shared.service';

@Component({
  selector: 'app-launch-detail',
  templateUrl: './launch-detail.component.html',
  styleUrls: ['./launch-detail.component.scss'],
})
export class LaunchDetailComponent implements OnInit {
  id = this.actRoute.snapshot.params['id'];
  launchDetail: Launch = {} as Launch;
  isLoading: boolean = false;
  isFavorite: boolean = false;

  _unsubscribeAll: Subject<any>;

  constructor(
    private sharedService: SharedService,
    private actRoute: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar,
    private titleService: Title
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.titleService.setTitle('Launch #' + this.id);
    this.isLoading = true;
    this.sharedService
      .getLaunchDetail(this.id)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((detail) => {
        this.launchDetail = detail;
        this.isFavorite = this.sharedService.isFavorite(detail);
        this.isLoading = false;
      });
  }

  addFavorite(f: Launch): void {
    this.sharedService.addFavorite(f);
    this.isFavorite = this.sharedService.isFavorite(f);
    this._snackBar.open(
      `Launch #${f.flight_number} is added to favorite.`,
      '',
      { duration: 1000 }
    );
  }

  isFavoriteNow(): void {
    this._snackBar.open(`This Launch is one the favorites.`, '', {
      duration: 1000,
    });
  }

  back(): void {
    this.router.navigate(['/launches']);
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next({});
    this._unsubscribeAll.complete();
  }
}
