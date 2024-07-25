import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReservacionesComponent } from './components/reservaciones/reservaciones.component';
import { ReservanosComponent } from './components/reservanos/reservanos.component';
import { IngresarComponent } from './components/ingresar/ingresar.component';
import { AdministrarReservasComponent } from './components/administrar-reservas/administrar-reservas.component';
import { NuevoUsuarioComponent } from './components/nuevo-usuario/nuevo-usuario.component';
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

const routes: Routes = [
  {
    path: '',
    redirectTo: '/inicio/inicio',
    pathMatch: 'full'
  },
   
  {
    path: 'inicio',
    component: NavegacionComponent,
    children: [
      { path: 'inicio', component: InicioComponent },
      { path: 'reservanos', component: ReservanosComponent },
      { path: 'reservaciones', component: ReservacionesComponent },
      { path: 'administrar-reservaciones', component: AdministrarReservasComponent },
      { path: 'oficios-reservas', component: OficiosReservasComponent },
      { path: 'sugerencias-quejas', component: SuguerenciasQuejasComponent },
      { path: 'registros', component: RegistrosComponent },
      { path: 'reservas', component: ReservasComponent },
      //edificios
      { path: 'edificios', component: EdificiosComponent },
      { path: 'edificio/edit/:idEdificio', component: AdminEdificiosComponent },
      //roles
      { path: 'roles', component: RolesComponent },
      { path: 'roles/edit/:idRoles', component: AdminRolesComponent }
    ]
  },
  { path: 'ingresar', component: IngresarComponent },
  { path: 'recuperar-contras', component: RecuperarContrasComponent },
  { path: 'nuevo-usuario', component: NuevoUsuarioComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
