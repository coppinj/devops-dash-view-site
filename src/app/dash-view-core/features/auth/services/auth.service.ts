import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { IJwtPayload, IJwtPayloadResponse, ILoginDTO, RoleType } from '@dash-view-common';
import { map, Observable, Subject, tap } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { APIClient } from '../../../common';

@Injectable({ providedIn: 'root' })
export class AuthService extends APIClient {
  readonly JWT_TOKEN_KEY = environment.jwtTokenKey;

  private jwtToken!: string | null;
  private payload!: IJwtPayload;

  private _userAuthenticated$: Subject<boolean>;

  get userAuthenticatedAsObservable(): Observable<boolean> {
    return this._userAuthenticated$.asObservable();
  }

  constructor(
    http: HttpClient,
    private jwtService: JwtHelperService,
    private readonly router: Router,
  ) {
    super(http, 'auth');

    this._userAuthenticated$ = new Subject<boolean>();
  }

  get isAuthenticated() {
    this._checkToken();

    return !!this.jwtToken;
  }

  get userId() {
    return this.payload.id;
  }

  get email() {
    return this.payload.email;
  }

  get role(): RoleType | null {
    if (!this.jwtToken) {
      if (!this.isAuthenticated) {
        return null;
      }
    }

    return this.payload.role.role;
  }

  login(dto: ILoginDTO): Observable<IJwtPayload> {
    return this.create<IJwtPayloadResponse>(dto, this.getResourceURL('login')).pipe(
      map(x => {
        this._setToken(x.access_token);

        return this.payload;
      }),
    );
  }

  logout(): void {
    this.jwtToken = null;
    localStorage.removeItem(this.JWT_TOKEN_KEY);

    this._userAuthenticated$.next(false);

    this.router.navigate(['/']);
  }

  private _setToken(token: string): void {
    if (!token || this.jwtService.isTokenExpired(token)) {
      return;
    }

    // = Save token
    this.jwtToken = token;
    this.payload = this.jwtService.decodeToken(this.jwtToken)!;
    localStorage.setItem(this.JWT_TOKEN_KEY, this.jwtToken);

    this._userAuthenticated$.next(true);
  }

  private _checkToken(): void {
    if (!this.jwtToken) {
      this._setToken(localStorage.getItem(this.JWT_TOKEN_KEY)!);
    }
    else if (this.jwtService.isTokenExpired(this.jwtToken)) {
      this.jwtToken = null;
    }
  }
}