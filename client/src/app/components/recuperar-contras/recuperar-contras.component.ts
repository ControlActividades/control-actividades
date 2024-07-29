import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResponsableService } from '../../services/responsable.service';
import { Router } from '@angular/router';
import { Responsable } from '../../models/Responsable';

@Component({
  selector: 'app-recuperar-contras',
  templateUrl: './recuperar-contras.component.html',
  styleUrls: ['./recuperar-contras.component.css']
})
export class RecuperarContrasComponent {
  buscarForm: FormGroup;
  recuperarForm: FormGroup;
  usuarioEncontrado: boolean = false;
  idResp: string | number | null = null;

  constructor(private fb: FormBuilder, private router: Router, private responsableService: ResponsableService) {
    this.buscarForm = this.fb.group({
      correoElec: ['', Validators.required],
      telefono: ['', Validators.required]
    });
    this.recuperarForm = this.fb.group({
      contrasenia: ['', Validators.required],
      confContrasenia: ['', Validators.required]
    });
  }

  ngOnInit() {}

  onBuscar(): void {
    const correoElec = this.buscarForm.get('correoElec')?.value;
    const telefono = this.buscarForm.get('telefono')?.value;

    this.responsableService.buscarResponsable(correoElec, telefono).subscribe(
      resp => {
        if (resp) {
          this.usuarioEncontrado = true;
          this.idResp = resp.idResp;
          this.buscarForm.disable();
        } else {
          console.log('Usuario no encontrado');
        }
      },
      err => console.log(err)
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
}
