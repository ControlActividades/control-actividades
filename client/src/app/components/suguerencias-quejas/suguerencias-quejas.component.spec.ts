import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuguerenciasQuejasComponent } from './suguerencias-quejas.component';

describe('SuguerenciasQuejasComponent', () => {
  let component: SuguerenciasQuejasComponent;
  let fixture: ComponentFixture<SuguerenciasQuejasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SuguerenciasQuejasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SuguerenciasQuejasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
