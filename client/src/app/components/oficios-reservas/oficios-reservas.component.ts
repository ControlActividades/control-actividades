import { Component, OnInit } from '@angular/core';
import { EdificioService } from '../../services/edificio.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ReservasService } from '../../services/reservas.service';
import { ActivatedRoute } from '@angular/router';
import { ReservasImprimir } from '../../models/ReservaImprimir';

@Component({
  selector: 'app-oficios-reservas',
  templateUrl: './oficios-reservas.component.html',
  styleUrls: ['./oficios-reservas.component.css']
})
export class OficiosReservasComponent implements OnInit {
  reservaForm: FormGroup;
  edificios: any = [];
  length : number = 0;
  length2 : number = 0;
  constructor(
    private reservaService: ReservasService,
    private edificioService: EdificioService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.reservaForm = this.fb.group({
      nombCompleto: [''],
      telefono: [''],
      correoElec: [''],
      grupo: [''],
      numControl: [''],
      horaInicio: [''],
      horaFin: [''],
      cargo: [''],
      areaUso: [''],
      razon: [''],
      razon2: [''],
      edificio: [''],
      fecha: ['']
    });
  }

  ngOnInit() {
    this.loadReservaData();
    this.edificioService.getEdificios().subscribe(
      resp => this.edificios = resp,
      err => console.error(err)
    );
  this.onChanges();
}

  onChanges(): void {
    this.reservaForm.get('razon')?.valueChanges.subscribe(val => {
      this.length = val.length;
    });
    this.reservaForm.get('razon2')?.valueChanges.subscribe(val => {
      this.length2 = val.length;
    });
  }

  loadReservaData(): void {
    const idReserva = this.route.snapshot.paramMap.get('idReserva');
    if (idReserva) {
      this.reservaService.getReservaImprimir(idReserva).subscribe(
        (reserva: ReservasImprimir) => {
          this.reservaForm.patchValue({
            nombCompleto: reserva.nombCompleto,
            telefono: reserva.telefono,
            correoElec: reserva.correoElec,
            grupo: reserva.grupo,
            numControl: reserva.numControl,
            horaInicio: reserva.horaInicio,
            horaFin: reserva.horaFin,
            areaUso: reserva.areaUsar,
            razon: reserva.razon,
            razon2: reserva.razon,
            fecha: reserva.fecha ? this.formatDate(reserva.fecha) : ''  // Usa formatDate si es necesario
          });
        },
        err => console.error(err)
      );
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];  // Convierte a formato YYYY-MM-DD
  }
}
