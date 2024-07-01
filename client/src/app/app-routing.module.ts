import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReservacionesComponent } from './components/reservaciones/reservaciones.component';
import { ContratoComponent } from './components/contrato/contrato.component';
import { ReservanosComponent } from './components/reservanos/reservanos.component';
import { ReglamentoComponent } from './components/reglamento/reglamento.component';
import { IngresarComponent } from './components/ingresar/ingresar.component';
import { AdministrarReservasComponent } from './components/administrar-reservas/administrar-reservas.component';
import { NuevoUsuarioComponent } from './components/nuevo-usuario/nuevo-usuario.component';
import { OficiosReservasComponent } from './components/oficios-reservas/oficios-reservas.component';
import { RecuperarContrasComponent } from './components/recuperar-contras/recuperar-contras.component';
import { SuguerenciasQuejasComponent } from './components/suguerencias-quejas/suguerencias-quejas.component';
import { RegistrosComponent } from './components/registros/registros.component';


const routes: Routes = [
  {
    path : '',
    redirectTo : '/ingresar' ,
    pathMatch : 'full'
  },
  {
    path : 'reservaciones',
    component :  ReservacionesComponent
  },
  {
    path : 'contrato',
    component :  ContratoComponent
    
  },
  {
    path : 'reservanos',
    component :  ReservanosComponent
    
  },
  {
    path : 'reglamento',
    component :  ReglamentoComponent
    
  },
  {
    path : 'ingresar',
    component :  IngresarComponent
    
  },
  {
    path : 'administrar-reservaciones',
    component :  AdministrarReservasComponent
    
  },
  {
    path : 'nuevo-usuario',
    component :  NuevoUsuarioComponent
    
  } ,
  {
    path : 'oficios-reservas',
    component :  OficiosReservasComponent
    
  } ,
  {
    path : 'recuperar-contras',
    component :  RecuperarContrasComponent
    
  } ,
  {
    path : 'sugerencias-quejas',
    component :  SuguerenciasQuejasComponent
    
  },
  {
    path : 'registros',
    component :  RegistrosComponent
    
  }
  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
