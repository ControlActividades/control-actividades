import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponsableService } from '../../services/responsable.service'; //servicios
import { RolService } from '../../services/rol.service';
import { Responsable } from '../../models/Responsable';

@Component({ 
  selector: 'app-nuevo-usuario',
  templateUrl: './nuevo-usuario.component.html',
  styleUrl: './nuevo-usuario.component.css'
})
export class NuevoUsuarioComponent {
responsableForm : FormGroup;
  roles : any=[];

  responsable : Responsable =  {
    idResp : 0,
    nombUsuario : '',
    contrasenia : new Uint8Array(),
    nombres : '',
    appPaterno : '',
    appMaterno : '',
    telefono: '',
    correoElec: '',
    numControl: '',
    grupo: '',
    idRoles: 0
  }


  constructor (private rolService : RolService,
    private responsableService : ResponsableService,
    private router : Router,
    private fb : FormBuilder
  ){
this.responsableForm = this.fb.group({
  nombUsuario: ['', Validators.required],
  contrasenia: ['', Validators.required],
  confContrasenia : ['', Validators.required],
  nombres: ['', Validators.required],
  appPaterno: ['', Validators.required],
  appMaterno: [''],
  telefono: [''],
  correoElec: [''],
  numControl: ['', Validators.required],
  grupo: ['', Validators.required],
  idRoles: ['']
})

  }

  ngOnInit(){
    this.rolService.getRoles().subscribe(
      resp => {
        this.roles = resp
      },
      err => console.error(err)
    );
  }

  saveResponsable(): void {
    if (this.responsableForm.valid) {
      const responsable : Responsable = {
        idResp: this.responsable.idResp,
        nombUsuario: this.responsableForm.get('nombUsuario')?.value,
        contrasenia: this.responsableForm.get('contrasenia')?.value,
        nombres: this.responsableForm.get('nombres')?.value,
        appPaterno: this.responsableForm.get('appPaterno')?.value,
        appMaterno: this.responsableForm.get('appMaterno')?.value,
        telefono: this.responsableForm.get('telefono')?.value,
        correoElec: this.responsableForm.get('correoElec')?.value,
        numControl: this.responsableForm.get('numControl')?.value,
        grupo: this.responsableForm.get('grupo')?.value,
        idRoles: this.responsableForm.get('idRoles')?.value
      };
        this.responsableService.saveResponsable(responsable).subscribe(
          resp => {
            console.log(resp);
            this.router.navigate(['/ingresar']);
          },
          err => console.log(err)
        );
      
    }
  }
}
