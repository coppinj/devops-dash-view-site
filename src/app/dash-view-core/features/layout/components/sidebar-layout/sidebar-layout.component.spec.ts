import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarLayoutComponent } from './sidebar-layout.component';

describe('AdminLayoutComponent', () => {
  let component: SidebarLayoutComponent;
  let fixture: ComponentFixture<SidebarLayoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SidebarLayoutComponent]
    });
    fixture = TestBed.createComponent(SidebarLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
