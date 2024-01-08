import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private _loading$: BehaviorSubject<boolean>;
  private _loadingCustom$: BehaviorSubject<boolean>;

  get loadingAsObservable(): Observable<boolean> {
    return this._loading$.asObservable();
  }

  get loading(): boolean {
    return this._loading$.getValue();
  }

  set loading(loading: boolean) {
    this._loading$.next(loading);
  }

  get loadingCustomAsObservable(): Observable<boolean> {
    return this._loadingCustom$.asObservable();
  }

  get loadingCustom(): boolean {
    return this._loadingCustom$.getValue();
  }

  set loadingCustom(loading: boolean) {
    this._loadingCustom$.next(loading);
  }

  constructor() {
    this._loading$ = new BehaviorSubject<boolean>(false);
    this._loadingCustom$ = new BehaviorSubject<boolean>(false);
  }
}
