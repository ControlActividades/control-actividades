import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidationErrors } from '@angular/forms';
import { ResponsableService } from '../../services/responsable.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  constructor(private fb: FormBuilder, private router: Router, 
    private responsableService: ResponsableService,
    private snackBar: MatSnackBar) {
    this.buscarForm = this.fb.group({
      correoElec: ['', [Validators.email, Validators.maxLength(260)]],
      telefono: ['', [Validators.pattern('^[0-9]+$'), Validators.maxLength(10), Validators.minLength(10)]]
    }, { validator: this.conditionalValidator });

    this.recuperarForm = this.fb.group({
      contrasenia: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(10)]],
      confContrasenia: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(10)]]
    });
  }

  ngOnInit() {}

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

    if (this.buscarForm.invalid) {
      console.log('Formulario inválido');
      return;
    }

    this.responsableService.buscarResponsable(correoElec, telefono).subscribe(
      resp => {
        if (resp) {
          this.usuarioEncontrado = true;
          this.idResp = resp.idResp;
          this.buscarForm.disable();
          this.searchExitoso();
        } else {
          console.log('Usuario no encontrado');
          
        }
      },
      err =>{

        console.log(err);
        this.searchFallido();
      } 
        
    );
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
    this.usuarioEncontrado = false;
  }

}
