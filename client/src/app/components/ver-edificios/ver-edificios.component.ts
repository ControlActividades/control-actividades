import { Component, OnInit, ViewChild, AfterViewInit, Input } from '@angular/core';
import { EdificioService } from '../../services/edificio.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ConfirmDeleteComponent } from '../confirm-delete/confirm-delete.component';
import { MatDialog } from '@angular/material/dialog';

@Component({ 
  selector: 'app-ver-edificios',
  templateUrl: './ver-edificios.component.html',
  styleUrls: ['./ver-edificios.component.css']
})
export class VerEdificiosComponent implements OnInit, AfterViewInit {
  edificios: any = [];
  displayedColumns: string[] = ['nombEdificio', 'acciones'];
  dataSource!: MatTableDataSource<any>;
  @Input() tabGroup: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private edificioService: EdificioService,
    private dialog :MatDialog
  ) { }

  ngOnInit() {
    this.getEdificios();
    this.edificioService.refresh$.subscribe(() => this.getEdificios());
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

  getEdificios() {
    this.edificioService.getEdificios().subscribe(
      resp => {
        this.dataSource = new MatTableDataSource(resp);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      err => console.error(err)
    );
  }

  openConfirmDialog(idEdificios: string): void {
    const dialogRef = this.dialog.open(ConfirmDeleteComponent, {
      data: {
        message: '¿Estás seguro de que deseas eliminar este edificio?'
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteEdificio(idEdificios);
      }
    });
  }
  

  deleteEdificio(idEdificios: string) {
    this.edificioService.deleteEdificio(idEdificios).subscribe(
      resp => {
        console.log(resp);
        this.getEdificios();
      },
      err => console.log(err)
    );
  }
}
