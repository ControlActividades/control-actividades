import { Component, AfterViewInit, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Responsable } from '../../models/Responsable';
import { RolService } from '../../services/rol.service';
import { ResponsableService } from '../../services/responsable.service';
import { Router } from '@angular/router';

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
    private fb: FormBuilder
  ) {
    this.responsableForm = this.fb.group({
      nombUsuario: ['', Validators.required],
      contrasenia: ['', Validators.required],
      confContrasenia: ['', Validators.required],
      nombres: ['', Validators.required],
      appPaterno: ['', Validators.required],
      appMaterno: [''],
      telefono: [''],
      correoElec: [''],
      numControl: ['', Validators.required],
      grupo: ['', Validators.required],
      idRoles: ['']
    });
    this.ingresarForm = this.fb.group({
      nombUsuario: [''],
      contrasenia: ['']
    });
  }

  ngOnInit() {
    this.rolService.getRoles().subscribe(
      resp => {
        this.roles = resp;
      },
      err => console.error(err)
    );
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
        },
        err => console.log(err)
      );
    }
  }

  searchResponsable() {
    const nombUsuario = this.ingresarForm.get('nombUsuario')?.value;
    const contrasenia = this.ingresarForm.get('contrasenia')?.value;

    if (nombUsuario && contrasenia) {
      this.responsableService.login(nombUsuario, contrasenia).subscribe(
        user => {
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
        error => {
          this.errMessage = 'Usuario o contraseña incorrectos';
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
    const video = document.getElementById('background-video') as HTMLVideoElement;

    if (video) {
      video.playbackRate = .37 // Slow down the video
    }

    if (container && registerBtn && loginBtn && registerBtn2) {
      registerBtn.addEventListener('click', () => {
        container.classList.add("active");
      });

      loginBtn.addEventListener('click', () => {
        container.classList.remove("active");
      });

      registerBtn2.addEventListener('click', () => {
        container.classList.remove("active");
      });
    }
  }

  private adjustForScreenSize() {
    const container = document.getElementById('container');

    if (container) {
      if (window.innerWidth <= 789) {
        container.classList.remove('active'); // Disable the animation for smaller screens
      }
    }
  }

  

}
