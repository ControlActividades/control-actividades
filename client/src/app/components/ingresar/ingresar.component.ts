import { Component, AfterViewInit, HostListener } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Responsable } from '../../models/Responsable';
import { RolService } from '../../services/rol.service';
import { ResponsableService } from '../../services/responsable.service';
import { Router } from '@angular/router';
import { Rol } from '../../models/Rol';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-ingresar',
  templateUrl: './ingresar.component.html',
  styleUrls: ['./ingresar.component.css']
})
export class IngresarComponent implements AfterViewInit {
  responsableForm: FormGroup;
  ingresarForm: FormGroup;
  errMessage: string | null = null;
  roles: any = [];
  existingUsernameError: string | null = null;
  errorMessage: string | null = null;
  passwordVisible: boolean = false;
  passwordVisibleIngresar: boolean = false;


  responsable: Responsable = {
    idResp: 0,
    nombUsuario: '',
    contrasenia: '',
    nombres: '',
    appPaterno: '',
    appMaterno: '',
    telefono: '',
    correoElec: '',
    numControl: '',
    grupo: '',
    idRoles: 0
  };



  constructor(
    private rolService: RolService,
    private responsableService: ResponsableService,
    private router: Router,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.responsableForm = this.fb.group({
      nombUsuario: ['', [Validators.required, Validators.maxLength(50)]],
      contrasenia: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(8)]],
      confContrasenia: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(8)]],
      nombres: ['', [Validators.required, Validators.maxLength(50)]],
      appPaterno: ['', [Validators.required, Validators.maxLength(20)]],
      appMaterno: ['', [Validators.maxLength(20)]],
      telefono: ['', [Validators.pattern('^[0-9]+$'), Validators.maxLength(10), Validators.minLength(10)]],
      correoElec: ['', [Validators.email, Validators.maxLength(260)]],
      numControl: ['', Validators.maxLength(20)],
      grupo: ['', [Validators.maxLength(20), Validators.pattern('^[A-Z]{3}[0-9]{4}$')]],
      idRoles: [2, Validators.required]
    },  { validator: [this.matchPasswords('contrasenia', 'confContrasenia'), this.conditionalValidator] });
    
    this.ingresarForm = this.fb.group({
      nombUsuario: ['', [Validators.required, Validators.maxLength(50)]],
      contrasenia: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(10)]]
    });
  }

  ngOnInit() {
    this.rolService.getRoles().subscribe(
      resp => {
        this.roles = resp;
      },
      err => console.error(err)
    );
    this.rolService.getRoles().subscribe(
      resp => {
        this.roles = resp.filter((rol: Rol) => rol.idRoles === 2); // Filtrar para mostrar solo el rol con id 2
      },
      err => console.error(err)
    );
  }

  conditionalValidator(formGroup: FormGroup): ValidationErrors | null {
    const correoElec = formGroup.get('correoElec')?.value;
    const telefono = formGroup.get('telefono')?.value;
  
    if (!correoElec && !telefono) {
      return { bothRequired: true };
    }
  
    return null;
  }

  saveResponsable(): void {
    if (this.responsableForm.valid) {
      const responsable: Responsable = {
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
          this.registroExitoso();
          this.responsableForm.reset();
        },
        err => {
          if (err.error.message === 'El nombre de usuario ya existe.') {
            this.existingUsernameError = err.error.message; 
            this.errorMessage = 'Usuario repetido';
            console.error('Usaurio');
          } else if (err.error.message === 'El teléfono ya existe.') {
            this.existingUsernameError = err.error.message; 
            this.errorMessage = 'Telefono repetido';
            console.error('Telefono');
          }else if (err.error.message === 'El correo electrónico ya existe.') {
            this.existingUsernameError = err.error.message; 
            this.errorMessage = 'Correo repetido';
            console.error('Correo');
          }else if (err.error.message === 'El número de control ya existe.') {
            this.existingUsernameError = 'La matrícula ya existe.'; 
            this.errorMessage = 'Matrícula repetido';
            console.error('MAtrícula');
          } else {
            this.errorMessage = 'Error inesperado en la insersión.';
            this.existingUsernameError = null;
          }
        }
      );
    }
  }
  


  searchResponsable() {
    const nombUsuario = this.ingresarForm.get('nombUsuario')?.value;
    const contrasenia = this.ingresarForm.get('contrasenia')?.value;

    if (nombUsuario && contrasenia) {
      this.responsableService.login(nombUsuario, contrasenia).subscribe(
        () => {
          this.ingresoExitoso();
          this.errMessage = null;
          const userRole = this.responsableService.getUserRole();
          if (userRole === 4) { // Ruta para boss
            this.router.navigate(['/inicio/inicio']);
          } else if (userRole === 1) {
            this.router.navigate(['/inicio/inicio']); // Ruta para administradores
          } else if (userRole === 2) {
            this.router.navigate(['/inicio/inicio']); // Ruta para usuarios usuarios
          } else if (userRole === 3) {
            this.router.navigate(['/inicio/inicio']); // Ruta externos
          } else {
            this.router.navigate(['/inicio/inicio']); // Ruta por defecto
          }
        },
        () => {
          this.errMessage = 'Usuario o contraseña incorrectos';
          this.ingresoFallido();
        }
      );
    } else {
      this.router.navigate(['/inicio/inicio']);
    }
  }

  @HostListener('window:resize')
  onResize() {
    this.adjustForScreenSize();
  }

  ngAfterViewInit(): void {
    this.initializeAnimation();
    this.adjustForScreenSize(); // Adjust on initial load
  }

  private initializeAnimation() {
    const container = document.getElementById('container');
    const registerBtn = document.getElementById('register');
    const registerBtn2 = document.getElementById('register2');
    const loginBtn = document.getElementById('login');


    if (container && registerBtn && loginBtn && registerBtn2) {
      registerBtn.addEventListener('click', () => {
        container.classList.add("active");
      });

      loginBtn.addEventListener('click', () => {
        container.classList.remove("active");
      });
    }
  }

  private adjustForScreenSize() {
    const container = document.getElementById('container');

    if (container) {
      if (window.innerWidth <= 789) {
        container.classList.remove('active'); 
      }
    }
  }

  private matchPasswords(passwordKey: string, confirmPasswordKey: string): ValidatorFn {
    return (formGroup: AbstractControl): { [key: string]: any } | null => {
      const password = formGroup.get(passwordKey);
      const confirmPassword = formGroup.get(confirmPasswordKey);
  
      if (password && confirmPassword && password.value !== confirmPassword.value) {
        return { 'passwordMismatch': true };
      }
      return null;
    };
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;

  }

  togglePasswordVisibilityIngresar() {
    this.passwordVisibleIngresar = !this.passwordVisibleIngresar;

  }

  registroExitoso() {
    this.snackBar.open('Registro completado con éxito', 'Cerrar', {
      duration: 3000,
      panelClass: ['success-snackbar'] 
    });
  }

  ingresoExitoso() {
    this.snackBar.open('Ingreso completado con éxito', 'Cerrar', {
      duration: 3000,
      panelClass: ['success-snackbar'],
      horizontalPosition: 'center', 
      verticalPosition: 'top', 
    });
  }

  ingresoFallido() {
    this.snackBar.open('Ingreso completado sin éxito', 'OK', {
      duration: 3000,
      panelClass: ['info-snackbar']
    });
  }


}
