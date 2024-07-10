import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RolService {

  API_URI = 'http://localhost:3000/rol';

  constructor(private http:HttpClient) { }

  getRoles(){
    return this.http.get(`${this.API_URI}`);
  }

  getRol(idRol:string){
    return this.http.get(`${this.API_URI}/${idRol}`);
  }
}



