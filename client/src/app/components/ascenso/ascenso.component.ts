import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ResponsableService } from '../../services/responsable.service';
@Component({
  selector: 'app-ascenso',
  templateUrl: './ascenso.component.html',
  styleUrl: './ascenso.component.css'
})
export class AscensoComponent implements OnInit{
  nombre: string = '';
  correo: string = '';
  telefono: string = '';
  razon: string = '';

  constructor(
    private responsableService: ResponsableService,
    public dialogRef: MatDialogRef<AscensoComponent>
  ) {}

  ngOnInit() {
    this.cargarDatosUsuario();
  }

  cargarDatosUsuario() {
    const idUsuario = this.responsableService.getUserId();
    this.responsableService.getResponsableById(idUsuario).subscribe(
      (data) => {
        this.nombre = data.nombUsuario;
        this.correo = data.correoElec;
        this.telefono = data.telefono;
      },
      (error) => {
        console.error('Error al cargar los datos del usuario', error);
      }
    );
  }

  onSubmit() {
    const ascensoData = {
      nombre: this.nombre,
      correo: this.correo,
      telefono: this.telefono,
      razon: this.razon
    };

  }

  onCancel() {
    this.dialogRef.close();
  }
}
