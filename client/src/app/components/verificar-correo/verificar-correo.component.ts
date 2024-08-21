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
  token: string | null = null; 
  idResp: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private responsableService: ResponsableService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token');
    if (this.token) {
      this.responsableService.verificarToken(this.token).subscribe(
        resp => {
          console.log('Token verificado:', resp);
          this.idResp = resp.idResp;
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

  startCountdown() {
    const interval = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        clearInterval(interval);
        this.redirectToRecuperarContras();
      }
    }, 1000);
  }

  redirectToRecuperarContras(): void {
    if (this.idResp) {
      this.router.navigate(['/recuperar-contras', this.idResp]);
    } else {
      this.router.navigate(['/recuperar-contras']);
    }
  }
}
