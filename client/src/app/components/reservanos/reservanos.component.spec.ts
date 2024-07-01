import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservanosComponent } from './reservanos.component';

describe('ReservanosComponent', () => {
  let component: ReservanosComponent;
  let fixture: ComponentFixture<ReservanosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReservanosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReservanosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
