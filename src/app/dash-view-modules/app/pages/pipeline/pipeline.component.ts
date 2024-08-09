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
import { IPipelineReadDTO, IRepositoryReadDTO } from '@dash-view-common';
import { CoreFormBuilder, LoadingContexts, LoadingService, TranslateService } from '@dash-view-core';
import { saveAs } from 'file-saver';
import { Scroller } from 'primeng/scroller';
import { forkJoin } from 'rxjs';
import { PipelineService } from '../../services/pipeline.service';
import { RepositoryService } from '../../services/repository.service';
import { TestClassService } from '../../services/test-class.service';

@Component({
  selector: 'app-pipeline',
  templateUrl: './pipeline.component.html',
  styleUrl: './pipeline.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class PipelineComponent implements OnInit, AfterViewInit {
  @ViewChildren('codePanel') codePanels!: QueryList<ElementRef>;
  @ViewChild('container') container!: ElementRef;
  @ViewChild('sc') sc!: Scroller;
  @ViewChild('testClassesContainer') testClassesContainer!: ElementRef;
  @ViewChildren('testClassContainer') testClassContainers!: QueryList<ElementRef>;

  repositoryID!: number;
  id!: number;

  currentTestClassID!: number | null;
  currentTestClassIndex!: number | null;

  defaultCollapsedMap: Map<number, boolean>;

  repository!: IRepositoryReadDTO;
  item!: IPipelineReadDTO;
  scrollerItems!: { id: number, name: string }[];

  sourceCodeMap: Map<number, string[]>;
  highlightedRowMap: Map<number, number[]>;
  checkboxRowMap: Map<number, number[]>;

  visibleIndexes!: number[];

  maxCodeHeight!: string;

  LoadingContexts = LoadingContexts;

  scrolling!: boolean;

  validatedTestClasses!: number;
  totalTestClasses!: number;

  private destroyRef = inject(DestroyRef);

  constructor(
    private readonly repositoryService: RepositoryService,
    private readonly pipelineService: PipelineService,
    private readonly testClassService: TestClassService,
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

    this.defaultCollapsedMap = new Map<number, boolean>();
  }

  validatedChanged(id: number): void {
    if (this.defaultCollapsedMap.has(id)) {
      this.testClassService.toggleValidated(this.repositoryID, this.id, id).subscribe(() => {
        this.defaultCollapsedMap.set(id, this.item.testClasses.find(x => x.id === id)?.validated ?? false);

        this._updateCountValidated();

        this.cd.detectChanges();
      });
    }
  }

  download(id: number): void {
    this.testClassService.download(this.repositoryID, this.id, id).subscribe(s => {
      const filename = /filename="(.+)"/.exec(s.headers.get('content-disposition')!)!;
      saveAs(s.body!, filename[1]);
    });
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
    this.checkActiveTestClass();

    this.testClassesContainer.nativeElement.addEventListener('scroll', this.checkActiveTestClass.bind(this));

    this.maxCodeHeight = `${this.container.nativeElement.offsetHeight - 60}px`;

    this.cd.detectChanges();
  }

  checkActiveTestClass(): void {
    if (this.scrolling) {
      return;
    }

    const activeIndex = this._computeActiveTestClass();

    if (activeIndex !== null) {
      if (this.currentTestClassIndex !== activeIndex) {
        this.currentTestClassID = this.item.testClasses[activeIndex].id;
        this.currentTestClassIndex = activeIndex;

        this.sc.scrollToIndex(this.currentTestClassIndex, 'smooth');

        this._generateVisibleIndexes();

        this.cd.detectChanges();
      }
    }
    else {
      this.currentTestClassID = null;
      this.currentTestClassIndex = null;
    }
  }

  private _computeActiveTestClass(): number | null {
    if (!this.item) {
      return null;
    }

    const containerTop = this.testClassesContainer.nativeElement.scrollTop;
    const containerBottom = containerTop + this.testClassesContainer.nativeElement.clientHeight;

    let activeIndex: null | number = null;
    let i = 0;

    while (activeIndex === null && i < this.testClassContainers.length) {
      const testClassContainer = this.testClassContainers.get(i)!;

      const testClassContainerTop = testClassContainer.nativeElement.offsetTop;
      const testClassContainerBottom = testClassContainerTop + testClassContainer.nativeElement.offsetHeight;

      if (testClassContainerTop < containerBottom && testClassContainerBottom > containerTop) {
        activeIndex = i;
      }

      i++;
    }

    return i;
  }

  private _generateVisibleIndexes(): void {
    if (this.currentTestClassIndex !== null) {
      for (let j = 0; j < 20; j++) {
        const index = this.currentTestClassIndex - 5 + j;

        if (index >= 0 && index <= this.item.testClasses.length && !this.visibleIndexes.includes(index)) {
          this.visibleIndexes.push(index);
        }
      }
    }
  }

  private _load(): void {
    this.loadingService.loadingCustom = true;
    this.cd.detectChanges();

    this.sourceCodeMap.clear();
    this.highlightedRowMap.clear();
    this.checkboxRowMap.clear();
    this.defaultCollapsedMap.clear();

    forkJoin([
      this.repositoryService.get<IRepositoryReadDTO>(this.repositoryID),
      this.pipelineService.get<IPipelineReadDTO>({ repositoryID: this.repositoryID, id: this.id })
    ]).subscribe({
      next: s => {
        this.repository = s[0] as IRepositoryReadDTO;
        this.item = s[1] as IPipelineReadDTO;
        this.visibleIndexes = [];
        this.scrollerItems = [];

        for (const testClass of this.item.testClasses) {
          this.scrollerItems.push({ id: testClass.id, name: testClass.name });

          this.sourceCodeMap.set(testClass.id, testClass.sourceCode.split('\n'));
          this.highlightedRowMap.set(testClass.id, []);
          this.checkboxRowMap.set(testClass.id, []);
          this.defaultCollapsedMap.set(testClass.id, testClass.validated);

          for (const method of testClass.methods) {
            this.checkboxRowMap.get(testClass.id)!.push(method.row);

            for (let i = method.row; i < method.row + method.rows; i++) {
              this.highlightedRowMap.get(testClass.id)!.push(i);
            }
          }
        }

        if (this.item.testClasses.length > 0) {
          this.currentTestClassIndex = 0;
          this.currentTestClassID = this.item.testClasses[0].id;
        }

        this._generateVisibleIndexes();

        this._updateCountValidated();

        this.loadingService.loadingCustom = false;

        this.cd.detectChanges();
      },
      error: () => {
        return this.router.navigate(['/repositories', this.repositoryID]);
      },
    })
  }

  changeIndex(item: { id: number, name: string }): void {
    const index = this.scrollerItems.findIndex(x => x.id === item.id);

    if (index === -1) {
      return;
    }

    this.currentTestClassID = this.item.testClasses[index].id;
    this.currentTestClassIndex = index;

    this.cd.detectChanges();

    this._generateVisibleIndexes();

    this.cd.detectChanges();

    this.scrolling = true;

    this.testClassContainers.get(this.currentTestClassIndex)?.nativeElement.scrollIntoView({behavior: 'instant'});

    setTimeout(() => this.scrolling = false, 500);
  }

  private _updateCountValidated(): void {
    this.validatedTestClasses = this.item.testClasses.filter(x => x.validated).length;
    this.totalTestClasses = this.item.testClasses.length;
  }
}
