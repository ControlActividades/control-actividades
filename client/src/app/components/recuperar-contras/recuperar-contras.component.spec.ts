import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecuperarContrasComponent } from './recuperar-contras.component';

describe('RecuperarContrasComponent', () => {
  let component: RecuperarContrasComponent;
  let fixture: ComponentFixture<RecuperarContrasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecuperarContrasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecuperarContrasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
