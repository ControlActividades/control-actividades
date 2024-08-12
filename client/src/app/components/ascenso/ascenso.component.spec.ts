import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AscensoComponent } from './ascenso.component';

describe('AscensoComponent', () => {
  let component: AscensoComponent;
  let fixture: ComponentFixture<AscensoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AscensoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AscensoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
