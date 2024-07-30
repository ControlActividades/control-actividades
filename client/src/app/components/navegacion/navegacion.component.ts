import { Component, inject, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ResponsableService } from '../../services/responsable.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navegacion',
  templateUrl: './navegacion.component.html',
  styleUrl: './navegacion.component.css'
})
export class NavegacionComponent implements OnInit {
  private breakpointObserver = inject(BreakpointObserver);
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  userRole: number = 0;
  isLoggedIn$: Observable<boolean>;

  constructor(private responsableService: ResponsableService, private router: Router) {
    this.isLoggedIn$ = this.responsableService.loggedIn.asObservable();
    this.userRole = this.responsableService.getUserRole();
  }

  ngOnInit() {
    this.userRole = this.responsableService.getUserRole();
  }

  logout() {
    this.responsableService.logout();
    this.router.navigate(['/ingresar']);
  }

  canAccess(role: number[]): boolean {
    return role.includes(this.userRole);
  }
}
