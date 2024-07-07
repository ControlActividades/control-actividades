import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NavigationComponent } from './components/navigation/navigation.component';
import { ReservacionesComponent } from './components/reservaciones/reservaciones.component';
import { ReglamentoComponent } from './components/reglamento/reglamento.component';
import { IngresarComponent } from './components/ingresar/ingresar.component';
import { RecuperarContrasComponent } from './components/recuperar-contras/recuperar-contras.component';
import { NuevoUsuarioComponent } from './components/nuevo-usuario/nuevo-usuario.component';
import { SuguerenciasQuejasComponent } from './components/suguerencias-quejas/suguerencias-quejas.component';
import { OficiosReservasComponent } from './components/oficios-reservas/oficios-reservas.component';
import { AdministrarReservasComponent } from './components/administrar-reservas/administrar-reservas.component';
import { ContratoComponent } from './components/contrato/contrato.component';
import { ReservanosComponent } from './components/reservanos/reservanos.component';
import { FooterComponent } from './components/footer/footer.component';
import { RegistrosComponent } from './components/registros/registros.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { NavegacionComponent } from './components/navegacion/navegacion.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    ReservacionesComponent,
    ReglamentoComponent,
    IngresarComponent,
    RecuperarContrasComponent,
    NuevoUsuarioComponent,
    SuguerenciasQuejasComponent,
    OficiosReservasComponent,
    AdministrarReservasComponent,
    ContratoComponent,
    ReservanosComponent,
    FooterComponent,
    RegistrosComponent,
    NavegacionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
