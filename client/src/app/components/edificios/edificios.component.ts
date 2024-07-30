import { Component, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-edificios',
  templateUrl: './edificios.component.html',
  styleUrls: ['./edificios.component.css']
})
export class EdificiosComponent {
  @ViewChild('tabGroup') tabGroup!: MatTabGroup;

  // Método para cambiar a la pestaña deseada
  public selectTab(index: number): void {
    if (this.tabGroup) {
      this.tabGroup.selectedIndex = index;
    }
  }
}
