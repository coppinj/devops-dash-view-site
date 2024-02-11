import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepositoryApiKeyResponseDialogComponent } from './repository-api-key-response-dialog.component';

describe('RepositoryApiKeyResponseDialogComponent', () => {
  let component: RepositoryApiKeyResponseDialogComponent;
  let fixture: ComponentFixture<RepositoryApiKeyResponseDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepositoryApiKeyResponseDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RepositoryApiKeyResponseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
