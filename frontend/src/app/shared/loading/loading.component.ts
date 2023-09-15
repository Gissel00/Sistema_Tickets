import { Component, Input } from '@angular/core';
import { LoadingService } from './loading.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent {
  // @Input() isLoading: boolean = false;

  constructor(private loadingService: LoadingService) {
  }

  get loading$(): Observable<boolean> {
    return this.loadingService.loading$;
  }
}
