import { Component, ElementRef, HostBinding, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ResponsableService } from '../../services/responsable.service';
import { RolService } from '../../services/rol.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    private snackBar: MatSnackBar
  ) {
    this.responsableFormEdit = this.fb.group({
      nombUsuario: ['', [Validators.required, Validators.maxLength(50)]],
      nombres: ['', [Validators.required, Validators.maxLength(50), Validators.pattern('^[A-Za-zÁÉÍÓÚÑáéíóúñ]+( [A-Za-zÁÉÍÓÚÑáéíóúñ]+)*$')]],
      appPaterno: ['', [Validators.required, Validators.maxLength(50), Validators.pattern('^[A-Za-zÁÉÍÓÚÑáéíóúñ ]+$')]],
      appMaterno: ['', [Validators.maxLength(50), Validators.pattern('^[A-Za-zÁÉÍÓÚÑáéíóúñ ]*$')]],
      telefono: ['', [Validators.pattern('^[0-9]+$'), Validators.maxLength(10), Validators.minLength(10)]],
      correoElec: ['', [Validators.email, Validators.maxLength(260)]],
      numControl: ['', [Validators.maxLength(20)]],
      grupo: ['', [Validators.maxLength(20), Validators.pattern('^[A-Z]{3}[0-9]{4}$')]],
      idRoles: ['', Validators.required]
    });
  }
  formatText(value: string, controlName: string): void {
    // Eliminar números y formatear el texto
    const formattedValue = value
      .replace(/\d/g, '') // Remove numbers
      .toLowerCase() // Convert all to lowercase first
      .replace(/\b\w/g, char => char.toUpperCase()); // Capitalize the first letter of each word

    // Update the form control value without triggering validation errors
    this.responsableFormEdit.get(controlName)?.setValue(formattedValue, { emitEvent: false });
  }

  getErrorMessage(controlName: string): string | null {
    const control = this.responsableFormEdit.get(controlName);
    if (control?.hasError('required')) {
      return 'Este campo es obligatorio';
    }
    if (control?.hasError('maxlength')) {
      return `El valor no puede tener más de ${control.errors?.['maxlength'].requiredLength} caracteres`;
    }
    if (control?.hasError('minlength')) {
      return `El valor debe tener al menos ${control.errors?.['minLength'].requiredLength} caracteres`;
    }
    if (control?.hasError('pattern')) {
      return 'Formato inválido';
    }
    if (control?.hasError('email')) {
      return 'Correo electrónico inválido';
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
        this.responsables = resp;
        this.dataSource = new MatTableDataSource(resp);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      err => console.error(err)
    );
  }

  getRoles() {
    this.rolService.getRoles().subscribe(
      resp => {
        this.roles = resp;
      },
      err => console.error(err)
    );
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

}
