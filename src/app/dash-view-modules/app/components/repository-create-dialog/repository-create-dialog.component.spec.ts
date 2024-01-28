import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepositoryCreateDialogComponent } from './repository-create-dialog.component';

describe('RepositoryCreateDialogComponent', () => {
  let component: RepositoryCreateDialogComponent;
  let fixture: ComponentFixture<RepositoryCreateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepositoryCreateDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RepositoryCreateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
