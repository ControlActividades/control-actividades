import { Component, Input, OnInit, Output, EventEmitter, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Rol } from '../../models/Rol'; //models
import { RolService } from '../../services/rol.service'; //servicios

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
    private cdr: ChangeDetectorRef
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
            this.tabChange.emit(1); // Cambia a la pestaña "Ver rol"
            this.rolForm.reset();
          },
          err => console.log(err)
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
        },
        err => console.error(err)
      );
    }
  }
}
