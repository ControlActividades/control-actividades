import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OficioService {

  API_URI = 'http://localhost:3000/oficio';

  constructor(private http:HttpClient) { }

  getOficios(){
    return this.http.get(`${this.API_URI}`);
  }

  getOficio(idOficio:string){
    return this.http.get(`${this.API_URI}/${idOficio}`);
  }
}
