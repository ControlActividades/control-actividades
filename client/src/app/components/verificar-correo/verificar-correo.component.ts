import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponsableService } from '../../services/responsable.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-verificar-correo',
  templateUrl: './verificar-correo.component.html',
  styleUrls: ['./verificar-correo.component.css']
})
export class VerificarCorreoComponent implements OnInit {
  showProgressBar = true; 
  redirectDelay = 5000;
  countdown: number = this.redirectDelay / 1000;
  verificationMessage: string = 'Verificando correo...';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private responsableService: ResponsableService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.paramMap.get('token');
    if (token) {
      this.responsableService.verificarToken(token).subscribe(
        resp => {
          console.log('Token verificado:', resp);
          this.verificationMessage = 'Correo verificado, puedes continuar';

          this.snackBar.open(this.verificationMessage, 'Cerrar', {
            duration: 2000,
            panelClass: ['success-snackbar']
          });

          this.responsableService.setUsuarioEncontrado(true);

          this.startCountdown();
        },
        err => {
          console.error('Error al verificar el token:', err);
          this.verificationMessage = 'Token inválido o expirado';

          this.snackBar.open(this.verificationMessage, 'Cerrar', {
            duration: 2000,
            panelClass: ['error-snackbar']
          });
          this.startCountdown();
        }
      );
    }
  }

  startCountdown(): void {
    const interval = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        clearInterval(interval);
        this.redirectToRecuperarContras();
      }
    }, 1000);
  }

  redirectToRecuperarContras(): void {
    this.router.navigate(['/recuperar-contras']);
  }
}
