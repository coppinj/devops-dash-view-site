import { ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { LoadingContexts } from '../../model';
import { LoadingService } from '../../services';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class LoaderComponent implements OnInit {
  @Input() context!: LoadingContexts;
  @Input() loading!: boolean;

  @Input() fullscreen!: boolean;

  @Input() size!: 'sm';

  target$!: Observable<boolean>;

  constructor(public readonly loadingService: LoadingService) {
  }

  ngOnInit(): void {
    if (this.loading !== undefined) {
      return;
    }

    switch (this.context) {
      case LoadingContexts.GLOBAL:
        this.target$ = this.loadingService.loadingAsObservable;

        break;
      case LoadingContexts.CUSTOM:
        this.target$ = this.loadingService.loadingCustomAsObservable;

        break;
    }
  }
}
