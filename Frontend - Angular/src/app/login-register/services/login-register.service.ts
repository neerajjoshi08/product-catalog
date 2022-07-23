import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.service';

@Injectable({
  providedIn: 'root'
})
export class LoginRegisterService {
  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  loginUser(user: User): Observable<User> {
    const headers = { 'content-type': 'application/json' };
    const body = user;

    return this.http.post<User>(`${environment.apiAuthURL}/login`, body, { 'headers': headers })
      .pipe(map(res => {
        // login successful if there's a jwt token in the response
        if (res) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(user.email));
        }
        return user;
      }),
        catchError(this.handleError)
      );
  }

  registerUser(user: User): Observable<User> {
    const headers = { 'content-type': 'application/json' };
    const body = user;

    return this.http.post<User>(`${environment.apiAuthURL}/register`, body, { 'headers': headers })
      .pipe(tap(),
        catchError(this.handleError)
      );
  }

  logoutUser() {
    localStorage.removeItem('currentUser');
    this.router.navigate(["product-search"]);
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    let errorMessage = '';
    return throwError(err);
  }
}
