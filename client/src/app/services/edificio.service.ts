import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';//peticiones de cliente

@Injectable({
  providedIn: 'root'
})
export class EdificioService {

  //API_URI = 'http://localhost:3000/api'; //backend 
  API_URI = 'http://localhost:3000/edificio'; //frondend 

  constructor(private http:HttpClient) { }
  
  getEdificios(){
    return this.http.get(`${this.API_URI}`);
  }

  getEdificio(idEdificio:string){
    return this.http.get(`${this.API_URI}/${idEdificio}`);
  }
  
}

