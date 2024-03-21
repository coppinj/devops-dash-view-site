import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { IPipelineListDTO } from '@dash-view-common';
import { LoadingService, TranslateService } from '@dash-view-core';
import { DialogService } from 'primeng/dynamicdialog';
import { PipelineService } from '../../../services/pipeline.service';

@Component({
  selector: 'app-repository-pipeline-tab',
  templateUrl: './repository-pipeline-tab.component.html',
  styleUrl: './repository-pipeline-tab.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RepositoryPipelineTabComponent implements OnInit {
  @Input({ required: true }) repositoryID!: number;

  apiKeys!: any[];

  private destroyRef = inject(DestroyRef);

  constructor(
    private readonly pipelineService: PipelineService,
    private readonly loadingService: LoadingService,
    private readonly dialogService: DialogService,
    private readonly translateService: TranslateService,
    private readonly cd: ChangeDetectorRef,
    private readonly router: Router,
  ) {
  }

  ngOnInit(): void {
    this._load();
  }

  view(row: IPipelineListDTO): void {
    this.router.navigate(['/app/repositories', this.repositoryID, 'pipelines', row.rowID]).then();
  }

  private _load(): void {
    this.pipelineService.getAll({ repositoryID: this.repositoryID }).subscribe(s => {
      this.apiKeys = s;

      this.cd.detectChanges();
    })
  }
}
