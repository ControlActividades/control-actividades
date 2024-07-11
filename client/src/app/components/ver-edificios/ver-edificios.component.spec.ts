import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerEdificiosComponent } from './ver-edificios.component';

describe('VerEdificiosComponent', () => {
  let component: VerEdificiosComponent;
  let fixture: ComponentFixture<VerEdificiosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerEdificiosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VerEdificiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
