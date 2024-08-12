import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { Reservas } from '../../models/Reservas';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReservasService } from '../../services/reservas.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponsableService } from '../../services/responsable.service';

@Component({
  selector: 'app-reservanos',
  templateUrl: './reservanos.component.html',
  styleUrls: ['./reservanos.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReservanosComponent {
  formAppearance: MatFormFieldAppearance = 'fill'; // Estilo para el formulario

  //declaraciones
  reservaForm: FormGroup;
  @Input() tabGroup: any;
  @Output() tabChange: EventEmitter<number> = new EventEmitter<number>();
  length: number = 0;

  reserva: Reservas = {
    idReserva: 0,
    horaInicio: new Date(),
    horaFin: new Date(),
    estado: '',
    areaUsar: '', // Usar este nombre
    fecha: '',
    razon: '',
    idResp: 0
  }

  constructor(
    private fb: FormBuilder, 
    private reservasService: ReservasService,
    private activatedRoute: ActivatedRoute,
    private responsableService : ResponsableService
  ) {
    this.reservaForm = this.fb.group({
      horaInicio: ['', Validators.required],
      horaFin: ['', Validators.required],
      estado: [''],
      areaUsar: ['', Validators.required],
      fecha: ['', Validators.required],
      razon: ['', Validators.required],
      idResp: [''],
    });
  }

  ngOnInit(): void {
    const idReserva = this.activatedRoute.snapshot.paramMap.get('idReserva');

    if (idReserva) {
      this.reservasService.getReserva(idReserva).subscribe(
        resp => {
          this.reserva = resp;
          this.reservaForm.patchValue({
            horaInicio: this.reserva.horaInicio,
            horaFin: this.reserva.horaFin,
            estado: this.reserva.estado,
            areaUsar: this.reserva.areaUsar,
            fecha: this.reserva.fecha,
            razon: this.reserva.razon
          });
        },
        err => console.error(err)
      );
    }
    this.onChanges();
  }

  onChanges(): void {
    this.reservaForm.get('razon')?.valueChanges.subscribe(val => {
      // Asegúrate de que val sea una cadena antes de acceder a length
      this.length = (typeof val === 'string') ? val.length : 0;
    });
  }

  saveReserva(): void {
    if (this.reservaForm.valid) {
      const responsableId = this.responsableService.getUserId()
      const reserva: Reservas = {
        idReserva: this.reserva.idReserva,
        horaInicio: this.reservaForm.get('horaInicio')?.value,
        horaFin: this.reservaForm.get('horaFin')?.value,
        estado: this.reservaForm.get('estado')?.value,
        areaUsar: this.reservaForm.get('areaUsar')?.value, // Usar este nombre
        fecha: this.reservaForm.get('fecha')?.value,
        razon: this.reservaForm.get('razon')?.value,
        idResp: responsableId
      };


      this.reservasService.saveReserva(reserva).subscribe(
        resp => {
          console.log(resp);
          this.tabChange.emit(1); // Cambia a la pestaña "Reservaciones"
          this.reservaForm.reset();

        },
        err => console.log(err)
      );
    }
  }

  reset(){
    this.reservaForm.reset();
  }
}

