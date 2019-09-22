import { Actions, ofType, Effect } from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../user.model';
import { AuthService } from '../auth.service';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

const handleAuth = (expiresIn: number, email: string, userId: string, token: string) => {
  const expirationDate = new Date(
    new Date().getTime() + expiresIn * 1000
  );
  const user = new User(email, userId, token, expirationDate);
  localStorage.setItem('userData', JSON.stringify(user));
  return new AuthActions.AuthSucess({
    email: email,
    userId: userId,
    token: token,
    expirationDate: expirationDate,
    redirect: true
  });
};

const handleError = (errResponse: any) => {
  let errorMessage = 'Something went wrong'; 
  if (!errResponse.error || !errResponse.error.error) {
    return of(new AuthActions.AuthFail(errorMessage));
  }
  switch(errResponse.error.error.message){
    case 'EMAIL_EXISTS':
      errorMessage = 'This email was already used';
      break;
    case 'EMAIL_NOT_FOUND':
    case 'INVALID_PASSWORD':
      errorMessage = 'Wrong email or password';
      break;
    default:
      errorMessage = 'Unknown error';
  }
  return of(new AuthActions.AuthFail(errorMessage));
};

@Injectable()
export class AuthEffects {

  @Effect()
  authSignUp = this.actions$.pipe(
    ofType(AuthActions.SIGNUP_START),
    switchMap((signupAction: AuthActions.SingupStart) => {
      return this.http.post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCcYPuoCGv5kOTKPvT7xUhhQJt1ZhpOZ9Q',
        {
          email: signupAction.payload.email,
          password: signupAction.payload.password,
          returnSecureToken: true
        }).pipe(
          tap(resData => {
            this.authService.setLogoutTimer(+resData.expiresIn * 1000);
          }),  
          map(resData => {
            return handleAuth(+resData.expiresIn, resData.email, resData.localId, resData.idToken);
          }),
          catchError(errResponse => {
            return handleError(errResponse);
          })
        );
    })
  );

  @Effect()
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => {
      return this.http.post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCcYPuoCGv5kOTKPvT7xUhhQJt1ZhpOZ9Q',
        {
          email: authData.payload.email,
          password: authData.payload.password,
          returnSecureToken: true
        }
      ).pipe(
        tap(resData => {
          this.authService.setLogoutTimer(+resData.expiresIn * 1000);
        }),  
        map(resData => {
          return handleAuth(+resData.expiresIn, resData.email, resData.localId, resData.idToken);
        }),
        catchError(errResponse => {
          return handleError(errResponse);
        })
      );
    }),

  );

  @Effect({dispatch: false})
  authRedirect = this.actions$.pipe(
    ofType(AuthActions.AUTH_SUCCESS),
    tap( (authSuccessAction: AuthActions.AuthSucess) => { 
      if (authSuccessAction.payload.redirect){
        this.router.navigate(['/']);
      }
    })
  );

  @Effect({dispatch: false})
  authLogout = this.actions$.pipe(
    ofType(AuthActions.LOGOUT),
    tap(() => {
      this.authService.clearLogoutTimer();
      localStorage.removeItem('userData');
      this.router.navigate(['/auth']);
    })
  );

  @Effect()
  autoLogin = this.actions$.pipe(
    ofType(AuthActions.AUTO_LOGIN),
    map(() => {
      const user: {
        email: string;
        id: string;
        _token: string;
        _tokenExpirationDate: string;
      } = JSON.parse(localStorage.getItem('userData'));
      if (!user) {
        return { type: 'asd' };
      }
  
      const loadedUser = new User(
        user.email,
        user.id,
        user._token,
        new Date(user._tokenExpirationDate)
      );
  
      if (loadedUser.token) {
        const expirationDuration = new Date(user._tokenExpirationDate).getTime() - new Date().getTime();
        this.authService.setLogoutTimer(expirationDuration);
        // this.user.next(loadedUser);
        return new AuthActions.AuthSucess(
          {
            email: loadedUser.email,
            userId: loadedUser.id,
            token: loadedUser.token,
            expirationDate: new Date(user._tokenExpirationDate),
            redirect: false
          });
        // const expirationDuration = new Date(user._tokenExpirationDate).getTime() - new Date().getTime();
        // this.autoLogout(expirationDuration);
      }
      return { type: 'asd' };
    })
  )

  constructor(private actions$: Actions, private http: HttpClient, private router: Router, private authService: AuthService) {}
}