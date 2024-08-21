import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReservasService } from '../../services/reservas.service';
import { ActivatedRoute } from '@angular/router';
import { ResponsableService } from '../../services/responsable.service';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-reservanos',
  templateUrl: './reservanos.component.html',
  styleUrls: ['./reservanos.component.css']
})
export class ReservanosComponent implements OnInit {
  formAppearance: MatFormFieldAppearance = 'fill'; 
  
  reservaForm: FormGroup;
  @Input() tabGroup: any;
  @Output() tabChange: EventEmitter<number> = new EventEmitter<number>();
  length: number = 0;
  availableStartTimes: string[] = [];
  availableEndTimes: string[] = [];
  minDate: string = '';

  isGuardarDisabled: boolean = false;

  constructor(
    private fb: FormBuilder,
    private reservasService: ReservasService,
    private activatedRoute: ActivatedRoute,
    private responsableService: ResponsableService,
    private snackBar: MatSnackBar
  ) {
    this.reservaForm = this.fb.group({
      horaInicio: ['', Validators.required],
      horaFin: [{ value: '', disabled: true }, Validators.required],
      estado: [''],
      areaUsar: ['', Validators.required],
      fecha: ['', Validators.required],
      razon: ['', Validators.required],
      idResp: [''], 
    });
  }

  ngOnInit(): void {
    const today = new Date();
    const day = (today.getDate() + 2).toString().padStart(2, '0');
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); 
    const year = today.getFullYear();

    this.minDate = `${year}-${month}-${day}`;

    const idReserva = this.activatedRoute.snapshot.paramMap.get('idReserva');

    // Actualizar lista de horas de inicio según la fecha seleccionada
    this.reservaForm.get('fecha')?.valueChanges.subscribe(val => {
      this.updateAvailableStartTimes();
    });

    //actualiza el horario en caso de estar ocupado el horario seleccionado
    this.reservaForm.get('fecha')
    &&this.reservaForm.get('horaInicio')
    &&this.reservaForm.get('horaFin')?.valueChanges.subscribe(val => {
      this.reservaOcupada();
    });


    if (idReserva) {
      this.reservasService.getReserva(idReserva).subscribe(
        resp => {
          this.reservaForm.patchValue({
            horaInicio: resp.horaInicio,
            horaFin: resp.horaFin,
            estado: resp.estado,
            areaUsar: resp.areaUsar,
            fecha: resp.fecha,
            razon: resp.razon
          });
        },
        err => console.error(err)
      );
    }

    this.reservaForm.get('razon')?.valueChanges.subscribe(val => {
      this.length = (typeof val === 'string') ? val.length : 0;
    });
  }

  updateAvailableStartTimes(): void {
    this.availableStartTimes = [];
    const selectedDate = new Date(this.reservaForm.get('fecha')?.value);
    const dayOfWeek = selectedDate.getDay(); // 0: Domingo, 1: Lunes
    // Si es domingo, deshabilitar el formulario y salir
    if (dayOfWeek === 0) {
      this.reservaForm.get('horaInicio')?.disable();
      this.reservaForm.get('horaFin')?.disable();
      this.ingresoFallido();
      return;
    } else {
      this.reservaForm.get('horaInicio')?.enable();
    }

    // Generar lista de horas de inicio, excluyendo de 3:50 PM a 7:00 PM de lunes a jueves
    for (let h = 8; h < 18; h++) {
      if (dayOfWeek >= 1 && dayOfWeek <= 4 && h >= 16 && h < 19) {
        continue;
      }

      for (let m = 0; m < 60; m += 50) {
        if (dayOfWeek >= 1 && dayOfWeek <= 4 && h === 15 && m >= 50) {
          continue;
        }
        this.availableStartTimes.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
      }
    }

    // Restablecer la lista de horas de fin cuando se selecciona una nueva hora de inicio
    this.reservaForm.get('horaInicio')?.valueChanges.subscribe(val => {
      this.updateAvailableEndTimes(val);
    });
  }

  updateAvailableEndTimes(horaInicio: string): void {
    if (horaInicio) {
      const [hour, minute] = horaInicio.split(':').map(Number);
      const selectedDate = new Date(this.reservaForm.get('fecha')?.value);
      const dayOfWeek = selectedDate.getDay();
      this.availableEndTimes = [];

      const limitHour = 19;
      const limitMinute = 0;

      const excludeStartHour = 16;
      const excludeEndHour = 19;

      for (let h = hour; h < 24; h++) {
        if (h > limitHour || (h === limitHour && minute >= limitMinute)) {
          break;
        }

        for (let m = (h === hour) ? minute + 50 : 0; m < 60; m += 50) {
          if (h === limitHour && m > limitMinute) {
            break;
          }

          if (dayOfWeek >= 1 && dayOfWeek <= 4 && h >= excludeStartHour && h < excludeEndHour) {
            continue;
          }

          this.availableEndTimes.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
        }
      }

      this.reservaForm.get('horaFin')?.enable();
    } else {
      this.availableEndTimes = [];
      this.reservaForm.get('horaFin')?.disable();
    }
  }

  saveReserva(): void {

    if (this.isGuardarDisabled || !this.reservaForm.valid) {
      return;
    }
  
    const currentDateTime = new Date(); // Hora y fecha actuales
    const reservaDateTime = new Date(this.reservaForm.get('fecha')?.value);
    const [horaInicioHour, horaInicioMinute] = this.reservaForm.get('horaInicio')?.value.split(':').map(Number);
  
    reservaDateTime.setHours(horaInicioHour, horaInicioMinute, 0, 0);
  
    // Verifica que la hora de la reserva sea al menos 3 horas después de la hora actual
    const threeHoursBefore = new Date(currentDateTime.getTime() + 3 * 60 * 60 * 1000); // Hora actual + 3 horas
  
    if (reservaDateTime <= threeHoursBefore) {
      this.snackBar.open('Debe reservar al menos con 3 horas de antelación', 'Cerrar', {
        duration: 3000,
        verticalPosition: 'top',
        panelClass: ['snackbar-info']
      });
      return;
    }
  
    if (this.reservaForm.valid) {
      const responsableId = this.responsableService.getUserId();
      const reserva = {
        ...this.reservaForm.value,
        idResp: responsableId
      };
  
      this.reservasService.saveReserva(reserva).subscribe(
        resp => {
          this.snackBar.open('Reserva guardada exitosamente', 'Cerrar', {
            duration: 3000,
            verticalPosition: 'top',
            panelClass: ['snackbar-info']
          });
          this.tabChange.emit(1);
          this.reservaForm.reset();
        },
        err => this.ingresoFallido()
      );
    }
  }
  

  reset(): void {
    this.reservaForm.reset();
    this.availableEndTimes = [];
    this.reservaForm.get('horaFin')?.disable();
  }
  ingresoFallido() {
    this.snackBar.open('Día no disponible', 'OK', {
      duration: 3000,
      panelClass: ['info-snackbar']
    });
  }

  //reserva disponible
  reservaOcupada() {
    const horaInicio = this.reservaForm.get('horaInicio')?.value;
    const horaFin = this.reservaForm.get('horaFin')?.value;
    const fecha = new Date(this.reservaForm.get('fecha')?.value).toISOString().split('T')[0];
  
    this.reservasService.checkReserva(horaInicio, horaFin, fecha).subscribe(
      (response) => {
        // Asegúrate de que 'response' tenga las propiedades necesarias
        if (response.hasAcceptedReserva) {
          this.isGuardarDisabled = true; // Deshabilitar el botón
          this.ingresoFallido();
        } else {
          this.isGuardarDisabled = false; // Habilitar el botón
        }
      },
      (error) => {
        this.isGuardarDisabled = true; // Deshabilitar el botón en caso de error
        this.ingresoFallido();
      }
    );
  }
  
  
}
