import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatFormFieldAppearance } from '@angular/material/form-field';


@Component({
  selector: 'app-reservanos',
  templateUrl: './reservanos.component.html',
  styleUrls: ['./reservanos.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReservanosComponent {
  formAppearance: MatFormFieldAppearance = 'fill'; // Estilo para el formulario

  // Variables para los campos del formulario
  horaInicio: string = '';
  horaFin: string = '';
  fechaReservacion: Date | null = null;
  razonesReservacion: string = '';
  areaUsar: string = '';

  constructor() {}

  // Ejemplo de método para manejar la limpieza del formulario
  limpiarFormulario() {
    this.horaInicio = '';
    this.horaFin = '';
    this.fechaReservacion = null;
    this.razonesReservacion = '';
    this.areaUsar = '';
  }

  // Ejemplo de método para enviar el formulario
  enviarFormulario() {
    // Aquí puedes procesar y enviar los datos del formulario
    console.log('Datos del formulario:', {
      horaInicio: this.horaInicio,
      horaFin: this.horaFin,
      fechaReservacion: this.fechaReservacion,
      razonesReservacion: this.razonesReservacion,
      areaUsar: this.areaUsar,
    });
  }
}
