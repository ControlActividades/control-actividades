import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ResponsableService } from '../../services/responsable.service';

@Component({
  selector: 'app-ascenso',
  templateUrl: './ascenso.component.html',
  styleUrls: ['./ascenso.component.css']
})
export class AscensoComponent {
  ascensoForm: FormGroup;

  constructor(
    private responsableService: ResponsableService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar:MatSnackBar
  ) {
    this.ascensoForm = this.fb.group({
      razon: ['', Validators.required] // Asegúrate de agregar el validador requerido
    });
  }

  onSubmit() {
    if (this.ascensoForm.valid) {
      const razon = this.ascensoForm.get('razon')?.value;
      this.responsableService.enviarCorreoAscenso(razon).subscribe(
        response => {
          console.log('Correo enviado exitosamente:', response);
          this.dialog.closeAll();
          this.envioExitoso();
        },
        error => {
          console.error('Error al enviar el correo:', error);
          this.envioFallido();
        }
      );
    } else {
      console.error('La razón del ascenso es requerida.');
    }
  }

  onCancel() {
    // Lógica para manejar la cancelación, como limpiar el formulario
    this.dialog.closeAll();
    this.ascensoForm.reset();
  }

  envioExitoso() {
    this.snackBar.open('Correo enviado con éxito', 'Cerrar', {
      duration: 3000,
      panelClass: ['success-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  envioFallido() {
    this.snackBar.open('Correo enviado sin éxito', 'OK', {
      duration: 3000,
      panelClass: ['info-snackbar']
    });
  }

}
