import { Component, OnInit } from '@angular/core';
import { Reservas } from '../../models/reservas';
import { ReservasService } from '../../services/reservas.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDeleteComponent } from '../confirm-delete/confirm-delete.component';

@Component({
  selector: 'app-administrar-reservas',
  templateUrl: './administrar-reservas.component.html',
  styleUrls: ['./administrar-reservas.component.css']
})
export class AdministrarReservasComponent implements OnInit {
  reservaForm: FormGroup;
  edificios: any = [];
  length: number = 0;
  idReserva: string = '';
  constructor(
    private reservaService: ReservasService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router : Router,
    private dialog: MatDialog
  ) {
    this.reservaForm = this.fb.group({
      idReserva: ['',Validators.required],
      horaInicio: ['',[Validators.required]],
      horaFin: ['',[Validators.required]],
      areaUsar: ['',[Validators.required]],
      razon: ['',[Validators.required]],
      fecha: ['',Validators.required],
      estado : ['']
    });
  }

  ngOnInit() {
    this.loadReservaData();
    this.onChanges();
  }

  onChanges(): void {
    this.reservaForm.get('razon')?.valueChanges.subscribe(val => {
      this.length = val ? val.length : 0;
    });
  }

  loadReservaData(): void {
    this.idReserva = this.route.snapshot.paramMap.get('idReserva') || '';
    if (this.idReserva) {
      this.reservaService.getReservaImprimir(this.idReserva).subscribe(
        (reserva: Reservas) => {
          this.reservaForm.patchValue({
            idReserva: reserva.idReserva,
            horaInicio: reserva.horaInicio,
            horaFin: reserva.horaFin,
            areaUsar: reserva.areaUsar,
            razon: reserva.razon,
            fecha: reserva.fecha ? this.formatDate(reserva.fecha) : ''
          });
        },
        err => console.error(err)
      );
    }
  }
  
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];  
  }

  updateReservaEstado(idReserva: string, estado: string) {
    this.reservaService.updateReserva(idReserva, { estado }).subscribe(
      resp => {
        console.log(resp);
          this.router.navigate(['/inicio/reservas']);
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
  updateReservas(): void {

    if (this.idReserva) {
      this.reservaService.updateReserva(this.idReserva, this.reservaForm.value).subscribe(
        resp => {
          console.log(resp);
          this.router.navigate(['/inicio/reservas']);
          this.reservaForm.reset();
        },
        err => console.error(err)
      );
    }
  }

  clearEstado(): void {
    this.reservaForm.get('estado')?.reset();
  }
  
  
}
