import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { IPipelineReadDTO, ITestClassReadDTO } from '@dash-view-common';
import { CoreFormBuilder, LoadingContexts, LoadingService, TranslateService } from '@dash-view-core';
import { Scroller } from 'primeng/scroller';
import { PipelineService } from '../../services/pipeline.service';

@Component({
  selector: 'app-pipeline',
  templateUrl: './pipeline.component.html',
  styleUrl: './pipeline.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class PipelineComponent implements OnInit, AfterViewInit {
  @ViewChild('container') container!: ElementRef;
  @ViewChild('sc') sc!: Scroller;
  @ViewChildren('scrollTarget') scrollTargets!: QueryList<ElementRef>;

  repositoryID!: number;
  id!: number;

  currentTestClassID!: number;

  item!: IPipelineReadDTO;
  scrollerItems!: { id: number, name: string }[];

  sourceCodeMap: Map<number, string[]>;
  highlightedRowMap: Map<number, number[]>;
  checkboxRowMap: Map<number, number[]>;

  maxCodeHeight!: string;

  LoadingContexts = LoadingContexts;

  private destroyRef = inject(DestroyRef);

  constructor(
    private readonly pipelineService: PipelineService,
    private readonly translateService: TranslateService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly fb: CoreFormBuilder,
    private readonly cd: ChangeDetectorRef,
    private readonly loadingService: LoadingService,
  ) {
    this.sourceCodeMap = new Map<number, string[]>();
    this.highlightedRowMap = new Map<number, number[]>();
    this.checkboxRowMap = new Map<number, number[]>();
  }

  checkboxChanged(event: any, row: number) {
    // Handle checkbox change
    console.log(`Checkbox at row ${row} changed to ${event.target.checked}`);
  }

  debug(testClass: ITestClassReadDTO) {
    console.log(testClass);
  }

  ngOnInit(): void {
    this.maxCodeHeight = '100vh';

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

  ngAfterViewInit(): void {
    this.maxCodeHeight = `${this.container.nativeElement.offsetHeight}px`;
    this.cd.detectChanges();

    this.scrollTargets.changes.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
    });
  }

  private _load(): void {
    this.loadingService.loadingCustom = true;
    this.cd.detectChanges();

    this.sourceCodeMap.clear();
    this.highlightedRowMap.clear();
    this.checkboxRowMap.clear();

    this.pipelineService.get({ repositoryID: this.repositoryID, id: this.id }).subscribe({
      next: s => {
        this.item = s;
        this.scrollerItems = [];

        for (const testClass of this.item.testClasses) {
          this.scrollerItems.push({ id: testClass.id, name: testClass.name });

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

        this.loadingService.loadingCustom = false;

        this.cd.detectChanges();
      },
      error: () => {
        return this.router.navigate(['/repositories', this.repositoryID]);
      },
    })
  }

  updateScroller(i: number) {
    this.currentTestClassID = this.item.testClasses[i].id;

    // console.log(this.currentTestClassID);

    if (this.sc) {
      this.sc.scrollToIndex(i, 'smooth');
    }
  }
}
