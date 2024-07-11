import { Component } from '@angular/core';
import { EdificioService } from '../../services/edificio.service';


@Component({
  selector: 'app-oficios-reservas',
  templateUrl: './oficios-reservas.component.html',
  styleUrl: './oficios-reservas.component.css'
})
export class OficiosReservasComponent {

  

  edificios : any=[];
  constructor (private edificioService : EdificioService){}

  ngOnInit(){
    this.edificioService.getEdificios().subscribe(
      resp => {
        this.edificios = resp
      },
      err => console.error(err)
    );
  }
  
}
