import { Component, HostBinding } from '@angular/core';
import { Edificios } from '../../models/Edificio';
import { EdificioService } from '../../services/edificio.service';

@Component({
  selector: 'app-admin-edificios',
  templateUrl: './admin-edificios.component.html',
  styleUrl: './admin-edificios.component.css'
})
export class AdminEdificiosComponent {
  
  @HostBinding('class') classes = 'row'
  edificio : Edificios ={

    idEdificio : 0,
    nombEdificio : ''
  }

  constructor(private edificioService : EdificioService){}
  ngOnInit(){}

  saveEdificio(){

    this.edificioService.saveEdificio(this.edificio).subscribe(
      resp => {console.log(resp)},
      err => console.log(err)
    )
  }
}
