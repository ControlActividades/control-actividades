import { Component } from '@angular/core';
import { EdificioService } from '../../services/edificio.service';

@Component({
  selector: 'app-ver-roles',
  templateUrl: './ver-roles.component.html',
  styleUrl: './ver-roles.component.css'
})
export class VerRolesComponent {
  edificios : any=[];
  constructor(private edificioService : EdificioService){}
  ngOnInit(){
    this.edificioService.getEdificios().subscribe(
      resp => {
        this.edificios = resp
      },
      err => console.error(err)
    );
  }  
}
