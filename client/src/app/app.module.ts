import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Angular Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';

// Angular Forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// HTTP
import { HttpClientModule } from '@angular/common/http';

// Components
import { ReservacionesComponent } from './components/reservaciones/reservaciones.component';
import { ReglamentoComponent } from './components/reglamento/reglamento.component';
import { IngresarComponent } from './components/ingresar/ingresar.component';
import { RecuperarContrasComponent } from './components/recuperar-contras/recuperar-contras.component';
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
import { VerEdificiosComponent } from './components/ver-edificios/ver-edificios.component';
import { VerRolesComponent } from './components/ver-roles/ver-roles.component';
import { AdminEdificiosComponent } from './components/admin-edificios/admin-edificios.component';
import { AdminRolesComponent } from './components/admin-roles/admin-roles.component';
import { EdificiosComponent } from './components/edificios/edificios.component';
import { RolesComponent } from './components/roles/roles.component';

// Services
import { ReservasService } from './services/reservas.service';
import { ResponsableService } from './services/responsable.service';
import { EdificioService } from './services/edificio.service';
import { OficioService } from './services/oficio.service';
import { RolService } from './services/rol.service';

// Common Module
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { CustomMatPaginatorIntl } from './utilMaterial/CustomMatPaginatorIntl ';
import { AscensoComponent } from './components/ascenso/ascenso.component';
import { DateFormatPipe } from './date-format.pipe';
import { ConfirmDeleteComponent } from './components/confirm-delete/confirm-delete.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { CuatroCeroCuatroComponent } from './components/cuatro-cero-cuatro/cuatro-cero-cuatro.component';
import { VerificarCorreoComponent } from './components/verificar-correo/verificar-correo.component';



@NgModule({
  declarations: [
    AppComponent,
    ReservacionesComponent,
    ReglamentoComponent,
    IngresarComponent,
    RecuperarContrasComponent,
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
    EdificiosComponent,
    AdminEdificiosComponent,
    VerEdificiosComponent,
    RolesComponent,
    AdminRolesComponent,
    VerRolesComponent,
    AscensoComponent,
    DateFormatPipe,
    ConfirmDeleteComponent,
    ConfirmDialogComponent,
    CuatroCeroCuatroComponent,
    VerificarCorreoComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
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
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    MatSelectModule,
    MatSnackBarModule,
    MatDialogModule,
    MatMenuModule,
    MatTooltipModule,
    MatProgressBarModule
  ],
  providers: [
    ReservasService,
    ResponsableService,
    EdificioService,
    OficioService,
    RolService,
    { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntl }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
