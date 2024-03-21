import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { IPipelineReadDTO, ITestClassReadDTO } from '@dash-view-common';
import { CoreFormBuilder, TranslateService } from '@dash-view-core';
import { PipelineService } from '../../services/pipeline.service';

@Component({
  selector: 'app-pipeline',
  templateUrl: './pipeline.component.html',
  styleUrl: './pipeline.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PipelineComponent implements OnInit {
  repositoryID!: number;
  id!: number;

  item!: IPipelineReadDTO;

  sourceCodeMap: Map<number, string[]>;
  highlightedRowMap: Map<number, number[]>;
  checkboxRowMap: Map<number, number[]>;

  private destroyRef = inject(DestroyRef);

  constructor(
    private readonly pipelineService: PipelineService,
    private readonly translateService: TranslateService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly fb: CoreFormBuilder,
    private readonly cd: ChangeDetectorRef,
  ) {
    this.sourceCodeMap = new Map<number, string[]>();
    this.highlightedRowMap = new Map<number, number[]>();
    this.checkboxRowMap = new Map<number, number[]>();
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(s => {
      if (!s.get('repositoryID')) {
        return this.router.navigate(['/repositories']);
      }

      this.repositoryID = parseInt(s.get('repositoryID')!);

      if (isNaN(this.repositoryID)) {
        return this.router.navigate(['/repositories']);
      }

      if (!s.get('id')) {
        return this.router.navigate(['/repositories', this.repositoryID]);
      }

      this.id = parseInt(s.get('id')!);

      if (isNaN(this.id)) {
        return this.router.navigate(['/repositories', this.repositoryID]);
      }

      return this._load();
    });
  }

  private _load(): void {
    this.sourceCodeMap.clear();
    this.highlightedRowMap.clear();
    this.checkboxRowMap.clear();

    this.pipelineService.get({ repositoryID: this.repositoryID, id: this.id }).subscribe({
      next: s => {
        this.item = s;

        for (const testClass of this.item.testClasses) {
          this.sourceCodeMap.set(testClass.id, testClass.sourceCode.split('\n'));
          this.highlightedRowMap.set(testClass.id, []);
          this.checkboxRowMap.set(testClass.id, []);

          for (const method of testClass.methods) {
            this.checkboxRowMap.get(testClass.id)!.push(method.row);

            for (let i = method.row; i < method.row + method.rows; i++) {
              this.highlightedRowMap.get(testClass.id)!.push(i);
            }
          }
        }

        this.cd.detectChanges();
      },
      error: () => {
        return this.router.navigate(['/repositories', this.repositoryID]);
      },
    })
  }

  checkboxChanged(event: any, row: number) {
    // Handle checkbox change
    console.log(`Checkbox at row ${row} changed to ${event.target.checked}`);
  }

  debug(testClass: ITestClassReadDTO) {
    console.log(testClass);
  }
}
