import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Edificios } from '../../models/Edificio';
import { EdificioService } from '../../services/edificio.service';
import { ActivatedRoute, Router } from '@angular/router';
 @Component({
  selector: 'app-admin-edificios',
  templateUrl: './admin-edificios.component.html',
  styleUrls: ['./admin-edificios.component.css']
})
export class AdminEdificiosComponent implements OnInit {
  edificioForm: FormGroup;
  edit: boolean = false;
  @Input() tabGroup: any;
  @Output() tabChange: EventEmitter<number> = new EventEmitter<number>();

  edificio: Edificios = {
    idEdificio: 0,
    nombEdificio: ''
  };

  constructor(
    private fb: FormBuilder,
    private edificioService: EdificioService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.edificioForm = this.fb.group({
      nombEdificio: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const idEdificio = this.activatedRoute.snapshot.paramMap.get('idEdificio');
    
    if (idEdificio) {
      this.edificioService.getEdificio(idEdificio).subscribe(
        resp => {
          this.edificio = resp;
          this.edificioForm.patchValue({
            nombEdificio: this.edificio.nombEdificio
          });
          this.edit = true;
        },
        err => console.error(err)
      );
    }
  }

  saveEdificio(): void {
    if (this.edificioForm.valid) {
      const edificio: Edificios = {
        idEdificio: this.edificio.idEdificio,
        nombEdificio: this.edificioForm.get('nombEdificio')?.value
      };

      if (this.edit) {
        this.updateEdificio();
      } else {
        this.edificioService.saveEdificio(edificio).subscribe(
          resp => {
            console.log(resp);
            this.tabChange.emit(1); // Cambia a la pestaña "Ver Edificios"
          },
          err => console.log(err)
        );
      }
    }
  }

  updateEdificio(): void {
    const idEdificio = this.edificio.idEdificio;

    if (idEdificio !== undefined) {
      this.edificioService.updateEdificio(idEdificio, this.edificioForm.value).subscribe(
        resp => {
          console.log(resp);
          this.router.navigate(['/inicio/edificios']);
        },
        err => console.error(err)
      );
    }
  }
}
