import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort'; // Importa MatSort

@Component({
  selector: 'app-reservaciones',
  templateUrl: './reservaciones.component.html',
  styleUrls: ['./reservaciones.component.css']
})
export class ReservacionesComponent implements AfterViewInit {
  displayedColumns: string[] = ['horaInicio', 'horaTermino', 'razonUso', 'areaUsar', 'estado', 'acciones'];
  dataSource: MatTableDataSource<any>;
  input: string = ''; // Propiedad para el filtro

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort; // ViewChild para MatSort

  constructor() {
    // Ejemplo de datos estáticos
    const reservaciones = [
      { horaInicio: '09:00 AM', horaTermino: '10:00 AM', razonUso: 'Reunión de equipo', areaUsar: 'Sala A', estado: 'Aprobada' },
      { horaInicio: '11:00 AM', horaTermino: '12:00 PM', razonUso: 'Entrenamiento', areaUsar: 'Gimnasio', estado: 'Aprobada' },
      { horaInicio: '02:00 PM', horaTermino: '04:00 PM', razonUso: 'Evento cultural', areaUsar: 'Auditorio', estado: 'Pendiente' },
      { horaInicio: '02:00 PM', horaTermino: '04:00 PM', razonUso: 'Evento cultural', areaUsar: 'Auditorio', estado: 'Pendiente' },
      { horaInicio: '02:00 PM', horaTermino: '04:00 PM', razonUso: 'Evento cultural', areaUsar: 'Auditorio', estado: 'Pendiente' },
      { horaInicio: '02:00 PM', horaTermino: '04:00 PM', razonUso: 'Evento cultural', areaUsar: 'Auditorio', estado: 'Pendiente' },
      { horaInicio: '02:00 PM', horaTermino: '04:00 PM', razonUso: 'Evento cultural', areaUsar: 'Auditorio', estado: 'Pendiente' },
      { horaInicio: '02:00 PM', horaTermino: '04:00 PM', razonUso: 'Evento cultural', areaUsar: 'Auditorio', estado: 'Pendiente' },
      { horaInicio: '02:00 PM', horaTermino: '04:00 PM', razonUso: 'Evento cultural', areaUsar: 'Auditorio', estado: 'Pendiente' },
      { horaInicio: '02:00 PM', horaTermino: '04:00 PM', razonUso: 'Evento cultural', areaUsar: 'Auditorio', estado: 'Pendiente' },
      { horaInicio: '02:00 PM', horaTermino: '04:00 PM', razonUso: 'Evento cultural', areaUsar: 'Auditorio', estado: 'Pendiente' },
      { horaInicio: '02:00 PM', horaTermino: '04:00 PM', razonUso: 'Evento cultural', areaUsar: 'Auditorio', estado: 'Pendiente' },
      { horaInicio: '02:00 PM', horaTermino: '04:00 PM', razonUso: 'Evento cultural', areaUsar: 'Auditorio', estado: 'Pendiente' },
      { horaInicio: '02:00 PM', horaTermino: '04:00 PM', razonUso: 'Evento cultural', areaUsar: 'Auditorio', estado: 'Pendiente' },
      { horaInicio: '02:00 PM', horaTermino: '04:00 PM', razonUso: 'Evento cultural', areaUsar: 'Auditorio', estado: 'Pendiente' },
      { horaInicio: '02:00 PM', horaTermino: '04:00 PM', razonUso: 'Evento cultural', areaUsar: 'Auditorio', estado: 'Pendiente' },
      { horaInicio: '02:00 PM', horaTermino: '04:00 PM', razonUso: 'Evento cultural', areaUsar: 'Auditorio', estado: 'Pendiente' },
      { horaInicio: '02:00 PM', horaTermino: '04:00 PM', razonUso: 'Evento cultural', areaUsar: 'Auditorio', estado: 'Pendiente' },
      // Agrega más datos
    ];

    this.dataSource = new MatTableDataSource(reservaciones);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort; // Asigna MatSort a dataSource
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
