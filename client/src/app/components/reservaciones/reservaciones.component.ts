import { Component, ViewChild, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ReservasService } from '../../services/reservas.service';
import { ResponsableService } from '../../services/responsable.service';

@Component({
  selector: 'app-reservaciones',
  templateUrl: './reservaciones.component.html',
  styleUrls: ['./reservaciones.component.css']
})
export class ReservacionesComponent {
  displayedColumns: string[] = ['horaInicio', 'horaFin', 'razon', 'areaUsar', 'estado', 'acciones'];
  dataSource!: MatTableDataSource<any>;

  reservas : any[] | undefined;
  @Input() tabGroup: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort; // ViewChild para MatSort
  userRole: number = 0;
  userId: number = 0; // Agregado para almacenar el idResp del usuario
  constructor(private reservaService : ReservasService,private responsableService: ResponsableService) { }

  ngOnInit() {
    this.getReservas();
    this.reservaService.refresh$.subscribe(() => this.getReservas());
    this.userRole = this.responsableService.getUserRole(); //Rol de responsable
    this.userId = this.responsableService.getUserId(); // idResp del usuario
  }

  ngAfterViewInit() {
    // Verifica si dataSource está definido antes de asignar paginator y sort
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
        this.dataSource = new MatTableDataSource(resp);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      err => console.error(err)
    );
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

//seguridad de edicion de reservas
canEdit(): boolean {
  const allowedRoles = [1, 4]; // Definir los roles que pueden editar
  return allowedRoles.includes(this.userRole);
}

canDelete(reservaIdResp: number): boolean {
  const adminRole = 1; // Rol de administrador
  return this.userRole === adminRole || reservaIdResp === this.userId;
}

}
