import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepositoryPipelineTabComponent } from './repository-pipeline-tab.component';

describe('RepositoryPipelineTabComponent', () => {
  let component: RepositoryPipelineTabComponent;
  let fixture: ComponentFixture<RepositoryPipelineTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepositoryPipelineTabComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RepositoryPipelineTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
