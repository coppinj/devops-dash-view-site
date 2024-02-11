import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-repository-pipeline-tab',
  templateUrl: './repository-pipeline-tab.component.html',
  styleUrl: './repository-pipeline-tab.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RepositoryPipelineTabComponent {
  @Input({ required: true }) repositoryID!: number;

}
