import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepositoryApiKeyCreateDialogComponent } from './repository-api-key-create-dialog.component';

describe('RepositoryApiKeyCreateDialogComponent', () => {
  let component: RepositoryApiKeyCreateDialogComponent;
  let fixture: ComponentFixture<RepositoryApiKeyCreateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepositoryApiKeyCreateDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RepositoryApiKeyCreateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
