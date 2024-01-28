import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepositoryApiKeyTabComponent } from './repository-api-key-tab.component';

describe('RepositoryApiKeyTabComponent', () => {
  let component: RepositoryApiKeyTabComponent;
  let fixture: ComponentFixture<RepositoryApiKeyTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepositoryApiKeyTabComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RepositoryApiKeyTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
