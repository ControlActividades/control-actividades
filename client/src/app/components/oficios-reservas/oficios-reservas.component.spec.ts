import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OficiosReservasComponent } from './oficios-reservas.component';

describe('OficiosReservasComponent', () => {
  let component: OficiosReservasComponent;
  let fixture: ComponentFixture<OficiosReservasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OficiosReservasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OficiosReservasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
