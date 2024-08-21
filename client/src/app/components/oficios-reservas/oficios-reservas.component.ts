import { Component, OnInit } from '@angular/core';
import { EdificioService } from '../../services/edificio.service';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ReservasService } from '../../services/reservas.service';
import { ActivatedRoute } from '@angular/router';
import { ReservasImprimir } from '../../models/ReservaImprimir';
import jsPDF from 'jspdf';


// Validador personalizado para números
function phoneNumberValidator(control: AbstractControl): ValidationErrors | null {
  const phonePattern = /^[0-9]*$/;
  return phonePattern.test(control.value) ? null : { invalidPhone: true };
}


@Component({
  selector: 'app-oficios-reservas',
  templateUrl: './oficios-reservas.component.html',
  styleUrls: ['./oficios-reservas.component.css']
})
export class OficiosReservasComponent implements OnInit {
  reservaForm: FormGroup;
  edificios: any = [];
  length: number = 0;
  length2: number = 0;
  constructor(
    private reservaService: ReservasService,
    private edificioService: EdificioService, 
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.reservaForm = this.fb.group({
      nombCompleto: ['', [ Validators.pattern(/^[A-Za-z\s]+$/)]],
      telefono: ['', [ phoneNumberValidator]],
      correoElec: ['',  Validators.email],
      dependencia: [''],
      grupo: ['', [ Validators.pattern(/^[A-Z]{3}\d{4}$/)]],
      numControl: ['', [ Validators.pattern(/^[A-Za-z0-9]+$/)]],
      horaInicio: [''],
      horaFin: [''],
      cargo: ['', [ Validators.pattern(/^[A-Za-z\s]+$/)]],
      areaUso: [''],
      razon: [''],
      razon2: ['' ],
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
    
    this.reservaForm.get('nombCompleto')?.valueChanges.subscribe(val => {
      this.reservaForm.patchValue({ nombCompleto: this.formatName(val) }, { emitEvent: false });
    });

    this.reservaForm.get('cargo')?.valueChanges.subscribe(val => {
      this.reservaForm.patchValue({ cargo: this.capitalizeFirstLetter(val) }, { emitEvent: false });
    });
  }

  formatName(name: string): string {
    return name.replace(/\b\w/g, char => char.toUpperCase());
  }

  capitalizeFirstLetter(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
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
            dependencia: reserva.dependencia,
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


  //convertir a PDf
  generatePDFInterno(): void {
    const doc = new jsPDF();
    // membrete superior
    const imgMembreteSuperior = '../../../assets/membrete.png'; // imagen del membrete superior
    const pageWidth = doc.internal.pageSize.getWidth(); // ancho de la página
    const imgHeight = 30; // Ajusta la altura 
    doc.addImage(imgMembreteSuperior, 'PNG', 0, 0, pageWidth, imgHeight);


    // Título
    doc.setFontSize(14);
    doc.text('Universidad Tecnológica del Norte de Guanajuato', 105, 40, { align: 'center' });
    doc.setFontSize(12);
    doc.text('Dirección de Espacios y Recursos', 105, 45, { align: 'center' });

    // Fecha
    const now = new Date();
    const day = now.getDate();
    const month = now.toLocaleString('es-ES', { month: 'long' });
    const year = now.getFullYear();
    const fecha = this.reservaForm.get('fecha')?.value || '________';
    doc.text(`Ciudad de Guanajuato, a ${day} de ${month} de ${year}`, 200, 60, { align: 'right' });
    doc.text(`Fecha de la reserva ${fecha}`, 200, 67, { align: 'right' });

    // Información del destinatario
    doc.setFont('Helvetica', 'bold');
    doc.text('Lic. Magda Mirthala Hernández González', 20, 78);
    doc.setFont('Helvetica', 'normal');
    doc.text('Encargada de la Subdirección de Formación Integral', 20, 74);
    doc.text('Gimnasio Auditorio, Universidad Tecnológica del Norte de Guanajuato', 20, 82);

    // Título del documento
    doc.setFontSize(14);
    doc.setFont('Helvetica', 'bold');  // Establece la fuente a negrita
    doc.text('Solicitud de Reservación de Área en Gimnasio Auditorio', 105, 95, { align: 'center' });

    // Restablece la fuente a normal
    doc.setFont('Helvetica', 'normal');
    // Cuerpo del oficio
    doc.setFontSize(12);
    doc.text('Por este medio, me permito solicitar la reservación de un área en el Gimnasio Auditorio de su', 20, 110);
    doc.text('institución, conforme a los siguientes datos:', 20, 114);

    // Datos del solicitante
    const nombreCompleto = this.reservaForm.get('nombCompleto')?.value || '________________________';
    const telefono = this.reservaForm.get('telefono')?.value || '________________________';
    const correoElec = this.reservaForm.get('correoElec')?.value || '________________@______';
    const grupo = this.reservaForm.get('grupo')?.value || '________________________';
    const numControl = this.reservaForm.get('numControl')?.value || '________________________';
    const horaInicio = this.reservaForm.get('horaInicio')?.value || '________________________';
    const horaFin = this.reservaForm.get('horaFin')?.value || '________________________';
    const cargo = this.reservaForm.get('cargo')?.value || '________________________';
    var areaUso = this.reservaForm.get('areaUso')?.value || '________________________';
    const razon = this.reservaForm.get('razon')?.value || '________________________';

    switch (areaUso) {
      case 'danzaFolclorica':
        areaUso = 'Danza Folclórica';
        break;
      case 'taekwando':
        areaUso = 'Taekwando';
        break;
      case 'baloncestoVoleibol':
        areaUso = 'Baloncesto y Voleibol';
        break;
      case 'ajedrez':
        areaUso = 'Ajedrez';
        break;
      default:
        areaUso = '';
        break;
    }

    const datos = [
      { label: '• Responsable:', value: nombreCompleto },
      { label: '• Teléfono:', value: telefono },
      { label: '• Correo electrónico:', value: correoElec },
      { label: '• Grupo:', value: grupo },
      { label: '• Matrícula:', value: numControl },
      { label: '• Hora de inicio:', value: horaInicio },
      { label: '• Hora de fin:', value: horaFin },
      { label: '• Cargo en la UTNG:', value: cargo },
      { label: '• Área a utilizar:', value: areaUso },
      { label: '• Especificaciones:', value: razon }
    ];

    let yPosition = 125;  // Coordenada Y inicial

    datos.forEach(item => {
      doc.setFont('Helvetica', 'bold');
      doc.text(item.label, 20, yPosition);
      doc.setFont('Helvetica', 'normal');
      doc.text(item.value, 80, yPosition);
      yPosition += 5; // Incrementar la posición Y para la siguiente línea
    });

    // Agradecimiento y despedida
    doc.text('Agradeceremos de antemano la confirmación de esta solicitud para proceder con los', 20, 200);
    doc.text('preparativos necesarios. Quedo atento a cualquier requerimiento adicional que pudiera surgir.', 20, 204);
    doc.text('Sin otro particular por el momento, aprovecho para enviarle un cordial saludo.', 20, 215);

    // Firma
    const nombre = this.reservaForm.get('nombCompleto')?.value || '_________________________';
    const edificio = this.reservaForm.get('edificio')?.value || '_____________';
    doc.text('Atentamente:', 105, 225, { align: 'center' });
    doc.text('_________________________', 105, 233, { align: 'center' });
    doc.text(`${nombre} y firma, edificio: ${edificio}`, 105, 239, { align: 'center' });
    doc.text('_________________________', 105, 246, { align: 'center' });
    doc.setFont('Helvetica', 'bold');
    doc.text('Lic. Magda Mirthala Hernández González', 105, 251, {align: 'center'});
    doc.text('Encargada de la Subdirección de Formación Integral', 105, 255,{align: 'center'});
    doc.setFont('Helvetica', 'normal');
    doc.text('Universidad Tecnológica del Norte de Guanajuato', 105, 259, { align: 'center' });

    //membrete inferior
    const imgMembreteInferior = '../../../assets/membrete.png'; //la imagen del membrete inferior
    const pageHeight = doc.internal.pageSize.getHeight(); // Obtiene la altura de la página
    const pageWidthDow = doc.internal.pageSize.getWidth(); // Obtiene el ancho de la página
    const imgHeightDow = 30; // Ajusta la altura de la imagen 
    doc.addImage(imgMembreteInferior, 'PNG', 0, pageHeight - imgHeight, pageWidthDow, imgHeightDow); // Abarca todo el ancho en la parte inferior

    //emergente
    window.open(doc.output('bloburl'));
  }


  //E
  generatePDFExterno(): void {
    const doc = new jsPDF();
    // membrete superior
    const imgMembreteSuperior = '../../../assets/membrete.png'; // imagen del membrete superior
    const pageWidth = doc.internal.pageSize.getWidth(); // ancho de la página
    const imgHeight = 30; // Ajusta la altura 
    doc.addImage(imgMembreteSuperior, 'PNG', 0, 0, pageWidth, imgHeight);


    // Título
    doc.setFontSize(14);
    doc.text('Universidad Tecnológica del Norte de Guanajuato', 105, 40, { align: 'center' });
    doc.setFontSize(12);
    doc.text('Dirección de Espacios y Recursos', 105, 45, { align: 'center' });

    // Fecha
    const now = new Date();
    const day = now.getDate();
    const month = now.toLocaleString('es-ES', { month: 'long' });
    const year = now.getFullYear();
    const fecha = this.reservaForm.get('fecha')?.value || '________';
    doc.text(`Ciudad de Guanajuato, a ${day} de ${month} de ${year}`, 200, 60, { align: 'right' });
    doc.text(`Fecha de la reserva ${fecha}`, 200, 67, { align: 'right' });

    // Información del destinatario
    doc.setFont('Helvetica', 'bold');
    doc.text('Lic. Magda Mirthala Hernández González', 20, 78);
    doc.setFont('Helvetica', 'normal');
    doc.text('Encargada de la Subdirección de Formación Integral', 20, 74);
    doc.text('Gimnasio Auditorio, Universidad Tecnológica del Norte de Guanajuato', 20, 82);

    // Título del documento
    doc.setFontSize(14);
    doc.setFont('Helvetica', 'bold');  // Establece la fuente a negrita
    doc.text('Solicitud de Reservación de Área en Gimnasio Auditorio', 105, 95, { align: 'center' });

    // Restablece la fuente a normal
    doc.setFont('Helvetica', 'normal');
    // Cuerpo del oficio
    doc.setFontSize(12);
    doc.text('Por este medio, me permito solicitar la reservación de un área en el Gimnasio Auditorio de su', 20, 110);
    doc.text('institución, conforme a los siguientes datos:', 20, 114);

    // Datos del solicitante
    const nombreCompleto = this.reservaForm.get('nombCompleto')?.value || '________________________';
    const telefono = this.reservaForm.get('telefono')?.value || '________________________';
    const correoElec = this.reservaForm.get('correoElec')?.value || '________________@______';
    const dependencia = this.reservaForm.get('dependencia')?.value || '_________________________';
    const horaInicio = this.reservaForm.get('horaInicio')?.value || '________________________';
    const horaFin = this.reservaForm.get('horaFin')?.value || '________________________';
    var areaUso = this.reservaForm.get('areaUso')?.value || '________________________';
    const razon = this.reservaForm.get('razon2')?.value || '________________________';

   // Transformar el valor de areaUso basado en su contenido
switch (areaUso) {
  case 'danzaFolclorica':
    areaUso = 'Danza Folclórica';
    break;
  case 'taekwando':
    areaUso = 'Taekwando';
    break;
  case 'baloncestoVoleibol':
    areaUso = 'Baloncesto y Voleibol';
    break;
  case 'ajedrez':
    areaUso = 'Ajedrez';
    break;
  default:
    areaUso = '';
    break;
}
    const datos = [
      { label: '• Responsable:', value: nombreCompleto },
      { label: '• Teléfono:', value: telefono },
      { label: '• Correo electrónico:', value: correoElec },
      { label: '• Dependencia:', value: dependencia },
      { label: '• Hora de inicio:', value: horaInicio },
      { label: '• Hora de fin:', value: horaFin },
      { label: '• Área a utilizar:', value: areaUso },
      { label: '• Especificaciones:', value: razon }
    ];

    let yPosition = 125;  // Coordenada Y inicial

    datos.forEach(item => {
      doc.setFont('Helvetica', 'bold');
      doc.text(item.label, 20, yPosition);
      doc.setFont('Helvetica', 'normal');
      doc.text(item.value, 80, yPosition);
      yPosition += 5; // Incrementar la posición Y para la siguiente línea
    });

    // Agradecimiento y despedida
    doc.text('Agradeceremos de antemano la confirmación de esta solicitud para proceder con los', 20, 200);
    doc.text('preparativos necesarios. Quedo atento a cualquier requerimiento adicional que pudiera surgir.', 20, 204);
    doc.text('Sin otro particular por el momento, aprovecho para enviarle un cordial saludo.', 20, 215);

    // Firma
    const nombre = this.reservaForm.get('nombCompleto')?.value || '_________________________';

    doc.text('Atentamente:', 105, 225, { align: 'center' });
    doc.text('_________________________', 105, 233, { align: 'center' });
    doc.text(`${nombre} y firma`, 105, 239, { align: 'center' });
    doc.text('_________________________', 105, 246, { align: 'center' });
    doc.setFont('Helvetica', 'bold');
    doc.text('Lic. Magda Mirthala Hernández González', 105, 251, {align: 'center'});
    doc.text('Encargada de la Subdirección de Formación Integral', 105, 255,{align: 'center'});
    doc.setFont('Helvetica', 'normal');
    doc.text('Universidad Tecnológica del Norte de Guanajuato', 105, 259, { align: 'center' });

    //membrete inferior
    const imgMembreteInferior = '../../../assets/membrete.png'; //la imagen del membrete inferior
    const pageHeight = doc.internal.pageSize.getHeight(); // Obtiene la altura de la página
    const pageWidthDow = doc.internal.pageSize.getWidth(); // Obtiene el ancho de la página
    const imgHeightDow = 30; // Ajusta la altura de la imagen 
    doc.addImage(imgMembreteInferior, 'PNG', 0, pageHeight - imgHeight, pageWidthDow, imgHeightDow); // Abarca todo el ancho en la parte inferior

    //emergente
    window.open(doc.output('bloburl'));
  }
}
