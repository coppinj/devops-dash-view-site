import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepositoryUserAccessDialogComponent } from './repository-user-access-dialog.component';

describe('RepositoryUserAccessDialogComponent', () => {
  let component: RepositoryUserAccessDialogComponent;
  let fixture: ComponentFixture<RepositoryUserAccessDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepositoryUserAccessDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RepositoryUserAccessDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
