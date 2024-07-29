import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ResponsableService } from '../services/responsable.service';

@Injectable({
  providedIn: 'root'
})
export class RolWeGuard implements CanActivate {
  constructor(private responsableService: ResponsableService, private router: Router) {}

  canActivate(): boolean {
    const userRole = this.responsableService.getUserRole();
    if (userRole === 1 || userRole === 2 || userRole === 3 || userRole === 4) {
      return true;
    } else {
      this.router.navigate(['/ingresar']);
      return false;
    }
  }
}