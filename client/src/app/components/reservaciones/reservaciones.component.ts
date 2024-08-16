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
  displayedColumns: string[] = ['horaInicio', 'horaFin', 'fecha', 'razon', 'areaUsar', 'estado', 'acciones'];
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

  openConfirmDialog(idReserva: string): void {
    const dialogRef = this.dialog.open(ConfirmDeleteComponent, {
      data: {
        message: '¿Estás seguro de que deseas eliminar esta reserva?'
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteReserva(idReserva);
      }
    });
  }
  deleteReserva(idReserva: string) {
    this.reservaService.deleteReserva(idReserva).subscribe(
      resp => {
        console.log(resp);
        this.getReservas();
      },
      err => console.log(err)
    );
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
