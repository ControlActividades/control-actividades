import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AscensoService {
  private apiUrl = 'http://localhost:3000/responsables/ascenso/correo'; // URL de la API en el backend

  constructor(private http: HttpClient) {}

  enviarRazon(razon: string): Observable<any> {
    const payload = { razon };
    return this.http.post(this.apiUrl, payload);
  }
}
