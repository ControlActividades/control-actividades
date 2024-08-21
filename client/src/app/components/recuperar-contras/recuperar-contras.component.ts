import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidationErrors } from '@angular/forms';
import { ResponsableService } from '../../services/responsable.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { passwordStrengthValidator } from '../ingresar/ingresar.component';

@Component({
  selector: 'app-recuperar-contras',
  templateUrl: './recuperar-contras.component.html',
  styleUrls: ['./recuperar-contras.component.css']
})
export class RecuperarContrasComponent implements OnInit {
  buscarForm: FormGroup;
  recuperarForm: FormGroup;
  usuarioEncontrado: boolean = false;
  idResp: string | number | null = null;
  showBuscarForm: boolean = true;

  constructor(private fb: FormBuilder, private router: Router,
    private responsableService: ResponsableService,
    private snackBar: MatSnackBar,
    private route : ActivatedRoute
  ) {
    this.buscarForm = this.fb.group({
      correoElec: ['', [Validators.email, Validators.maxLength(260)]]
    }, { validator: this.conditionalValidator });

    this.recuperarForm = this.fb.group({
      contrasenia: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(10), passwordStrengthValidator()]],
      confContrasenia: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(10), passwordStrengthValidator()]]
    });
  }

  ngOnInit() {
    this.idResp = this.route.snapshot.paramMap.get('idResp');
    if(this.idResp){
      this.showBuscarForm = false;
    }
    this.responsableService.usuarioEncontrado$.subscribe(valor => {
      this.usuarioEncontrado = valor;
      if (!valor) {
        this.usuarioEncontrado= false;
      }
    });
   }

  conditionalValidator(formGroup: FormGroup): ValidationErrors | null {
    const correoElec = formGroup.get('correoElec')?.value;
    const telefono = formGroup.get('telefono')?.value;

    if (!correoElec && !telefono) {
      return { bothRequired: true };
    }

    return null;
  }

  onBuscar(): void {
    const correoElec = this.buscarForm.get('correoElec')?.value;
    const telefono = this.buscarForm.get('telefono')?.value;

    if (correoElec) {
      // Llamar al servicio para buscar al usuario
      this.responsableService.buscarResponsable(correoElec, telefono).subscribe(
        (usuario) => {
          if (usuario) {
            // Usuario encontrado, ahora enviar el correo de verificación
            this.responsableService.enviarCorreoVerificacion(correoElec).subscribe(
              () => {
                this.snackBar.open('Correo de verificación enviado', 'Cerrar', {
                  duration: 2000,
                  panelClass: ['success-snackbar']
                });
              },
              (err) => {
                console.error('Error al enviar el correo de verificación:', err);
                this.snackBar.open('Error al enviar el correo de verificación', 'Cerrar', {
                  duration: 2000,
                  panelClass: ['error-snackbar']
                });
              }
            );
          } else {
            // Usuario no encontrado
            this.snackBar.open('Usuario no encontrado', 'Cerrar', {
              duration: 2000,
              panelClass: ['error-snackbar']
            });
          }
        },
        (err) => {
          console.error('Error al buscar usuario:', err);
          this.snackBar.open('Error al buscar usuario', 'Cerrar', {
            duration: 2000,
            panelClass: ['error-snackbar']
          });
        }
      );
    }
  }

  updateContrasenia(): void {
    if (this.recuperarForm.valid && this.idResp !== null) {
      const updateData = {
        contrasenia: this.recuperarForm.get('contrasenia')?.value
      };
      this.responsableService.updateContrasenia(this.idResp, updateData).subscribe(
        resp => {
          console.log(resp);
          this.router.navigate(['/ingresar']);
        },
        err => console.log(err)
      );
    }
  }

  searchExitoso() {
    this.snackBar.open('Usuario encontrado', 'Cerrar', {
      duration: 2000,
      panelClass: ['success-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  searchFallido() {
    this.snackBar.open('Usuario no encontrado', 'OK', {
      duration: 2000,
      panelClass: ['info-snackbar']
    });
  }

  cancelar(): void {
    this.buscarForm.reset();
    this.buscarForm.enable();
    this.recuperarForm.reset();
    this.usuarioEncontrado = false;
    this.idResp = null;
    this.showBuscarForm = true;
    this.router.navigate([]);
  }

  //verificar correo
  onEnviarVerificacionCorreo(): void {
    const correoElec = this.buscarForm.get('correoElec')?.value;

    if (correoElec) {
      this.responsableService.enviarCorreoVerificacion(correoElec).subscribe(
        resp => {
          console.log('Correo de verificación enviado:', resp);
          this.snackBar.open('Correo de verificación enviado', 'Cerrar', {
            duration: 2000,
            panelClass: ['success-snackbar']
          });
        },
        err => {
          console.error('Error al enviar el correo de verificación:', err);
          this.snackBar.open('Error al enviar el correo de verificación', 'Cerrar', {
            duration: 2000,
            panelClass: ['error-snackbar']
          });
        }
      );
    }
  }

}
