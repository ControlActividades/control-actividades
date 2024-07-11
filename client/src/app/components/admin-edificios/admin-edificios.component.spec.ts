import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEdificiosComponent } from './admin-edificios.component';

describe('AdminEdificiosComponent', () => {
  let component: AdminEdificiosComponent;
  let fixture: ComponentFixture<AdminEdificiosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminEdificiosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminEdificiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
