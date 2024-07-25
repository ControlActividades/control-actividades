import { Component, OnInit, ViewChild, AfterViewInit, Input } from '@angular/core';
import { RolService } from '../../services/rol.service';//servicio
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({ 
  selector: 'app-ver-roles',
  templateUrl: './ver-roles.component.html',
  styleUrl: './ver-roles.component.css'
})
export class VerRolesComponent {
  roles: any = [];
  displayedColumns: string[] = ['idRoles', 'rol', 'acciones'];
  dataSource!: MatTableDataSource<any>;
  @Input() tabGroup: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private rolService: RolService) { }

  ngOnInit() {
    this.getRoles();
    this.rolService.refresh$.subscribe(() => this.getRoles());
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

  getRoles() {
    this.rolService.getRoles().subscribe(
      resp => {
        this.dataSource = new MatTableDataSource(resp);
        // Asegúrate de que paginator y sort estén disponibles
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      err => console.error(err)
    );
  }

  deleteRol(idRoles: string) {
    this.rolService.deleteRol(idRoles).subscribe(
      resp => {
        console.log(resp);
        this.getRoles();
      },
      err => console.log(err)
    );
  }
}
