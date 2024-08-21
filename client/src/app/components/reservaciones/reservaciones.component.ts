import { Component, ViewChild, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ReservasService } from '../../services/reservas.service';
import { ResponsableService } from '../../services/responsable.service';
import { ConfirmDeleteComponent } from '../confirm-delete/confirm-delete.component';
// Importa el componente de diálogo

@Component({
  selector: 'app-reservaciones',
  templateUrl: './reservaciones.component.html',
  styleUrls: ['./reservaciones.component.css']
})
export class ReservacionesComponent {
  displayedColumns: string[] = ['horaInicio', 'horaFin', 'fecha', 'razon', 'areaUsar', 'estado','proximidad', 'acciones'];
  dataSource!: MatTableDataSource<any>;

  reservas: any[] | undefined;
  @Input() tabGroup: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  userRole: number = 0;
  userId: number = 0;

  constructor(
    private reservaService: ReservasService,
    private responsableService: ResponsableService,
    public dialog: MatDialog // Inyecta MatDialog
  ) { }

  ngOnInit() {
    this.getReservas();
    this.reservaService.refresh$.subscribe(() => this.getReservas());
    this.userRole = this.responsableService.getUserRole();
    this.userId = this.responsableService.getUserId();
  }

  ngAfterViewInit() {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'estado':
          return this.getEstadoOrderValue(item.estado);
        default:
          return item[property];
      }
    };

    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'proximidad':
          return this.getEstadoOrderValue(item.estado);
        default:
          return item[property];
      }
    };
  }

  getEstadoOrderValue(estado: string): number {
    switch (estado) {
      case 'Aceptado': return 1;
      case 'Rechazado': return 2;
      case 'Error': return 3;
      default: return 4;
    }
  }

  getEstadoOrderValueP(estado: string): number {
    switch (estado) {
      case 'Aceptado': return 1;
      case 'Rechazado': return 2;
      case 'Error': return 3;
      default: return 4;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getReservas() {
    this.reservaService.getReservas().subscribe(
      resp => {
        const reservasPersonalizadas = resp.map(reserva => ({
          ...reserva,
          areaUsar: this.mapAreaUsar(reserva.areaUsar || '')
        }));
        this.dataSource = new MatTableDataSource(reservasPersonalizadas);
        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }
        if (this.sort) {
          this.dataSource.sort = this.sort;
        }
      },
      err => console.error(err)
    );
  }

  // Función para calcular la proximidad y devolver un texto
  calculateProximityText(reservaFecha: string, estado: string): string {
    if (estado) {
      return ''; // Retorna una cadena vacía si el estado tiene un valor
    }
  
    const fechaReserva = new Date(reservaFecha);
    const fechaActual = new Date();
  
    const diferencia = fechaReserva.getTime() - fechaActual.getTime();
    const diasDiferencia = Math.ceil(diferencia / (1000 * 3600 * 24));
  
    if (diasDiferencia <= 2) {
      return 'Improbable';
    } else if (diasDiferencia > 2 && diasDiferencia <= 7) {
      return 'Poco probable';
    } else {
      return 'Probable';
    }
  }
  // Función para determinar el color basado en la proximidad
  getProximityColor(proximityText: string): string {
    switch (proximityText) {
      case 'Improbable':
        return 'red';
      case 'Poco probable':
        return 'orange';
      case 'Probable':
        return 'green';
      default:
        return 'black'; // Color por defecto si no coincide ninguna condición
    }
  }
  updateReservaEstado(idReserva: string, estado: string) {
    this.reservaService.updateReserva(idReserva, { estado }).subscribe(
      resp => {
        console.log(resp);
        this.getReservas();
      },
      err => console.log(err)
    );
  }
  
  openConfirmDialog(idReserva: string): void {
    const dialogRef = this.dialog.open(ConfirmDeleteComponent, {
      data: {
        message: '¿Estás seguro de que deseas marcar esta reserva como "Error"?'
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateReservaEstado(idReserva, 'Error');
      }
    });
  }
  

  canEdit(): boolean {
    const allowedRoles = [1, 4];
    return allowedRoles.includes(this.userRole);
  }

  canDelete(reservaIdResp: number): boolean {
    const adminRole = 1;
    return this.userRole === adminRole || reservaIdResp === this.userId;
  }

  mapAreaUsar(area: string): string {
    switch (area) {
      case 'danzaFolclorica':
        return 'Danza Folclórica';
      case 'taekwando':
        return 'Taekwando';
      case 'baloncestoVoleibol':
        return 'Baloncesto y Voleibol';
      case 'ajedrez':
        return 'Ajedrez';
      default:
        return 'Área desconocida';
    }
  }
}
