import { Component, HostListener } from '@angular/core';
import { ResponsableService } from './services/responsable.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'client';

  constructor(private responsableService: ResponsableService) { }

  // Este HostListener escuchará cuando se intente cerrar la ventana
  @HostListener('window:beforeunload', ['$event'])
  unloadHandler(event: Event) {
    this.responsableService.logout(); // Llama al método logout de tu servicio
  }
}
