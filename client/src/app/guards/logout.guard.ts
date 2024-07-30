import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ResponsableService } from '../services/responsable.service';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {
  constructor(private responsableService: ResponsableService, private router: Router) {}

  canActivate(): boolean {
    if (!this.responsableService.isLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['/ingresar']);
      return false;
    }
  }
}