import { Component, OnInit } from '@angular/core';
import { Reservas } from '../../models/Reservas';
import { ReservasService } from '../../services/reservas.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

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
    private router : Router
  ) {
    this.reservaForm = this.fb.group({
      idReserva: [''],
      horaInicio: [''],
      horaFin: [''],
      areaUsar: [''],
      razon: [''],
      fecha: [''],
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

  deleteReserva(): void {
    if (this.idReserva) {
      this.reservaService.deleteReserva(this.idReserva).subscribe(
        resp => {
          console.log('Reserva eliminada:', resp);
          this.router.navigate(['/inicio/reservas']);
        },
        err => console.error('Error al eliminar la reserva:', err)
      );
    } else {
      console.error('ID de reserva no disponible');
    }
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
  
}
