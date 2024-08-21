import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReservacionesComponent } from './components/reservaciones/reservaciones.component';
import { IngresarComponent } from './components/ingresar/ingresar.component';
import { AdministrarReservasComponent } from './components/administrar-reservas/administrar-reservas.component';
import { OficiosReservasComponent } from './components/oficios-reservas/oficios-reservas.component';
import { RecuperarContrasComponent } from './components/recuperar-contras/recuperar-contras.component';
import { SuguerenciasQuejasComponent } from './components/suguerencias-quejas/suguerencias-quejas.component';
import { RegistrosComponent } from './components/registros/registros.component';
import { NavegacionComponent } from './components/navegacion/navegacion.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { ReservasComponent } from './components/reservas/reservas.component';
import { EdificiosComponent } from './components/edificios/edificios.component';
import { RolesComponent } from './components/roles/roles.component';
import { AdminEdificiosComponent } from './components/admin-edificios/admin-edificios.component';
import { AdminRolesComponent } from './components/admin-roles/admin-roles.component';

import { RolUnoGuard } from './guards/rol-uno.guard';
import { RolWeGuard } from './guards/we.guard';
import { RolBossGuard } from './guards/boss.guard';
import { RolDosGuard } from './guards/rol-dos.guard';
import { NoAuthGuard } from './guards/logout.guard';
import { ContratoComponent } from './components/contrato/contrato.component';
import { CuatroCeroCuatroComponent } from './components/cuatro-cero-cuatro/cuatro-cero-cuatro.component';
import { VerificarCorreoComponent } from './components/verificar-correo/verificar-correo.component';

const routes: Routes = [
  { path: '', redirectTo: '/inicio/inicio', pathMatch: 'full' },
  {
    path: 'inicio',
    component: NavegacionComponent,
    children: [
      { path: 'inicio', component: InicioComponent },
      { path: 'administrar-reservaciones/:idReserva', component: AdministrarReservasComponent,canActivate: [RolUnoGuard] },
      { path: 'oficios-reservas', component: OficiosReservasComponent, canActivate: [RolWeGuard, RolDosGuard] },
      { path: 'oficios-reservas/edit/:idReserva', component: OficiosReservasComponent, canActivate: [RolWeGuard, RolDosGuard] },
      { path: 'sugerencias-quejas', component: CuatroCeroCuatroComponent },
      { path: 'reservaciones', component: ReservacionesComponent, canActivate : [NoAuthGuard] },
      { path: 'reservas', component: ReservasComponent, canActivate: [RolDosGuard] },
      { path: 'registros', component: RegistrosComponent, canActivate: [RolUnoGuard] },
      { path: 'registros/:idResp', component: RegistrosComponent, canActivate: [RolBossGuard] },
      { path: 'edificios', component: EdificiosComponent, canActivate: [RolUnoGuard] },
      { path: 'edificio/edit/:idEdificio', component: AdminEdificiosComponent, canActivate: [RolUnoGuard] },
      { path: 'roles', component: RolesComponent, canActivate: [RolBossGuard] },
      { path: 'contrato', component: ContratoComponent },
      { path: 'roles/edit/:idRoles', component: AdminRolesComponent, canActivate: [RolBossGuard] }
    ]
  },
  { path: 'ingresar', component: IngresarComponent },
  { path: 'recuperar-contras', component: RecuperarContrasComponent },
  { path: 'recuperar-contras/:idResp', component: RecuperarContrasComponent },
  { path: 'verificar-correo/:token', component: VerificarCorreoComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
