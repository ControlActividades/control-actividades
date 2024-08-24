import { Component, AfterViewInit, HostListener } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Responsable } from '../../models/responsable';
import { RolService } from '../../services/rol.service';
import { ResponsableService } from '../../services/responsable.service';
import { Router } from '@angular/router';
import { Rol } from '../../models/Rol';
import { MatSnackBar } from '@angular/material/snack-bar';
import anime from 'animejs';
declare var particlesJS: any;


interface ControlLabels {
  [key: string]: string;
}
// Validador personalizado para evitar números en el campo
export function noNumbersValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const hasNumbers = /\d/.test(control.value);
    return hasNumbers ? { 'noNumbers': true } : null;
  };
}

export function capitalizeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value && !/^[A-Z]/.test(value)) {
      return { capitalize: true };
    }
    return null;
  };
}

export function passwordStrengthValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value || '';

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    const passwordValid = hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;

    return !passwordValid ? { passwordStrength: true } : null;
  };
}

export function specificValueAndNoUpperCase(control: AbstractControl): ValidationErrors | null {
  const validValue = "MrMexico2014";
  const regex = /^[a-z0-9!@#\$%\^\&*\)\(+=._-]+$/;  // Acepta minúsculas, números y caracteres especiales
  const value = control.value as string;

  // Si el valor es "MrMexico2014", es válido, independientemente de otras validaciones
  if (value === validValue) {
    return null;
  }

  // Verifica si el valor contiene alguna mayúscula o si no coincide con el patrón permitido
  if (/[A-Z]/.test(value) || !regex.test(value)) {
    return { noUpperCase: true };
  }

  // Si el valor no es válido según las reglas establecidas
  return null;
}

@Component({
  selector: 'app-ingresar',
  templateUrl: './ingresar.component.html',
  styleUrls: ['./ingresar.component.css']
})
export class IngresarComponent implements AfterViewInit {
  particulasActivadas: boolean = true; //desactivar particulas
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
      nombUsuario: ['', [Validators.required, Validators.maxLength(50),specificValueAndNoUpperCase]],
      contrasenia: ['', [Validators.required,
      Validators.maxLength(10),
      Validators.minLength(8),
      passwordStrengthValidator()
      ]],
      confContrasenia: ['', [Validators.required,
      Validators.maxLength(10),
      Validators.minLength(8),
      passwordStrengthValidator()
      ]],
      nombres: ['', [Validators.required, Validators.maxLength(50), noNumbersValidator(), capitalizeValidator()]],
      appPaterno: ['', [Validators.required, Validators.maxLength(50), noNumbersValidator(), capitalizeValidator()]],
      appMaterno: ['', [Validators.maxLength(50), noNumbersValidator(), capitalizeValidator()]],
      telefono: ['', [Validators.pattern('^[0-9]+$'), Validators.maxLength(10), Validators.minLength(10)]],
      correoElec: ['', [Validators.email, Validators.maxLength(260)]],
      numControl: ['', [Validators.maxLength(20), Validators.pattern('^[a-zA-Z0-9]+$')]],
      grupo: ['', [Validators.maxLength(20), Validators.pattern('^[A-Z]{3}[0-9]{4}$')]],
      idRoles: [2, Validators.required]
    }, { validator: [this.matchPasswords('contrasenia', 'confContrasenia'), this.conditionalValidator] });
    this.responsableForm.get('nombres')?.valueChanges.subscribe(value => this.capitalize(value, 'nombres'));
    this.responsableForm.get('appPaterno')?.valueChanges.subscribe(value => this.capitalize(value, 'appPaterno'));
    this.responsableForm.get('appMaterno')?.valueChanges.subscribe(value => this.capitalize(value, 'appMaterno'));
    this.responsableForm.get('grupo')?.valueChanges.subscribe(value => this.capitalizeGrup(value, 'grupo'));


    this.ingresarForm = this.fb.group({
      nombUsuario: ['', [Validators.required, Validators.maxLength(50),specificValueAndNoUpperCase]],
      contrasenia: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(10),passwordStrengthValidator()]]
    });
  }

  ngOnInit() {

    this.rolService.getRoles().subscribe(
      resp => {
        this.roles = resp.filter((rol: Rol) => rol.idRoles === 2); // Filtrar para mostrar solo el rol con id 2
      },
      err => console.error(err)
    );
    this.loadParticles();
  }

  loadParticles() {
    particlesJS.load('particles-js', 'assets/particles.json', null);
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
          } else if (err.error.message === 'El correo electrónico ya existe.') {
            this.existingUsernameError = err.error.message;
            this.errorMessage = 'Correo repetido';
            console.error('Correo');
          } else if (err.error.message === 'El número de control ya existe.') {
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
    this.initializeParticles()
  }
  initializeParticles(): void {
    if ((window as any).particlesJS) {
      (window as any).particlesJS.load('particles-js', 'assets/particles.json', function () {
        console.log('callback - particles.js config loaded');
      });
    } else {
      console.error('particlesJS is not defined');
    }
  }

  private initializeAnimation() {
    const container = document.getElementById('container');
    const registerBtn = document.getElementById('register');
    const registerBtn2 = document.getElementById('register2');
    const loginBtn = document.getElementById('login');


    if (container && registerBtn && loginBtn && registerBtn2) {
      registerBtn.addEventListener('click', () => {
        container.classList.add("active");
        this.responsableForm.reset();
      });

      loginBtn.addEventListener('click', () => {
        container.classList.remove("active");
        this.ingresarForm.reset();
      });
    }

    if (container) {
      anime({
        targets: container,
        opacity: [0, 1],
        duration: 1500,
        easing: 'easeInOutQuad'
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
      duration: 2000,
      panelClass: ['success-snackbar']
    });
  }

  ingresoExitoso() {
    this.snackBar.open('Ingreso completado con éxito', 'Cerrar', {
      duration: 2000,
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

  capitalize(value: string, controlName: string): void {
    const capitalizedValue = value
      .toLowerCase() // Convierte todo el texto a minúsculas primero
      .split(' ')    // Divide el texto en palabras
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitaliza la primera letra de cada palabra
      .join(' ');    // Une las palabras de nuevo en una cadena

    this.responsableForm.get(controlName)?.setValue(capitalizedValue, { emitEvent: false });
  }



  capitalizeGrup(value: string, controlName: string): void {
    const capitalizedValue = value.toUpperCase();
    this.responsableForm.get(controlName)?.setValue(capitalizedValue, { emitEvent: false });
  }

  getTooltipMessage(controlName: string): string {
    const control = this.responsableForm.get(controlName);
    const ingresar = this.ingresarForm.get(controlName);
    if (control && control.invalid && control.touched) {
      const labels: ControlLabels = {
        contrasenia: 'Contraseña',
        confContrasenia: 'Confirmación de contraseña',
        nombUsuario: 'Usuario',
        nombres: 'Nombre',
        appPaterno: 'Apellido paterno',
        appMaterno: 'Apellido materno',
        telefono: 'Teléfono',
        correoElec: 'Correo electrónico',
        numControl: 'Matrícula',
        grupo: 'Grupo'
      };

      const label = labels[controlName] || controlName; // Aquí se asegura de que nunca sea undefined

      if (control.errors?.['required']) {
        return `${label} es obligatorio.`;
      } else if (control.errors?.['minlength']) {
        return `La longitud de ${label} debe ser al menos ${control.errors['minlength'].requiredLength} caracteres.`;
      } else if (control.errors?.['maxlength']) {
        return `La longitud de ${label} no debe superar los ${control.errors['maxlength'].requiredLength} caracteres.`;
      } else if (control.errors?.['pattern']) {
        return `El formato de ${label} es incorrecto.`;
      }
    }

    if (ingresar && ingresar.invalid && ingresar.touched) {
      const labels: ControlLabels = {
        contrasenia: 'Contraseña',
        nombUsuario: 'Usuario',
        
      };

      const label = labels[controlName] || controlName; // Aquí se asegura de que nunca sea undefined

      if (ingresar.errors?.['required']) {
        return `${label} es obligatorio.`;
      } else if (ingresar.errors?.['minlength']) {
        return `La longitud de ${label} debe ser al menos ${ingresar.errors['minlength'].requiredLength} caracteres.`;
      } else if (ingresar.errors?.['maxlength']) {
        return `La longitud de ${label} no debe superar los ${ingresar.errors['maxlength'].requiredLength} caracteres.`;
      } else if (ingresar.errors?.['pattern']) {
        return `El formato de ${label} es incorrecto.`;
      }
    }
    return '';
  }

  //limpiar formulario
  limpiar() {
    this.responsableForm.reset();
    this.errMessage = null;
    this.existingUsernameError = null;
    this.errorMessage = null;
    this.passwordVisible = false;
    this.passwordVisibleIngresar = false;
  }

  toggleParticulas() {
    const particlesContainer = document.getElementById('particles-js');

    if (this.particulasActivadas) {
      if (particlesContainer) {
        particlesContainer.style.display = 'none'; // Oculta el contenedor de partículas
        this.router.navigate(['/ingresar']);
      }
    } else {
      if (particlesContainer) {
        particlesContainer.style.display = 'block'; // Muestra el contenedor de partículas
      } else {
        this.loadParticles(); // Vuelve a cargar las partículas si el contenedor no existe
      }
    }

    this.particulasActivadas = !this.particulasActivadas; // Cambia el estado
  }





}
