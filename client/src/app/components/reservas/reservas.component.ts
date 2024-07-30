import { Component, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.component.html',
  styleUrl: './reservas.component.css'
})
export class ReservasComponent {
  @ViewChild('tabGroup') tabGroup!: MatTabGroup;

  // Método para cambiar a la pestaña deseada
  public selectTab(index: number): void {
    if (this.tabGroup) {
      this.tabGroup.selectedIndex = index;
    }
  }
}
