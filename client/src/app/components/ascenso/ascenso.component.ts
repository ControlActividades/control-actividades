import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ResponsableService } from '../../services/responsable.service';
import { NotificationService } from '../../services/notificacion.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-ascenso',
  templateUrl: './ascenso.component.html',
  styleUrls: ['./ascenso.component.css']
})
export class AscensoComponent {
  ascensoForm: FormGroup;
  showProgressBar = false;

  constructor(
    private responsableService: ResponsableService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar:MatSnackBar,
    public notificationService : NotificationService
  ) {
    this.ascensoForm = this.fb.group({
      razon: ['', Validators.required] 
    });
  }

  onSubmit() {
    if (this.ascensoForm.valid) {
      const razon = this.ascensoForm.get('razon')?.value;
      this.showProgressBar = true;

      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '300px',
        data: {
          message: '¿Estás seguro de que deseas enviar la solicitud de ascenso?',
          confirmButtonText: 'Enviar',
          cancelButtonText: 'Cancelar'
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result === 'confirm') {
          // El usuario confirmó el envío
          this.responsableService.enviarCorreoAscenso(razon).subscribe(
            response => {
              console.log('Correo enviado exitosamente:', response);
              this.showProgressBar = true;
              this.notificationService.showNotification('Solicitud de ascenso enviada correctamente');
              setTimeout(() => {
              this.showProgressBar = false;

                this.dialog.closeAll();
              }, 1000);
            },
            error => {
              console.error('Error al enviar el correo:', error);
              this.showProgressBar = false;
              this.envioFallido();
            }
          );
        } else {
          this.showProgressBar = false;
        }
      });
    } else {
      console.error('La razón del ascenso es requerida.');
    }
  }
  onCancel() {
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
