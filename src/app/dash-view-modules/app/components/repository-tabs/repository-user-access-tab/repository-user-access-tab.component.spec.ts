import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepositoryUserAccessTabComponent } from './repository-user-access-tab.component';

describe('RepositoryUserAccessTabComponent', () => {
  let component: RepositoryUserAccessTabComponent;
  let fixture: ComponentFixture<RepositoryUserAccessTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepositoryUserAccessTabComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RepositoryUserAccessTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
