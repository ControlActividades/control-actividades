import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerRolesComponent } from './ver-roles.component';

describe('VerRolesComponent', () => {
  let component: VerRolesComponent;
  let fixture: ComponentFixture<VerRolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerRolesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VerRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
