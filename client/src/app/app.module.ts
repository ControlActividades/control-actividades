import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
//material angular
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';


//imports componentes
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
import { NavegacionComponent } from './components/navegacion/navegacion.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { ReservasComponent } from './components/reservas/reservas.component';

//imports sErvicios
import { ReservasService } from './services/reservas.service';
import { ResponsableService } from './services/responsable.service';
import { EdificioService } from './services/edificio.service';
import { OficioService } from './services/oficio.service';
import { RolService } from './services/rol.service';

//backend
import { HttpClientModule } from '@angular/common/http';
import { VerEdificiosComponent } from './components/ver-edificios/ver-edificios.component';
import { VerRolesComponent } from './components/ver-roles/ver-roles.component';
import { AdminEdificiosComponent } from './components/admin-edificios/admin-edificios.component';
import { AdminRolesComponent } from './components/admin-roles/admin-roles.component';
import { EdificiosComponent } from './components/edificios/edificios.component';
import { RolesComponent } from './components/roles/roles.component';



@NgModule({
  declarations: [
    AppComponent,
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
    NavegacionComponent,
    InicioComponent,
    ReservasComponent,
    VerEdificiosComponent,
    VerRolesComponent,
    AdminEdificiosComponent,
    AdminRolesComponent,
    EdificiosComponent,
    RolesComponent
  ],
  imports: [
    //browser
    BrowserAnimationsModule,
    BrowserModule,

    //routing
    AppRoutingModule,

    //Material
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatTabsModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule, 
    MatInputModule, 
    MatTableModule, 
    MatSortModule, 
    MatPaginatorModule,
    FormsModule,
    ReactiveFormsModule,

    //backend
    HttpClientModule
  ],
  providers: [
    provideAnimationsAsync(),
    ReservasService,
    ResponsableService,
    EdificioService,
    OficioService,
    RolService    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
