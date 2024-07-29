import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ResponsableService } from '../services/responsable.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private responsableService: ResponsableService, private router: Router) {}

  canActivate(): boolean {
    const userRole = this.responsableService.getUserRole();
    if (userRole === 1 || userRole === 2) {
      return true;
    } else {
      this.router.navigate(['/']);
     
      return false;
    }
  }
}