import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-repository-create-dialog',
  templateUrl: './repository-create-dialog.component.html',
  styleUrl: './repository-create-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RepositoryCreateDialogComponent implements OnInit {
  constructor() {
  }

  ngOnInit(): void {
  }
}
