import { Component, ElementRef, HostBinding, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ResponsableService } from '../../services/responsable.service';
import { RolService } from '../../services/rol.service';
import { Responsable } from '../../models/Responsable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-registros',
  templateUrl: './registros.component.html',
  styleUrls: ['./registros.component.css']
})
export class RegistrosComponent implements OnInit {

  displayedColumns: string[] = ['nombUsuario', 'appPaterno', 'appMaterno', 'nombres', 'telefono', 'correoElec','numbControl', 'grupo', 'rol', 'acciones'];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort; 

  responsableFormEdit: FormGroup;
  @HostBinding('class') classes = 'row';
  responsables: any = [];
  roles: any = [];
  currentId: string | number | null = null;
  @ViewChildren('card') cards!: QueryList<ElementRef>;



  constructor(
    private responsableService: ResponsableService,
    private rolService: RolService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.responsableFormEdit = this.fb.group({
      nombUsuario: ['', Validators.required],
      nombres: ['', Validators.required],
      appPaterno: ['', Validators.required],
      appMaterno: [''],
      telefono: [''],
      correoElec: [''],
      numControl: ['', Validators.required],
      grupo: ['', Validators.required],
      idRoles: ['']
    });
  }

  ngOnInit() {
    this.getResponsables();
    this.getRoles();
  }

  getResponsables() {
    this.responsableService.getResponsables().subscribe(
      resp => {
        this.responsables = resp;
        this.dataSource = new MatTableDataSource(resp);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      err => console.error(err)
    );
  }

  getRoles() {
    this.rolService.getRoles().subscribe(
      resp => {
        this.roles = resp;
      },
      err => console.error(err)
    );
  }

  deleteResponsable(idResp: string | number) {
    this.responsableService.deleteResponsable(idResp).subscribe(
      resp => {
        console.log(resp);
        this.getResponsables();
      },
      err => console.log(err)
    );
  }

  editResponsable(idResp: string | number): void {
    this.currentId = idResp;
    this.responsableService.getResponsable(idResp).subscribe(
      resp => {
        this.responsableFormEdit.patchValue({
          nombUsuario: resp.nombUsuario, 
          nombres: resp.nombres,
          appPaterno: resp.appPaterno,
          appMaterno: resp.appMaterno,
          telefono: resp.telefono,
          correoElec: resp.correoElec,
          numControl: resp.numControl,
          grupo: resp.grupo,
          idRoles: resp.idRoles
        });
        this.scrollToEdit();
      },
      err => console.error(err)
    );
  }

  updateResponsable(): void {
    if (this.currentId !== null) {
      this.responsableService.updateResponsable(this.currentId, this.responsableFormEdit.value).subscribe(
        resp => {
          console.log(resp);
          this.getResponsables();
          if (this.currentId) { 
            this.scrollToCard(this.currentId);
          }
          this.responsableFormEdit.reset(); // Limpia el formulario
        this.currentId = null;
        },
        err => console.error(err)
      );
    }
  }

  private scrollToCard(idResp: string | number): void {
    const cardElement = this.cards.find(card => card.nativeElement.dataset.id === idResp.toString());
    if (cardElement) {
      cardElement.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  private scrollToEdit(): void {
    const formElement = document.getElementById('editForm');
    if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();

  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }
}

reset(){
  this.responsableFormEdit.reset();
}
}
