import { Component, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css'
})
export class RolesComponent {
  @ViewChild('tabGroup') tabGroup!: MatTabGroup;

  // Método para cambiar a la pestaña deseada
  public selectTab(index: number): void {
    if (this.tabGroup) {
      this.tabGroup.selectedIndex = index;
    }
  }
}
