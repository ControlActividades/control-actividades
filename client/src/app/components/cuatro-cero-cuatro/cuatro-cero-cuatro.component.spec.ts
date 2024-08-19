import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuatroCeroCuatroComponent } from './cuatro-cero-cuatro.component';

describe('CuatroCeroCuatroComponent', () => {
  let component: CuatroCeroCuatroComponent;
  let fixture: ComponentFixture<CuatroCeroCuatroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CuatroCeroCuatroComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CuatroCeroCuatroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
