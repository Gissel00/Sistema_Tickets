import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private loadingBS = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingBS.asObservable();

  constructor() {}

  setLoading(value: boolean): void {
    this.loadingBS.next(value);
  }
}
