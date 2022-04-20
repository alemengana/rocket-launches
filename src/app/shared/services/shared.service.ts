import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Launch } from '../models/launch';
import { Rocket } from '../models/rocket';
import { format, sub } from 'date-fns';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  // Define API
  apiURL = environment.apiURL;

  constructor(private http: HttpClient) {}

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  getLaunches(): Observable<Launch[]> {
    return this.http
      .get<Launch[]>(
        `${this.apiURL}launches?limit=10&sort=flight_number&order=desc`
      )
      .pipe(
        map((launches: Launch[]) => {
          return launches.filter((l) => !!l.details);
        }),
        catchError(this.handleError)
      );
  }

  getLaunchDetail(flightNumber: number): Observable<Launch> {
    return this.http.get<Launch>(this.apiURL + 'launches/' + flightNumber).pipe(
      mergeMap((launch: Launch) => {
        return this.http
          .get<Rocket>(this.apiURL + 'rockets/' + launch.rocket.rocket_id)
          .pipe(
            map((rocket) => {
              return {
                flight_number: launch.flight_number,
                mission_name: launch.mission_name,
                launch_date_unix: launch.launch_date_unix,
                details: launch.details,
                rocket: {
                  rocket_id: rocket.rocket_id,
                  rocket_name: rocket.rocket_name,
                  active: rocket.active,
                  cost_per_launch: rocket.cost_per_launch,
                  company: rocket.company,
                },
              };
            })
          );
      }),
      catchError(this.handleError)
    );
  }

  addFavorite(launch: Launch): void {
    const favKey = 'favorites';
    const favoritesFromLS = localStorage.getItem(favKey) || '[]';
    const fav = (JSON.parse(favoritesFromLS) as Launch[]) || [];
    if (!this.isFavorite(launch)) {
      fav.push(launch);
    }

    localStorage.setItem(favKey, JSON.stringify(fav));
  }

  isFavorite(launch: Launch): boolean {
    const favKey = 'favorites';
    const favoritesFromLS = localStorage.getItem(favKey) || '[]';
    const fav = (JSON.parse(favoritesFromLS) as Launch[]) || [];
    return !!fav.find((f) => launch.flight_number === f.flight_number);
  }

  // Error handling
  handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
  }
}
