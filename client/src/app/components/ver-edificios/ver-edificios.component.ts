import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { EdificioService } from '../../services/edificio.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-ver-edificios',
  templateUrl: './ver-edificios.component.html',
  styleUrls: ['./ver-edificios.component.css'] // Nota: styleUrls en plural
})
export class VerEdificiosComponent implements OnInit, AfterViewInit {
  edificios: any = [];
  displayedColumns: string[] = ['idEdificio', 'nombEdificio', 'acciones'];
  dataSource!: MatTableDataSource<any>;
  input: string = ''; // Propiedad para el filtro
  

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort; // ViewChild para MatSort
  @ViewChild(MatTabGroup) tabGroup!: MatTabGroup; // ViewChild para MatTabGroup


  constructor(private edificioService: EdificioService) {}

  ngOnInit() {
    this.edificioService.getEdificios().subscribe(
      resp => {
        this.edificios = resp;
        this.dataSource = new MatTableDataSource(this.edificios);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      err => console.error(err)
    );
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
  editEdificio() {
    if (this.tabGroup) {
      this.tabGroup.selectedIndex = 0; // Cambia a la primera pestaña (índice 0)
    }
  }
  
}
