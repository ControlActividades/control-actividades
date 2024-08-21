import { Component, ElementRef, HostBinding, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ResponsableService } from '../../services/responsable.service';
import { RolService } from '../../services/rol.service';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDeleteComponent } from '../confirm-delete/confirm-delete.component';
import { Rol } from '../../models/rol';
import { Responsable } from '../../models/responsable';

export function noEHyphenValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value && typeof control.value === 'string' && control.value.startsWith('e-')) {
      return { 'noEHyphen': true };
    }
    return null;
  };
}
@Component({
  selector: 'app-registros',
  templateUrl: './registros.component.html',
  styleUrls: ['./registros.component.css']
})
export class RegistrosComponent implements OnInit {
  existingUsernameError: string | null = null;
  errorMessage: string | null = null;

  displayedColumns: string[] = ['nombUsuario', 'appPaterno', 'appMaterno', 'nombres', 'telefono', 'correoElec', 'numbControl', 'grupo', 'idRoles', 'acciones'];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  responsableFormEdit: FormGroup;
  @HostBinding('class') classes = 'row';
  responsables: any = [];
  roles: any = [];
  currentId: string | number | null = null;
  @ViewChildren('card') cards!: QueryList<ElementRef>;



  constructor(
    private responsableService: ResponsableService,
    private rolService: RolService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog : MatDialog
  ) {
    this.responsableFormEdit = this.fb.group({
      nombUsuario: ['', [Validators.required, Validators.maxLength(50)]],
      nombres: ['', [Validators.required, Validators.maxLength(50), Validators.pattern('^[A-Za-zÁÉÍÓÚÑáéíóúñ]+( [A-Za-zÁÉÍÓÚÑáéíóúñ]+)*$')]],
      appPaterno: ['', [Validators.required, Validators.maxLength(50), Validators.pattern('^[A-Za-zÁÉÍÓÚÑáéíóúñ ]+$')]],
      appMaterno: ['', [Validators.maxLength(50), Validators.pattern('^[A-Za-zÁÉÍÓÚÑáéíóúñ ]*$')]],
      telefono: ['', [Validators.pattern('^[0-9]*$'), Validators.maxLength(10), Validators.minLength(10)]],
      correoElec: ['', [Validators.email, Validators.maxLength(260)]],
      numControl: ['', [Validators.maxLength(20), Validators.pattern('^[A-Za-zÁÉÍÓÚÑáéíóúñ0-9 ]*$')]],
      grupo: ['', [Validators.maxLength(20), Validators.pattern('^[A-Z]{3}[0-9]{4}$')]],
      idRoles: ['', Validators.required]
    }, { validator: this.atLeastOneFieldRequired(['telefono', 'correoElec']) });
  }
  formatText(value: string, controlName: string): void {
    
    const formattedValue = value
      .replace(/\d/g, '') 
      .toLowerCase() 
      .replace(/\b\w/g, char => char.toUpperCase()); 

   
    this.responsableFormEdit.get(controlName)?.setValue(formattedValue, { emitEvent: false });
  }

  getErrorMessage(controlName: string): string | null {
    const control = this.responsableFormEdit.get(controlName);

    if (control?.hasError('required')) {
        return 'Este campo es obligatorio';
    }

    if (controlName === 'telefono' && control?.hasError('pattern')) {
        return 'Solo se permiten números en este campo';
    }

    if (control?.hasError('maxlength')) {
        const maxLengthError = control.errors?.['maxlength'];
        if (maxLengthError) {
            return `El valor no puede tener más de ${maxLengthError.requiredLength} caracteres`;
        }
    }

    if (control?.hasError('minlength')) {
        const minLengthError = control.errors?.['minlength'];
        if (minLengthError) {
            return `El valor debe tener al menos ${minLengthError.requiredLength} caracteres`;
        }
    }

    if (control?.hasError('pattern')) {
        return 'Formato inválido';
    }

    if (control?.hasError('email')) {
        return 'Correo electrónico inválido';
    }

    if (this.responsableFormEdit.hasError('atLeastOneRequired')) {
        return 'Debe ingresar al menos un campo: teléfono o correo electrónico.';
    }

    return null;
}


  ngOnInit() {
    this.getResponsables();
    this.getRoles();
  }

  getResponsables() {
    this.responsableService.getResponsables().subscribe(
      resp => {
        // Filtrar los responsables que NO tengan idRoles igual a 4
        const filteredResponsables = resp.filter((responsable: Responsable) => responsable.idRoles !== 4);
        
        // Asignar el array filtrado a dataSource
        this.dataSource = new MatTableDataSource(filteredResponsables);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      err => console.error(err)
    );
  }
  getRoles() {
    this.rolService.getRoles().subscribe(
      resp => {
        this.roles = resp.filter((rol: Rol) => !((rol.idRoles === 4)));
      },
      err => console.error(err)
    );
  }

  openConfirmDialog(idResp: string): void {
    this.responsableService.getResponsable(idResp).subscribe(responsable => {
        console.log(responsable); 
        const nomResp = responsable.nombres; 

        const dialogRef = this.dialog.open(ConfirmDeleteComponent, {
            data: {
                message: `¿Estás seguro de que deseas eliminar al responsable ${nomResp}?`
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.deleteResponsable(idResp);
            }
        });
    });
}
  
  
  deleteResponsable(idResp: string | number) {
    this.responsableService.deleteResponsable(idResp).subscribe(
      resp => {
        console.log(resp);
        this.getResponsables();
      },
      err => console.log(err)
    );
  }

  editResponsable(idResp: string | number): void {
    this.currentId = idResp;
    this.responsableService.getResponsable(idResp).subscribe(
      resp => {
        this.responsableFormEdit.patchValue({
          nombUsuario: resp.nombUsuario,
          nombres: resp.nombres,
          appPaterno: resp.appPaterno,
          appMaterno: resp.appMaterno,
          telefono: resp.telefono,
          correoElec: resp.correoElec,
          numControl: resp.numControl,
          grupo: resp.grupo,
          idRoles: resp.idRoles
        });
        this.scrollToEdit();
      },
      err => console.error(err)
    );
  }

  updateResponsable(): void {
    if (this.currentId !== null) {
      this.responsableService.updateResponsable(this.currentId, this.responsableFormEdit.value).subscribe(
        resp => {
          console.log(resp);
          this.getResponsables();
          
          this.scrollToCard();
          this.responsableFormEdit.reset(); 
          this.currentId = null;
        },
        err => {
          if (err.error.message === 'Error al actualizar el responsable') {
            this.showSnackbar('Usuario, teléfono, correo electrónico o matrícula repetidos');
          } else {
            this.showSnackbar('Error inesperado en la insersión.');
          }
        }
      );
    }
  }

  private showSnackbar(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000, 
      horizontalPosition: 'center', // Posición horizontal
      verticalPosition: 'bottom', // Posición vertical
    });
  }

  private scrollToCard(): void {
    const cardElement = document.getElementById('registros');
    if (cardElement) {
      cardElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  private scrollToEdit(): void {
    const formElement = document.getElementById('editForm');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  reset() {
    this.responsableFormEdit.reset();
    this.existingUsernameError = null;
    this.errorMessage = null;
  }

  private atLeastOneFieldRequired(controlNames: string[]): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const controls = controlNames.map(name => formGroup.get(name));
      const hasValue = controls.some(control => control?.value);
      
      if (!hasValue) {
        return { atLeastOneRequired: true };
      }
      return null;
    };
  }

}
