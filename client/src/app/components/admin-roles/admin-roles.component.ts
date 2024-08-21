import { Component, Input, OnInit, Output, EventEmitter, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Rol } from '../../models/rol'; //models
import { RolService } from '../../services/rol.service'; //servicios
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-roles',
  templateUrl: './admin-roles.component.html',
  styleUrls: ['./admin-roles.component.css']
})
export class AdminRolesComponent implements OnInit, AfterViewInit {
  rolForm: FormGroup;
  edit: boolean = false;
  @Input() tabGroup: any;
  @Output() tabChange: EventEmitter<number> = new EventEmitter<number>();

  rol: Rol = {
    idRoles: 0,
    rol: ''
  };

  constructor(
    private fb: FormBuilder,
    private rolService: RolService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private snackBar:MatSnackBar
  ) {
    this.rolForm = this.fb.group({
      rol: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const idRoles = this.activatedRoute.snapshot.paramMap.get('idRoles');
    
    if (idRoles) {
      this.rolService.getRol(idRoles).subscribe(
        resp => {
          this.rol = resp;
          setTimeout(() => {
            this.rolForm.patchValue({
              rol : this.rol.rol
            });
            this.edit = true;
          });
        },
        err => console.error(err)
      );
    }
  }

  ngAfterViewInit(): void {
    if (this.edit) {
      this.rolForm.patchValue({
        rol : this.rol.rol
      });
      this.cdr.detectChanges();
    }
  }

  saveRol(): void {
    if (this.rolForm.valid) {
      const rol: Rol = {
        idRoles: this.rol.idRoles,
        rol: this.rolForm.get('rol')?.value
      };

      if (this.edit) {
        this.updateRol();
      } else {
        this.rolService.saveRol(rol).subscribe(
          resp => {
            console.log(resp);
            this.rolForm.reset();
            this.tabChange.emit(1); // Cambia a la pestaña "Ver rol"
            this.ingresoExitoso();
          },
          err => this.edicionFallido()
        );
      }
    }
  }

  updateRol(): void {
    const idRoles = this.rol.idRoles;

    if (idRoles !== undefined) {
      this.rolService.updateRol(idRoles, this.rolForm.value).subscribe(
        resp => {
          console.log(resp);
          this.router.navigate(['/inicio/roles']);
          this.rolForm.reset();
          this.edicionExitoso()
        },
        err => this.edicionFallido() 
      );
    }
  }

  ingresoExitoso() {
    this.snackBar.open('Rol agregado con éxito', 'Cerrar', {
      duration: 3000,
      panelClass: ['success-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  edicionExitoso() {
    this.snackBar.open('Rol editado con éxito', 'Cerrar', {
      duration: 3000,
      panelClass: ['success-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  edicionFallido() {
    this.snackBar.open('Rol ya existente', 'OK', {
      duration: 3000,
      panelClass: ['info-snackbar']
    });
  }
}
